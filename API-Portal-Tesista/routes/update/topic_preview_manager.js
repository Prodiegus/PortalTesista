const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');

async function addPreview(req, res) {
    const { id_tema, nombre_archivo, archivo64, fecha} = req.body;

    const query_insert_file = `
        INSERT INTO archivo (nombre, file, fecha, tipo)
        VALUES (?, ?, ?, ?)
    `;
    const params_insert_file = [nombre_archivo, archivo64, fecha, 'avance'];

    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;
    const query_insert_preview = `
        INSERT INTO avance (id_tema, id_archivo, comentarios, nota, aprobado, fecha, revision_visible)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const connection = await beginTransaction(); 
    try {
        // Insertar el archivo
        await runParametrizedQuery(query_insert_file, params_insert_file, connection);
        const results = await runQuery(query_get_last_id, connection);
        const newFileId = results[0].id;

        // Insertar el avance
        const params_insert_preview = [id_tema, newFileId, null, null, null, fecha, 0];
        await runParametrizedQuery(query_insert_preview, params_insert_preview, connection);

        await commitTransaction(connection);
        res.status(200).json({ id: newFileId, message: 'Preview added successfully' });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error adding preview:', error.response ? error.response.data : error.message);
        res.status(500).send('Error adding preview');
    }
}

module.exports = {
    addPreview,
};