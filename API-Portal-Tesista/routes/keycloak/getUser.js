const axios = require('axios');
require('dotenv').config();
const https = require('https');

async function getUser(token, userName) {
    try {
        const url = `${process.env.API_LOGIN_URL}keycloak/user/search/${userName}`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Ignorar la verificación del certificado
                checkServerIdentity: () => undefined // Ignorar la verificación del nombre de host
            })
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo usuario Keycloak:', error);
        return "no user";
    }
}

module.exports = getUser;