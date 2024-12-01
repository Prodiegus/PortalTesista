const axios = require('axios');
require('dotenv').config();
const qs = require('qs');
const https = require('https');

async function crearUsuario(req, token, password) {
    const {nombre, apellido, rut, correo, tipo} = req.body;
    try {
        const response = await axios.post(process.env.API_LOGIN_URL+'keycloak/user/create', {
        username: rut,
        email: correo,
        firstName: nombre,
        lastName: apellido,
        password: password,
        roles: [tipo]
        }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false, // Ignorar la verificación del certificado
            checkServerIdentity: () => undefined // Ignorar la verificación del nombre de host
          })
        });
        console.log('Usuario keycloak creado:', response.data);
    } catch (error) {
        console.error('Error creando usuario keycloak:', error.response ? error.response.data : error.message);
    }
}

module.exports = crearUsuario;