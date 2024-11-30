const getRandomPassword = require('../utils/getRandomPassword');
const getToken = require('../utils/getToken');
const crearUsuario = require('../keycloak/crearUsuario');
const {runParametrizedQuery} = require('../utils/query');

async function create(req, res) {
    const {nombre, apellido, rut, escuela, correo, tipo, activo} = req.body;
    const password = getRandomPassword(8);
    const query = `
            INSERT INTO usuario (nombre, apellido, rut, escuela, correo, password, tipo, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const params = [nombre, apellido, rut, escuela, correo, password, tipo, activo];
    try {
        const token = await getToken();
        const results = await runParametrizedQuery(query, params);
        await crearUsuario(req, token, password);
        res.status(200).send('Usuario creado, contraseña temporal: ' + password + ' resultados: ' + results);
    } catch (error) {
        console.error('Error creando usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando usuario');
    }
}

module.exports = create;