const getToken = require('../utils/getToken');
const {runParametrizedQuery} = require('../utils/query');

async function updateUser(req, res) {
    const {nombre, apellido, rut, escuela, correo, tipo, activo} = req.body;
    const query = `
            UPDATE usuario
            SET nombre = ?, apellido = ?, escuela = ?, correo = ?, tipo = ?, activo = ?
            WHERE rut = ?
        `;
    const params = [nombre, apellido, escuela, correo, tipo, activo, rut];
    try {
        const token = await getToken();
        
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Usuario actualizado');
    } catch (error) {
        console.error('Error actualizando usuario:', error.response ? error.response.data : error.message);
        res.status(500).send('Error actualizando usuario');
    }
}

module.exports = updateUser;