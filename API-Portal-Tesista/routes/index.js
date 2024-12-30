// routes/index.js
const express = require('express');
const create = require('./user/create');
const { read, readAll} = require('./user/read');
const { create_flow, read_flow, read_school_flow, edit_flow } = require('./flow/manage_flow');
const { create_phase, read_phase, edit_phase } = require('./flow/manage_phase');
const { create_topic, read_topic, read_all_topics, edit_topic, change_topic_status } = require('./topic/topic_manager');
const disable = require('./user/disable');
const enable = require('./user/enable');

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

router.post('/edit/phase', async (req, res) => {
  console.log('Consulta post a /edit/phase: ', req.body);
  await edit_phase(req, res);
});

router.post('/create/phase', async (req, res) => {
  console.log('Consulta post a /create/phase: ', req.body);
  await create_phase(req, res);
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

module.exports = router;