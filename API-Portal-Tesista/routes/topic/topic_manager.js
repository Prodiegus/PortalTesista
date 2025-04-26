const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const {create_flow, read_flow, read_school_flow, edit_flow} = require('../flow/manage_flow');
const {read_phase, create_phase, edit_phase, read_flow_phase, delete_phase, getPhasesTopic} = require('../flow/manage_phase');
const getToken = require('../utils/getToken');
const createUsuario = require('../keycloak/crearUsuario');
const getRandomPassword = require('../utils/getRandomPassword');
const { get } = require('http');
const { json } = require('stream/consumers');

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
    } finally {
        console.log('Cambios programados guardados en', scheduledChangesFilePath);
        schedulePendingChanges();
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
    const query_finalizar_trabajo_alumno = `UPDATE alumno_trabaja SET fecha_termino = ? WHERE id_tema = ?;`;
    const params_finalizar_trabajo_alumno = [change.fechaCambio, change.id];

    try {
        await runParametrizedQuery(query_update_estado, params_update_estado);
        console.log(`Estado del tema con ID ${change.id} actualizado a ${change.estado}`);
        await runParametrizedQuery(query_finalizar_trabajo_alumno, params_finalizar_trabajo_alumno);
        console.log(`Trabajo del alumno en tema ${change.id} finalizado`);
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
        INSERT INTO tema (titulo, resumen, estado, numero_fase, id_fase, nombre_escuela, rut_guia, creacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const query_get_LastId = `SELECT LAST_INSERT_ID() AS id;`;
    const query_insert_FTT = `
        INSERT INTO flujo_tiene_tema (id_flujo, id_tema)
        VALUES (?, ?);
    `;

    query_insert_FTP = `
        INSERT INTO fase_tiene_padre (id_padre, id_hijo)
        VALUES (?, ?);`
    const query_insert_dueno = `INSERT INTO dueno (rut, id_tema) VALUES (?, ?);`;
    const params_id_flujo = [nombre_escuela];
    
    const raw_timestamp = new Date();
    const current_date_time = raw_timestamp.toISOString().slice(0, 19).replace('T', ' ');

    let connection;
    try {
        connection = await beginTransaction();

        let id_flujo_res = await runParametrizedQuery(query_id_flujo, params_id_flujo, connection);
        let id_flujo = id_flujo_res[0].id_flujo;
        const id_fase_res = await runParametrizedQuery(query_id_fase, [id_flujo, numero_fase], connection);
        const id_fase = id_fase_res[0].id;
        const params_insert_topic = [titulo, resumen, estado, numero_fase, id_fase, nombre_escuela, rut_guia, current_date_time];
        await runParametrizedQuery(query_insert_topic, params_insert_topic, connection);
        
        // Obtener el ID del tema recién insertado
        const id_tema_res = await runQuery(query_get_LastId, connection);
        const id_tema = id_tema_res[0].id;
        
        if (!id_tema) {
            throw new Error('No se pudo obtener el ID del tema recién insertado');
        }

        let params_insert_FTT = [id_flujo, id_tema];
        await runParametrizedQuery(query_insert_FTT, params_insert_FTT, connection);
        
        let fases_flujo_general;
        const res_for_http_request = {
            status: (code) => {
                console.log(`Status: ${code}`);
                return res_for_http_request;
            },
            send: (data) => {
                fases_flujo_general = data;
                console.log(data);
            },
            json: (data) => {
                fases_flujo_general = data;
                console.log(JSON.stringify(data));
            }
        };

        await read_flow_phase({params: {id: id_flujo}}, res_for_http_request);

        if (Array.isArray(fases_flujo_general)) {
            for (let i = 0; i < fases_flujo_general.length; i++) {
                const fase = fases_flujo_general[i];
                const create_flow_req = {
                    body: {
                        rut_creador: rut_guia,
                        tipo: 'guia',
                        fecha_inicio: fase.fecha_inicio,
                        fecha_termino: fase.fecha_termino
                    }
                };

                let new_id_flujo;
                const res_for_create_flow = {
                    status: (code) => {
                        console.log(`Status: ${code}`);
                        return res_for_create_flow;
                    },
                    send: (data) => {
                        new_id_flujo = data.id_flujo;
                        console.log(data);
                    },
                    json: (data) => {
                        new_id_flujo = data.id_flujo;
                        console.log(JSON.stringify(data));
                    }
                };

                await create_flow(create_flow_req, res_for_create_flow);
                params_insert_FTT = [new_id_flujo, id_tema];
                await runParametrizedQuery(query_insert_FTT, params_insert_FTT, connection);
                
                let new_id_fase;
                const create_phase_req = {
                    body: {
                        numero: 1,
                        nombre: fase.nombre,
                        descripcion: 'Fase auto generada',
                        tipo: 'guia',
                        fecha_inicio: fase.fecha_inicio,
                        fecha_termino: fase.fecha_termino,
                        rut_creador: rut_guia,
                        id_flujo: new_id_flujo
                    }
                };
                const res_for_create_fase = {
                    status: (code) => {
                        console.log(`Status: ${code}`);
                        return res_for_create_fase;
                    },
                    send: (data) => {
                        try {
                            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                            new_id_fase = parsedData.id;
                            console.log(parsedData);
                        } catch (error) {
                            console.error('Error parsing response from create_phase:', error);
                        }
                    },
                    json: (data) => {
                        new_id_fase = data.id;
                        console.log(JSON.stringify(data));
                    }
                };

                await create_phase(create_phase_req, res_for_create_fase);

                if (!new_id_fase) {
                    throw new Error('No se pudo obtener el ID de la nueva fase');
                }

                const params_insert_FTP = [fase.id, new_id_fase];
                await runParametrizedQuery(query_insert_FTP, params_insert_FTP, connection);
            }
        } else {
            throw new Error('Fases del flujo no es un array');
        }

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
        WHERE alumno_trabaja.rut_alumno = ?
        AND (alumno_trabaja.fecha_termino IS NULL OR alumno_trabaja.fecha_termino <= CURRENT_DATE);
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

    const query_user_name = `SELECT nombre, apellido FROM usuario WHERE rut = ?;`;
    const topics_res = [];
    for (const topic of uniqueTopics) {
        const params = [topic.rut_guia];
        try {
            const user_name_res = await runParametrizedQuery(query_user_name, params);
            const user_name = user_name_res[0];
            const topic_res = {
                id: topic.id,
                titulo: topic.titulo,
                resumen: topic.resumen,
                estado: topic.estado,
                numero_fase: topic.numero_fase,
                id_fase: topic.id_fase,
                nombre_escuela: topic.nombre_escuela,
                rut_guia: topic.rut_guia,
                guia: user_name.nombre + ' ' + user_name.apellido,
                co_guias: ['-'],
                creacion: topic.creacion
            };
            topics_res.push(topic_res);
        } catch (error) {
            console.error('Error obteniendo nombre de usuario:', error.response ? error.response.data : error.message);
            res.status(500).send('Error obteniendo nombre de usuario');
        }
    }

    res.status(200).send(topics_res);
}

async function read_all_topics(req, res) {
    const query = `SELECT * FROM tema`;
    const query_user_name = `SELECT nombre, apellido FROM usuario WHERE rut = ?;`;
    const topics_res = [];
    try {
        const results = await runQuery(query);
        for (const topic of results) {
            const params = [topic.rut_guia];
            const user_name_res = await runParametrizedQuery(query_user_name, params);
            const user_name = user_name_res[0];
            const topic_res = {
                id: topic.id,
                titulo: topic.titulo,
                resumen: topic.resumen,
                estado: topic.estado,
                numero_fase: topic.numero_fase,
                id_fase: topic.id_fase,
                nombre_escuela: topic.nombre_escuela,
                rut_guia: topic.rut_guia,
                guia: user_name.nombre + ' ' + user_name.apellido,
                co_guias: ['-'],
                creacion: topic.creacion
            };
            topics_res.push(topic_res);
        }
        res.status(200).send(topics_res);
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
    const query_change_status = `UPDATE tema SET estado = ? WHERE id = ?;`;
    const params_change_status = [estado, id];
    const query_set_end_date = `UPDATE alumno_trabaja SET fecha_termino = ? WHERE id_tema = ?;`;
    const params_set_end_date = [new Date(), id];
    try {
        if(estado !== 'Pendiente'){
            await runParametrizedQuery(query_set_end_date, params_set_end_date);
        }
        await runParametrizedQuery(query_change_status, params_change_status);
        res.status(200).send('Estado del tema cambiado con éxito');

    } catch (error) {
        console.error('Error obteniendo fecha de cambio de estado:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fecha de cambio de estado');
    }
}

async function requestTopic(req, res) {
    const {topic_id, nombre, apellido, rut, escuela, correo, mensaje} = req.body;

    const userExistsQuery = `SELECT * FROM usuario WHERE rut = ?;`;
    const userExistsParams = [rut];

    const insertUserQuery = 
    `
        INSERT INTO usuario (nombre, apellido, rut, escuela, correo, password, tipo, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertUserParams = [nombre, apellido, rut, escuela, correo, getRandomPassword(8), 'alumno', 1];

    const insertRequestQuery = 
    `
        INSERT INTO solicitud_tema (id_tema, rut_alumno, mensaje)
        VALUES (?, ?, ?)
    `;

    const insertRequestParams = [topic_id, rut, mensaje];

    try {
        const userExists = await runParametrizedQuery(userExistsQuery, userExistsParams);
        if (userExists.length === 0) {
            await runParametrizedQuery(insertUserQuery, insertUserParams);
        }
        await runParametrizedQuery(insertRequestQuery, insertRequestParams);
        res.status(200).send('Solicitud enviada con éxito');
    } catch (error) {
        console.error('Error solicitando tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error solicitando tema');
    }
    
}

async function acept_topic_request(req, res) {
    const {topic_id, rut_alumno} = req.body;

    const query_insert_guia = `
        INSERT INTO guia (rut_guia, rut_alumno, fecha_inicio, fecha_termino)
        VALUES (?, ?, ?, ?);
    `;
    const params_insert_guia = [rut_alumno, rut_alumno, new Date(), null];

    const query_insert_flow = `
        INSERT INTO flujo (rut_creador, tipo, fecha_inicio, fecha_termino)
        VALUES (?, ?, ?, ?);
    `;
    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;
    const query_insert_FTT = `
        INSERT INTO flujo_tiene_tema (id_flujo, id_tema)
        VALUES (?, ?);
    `;
    const query_insert_phase = `
        INSERT INTO fase (numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const query_insert_FTP = `
        INSERT INTO fase_tiene_padre (id_padre, id_hijo)
        VALUES (?, ?);
    `;
    const query_insert_alumno_trabaja = `
        INSERT INTO alumno_trabaja (rut_alumno, id_tema, fecha_inicio, fecha_termino)
        VALUES (?, ?, ?, ?);
    `;
    const alumno_trabaja_params = [rut_alumno, topic_id, new Date(), null];
    const query_select_alumno = `SELECT * FROM usuario WHERE rut = ?;`;
    const select_alumno_params = [rut_alumno];

    const query_update_topic_status = `
        UPDATE tema
        SET estado = 'En trabajo'
        WHERE id = ?;
    `;
    const update_topic_status_params = [topic_id];

    let connection;
    try{
        connection = await beginTransaction();
        const fases_flujo_guia = await getPhasesTopic(topic_id, 'guia', connection);
        console.log("fases encontradas: "+fases_flujo_guia);
        if (!fases_flujo_guia) {
            throw new Error('No se encontraron fases para el flujo del guía');
            res.status(500).send('Error aceptando solicitud de tema');
        }
        if (fases_flujo_guia.length === 0) {
            throw new Error('No se encontraron fases para el flujo del guía');
            res.status(500).send('Error aceptando solicitud de tema');
        }
        
        for (let i = 0; i < fases_flujo_guia.length; i++){
            console.log("fase: "+fases_flujo_guia[i]);
            const fase = fases_flujo_guia[i];
            const create_flow_params = [rut_alumno, 'alumno', fase.fecha_inicio, fase.fecha_termino];
            await runParametrizedQuery(query_insert_flow, create_flow_params, connection);

            const new_id_flujo_res = await runQuery(query_get_last_id, connection);
            const new_id_flujo = new_id_flujo_res[0].id;

            const query_insert_FTT_params = [new_id_flujo, topic_id];
            await runParametrizedQuery(query_insert_FTT, query_insert_FTT_params, connection);

            const create_phase_params = [fase.numero, fase.nombre, 'fase autogenerada', 'alumno', fase.fecha_inicio, fase.fecha_termino, rut_alumno, new_id_flujo];
            await runParametrizedQuery(query_insert_phase, create_phase_params, connection);

            const new_id_fase_res = await runQuery(query_get_last_id, connection);
            const new_id_fase = new_id_fase_res[0].id;

            const query_insert_FTP_params = [fase.id, new_id_fase];
            await runParametrizedQuery(query_insert_FTP, query_insert_FTP_params, connection);
        }

        const alumno_res = await runParametrizedQuery(query_select_alumno, select_alumno_params, connection);
        if (alumno_res.length === 0) {
            throw new Error('No se encontró el alumno');
        }
        const alumno = alumno_res[0];
        const token = await getToken();

        const createUsuarioReq = {
            body: {
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                rut: alumno.rut,
                correo: alumno.correo,
                tipo: 'alumno'
            }
        };

        await createUsuario(createUsuarioReq, token, alumno.password);

        await runParametrizedQuery(query_insert_alumno_trabaja, alumno_trabaja_params, connection);
        await runParametrizedQuery(query_update_topic_status, update_topic_status_params, connection);

        await runParametrizedQuery(query_insert_guia, params_insert_guia, connection);

        await commitTransaction(connection);
        res.status(200).send('Solicitud de tema aceptada con éxito');
        
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error aceptando solicitud de tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error aceptando solicitud de tema');
    }
}

async function read_topic_request(req, res) {
    const {topic_id} = req.params;
    const query = `
        SELECT mensaje, usuario.*
        FROM usuario JOIN solicitud_tema ON rut_alumno = rut
        WHERE id_tema = ?;
    `;
    const params = [topic_id];
    let connection;
    try {
        connection = await beginTransaction();
        const results = await runParametrizedQuery(query, params, connection);
        await commitTransaction(connection);
        res.status(200).send(results);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error obteniendo solicitudes de tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo solicitudes de tema');
    }
}

async function get_topic_summary(req, res) {
    const {id_tema} = req.params;
    const query_get_tema_estado_fase = `
        SELECT estado, id_fase
        FROM tema
        WHERE id = ?;
    `;
    const params = [id_tema];
    const query_get_tema_fases = `
        SELECT fase.*
        FROM fase
        JOIN (
            SELECT flujo.*
            FROM flujo JOIN (
                SELECT * FROM flujo_tiene_tema WHERE id_tema = 1
            ) as flujo_tema ON flujo.id = flujo_tema.id_flujo
            WHERE tipo = 'alumno'
        ) as flujo_alumno ON fase.id_flujo = flujo_alumno.id ORDER BY \`fecha_inicio\` asc;
    `;
    const params_fases = [id_tema];
    const query_get_fase_padre = `
        SELECT fase.*
        FROM fase JOIN fase_tiene_padre ON fase.id = fase_tiene_padre.id_padre
        WHERE id_hijo = ?;
    `;
    const query_get_duenos = `
        SELECT usuario.nombre, usuario.apellido, usuario.correo
        FROM dueno JOIN usuario ON dueno.rut = usuario.rut
        WHERE id_tema = ?;
    `;
    const params_duenos = [id_tema];
    let connection;
    try {
        let estado = '';
        let flujo = '';
        let avance = '';
        let dueno = [];
        connection = await beginTransaction();

        const owners_res = await runParametrizedQuery(query_get_duenos, params_duenos, connection);
        for (let i = 0; i < owners_res.length; i++) {
            const owner = owners_res[i];
            const owner_data = owner.nombre+" "+owner.apellido+" ("+owner.correo+")";
            dueno.push(owner_data);
        }

        const state_phase_res = await runParametrizedQuery(query_get_tema_estado_fase, params, connection);
        if (state_phase_res.length === 0) {
            throw new Error('No se encontró el tema');
        }
        estado = state_phase_res[0].estado;
        const id_fase = state_phase_res[0].id_fase;
        const phases_res = await runParametrizedQuery(query_get_tema_fases, params_fases, connection);
        if (phases_res.length === 0) {
            throw new Error('No se encontraron fases para el tema');
        }
        avance = estimate_progress(id_fase, phases_res)+'%';
        const student_flow = get_current_phase(id_fase, phases_res);
        if (!student_flow) {
            throw new Error('No se encontró la fase actual del flujo del estudiante');
        }
        let fase_padre_res = await runParametrizedQuery(query_get_fase_padre, [student_flow.id], connection);
        if (fase_padre_res.length === 0) {
            throw new Error('No se encontró la fase padre del flujo del estudiante');
        }
        const guide_flow = fase_padre_res[0];
        fase_padre_res = await runParametrizedQuery(query_get_fase_padre, [guide_flow.id], connection);
        if (fase_padre_res.length === 0) {
            throw new Error('No se encontró la fase padre del flujo del guía');
        }
        const school_flow = fase_padre_res[0];
        flujo = school_flow.nombre + ' -> ' + guide_flow.nombre + ' -> ' + student_flow.nombre;
        
        const json = {
            id_tema: id_tema,
            estado: estado,
            flujo: flujo,
            avance: avance,
            dueno: dueno
        }
        await commitTransaction(connection);
        console.log("summary: "+JSON.stringify(json));
        res.status(200).send(json);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error obteniendo resumen de tema:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo resumen de tema');
    }
}

function estimate_progress(current_phase_id, phases) {
    let progress = 0;
    sort_phases(phases);
    for (let i = 0; i < phases.length; i++) {
        if (phases[i].id === current_phase_id) {
            progress = Math.round((i + 1) / phases.length * 100);
            break;
        }
    }
    return progress;
}

function sort_phases(phases) {
    return phases.sort((a, b) => {
        const dateA = new Date(a.fecha_inicio);
        const dateB = new Date(b.fecha_inicio);
        return dateA - dateB;
    });
}

function get_current_phase(current_phase_id, phases) {
    let current_phase = null;
    console.log("phases: "+JSON.stringify(phases));
    console.log("current_phase_id: "+current_phase_id);
    for (let i = 0; i < phases.length; i++) {
        if (phases[i].id === current_phase_id) {
            current_phase = phases[i];
            break;
        }
    }
    return current_phase;
}

module.exports = {
    create_topic,
    read_topic,
    read_all_topics,
    edit_topic,
    change_topic_status,
    requestTopic,
    read_topic_request,
    acept_topic_request,
    get_topic_summary,
};