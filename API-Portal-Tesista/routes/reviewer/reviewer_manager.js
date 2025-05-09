const e = require('express');
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
        await runParametrizedQuery(query_delete_reviewer, params_delete_reviewer);

        res.status(200).json({ message: 'Reviewer deleted successfully' });
    } catch (error) {
        console.error('Error deleting reviewer:', error.response ? error.response.data : error.message);
        res.status(500).send('Error deleting reviewer');
    } 
}

async function startPreviewReview(req, res){
    const { 
        nota, 
        aprobado, 
        comentario, 
        archivo, 
        id_avance,
        nombre
    } = req.body;

    const query_edit_review = `
        UPDATE avance
        SET nota = ?, aprobado = ?, comentarios = ?
        WHERE id = ?;
    `;
    const params_edit_review = [nota, aprobado, comentario, id_avance];
    console.log('params_edit_review', params_edit_review);
    query_add_file = `
        INSERT INTO archivo (id_avance, nombre, file, fecha, tipo)
        VALUES (?, ?, ?, ?, ?);
    `;

    const params_add_file = [id_avance, nombre, archivo, new Date(), 'feedback'];

    try{
        await runParametrizedQuery(query_edit_review, params_edit_review);
        if(archivo){
            await runParametrizedQuery(query_add_file, params_add_file);
        }


        res.status(200).json({ message: 'Revision enviada con exito' });

    }catch(error){
        console.error('Error starting preview review:', error.response ? error.response.data : error.message);
        res.status(500).send('Error starting preview review');
    }
}

async function gradeReview(req, res){
    const { 
        nota, 
        aprobado, 
        comentario, 
        archivo, 
        id_avance,
        id_tema,
        nombre
    } = req.body;
    
    const query_edit_review = `
        UPDATE avance
        SET nota = ?, aprobado = ?, comentarios = ?
        WHERE id = ?;
    `;
    query_add_file = `
        INSERT INTO archivo (id_avance, nombre, file, fecha, tipo)
        VALUES (?, ?, ?, ?, ?);
    `;
    const params_add_file = [id_avance, nombre, archivo, new Date(), 'feedback'];
    const query_get_reviewers = `SELECT count(rut_revisor) as revisores from revisor_asignado where id_tema = ?`;
    const params_get_reviewers = [id_tema];
    const query_get_avance = `SELECT * from avance where id = ?`;
    const params_get_avance = [id_avance];

    try{
        const reviewers = await runParametrizedQuery(query_get_reviewers, params_get_reviewers);
        const avance = await runParametrizedQuery(query_get_avance, params_get_avance);
        console.log('reviewers', reviewers);
        console.log('avance', avance);
        if (!avance[0]) {
            return res.status(400).json({ message: 'No se encontró el avance especificado' });
        }
        if(reviewers[0].revisores == 1){
            const params_edit_review = [nota, aprobado, comentario, id_avance];
            await runParametrizedQuery(query_edit_review, params_edit_review);
            if(archivo){
                await runParametrizedQuery(query_add_file, params_add_file);
            }
            res.status(200).json({ message: 'Revision enviada con exito' });
        } else if (reviewers[0] && reviewers[0].revisores > 1) {
            const currentNota = avance[0].nota !== null && avance[0].nota !== undefined ? avance[0].nota : 0;
            const currentAprobado = avance[0].aprobado !== null && avance[0].aprobado !== undefined ? avance[0].aprobado : 0;
        
            const aprobadoValue = aprobado === true ? 1 : aprobado === false ? 0 : aprobado;
        
            const newNota = (currentNota + (nota !== null && nota !== undefined ? nota : 0)) / reviewers[0].revisores;
            const newAprobado = (currentAprobado + aprobadoValue) / reviewers[0].revisores;
        
            const params_edit_review = [newNota, newAprobado, comentario, id_avance];
            await runParametrizedQuery(query_edit_review, params_edit_review);
        
            if (archivo) {
                await runParametrizedQuery(query_add_file, params_add_file);
            }
        
            res.status(200).json({ message: 'Revision enviada con exito' });
        }else{
            res.status(400).json({ message: 'No hay revisores asignados' });
        }
    }catch(error){
        console.error('Error starting preview review:', error.response ? error.response.data : error.message);
        res.status(500).send('Error starting preview review');
    }
}

module.exports = {
    addReviewer,
    getTopicReviewers,
    deleteReviewer,
    startPreviewReview,
    gradeReview
};