const axios = require('axios');
require('dotenv').config();
const https = require('https');

async function getUserName(token) {
    try {
        const response = await axios.get(process.env.API_LOGIN_URL+'userName', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false, // Ignorar la verificación del certificado
            checkServerIdentity: () => undefined // Ignorar la verificación del nombre de host
          })
        });
        return response.data.name;
    } catch (error) {
        console.error('Error usuario keycloak:', error.response ? error.response.data : error.message);
    }
    return "No user";
}

module.exports = getUserName;