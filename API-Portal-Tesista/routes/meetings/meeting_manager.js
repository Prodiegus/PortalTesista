const { runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction } = require('../utils/query');

function getFechas(fecha_inicio, fecha_termino, frecuencia_dias) {
    const fechas = [];
    const fechaInicio = new Date(fecha_inicio);
    const fechaTermino = new Date(fecha_termino);
    
    console.log('Fecha inicio:', fechaInicio);
    console.log('Fecha término:', fechaTermino);
    console.log('Frecuencia días:', frecuencia_dias);
    
    while (fechaInicio <= fechaTermino) {
        fechas.push(new Date(fechaInicio));
        fechaInicio.setDate(fechaInicio.getDate() + frecuencia_dias);
        console.log('Fecha generada:', fechaInicio);
    }
    return fechas;
}

async function create_meetings(req, res) {
    const { fecha_inicio, fecha_termino, frecuencia_dias, rut_coordinador, id_tema } = req.body;
    const query_insert_meeting = `
        INSERT INTO reunion (fecha, resumen, estado, rut_coordinador, id_tema)
        VALUES (?, ?, ?, ?, ?);
    `;
    const fechas = getFechas(fecha_inicio, fecha_termino, frecuencia_dias);
    const params_insert_meeting = [];
    for (const fecha of fechas) {
        const params = [fecha, 'Resumen de la reunión', 'Pendiente', rut_coordinador, id_tema];
        params_insert_meeting.push(params);
    }
    const json = {
        message: 'Reuniones creadas exitosamente',
        meetings: params_insert_meeting.map(params => ({
            fecha: params[0],
            resumen: params[1],
            estado: params[2],
            rut_coordinador: params[3],
            id_tema: params[4]
        }))
    };
    
    try {
        for (const params of params_insert_meeting) {
            await runParametrizedQuery(query_insert_meeting, params);
        }
        res.status(200).send(json);
    }
    catch (error) {
        console.error('Error creando reuniones:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando reuniones');
    }
}

async function read_topic_meetings(req, res) {
    const { id_tema } = req.params;
    const query = `
        SELECT * FROM reunion WHERE id_tema = ?;
    `;
    const params = [id_tema];
    
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo reuniones:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo reuniones');
    }
}
async function edit_meeting(req, res) {
    const { id, fecha, resumen, estado } = req.body;
    const query = `
        UPDATE reunion
        SET fecha = ?, resumen = ?, estado = ?
        WHERE id = ?;
    `;
    const params = [fecha, resumen, estado, id];
    try {
        await runParametrizedQuery(query, params);
        res.status(200).send('Reunión editada exitosamente');
    } catch (error) {
        console.error('Error editando reunión:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando reunión');
    }
}
async function delete_meeting(req, res) {
    const { id } = req.body;
    const query = `
        DELETE FROM reunion
        WHERE id = ?;
    `;
    const params = [id];
    
    try {
        await runParametrizedQuery(query, params);
        res.status(200).send('Reunión eliminada exitosamente');
    } catch (error) {
        console.error('Error eliminando reunión:', error.response ? error.response.data : error.message);
        res.status(500).send('Error eliminando reunión');
    }
}

module.exports = {
    create_meetings,
    read_topic_meetings,
    edit_meeting,
    delete_meeting
};