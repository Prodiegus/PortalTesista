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
    const query_id_flujo = `
        SELECT fase.id_flujo
        FROM (
            SELECT fase.* FROM fase_tiene_padre JOIN fase ON fase_tiene_padre.id_hijo = fase.id WHERE fase_tiene_padre.id_padre = ?
        ) as fase JOIN flujo_tiene_tema ON fase.id_flujo = flujo_tiene_tema.id_flujo
        WHERE flujo_tiene_tema.id_tema = ?;
    `;
    const id_flujo_params = [id_padre, id_tema];

    const query_create_flow = `
        INSERT INTO flujo (tipo, fecha_inicio, fecha_termino, rut_creador)
        VALUES (?, ?, ?, ?);
    `;
    const flow_params = [tipo, fecha_inicio, fecha_termino, rut_creador];
    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;

    const query_insert_flujo_tema = `
        INSERT INTO flujo_tiene_tema (id_flujo, id_tema)
        VALUES (?, ?);
    `;

    const query_insert_fase_tiene_padre = `
        INSERT INTO fase_tiene_padre (id_padre, id_hijo)
        VALUES (?, ?);
    `;

    let connection = null;
    try {

        connection = await beginTransaction(); // Iniciar transacción
        // Verificar si la fase padre tiene un flujo asociado
        const flujoResults = await runParametrizedQuery(query_id_flujo, id_flujo_params, connection);
        let id_flujo = null;
        if (flujoResults.length > 0) {
            id_flujo = flujoResults[0].id_flujo; // Obtener el ID del flujo existente
        } else {
            // Si no existe un flujo asociado, crear uno nuevo
            await runParametrizedQuery(query_create_flow, flow_params, connection);
            const results = await runQuery(query_get_last_id, connection);
            id_flujo = results[0].id; // Obtener el ID del nuevo flujo creado

            // Crear la relación entre el flujo y el tema
            await runParametrizedQuery(query_insert_flujo_tema, [id_flujo, id_tema], connection);
        }
        // Crear la fase    
        const results = await runParametrizedQuery(query_number, number_params, connection);
        const numero = results[0]['count(*)'] + 1; // Número de la nueva fase

        const insert_params = [numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo];

        await runParametrizedQuery(query_insert, insert_params, connection);

        const results2 = await runQuery(query_get_last_id, connection);
        const newPhaseId = results2[0].id; // Obtener el ID de la nueva fase creada

        // Crear la relación padre-hijo
        await runParametrizedQuery(query_insert_fase_tiene_padre, [id_padre, newPhaseId], connection);
        await commitTransaction(connection); // Confirmar transacción
        console.log('Subfase creada con éxito:', newPhaseId);
        // Enviar respuesta al cliente
        res.status(200).json({ message: 'Fase creada con éxito' });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection); // Revertir transacción en caso de error
        }
        // Manejar el error y enviar respuesta al cliente
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
    const { id_tema } = req.params;
    const query = `
        SELECT fase.*, fase_tiene_padre.id_padre
        FROM flujo_tiene_tema
        JOIN fase ON flujo_tiene_tema.id_flujo = fase.id_flujo
        JOIN fase_tiene_padre ON fase_tiene_padre.id_hijo = fase.id
        WHERE flujo_tiene_tema.id_tema = ?;
    `;
    const params = [id_tema];
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

async function move_phase_forward(req, res) {
    const { id_tema } = req.params;
    const connection = await beginTransaction(); // Iniciar transacción

    try {
        const alumno_phases = await getPhasesTopic(id_tema, 'alumno', connection);
        if (alumno_phases.length == 0) {
            res.status(200).send('No se encontraron fases de alumno');
            return;
        }

        await commitTransaction(connection); // Confirmar transacción

        const query_update_topic = `
            UPDATE tema
            SET id_fase = ?, numero_fase = ?
            WHERE id = ?
        `;
        const query_get_topic = `
            SELECT *
            FROM tema
            WHERE id = ?
        `;
        const params_get_topic = [id_tema];

        const query_get_phase = `
            SELECT *
            FROM fase
            WHERE id = ?
        `;

        let currentPhase = null;
        let nextPhase = null;

        const topic = await runParametrizedQuery(query_get_topic, params_get_topic);
        currentPhase = await runParametrizedQuery(query_get_phase, [topic[0].id_fase]);
        currentPhase = currentPhase[0];
        nextPhase = currentPhase;

        for (let i = 0; i < alumno_phases.length; i++) {
            const phase = alumno_phases[i];
            if (currentPhase.tipo != 'alumno') {
                // Seleccionar la fase alumno con la fecha de inicio más pequeña
                if (phase.fecha_inicio <= nextPhase.fecha_inicio) {
                    nextPhase = phase;
                }
            } else {
                if (phase.fecha_inicio > currentPhase.fecha_inicio && phase.fecha_termino > currentPhase.fecha_termino) {
                    if (nextPhase.fecha_inicio > phase.fecha_inicio) {
                        nextPhase = phase;
                    }
                }
            }
        }

        const params_update_topic = [nextPhase.id, nextPhase.numero, id_tema];
        await runParametrizedQuery(query_update_topic, params_update_topic);

        console.log('Fase movida hacia adelante:', nextPhase);
        res.status(200).send('Fase movida hacia adelante: ' + nextPhase.id);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection); // Revertir transacción en caso de error
            connection.release(); // Liberar conexión
        }
        console.error('Error moviendo fase hacia adelante:', error.response ? error.response.data : error.message);
        res.status(500).send('Error moviendo fase hacia adelante');
    }
}

async function move_phase_backward(req, res) {
    const { id_tema } = req.params;
    const connection = await beginTransaction(); // Iniciar transacción

    try {
        const alumno_phases = await getPhasesTopic(id_tema, 'alumno', connection);

        await commitTransaction(connection); // Confirmar transacción

        const query_update_topic = `
            UPDATE tema
            SET id_fase = ?, numero_fase = ?
            WHERE id = ?
        `;
        const query_get_topic = `
            SELECT *
            FROM tema
            WHERE id = ?
        `;
        const params_get_topic = [id_tema];

        const query_get_phase = `
            SELECT *
            FROM fase
            WHERE id = ?
        `;

        let currentPhase = null;
        let previousPhase = null;

        const topic = await runParametrizedQuery(query_get_topic, params_get_topic);
        currentPhase = await runParametrizedQuery(query_get_phase, [topic[0].id_fase]);
        currentPhase = currentPhase[0];
        previousPhase = currentPhase;

        for (let i = 0; i < alumno_phases.length; i++) {
            const phase = alumno_phases[i];
            if (currentPhase.tipo != 'alumno') {
                res.status(200).send('No se encontró una fase anterior');
                return;
            } else {
                if (phase.fecha_inicio < currentPhase.fecha_inicio && phase.fecha_termino < currentPhase.fecha_termino) {
                    if (previousPhase.fecha_inicio < phase.fecha_inicio) {
                        previousPhase = phase;
                    }
                }
            }
        }

        if (previousPhase.id == currentPhase.id) {
            res.status(200).send('No se encontró una fase anterior');
            return;
        }

        const params_update_topic = [previousPhase.id, previousPhase.numero, id_tema];
        await runParametrizedQuery(query_update_topic, params_update_topic);

        console.log('Fase movida hacia atrás:', previousPhase);
        res.status(200).send('Fase movida hacia atrás: ' + previousPhase.id);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection); // Revertir transacción en caso de error
            connection.release(); // Liberar conexión
        }
        console.error('Error moviendo fase hacia atrás:', error.response ? error.response.data : error.message);
        res.status(500).send('Error moviendo fase hacia atrás');
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
    move_phase_forward,
    move_phase_backward,
};