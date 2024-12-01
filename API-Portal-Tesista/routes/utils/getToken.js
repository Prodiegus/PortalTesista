const axios = require('axios');
require('dotenv').config();
const qs = require('qs');
const https = require('https');

async function getToken() {
  try {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      grant_type: process.env.GRANT_TYPE,
      username: process.env.TOKEN_USER,
      password: process.env.PASSWORD,
      client_secret: process.env.CLIENT_SECRET
    });

    const response = await axios.post(process.env.TOKEN_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignorar la verificación del certificado
        checkServerIdentity: () => undefined // Ignorar la verificación del nombre de host
      })
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = getToken;