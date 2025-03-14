const { runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction } = require('../utils/query');

async function create_flow(req, res) {
    const { rut_creador, tipo, fecha_inicio, fecha_termino } = req.body;
    const query_insert_flow = `
        INSERT INTO flujo (rut_creador, tipo, fecha_inicio, fecha_termino)
        VALUES (?, ?, ?, ?);
    `;
    const params_insert_flow = [rut_creador, tipo, fecha_inicio, fecha_termino];
    const query_get_LastId = `SELECT LAST_INSERT_ID() AS id;`;

    let connection;
    try {
        connection = await beginTransaction();
        await runParametrizedQuery(query_insert_flow, params_insert_flow, connection);
        const id_flujo_res = await runQuery(query_get_LastId, connection);
        const id_flujo = id_flujo_res[0].id;
        await commitTransaction(connection);
        res.status(200).json({ id_flujo });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error creando flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando flujo');
    }
}

async function read_flow(req, res) {
    const {type} = req.params;
    const query = `SELECT * FROM flujo WHERE tipo = ?`;
    const params = [type];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo flujo');
    }
}

async function read_school_flow(req, res) {
    const { school } = req.params;
    const query_id_flujo = `SELECT id_flujo FROM escuela WHERE nombre = ?;`;
    const params_id_flujo = [school];
    const query = `SELECT * FROM flujo WHERE id = ?;`;
    try {
        const results_id_flujo = await runParametrizedQuery(query_id_flujo, params_id_flujo);
        const id_flujo = results_id_flujo[0].id_flujo;
        const results = await runParametrizedQuery(query, [id_flujo]);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo flujo');
    }

}

async function edit_flow(req, res) {
    const {id, tipo, fecha_inicio, fecha_termino} = req.body;
    const query = `
            UPDATE flujo
            SET tipo = ?, fecha_inicio = ?, fecha_termino = ?
            WHERE id = ?
        `;
    const params = [tipo, fecha_inicio, fecha_termino, id];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Flujo editado resultados: ' + results);
    } catch (error) {
        console.error('Error editando flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando flujo');
    }
    
}


module.exports = {
    create_flow,
    read_flow,
    read_school_flow,
    edit_flow
};