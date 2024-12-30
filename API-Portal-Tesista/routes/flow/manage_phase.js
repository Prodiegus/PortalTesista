const {runParametrizedQuery} = require('../utils/query');

async function create_phase(req, res) {
    const {numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo} = req.body;
    const query = `
            INSERT INTO fase (numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const params = [numero, nombre, descripcion, tipo, fecha_inicio, fecha_termino, rut_creador, id_flujo];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Fase creada resultados: ' + results);
    } catch (error) {
        console.error('Error creando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando fase');
    }
}

async function read_phase(req, res) {
    const {type} = req.params;
    const query = `SELECT * FROM fase WHERE tipo = ?`;
    const params = [type];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fase');
    }
}

async function read_flow_phase(req, res) {
    const { id } = req.params;
    const query = `SELECT * FROM fase WHERE id_flujo = ?;`;
    try {
        const results = await runParametrizedQuery(query, [id]);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fase');
    }
}

async function edit_phase(req, res) {
    const {id, numero, nombre, descripcion, fecha_inicio, fecha_termino, id_flujo} = req.body;
    const query = `
            UPDATE fase
            SET numero = ?, nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_termino = ?, id_flujo = ?
            WHERE id = ?
        `;
    const params = [numero, nombre, descripcion, fecha_inicio, fecha_termino, id_flujo, id];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Fase editada resultados: ' + results);
    } catch (error) {
        console.error('Error editando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando fase');
    }
    
}

module.exports = {
    create_phase,
    read_phase,
    read_flow_phase,
    edit_phase
};