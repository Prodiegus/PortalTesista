const {runParametrizedQuery} = require('../utils/query');

async function create_phase(req, res) {
    console.log('Creando fase:', req.body);
    const { numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo } = req.body;
    const query_insert = `
        INSERT INTO fase (numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;
    const params = [numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo];

    const connection = await beginTransaction(); 
    try {
        await runParametrizedQuery(query_insert, params, connection);
        const results = await runQuery(query_get_last_id, connection);
        const newPhaseId = results[0].id;
        await commitTransaction(connection);

        res.status(200).json({ id: newPhaseId, message: 'Fase creada con éxito' });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error creando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando fase');
    }
}
async function read_phase(req, res) {
    const {type} = req.params;
    const query = `SELECT * FROM fase WHERE tipo = ?`;
    const params = [type];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fase');
    }
}

async function read_flow_phase(req, res) {
    const { id } = req.params;
    const query = `SELECT * FROM fase WHERE id_flujo = ?;`;
    try {
        const results = await runParametrizedQuery(query, [id]);
        console.log('Fases del flujo:', results);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fase');
    }
}

async function edit_phase(req, res) {
    const {id, numero, nombre, descripcion, fecha_inicio, fecha_termino, id_flujo} = req.body;
    
    try {
        const params = [nombre, descripcion, fecha_inicio, fecha_termino, id_flujo, id];
        await updatePhase(params);
        
        const existingPhase = await existingPhaseCheck(numero, id_flujo);

        if (existingPhase.length > 0) {
            // Si existe una fase con el nuevo número, intercambiar los números
            await swap_numbers(existingPhase, id, numero);
        }

        res.status(200).send('Fase editada correctamente');
    } catch (error) {
        console.error('Error editando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando fase');
    }
}

async function updatePhase(params) {
    const query = `
        UPDATE fase
        SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_termino = ?, id_flujo = ?
        WHERE id = ?
    `;
    return await runParametrizedQuery(query, params);
}

async function existingPhaseCheck(numero, id_flujo) {
    const checkQuery = `SELECT id, numero FROM fase WHERE numero = ? AND id_flujo = ?`;
    const checkParams = [numero, id_flujo];
    return await runParametrizedQuery(checkQuery, checkParams);
}

async function swap_numbers(existingPhase, id, numero) {
    const existingPhaseId = existingPhase[0].id;
    const currentPhaseQuery = `SELECT numero FROM fase WHERE id = ?`;
    const currentPhaseParams = [id];
    const currentPhase = await runParametrizedQuery(currentPhaseQuery, currentPhaseParams);
    const currentPhaseNumero = currentPhase[0].numero;

    const swapQuery1 = `UPDATE fase SET numero = ? WHERE id = ?`;
    const swapParams1 = [currentPhaseNumero, existingPhaseId];
    await runParametrizedQuery(swapQuery1, swapParams1);

    const swapQuery2 = `UPDATE fase SET numero = ? WHERE id = ?`;
    const swapParams2 = [numero, id];
    await runParametrizedQuery(swapQuery2, swapParams2);
}


async function delete_phase(req, res) {
    const {id} = req.body;
    const query = `DELETE FROM fase WHERE id = ?`;
    try {
        const results = await runParametrizedQuery(query, [id]);
        console.log('Fase eliminada resultados:', results);
        res.status(200).send('Fase eliminada resultados: ' + results);
    } catch (error) {
        console.error('Error eliminando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error eliminando fase');
    }
}

async function getPhasesTopic(id_topic, type){
    const query = `
        SELECT fase.* 
        FROM fase
        JOIN (
            SELECT id
            FROM flujo_tiene_tema
            JOIN flujo ON flujo_tiene_tema.id_flujo = flujo.id
            WHERE flujo_tiene_tema.id_tema = ? AND tipo = ?
        ) as flujos
        ON fase.id_flujo = flujos.id;
    `;
    const params = [id_topic, type];
    try {
        const results = await runParametrizedQuery(query, params);
        return results;
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        return [];
    }
}

module.exports = {
    create_phase,
    read_phase,
    read_flow_phase,
    edit_phase,
    delete_phase,
    getPhasesTopic
};