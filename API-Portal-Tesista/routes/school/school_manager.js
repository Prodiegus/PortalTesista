const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

async function getSchools(req, res) {
    try {
        const query = `SELECT escuela.nombre, usuario.correo as profesor, rut_profesor_cargo FROM escuela JOIN usuario ON escuela.rut_profesor_cargo = usuario.rut;`;
        const result = await runQuery(query);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error al consultar escuelas:', error);
        res.status(500).send('Error al consultar escuelas');
    }
}

async function createSchool(req, res) {
    const { nombre, rut_profesor_cargo } = req.body;
    const query_create_flow = `INSERT INTO flujo (rut_creador, tipo, fecha_inicio, fecha_termino) VALUES (?, ?, ?, ?)`;
    
    const now = new Date();
    const nextSemester = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    const flow_params = [rut_profesor_cargo, 'general', now, nextSemester];

    const query_create_school = `INSERT INTO escuela (nombre, id_flujo, rut_profesor_cargo) VALUES (?, ?, ?)`;
    const school_params = [nombre, null, rut_profesor_cargo];

    const query_get_last_insert_id = `SELECT LAST_INSERT_ID() AS id_flujo`;

    const query_swap_creator_school = `UPDATE usuario SET escuela = ? WHERE rut = ?`;
    const swap_params = [nombre, rut_profesor_cargo];

    const connection = await beginTransaction();
    try {
        await runParametrizedQuery(query_create_flow, flow_params, connection);

        const result = await runParametrizedQuery(query_get_last_insert_id, [], connection);
        const id_flujo = result[0].id_flujo;

        school_params[1] = id_flujo;
        await runParametrizedQuery(query_create_school, school_params, connection);
        await runParametrizedQuery(query_swap_creator_school, swap_params, connection);
        await commitTransaction(connection);

        const json = {
            message: 'Escuela creada con éxito',
            school: {
                nombre,
                id_flujo,
                rut_profesor_cargo
            }
        };

        res.status(200).send(json);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error al crear escuela:', error);
        res.status(500).send('Error al crear escuela');
    }
}

async function updateSchool(req, res) {
    const { nombre, rut_profesor_cargo} = req.body;
    if (!nombre || !rut_profesor_cargo) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }
    const query = `UPDATE escuela SET rut_profesor_cargo = ? WHERE nombre = ?`;
    const school_params = [rut_profesor_cargo, nombre];
    try {
        const result = await runParametrizedQuery(query, school_params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }
        swap_user_school(rut_profesor_cargo, nombre);
        const json = {
            message: 'Escuela actualizada con éxito',
            school: {
                nombre: nombre,
                rut_profesor_cargo
            }
        };
        res.status(200).json(json);
    } catch (error) {
        console.error('Error al actualizar escuela:', error);
        res.status(500).json({ error: 'Error al actualizar escuela', details: error });
    }
}

function swap_user_school(rut, school) {
    const query = `UPDATE usuario SET escuela = ? WHERE rut = ?`;
    const params = [school, rut];
    return runParametrizedQuery(query, params);
}

module.exports = {
    getSchools,
    createSchool,
    updateSchool
};