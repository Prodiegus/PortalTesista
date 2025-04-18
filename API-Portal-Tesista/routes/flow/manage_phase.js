const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');

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

async function create_subphase(req, res) {
    const {
        nombre,
        descripcion,
        tipo,
        fecha_inicio,
        fecha_termino,
        rut_creador,
        id_flujo,
        id_padre, // ID de la fase padre
        id_tema, // ID del tema al que pertenece la fase
     } = req.body;
     // numero se calcula con la cantidad de fases hijas del padre + 1 en el tema actual
    const query_number = `
        SELECT count(*)
        FROM (
            SELECT id_flujo, id, numero
            FROM fase_tiene_padre JOIN fase ON fase_tiene_padre.id_hijo = fase.id
            where fase_tiene_padre.id_padre = ?
        ) as fases_padre JOIN flujo_tiene_tema ON fases_padre.id_flujo = flujo_tiene_tema.id_flujo
        WHERE flujo_tiene_tema.id_tema = ?;
    `;
    const number_params = [id_padre, id_tema];
    const query_insert = `
        INSERT INTO fase (numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const results = await runParametrizedQuery(query_number, number_params);
        const numero = results[0]['count(*)'] + 1; // Número de la nueva fase

        const insert_params = [numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo];

        await runParametrizedQuery(query_insert, insert_params);

        res.status(200).json({ message: 'Fase creada con éxito' });
    } catch (error) {
        console.error('Error creando subfase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando subfase');
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

async function read_topic_phase(req, res) {
    const { id } = req.params;
    const query = `
    SELECT fase.*, fase_tiene_padre.id_padre
    FROM flujo_tiene_tema JOIN fase ON flujo_tiene_tema.id_flujo = fase.id_flujo, fase_tiene_padre
    WHERE id_tema = ? AND fase_tiene_padre.id_hijo = fase.id;
    `;
    const params = [id];
    try {
        const results = await runParametrizedQuery(query, params);
        console.log('Fases del tema:', results);
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
    const {id_tema} = req.body;
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

async function getPhasesTopic(id_topic, type, connection) {
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
        const results = await runParametrizedQuery(query, params, connection);
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
    getPhasesTopic,
    read_topic_phase,
    create_subphase,
};