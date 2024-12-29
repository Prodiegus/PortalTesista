const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const scheduledChangesFilePath = path.join(__dirname, 'scheduled_changes.json');

let scheduledChanges = [];

// Leer los cambios programados desde el archivo al iniciar
function loadScheduledChanges() {
    if (fs.existsSync(scheduledChangesFilePath)) {
        try {
            scheduledChanges = JSON.parse(fs.readFileSync(scheduledChangesFilePath));
            schedulePendingChanges();
        } catch (error) {
            console.error('Error leyendo cambios programados:', error);
        }
    }
}

// Guardar los cambios programados en el archivo
function saveScheduledChanges() {
    try {
        fs.writeFileSync(scheduledChangesFilePath, JSON.stringify(scheduledChanges, null, 2));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Crear el directorio si no existe
            fs.mkdirSync(path.dirname(scheduledChangesFilePath), { recursive: true });
            // Intentar guardar nuevamente
            fs.writeFileSync(scheduledChangesFilePath, JSON.stringify(scheduledChanges, null, 2));
        } else {
            console.error('Error guardando cambios programados:', error);
        }
    }
}

// Programar los cambios pendientes
function schedulePendingChanges() {
    const ahora = new Date();
    scheduledChanges.forEach(change => {
        const delay = new Date(change.fechaCambio) - ahora;
        if (delay > 0) {
            if (delay > 2147483647) { // 2^31-1 milisegundos, aproximadamente 24.8 días
                setInterval(() => {
                    const now = new Date();
                    if (now >= new Date(change.fechaCambio)) {
                        executeChange(change);
                    }
                }, 2147483647);
            } else {
                setTimeout(() => {
                    executeChange(change);
                }, delay);
            }
        }
    });
}

// Ejecutar el cambio de estado
async function executeChange(change) {
    const query_update_estado = `UPDATE tema SET estado = ? WHERE id = ?;`;
    const params_update_estado = [change.estado, change.id];
    try {
        await runParametrizedQuery(query_update_estado, params_update_estado);
        console.log(`Estado del tema con ID ${change.id} actualizado a ${change.estado}`);
        // Eliminar el cambio programado después de ejecutarlo
        scheduledChanges = scheduledChanges.filter(c => c.id !== change.id || c.estado !== change.estado);
        saveScheduledChanges();
    } catch (error) {
        console.error(`Error actualizando estado del tema con ID ${change.id}:`, error);
    }
}

loadScheduledChanges();

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
    const query_insert_dueno = `INSERT INTO dueno (rut, id_tema) VALUES (?, ?);`;
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
        
        const params_insert_dueno = [rut_guia, id_tema];
        await runParametrizedQuery(query_insert_dueno, params_insert_dueno, connection);

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

async function read_topic(req, res) {
    const {rut} = req.params;
    const quey_get_user_tipe = `SELECT tipo FROM usuario WHERE rut = ?;`;
    const query_tema_alumno = `
        SELECT tema.* 
        FROM tema JOIN alumno_trabaja 
        ON tema.id = alumno_trabaja.id_tema 
        WHERE alumno_trabaja.rut_alumno = ?;
    `;
    const query_alumnos_guia = `SELECT rut_alumno FROM guia WHERE rut_guia = ?;`;
    const query_temas_revisor = `
        SELECT tema.* 
        FROM tema JOIN revisor_asignado 
        ON tema.id = revisor_asignado.id_tema 
        WHERE revisor_asignado.rut_revisor = ?;
    `;
    const query_guia_temas = `SELECT * FROM tema WHERE rut_guia = ?;`;
    const query_escuela_user = `SELECT escuela FROM usuario WHERE rut = ?;`;
    const query_temas_escuela = `SELECT * FROM tema WHERE nombre_escuela = ?;`;
    const query_dueno_temas = `
        SELECT tema.* 
        FROM tema JOIN dueno 
        ON tema.id = dueno.id_tema 
        WHERE dueno.rut = ?;
    `;
    const params = [rut];
    let topics_JSON = [];
    try {
        const user_type_res = await runParametrizedQuery(quey_get_user_tipe, params);
        const user_type = user_type_res[0].tipo;
        const dueno_res = await runParametrizedQuery(query_dueno_temas, params);
        topics_JSON = [...topics_JSON, ...dueno_res];
        if (user_type === 'alumno') {
            const topics_res = await runParametrizedQuery(query_tema_alumno, params);
            topics_JSON = [...topics_JSON, ...topics_res];
        } else if (user_type === 'guia') {
            const alumnos_res = await runParametrizedQuery(query_alumnos_guia, params);
            for (let i = 0; i < alumnos_res.length; i++) {
                const topics_res = await runParametrizedQuery(query_tema_alumno, [alumnos_res[i].rut_alumno]);
                topics_JSON = [...topics_JSON, ...topics_res];
            }
            const temas_revisor_res = await runParametrizedQuery(query_temas_revisor, params);
            const guia_temas_res = await runParametrizedQuery(query_guia_temas, params);
            topics_JSON = [...topics_JSON, ...temas_revisor_res, ...guia_temas_res];
        } else if (user_type === 'cargo') {
            const escuela_res = await runParametrizedQuery(query_escuela_user, params);
            for (let i = 0; i < escuela_res.length; i++) {
                const temas_escuela_res = await runParametrizedQuery(query_temas_escuela, [escuela_res[i].escuela]);
                topics_JSON = [...topics_JSON, ...temas_escuela_res];
            }
        } else {
            throw new Error('Tipo de usuario no válido');
        }
    } catch (error) {
        console.error('Error obteniendo tipo de usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo tipo de usuario');
    }
    // ahora hay que limpar las primary keys de id en temas que puedan ser repetidos
    const uniqueTopics = [];
    const ids = new Set();
    for(const topic of topics_JSON) {
        if(!ids.has(topic.id)) {
            uniqueTopics.push(topic);
            ids.add(topic.id);
        }
    }

    res.status(200).send(uniqueTopics);
}

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

async function edit_topic(req, res) {
    const {id, titulo, resumen, numero_fase, id_fase, nombre_escuela, rut_guia} = req.body;
    const query = `
        UPDATE tema
        SET titulo = ?, resumen = ?, numero_fase = ?, nombre_escuela = ?, rut_guia = ?, id_fase = ?
        WHERE id = ?;
    `;
    const params = [titulo, resumen, numero_fase, nombre_escuela, rut_guia, id_fase, id];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Tema editado con éxito');
    } catch (error) {
        console.error('Error editando tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando tema');
    }
}

async function change_topic_status(req, res) {
    const { id, estado } = req.body;
    const query_get_fechas_flow = `
        SELECT fecha_termino as fecha 
        FROM fase JOIN (
            SELECT id_flujo 
            FROM tema JOIN escuela 
            ON tema.nombre_escuela = escuela.nombre 
            WHERE id = ?
        ) as flujo
        ON fase.id_flujo = flujo.id_flujo;
    `;
    const params_get_fechas_flow = [id];
    let fechaCambio;

    try {
        const results = await runParametrizedQuery(query_get_fechas_flow, params_get_fechas_flow);
        // Obtendremos la fecha de termino mas proxima
        fechaCambio = new Date(results[0].fecha);
        for (let i = 1; i < results.length; i++) {
            const fecha = new Date(results[i].fecha);
            if (fecha < fechaCambio) {
                fechaCambio = fecha;
            }
        }
    } catch (error) {
        console.error('Error obteniendo fecha de cambio de estado:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fecha de cambio de estado');
    }

    //fechaCambio = new Date("2024-12-29T12:32:00");

    // Programar el cambio de estado
    const ahora = new Date();
    const delay = fechaCambio - ahora;

    if (delay > 0) {
        scheduledChanges.push({ id, estado, fechaCambio });
        saveScheduledChanges();
        if (delay > 2147483647) { // 2^31-1 milisegundos, aproximadamente 24.8 días
            setInterval(() => {
                const now = new Date();
                if (now >= fechaCambio) {
                    executeChange({ id, estado });
                }
            }, 2147483647);
        } else {
            setTimeout(() => {
                executeChange({ id, estado });
            }, delay);
        }
        res.status(200).send('Cambio de estado programado con éxito para la fecha ' + fechaCambio);
    } else {
        res.status(400).send('La fecha de cambio de estado debe ser en el futuro');
    }
}

module.exports = {
    create_topic,
    read_topic,
    read_all_topics,
    edit_topic,
    change_topic_status
};