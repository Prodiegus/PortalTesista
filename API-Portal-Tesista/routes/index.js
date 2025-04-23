// routes/index.js
const express = require('express');
const create = require('./user/create');
const { read, readAll} = require('./user/read');
const { create_flow, read_flow, read_school_flow, edit_flow } = require('./flow/manage_flow');
const { create_phase, read_phase, edit_phase, read_flow_phase, delete_phase, read_topic_phase, create_subphase, move_phase_backward, move_phase_forward } = require('./flow/manage_phase');
const { create_topic, read_topic, read_all_topics, edit_topic, change_topic_status, requestTopic, acept_topic_request, read_topic_request} = require('./topic/topic_manager');
const disable = require('./user/disable');
const enable = require('./user/enable');
const {getSchools} = require('./school/school_manager');
const {addPreview, getTopicPreviews} = require('./update/topic_preview_manager');
const {addReviewer, getTopicReviewers, deleteReviewer, startPreviewReview} = require('./reviewer/reviewer_manager');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('Consulta get a /: ', req.body);
  res.send('API de Portal Tesista');
});

router.post('/create/user', async (req, res) => {
  console.log('Consulta post a /create/user: ', req.body);
  await create(req, res); 
});

router.get('/read/user', async (req, res) => {
  console.log('Consulta get a /read/user: ', req.body);
  await read(req, res); 
});

router.get('/read/allUser/:escuela', async (req, res) => {
  console.log('Consulta get a /read/allUser: ', req.body);
  await readAll(req, res); 
});

router.post('/disable/user', async (req, res) => {
  console.log('Consulta post a /disable/user: ', req.body);
  await disable(req, res); 
});

router.post('/enable/user', async (req, res) => {
  console.log('Consulta post a /enable/user: ', req.body);
  await enable(req, res); 
});

router.get('/read/work-flow/:type', async (req, res) => {
  console.log('Consulta get a /read/work-flow: ', req.body);
  await read_flow(req, res);
});

router.get('/read/work-flow/escuela/:school', async (req, res) => {
  console.log('Consulta get a /read/work-flow/escuela/'+req.params.school+': ', req.body);
  await read_school_flow(req, res);
});

router.post('/edit/work-flow', async (req, res) => {
  console.log('Consulta post a /edit/work-flow: ', req.body);
  await edit_flow(req, res);
});

router.post('/create/work-flow', async (req, res) => {
  console.log('Consulta post a /create/work-flow: ', req.body);
  // para flujos generales unicamente se pueden crear al crear una escuela
  await create_flow(req, res);
});

router.get('/read/phase/:type', async (req, res) => {
  console.log('Consulta get a /read/phase/:type: ', req.body);
  await read_phase(req, res);
});

router.get(`/read/work-flow/phase/:id`, async (req, res) => {
  console.log('Consulta get a /read/work-flow/phase/:id: ', req.body);
  await read_flow_phase(req, res);
});

router.get('/read/topic-phase/:id_tema', async (req, res) => {
  console.log('Consulta get a /read/topic-phase/:id_tema: ', req.body);
  await read_topic_phase(req, res);
});

router.post('/create/subphase', async (req, res) => {
  console.log('Consulta post a /create/subphase: ', req.body);
  await create_subphase(req, res);
});

router.post('/edit/phase', async (req, res) => {
  console.log('Consulta post a /edit/phase: ', req.body);
  await edit_phase(req, res);
});

router.post('/create/phase', async (req, res) => {
  console.log('Consulta post a /create/phase: ', req.body);
  await create_phase(req, res);
});

router.delete('/delete/phase', async (req, res) => {
  console.log('Consulta delete a /delete/phase: ', req.body);
  await delete_phase(req, res);
});

router.post('/move/phase/forward/:id_tema', async (req, res) => {
  console.log('Consulta post a /move/phase/forward/:id_tema: ', req.body);
  await move_phase_forward(req, res);
});

router.post('/move/phase/backward/:id_tema', async (req, res) => {
  console.log('Consulta post a /move/phase/backward/:id_tema: ', req.body);
  await move_phase_backward(req, res);
});

// leer todos los temas
router.get('/read/topic', async (req, res) => {
  console.log('Consulta get a /read/topic: ', req.body);
  await read_all_topics(req, res);
});

// leer los temas de un usuario
router.get('/read/topic/:rut', async (req, res) => {
  console.log('Consulta get a /read/topic/:rut: ', req.body);
  await read_topic(req, res);
});

router.post('/create/topic', async (req, res) => {
  console.log('Consulta post a /create/topic: ', req.body);
  await create_topic(req, res);
});

router.post('/edit/topic', async (req, res) => {
  console.log('Consulta post a /edit/topic: ', req.body);
  await edit_topic(req, res);
});

router.post('/change/topic-status', async (req, res) => {
  console.log('Consulta post a /change/topic-status: ', req.body);
  await change_topic_status(req, res);
});

router.post('/request/topic', async (req, res) => {
  console.log('Consulta post a /request/topic: ', req.body);
  await requestTopic(req, res);
});

router.post('/accept/topic', async (req, res) => {
  console.log('Consulta post a /accept/topic: ', req.body);
  await acept_topic_request(req, res);
});

router.get('/read/topic-request/:topic_id', async (req, res) => {
  console.log('Consulta get a /read/topic-request/:topic_id: ', req.params);
  await read_topic_request(req, res);
});


// leer todas las escuelas
router.get('/read/schools', async (req, res) => {
  console.log('Consulta get a /read/schools: ', req.body);
  await getSchools(req, res);
});

// subir un avance
router.post('/upload/preview', async (req, res) => {
  console.log('Consulta post a /upload/preview: ');
  await addPreview(req, res);
});

// leer avances tema
router.get('/read/preview/:id_tema', async (req, res) => {
  console.log('Consulta get a /read/preview/:id_tema: ', req.body);
  await getTopicPreviews(req, res);
});

// agregar revisor a un tema
router.post('/add/reviewer', async (req, res) => {
  console.log('Consulta post a /add/reviewer: ', req.body);
  await addReviewer(req, res);
});

// leer revisores de un tema
router.get('/read/reviewer/:id_tema', async (req, res) => {
  console.log('Consulta get a /read/reviewer/:id_tema: ', req.body);
  await getTopicReviewers(req, res);
});

// eliminar revisor de un tema
router.post('/delete/reviewer', async (req, res) => {
  console.log('Consulta POST a /delete/reviewer: ', req.body);
  await deleteReviewer(req, res);
});

// iniciar revision de un avance
router.post('/start/review', async (req, res) => {
  console.log('Consulta post a /start/review: ', req.body);
  await startPreviewReview(req, res);
});

module.exports = router;