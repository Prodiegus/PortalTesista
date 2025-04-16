const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');

async function addPreview(req, res) {
    const { id_tema, nombre_archivo, archivo64, fecha } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!id_tema || !nombre_archivo || !archivo64 || !fecha) {
        return res.status(400).send('Faltan campos requeridos en la solicitud');
    }

    const query_insert_preview = `
        INSERT INTO avance (id_tema, comentarios, nota, aprobado, fecha, revision_visible)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params_insert_preview = [id_tema, null, null, null, fecha, 0];

    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;

    const query_insert_file = `
        INSERT INTO archivo (id_avance, nombre, file, fecha, tipo)
        VALUES (?, ?, ?, ?, ?)
    `;

    let connection;
    try {
        connection = await beginTransaction();

        // Insertar el avance
        await runParametrizedQuery(query_insert_preview, params_insert_preview, connection);

        const results = await runQuery(query_get_last_id, connection);
        const newPreviewId = results[0].id;

        const params_insert_file = [newPreviewId, nombre_archivo, archivo64, fecha, 'avance'];

        // Insertar el archivo
        await runParametrizedQuery(query_insert_file, params_insert_file, connection);

        await commitTransaction(connection);

        res.status(200).json({ id: newPreviewId, message: 'Preview added successfully' });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error adding preview:', error.response ? error.response.data : error.message);
        res.status(500).send('Error adding preview');
    } finally {
        if (connection) {
            connection.release(); // Liberar la conexión al pool
        }
    }
}

async function getTopicPreviews(req, res) {
    const { id_tema } = req.params;

    if (!id_tema) {
        return res.status(400).send('Falta el id_tema en la solicitud');
    }

    const query = `
        SELECT a.*, ar.nombre AS nombre_archivo, ar.file AS archivo
        FROM avance a
        JOIN (
            SELECT id_avance, MAX(fecha) AS fecha_reciente
            FROM archivo
            WHERE tipo = 'avance'
            GROUP BY id_avance
        ) subquery ON a.id = subquery.id_avance
        JOIN archivo ar ON subquery.id_avance = ar.id_avance AND subquery.fecha_reciente = ar.fecha
        WHERE a.id_tema = ?
    `;

    const params = [id_tema];
    const connection = await beginTransaction();

    try {
        const results = await runParametrizedQuery(query, params, connection);
        await commitTransaction(connection);

        if (results.length === 0) {
            return res.status(404).send('No se encontraron avances para el tema especificado');
        }

        const processedResults = results.map(result => {
            if (result.archivo) {
                const archivo = result.archivo.toString(); // Convertir a cadena
                // Verificar si ya es Base64 con prefijo
                if (archivo.startsWith('data:application/pdf;base64,')) {
                    return { ...result, archivo }; // Enviar tal cual
                } else {
                    // Convertir a Base64 si no tiene el prefijo
                    const base64String = Buffer.from(result.archivo).toString('base64');
                    return {
                        ...result,
                        archivo: `data:application/pdf;base64,${base64String}`
                    };
                }
            }
            return { ...result, archivo: null };
        });

        res.status(200).json(processedResults);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error fetching topic previews:', error.message);
        res.status(500).send('Error fetching topic previews');
    }
}

module.exports = {
    addPreview,
    getTopicPreviews
};