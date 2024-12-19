const axios = require('axios');
require('dotenv').config();
const qs = require('qs');
const https = require('https');

async function deleteUser(req, token) {
    const { id } = req.body;
    try {
        const response = await axios.delete(`${process.env.API_LOGIN_URL}keycloak/user/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Ignorar la verificación del certificado
                checkServerIdentity: () => undefined // Ignorar la verificación del nombre de host
            })
        });
        console.log('Usuario keycloak eliminado:', response.data);
    } catch (error) {
        console.error('Error eliminando usuario keycloak:', error.response ? error.response.data : error.message);
    }
}

module.exports = deleteUser;