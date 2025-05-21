const { runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction } = require('../utils/query');

async function addGuideToTopic(req, res) {
    const { id_tema, rut } = req.body;
    const query_get_rut_alumno = `SELECT rut_alumno FROM alumno_trabaja WHERE id_tema = ? AND fecha_termino IS NULL;`;
    const params_get_rut_alumno = [id_tema];
    const query_add_guide = `INSERT INTO guia (rut_alumno, rut_guia, fecha_inicio, fecha_termino) VALUES (?, ?, ?, ?);`;
    const params_add_guide = [null, rut, new Date(), null];

    try {
        const results = await runParametrizedQuery(query_get_rut_alumno, params_get_rut_alumno);
        if (results.length === 0) {
            return res.status(404).send('No se encontró el tema o no hay alumnos asignados.');
        }
        const rut_alumno = results[0].rut_alumno;
        params_add_guide[0] = rut_alumno;

        await runParametrizedQuery(query_add_guide, params_add_guide);
        res.status(200).send({ message: 'Guía agregado exitosamente' });
    } catch (error) {
        console.error('Error agregando guía:', error.response ? error.response.data : error.message);
        res.status(500).send('Error agregando guía');
    }
}

async function deleteGuideFromTopic(req, res) {
    const { rut } = req.body;
    
    const query = `
        UPDATE guia
        SET fecha_termino = ?
        WHERE rut_guia = ? AND;
    `;
    const params = [new Date(), rut];
    try {
        await runParametrizedQuery(query, params);
        res.status(200).send({ message: 'Guía eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando guía:', error.response ? error.response.data : error.message);
        res.status(500).send('Error eliminando guía');
    }
}

async function readTopicGuide(req, res) {
    const { id_tema } = req.params;
    const query = `
    SELECT usuario.nombre, usuario.apellido, usuario.rut, usuario.correo
    FROM (
        SELECT rut_guia, guia.fecha_termino
        FROM alumno_trabaja JOIN guia ON guia.rut_alumno = alumno_trabaja.rut_alumno
        WHERE alumno_trabaja.fecha_termino IS NULL AND alumno_trabaja.id_tema = ?
        ) as guias JOIN usuario ON guias.rut_guia = usuario.rut;
    WHERE guias.fecha_termino IS NULL;
    `;
    const params = [id_tema];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo guías:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo guías');
    }
}

module.exports = {
    addGuideToTopic,
    deleteGuideFromTopic,
    readTopicGuide
};