const getUserName = require('../keycloak/getUserName');
const getUser = require('../keycloak/getUser');
const getAllUser = require('../keycloak/getAllUsers');
const getToken = require('../utils/getToken');
const {runParametrizedQuery, runQuery} = require('../utils/query');
const { response } = require('express');

async function read(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(401).send('No se proporcionó token');
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).send('Token no válido');
            return;
        }
        const userName = await getUserName(token);
        if (!userName) {
            return res.status(404).send('Usuario no encontrado');
        }
        const userRepresentation = await getUser(await getToken(), userName);
        if (userRepresentation === "no user") {
            return res.status(404).send('Usuario no encontrado');
        }
        const id = userRepresentation[0].id;
        const query = `SELECT * FROM usuario WHERE rut = ?`;
        const params = [userName];
        const results = await runParametrizedQuery(query, params);
        const {nombre, apellido, rut, escuela, correo, tipo, activo} = results[0];
        res.status(200).send({
            id: id,
            nombre: nombre+' '+apellido,
            rut: rut,
            escuela: escuela,
            correo: correo,
            tipo: tipo,
            activo: activo
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo usuario');
    }
}

async function readAll(req, res) {
    try {
        const keycloakUsers = await getAllUser(await getToken());
        if (keycloakUsers === "no user") {
            return res.status(404).send('Usuarios no encontrados');
        }
        const query = `SELECT * FROM usuario WHERE escuela = ?`;
        const { escuela } = req.params;
        const params = [escuela];
        const results = await runParametrizedQuery(query, params);
        
        let response = [];
        let keycloakUser;
        for (result of results) {
            keycloakUser = keycloakUsers.find(user => user.username === result.rut);
            if (keycloakUser) {
                response.push({
                    id: keycloakUser.id,
                    nombre: result.nombre + ' ' + result.apellido,
                    rut: result.rut,
                    escuela: result.escuela,
                    correo: result.correo,
                    tipo: result.tipo,
                    activo: result.activo
                });
            } else {
                response.push({
                    id: null,
                    nombre: result.nombre + ' ' + result.apellido,
                    rut: result.rut,
                    escuela: result.escuela,
                    correo: result.correo,
                    tipo: result.tipo,
                    activo: result.activo
                });
            }
        }

        for (let i = 0; i < response.length; i++) {
            if (response[i].tipo === 'alumno') {
                response.splice(i, 1);
                i--; 
            }
        }
        
        res.status(200).send(response);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo usuarios');
        
    }
}

async function readAlles(req, res) {
    try {
        const query = `SELECT  nombre, apellido, escuela, correo, rut FROM usuario`;
        const results = await runQuery(query);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo usuarios');
    }
}
module.exports = {
    read,
    readAll
}; 