const getToken = require('../utils/getToken');
const deleteUser = require('../keycloak/deleteUser');
const {runParametrizedQuery} = require('../utils/query');

async function disable(req, res) {
    const {rut} = req.body;
    const query = `
            UPDATE usuario
            SET activo = 0
            WHERE rut = ?
        `;
    const params = [rut];
    try {
        const token = await getToken();
        await deleteUser(req, token);
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Usuario desactivado, resultados: ' + results);
    } catch (error) {
        console.error('Error desactivando usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error desactivando usuario');
    }
}

module.exports = disable;