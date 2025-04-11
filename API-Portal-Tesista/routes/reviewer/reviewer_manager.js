const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');

async function addReviewer(req, res){
    const { id_tema, rut_revisor, rut_profesor_cargo } = req.body;

    const query_insert_reviewer = `
        INSERT INTO revisor_asignado (id_tema, rut_revisor, rut_profesor_cargo)
        VALUES (?, ?, ?)
    `;
    const params_insert_reviewer = [id_tema, rut_revisor, rut_profesor_cargo];
    
    try {
        await runParametrizedQuery(query_insert_reviewer, params_insert_reviewer);

        res.status(200).json({ message: 'Reviewer added successfully' });
    } catch (error) {
        console.error('Error adding reviewer:', error.response ? error.response.data : error.message);
        res.status(500).send('Error adding reviewer');
    }
}

async function getTopicReviewers(req, res){
    const { id_tema } = req.params;

    // Validar que el id_tema no esté vacío
    if (!id_tema) {
        return res.status(400).send('Falta el id_tema en la solicitud');
    }

    const query_get_reviewers = `
        SELECT usuario.nombre, usuario.apellido, usuario.rut, usuario.correo
        FROM usuario JOIN revisor_asignado ON revisor_asignado.rut_revisor = usuario.rut
        WHERE revisor_asignado.id_tema = ?;
    `;
    const params_get_reviewers = [id_tema];

    try {

        const reviewers = await runParametrizedQuery(query_get_reviewers, params_get_reviewers);

        res.status(200).json(reviewers);
    } catch (error) {
        console.error('Error getting topic reviewers:', error.response ? error.response.data : error.message);
        res.status(500).send('Error getting topic reviewers');
    }
}

async function deleteReviewer(req, res){
    const { id_tema, rut_revisor } = req.body;

    const query_delete_reviewer = `
        DELETE FROM revisor_asignado
        WHERE id_tema = ? AND rut_revisor = ?
    `;
    const params_delete_reviewer = [id_tema, rut_revisor];

    try {
        await runParametrizedQuery(query_delete_reviewer, params_delete_reviewer, connection);

        res.status(200).json({ message: 'Reviewer deleted successfully' });
    } catch (error) {
        console.error('Error deleting reviewer:', error.response ? error.response.data : error.message);
        res.status(500).send('Error deleting reviewer');
    } 
}

async function startPreviewReview(req, res){}

module.exports = {
    addReviewer,
    getTopicReviewers,
    deleteReviewer,
    startPreviewReview
};