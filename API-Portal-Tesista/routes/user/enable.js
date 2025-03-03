const getToken = require('../utils/getToken');
const crearUsuario = require('../keycloak/crearUsuario');
const getRandomPassword = require('../utils/getRandomPassword');
const {runParametrizedQuery} = require('../utils/query');

async function enable(req, res) {
    const {rut} = req.body;
    const query = `
            UPDATE usuario
            SET activo = 1
            WHERE rut = ?
        `;
    const params = [rut];
    try {
        const token = await getToken();
        const results = await runParametrizedQuery(query, params);
        await crearUsuario(req, token, getRandomPassword(8));
        const response = { 
                estado: "Usuario activado"
        }
        res.status(200).send(response);
    } catch (error) {
        console.error('Error activando usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error activando usuario');
    }
}

module.exports = enable;  
