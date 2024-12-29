const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');

async function create_topic(req, res) {
    const { titulo, resumen, nombre_escuela, rut_guia } = req.body;
    const estado = 'Pendiente';
    const numero_fase = 1;
    const query_id_flujo = `SELECT id_flujo FROM escuela WHERE nombre = ?;`;
    const query_id_fase = `SELECT id FROM fase WHERE id_flujo = ? AND numero = ?;`;
    const query_insert_topic = `
        INSERT INTO tema (titulo, resumen, estado, numero_fase, id_fase, nombre_escuela, rut_guia)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const query_get_LastId = `SELECT LAST_INSERT_ID() AS id;`;
    const query_insert_FTT = `
        INSERT INTO flujo_tiene_tema (id_flujo, id_tema)
        VALUES (?, ?);
    `;
    const params_id_flujo = [nombre_escuela];
    let connection;
    try {
        connection = await beginTransaction();

        const id_flujo_res = await runParametrizedQuery(query_id_flujo, params_id_flujo, connection);
        const id_flujo = id_flujo_res[0].id_flujo;
        const id_fase_res = await runParametrizedQuery(query_id_fase, [id_flujo, numero_fase], connection);
        const id_fase = id_fase_res[0].id;
        const params_insert_topic = [titulo, resumen, estado, numero_fase, id_fase, nombre_escuela, rut_guia];
        await runParametrizedQuery(query_insert_topic, params_insert_topic, connection);
        
        // Obtener el ID del tema recién insertado
        const id_tema_res = await runQuery(query_get_LastId, connection);
        const id_tema = id_tema_res[0].id;
        
        if (!id_tema) {
            throw new Error('No se pudo obtener el ID del tema recién insertado');
        }

        const params_insert_FTT = [id_flujo, id_tema];
        await runParametrizedQuery(query_insert_FTT, params_insert_FTT, connection);

        await commitTransaction(connection);
        res.status(200).send('Tema creado con éxito');
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error creando tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando tema');
    }
}

async function read_topic(req, res) {}

async function read_all_topics(req, res) {
    const query = `SELECT * FROM tema`;
    try {
        const results = await runQuery(query);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo temas:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo temas');
    }
}

async function edit_topic(req, res) {}

async function change_topic_status(req, res) {}

module.exports = {
    create_topic,
    read_topic,
    read_all_topics,
    edit_topic,
    change_topic_status
};

