const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

async function getSchools(req, res) {
    try {
        const query = `SELECT nombre FROM escuela`;
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

    const flow_params = [rut_profesor_cargo,'general',new Date(),new Date()+86400000];// 86400000 = 1 day

    const query_create_school = `INSERT INTO escuela (nombre, id_flujo, rut_profesor_cargo) VALUES (?, ?, ?)`;
    const school_params = [nombre, null, rut_profesor_cargo];

    const query_get_last_insert_id = `SELECT LAST_INSERT_ID() AS id_flujo`;

    const connection = await beginTransaction();
    try {
        await runParametrizedQuery(query_create_flow, flow_params, connection);

        const result = await runParametrizedQuery(query_get_last_insert_id, [], connection);
        const id_flujo = result[0].id_flujo;

        school_params[1] = id_flujo;
        await runParametrizedQuery(query_create_school, school_params, connection);
        await commitTransaction(connection);
        res.status(201).send('Escuela creada con éxito');
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error al crear escuela:', error);
        res.status(500).send('Error al crear escuela');
    }
}

async function updateSchool(req, res) {
    const { id, nombre, rut_profesor_cargo } = req.body;
    const query = `UPDATE escuela SET nombre = ?, rut_profesor_cargo = ? WHERE id = ?`;
    const school_params = [nombre, rut_profesor_cargo, id];
    try {
        const result = await runParametrizedQuery(query, school_params);
        if (result.affectedRows === 0) {
            return res.status(404).send('Escuela no encontrada');
        }
        
        res.status(200).send('Escuela actualizada con éxito');
    } catch (error) {
        console.error('Error al actualizar escuela:', error);
        res.status(500).send('Error al actualizar escuela');
    }
}

module.exports = {
    getSchools,
    createSchool,
    updateSchool
};