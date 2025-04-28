const { runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction } = require('../utils/query');


async function add_owner(req, res) {
    const { id_tema, rut } = req.body;
    const query = `
        INSERT INTO dueno (id_tema, rut)
        VALUES (?, ?);
    `;
    const params = [id_tema, rut];

    try {
        await runParametrizedQuery(query, params);
        res.status(200).send({ message: 'Dueño agregado exitosamente' });
    }
    catch (error) {
        console.error('Error agregando dueño:', error.response ? error.response.data : error.message);
        res.status(500).send('Error agregando dueño');
    }
}

async function delete_owner(req, res) {
    const { id_tema, rut } = req.body;
    const query = `
        DELETE FROM dueno
        WHERE id_tema = ? AND rut = ?;
    `;
    const params = [id_tema, rut];

    try {
        await runParametrizedQuery(query, params);
        res.status(200).send({ message: 'Dueño eliminado exitosamente' });
    }
    catch (error) {
        console.error('Error eliminando dueño:', error.response ? error.response.data : error.message);
        res.status(500).send('Error eliminando dueño');
    }
}

async function read_topic_owner(req, res) {
    const { id_tema } = req.params;
    const query = `
       SELECT nombre, apellido, escuela, correo, usuario.rut
        FROM dueno JOIN usuario ON dueno.rut = usuario.rut
        WHERE id_tema = ?;
    `;
    const params = [id_tema];

    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    }
    catch (error) {
        console.error('Error obteniendo dueños:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo dueños');
    }
}

module.exports = {
    add_owner,
    delete_owner,
    read_topic_owner
};