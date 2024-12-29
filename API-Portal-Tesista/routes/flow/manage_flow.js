const {runParametrizedQuery} = require('../utils/query');

async function create_flow(req, res) {
    const {rut_creador, tipo, fecha_inicio, fecha_termino} = req.body;
    const query = `
            INSERT INTO flujo (rut_creador, tipo, fecha_inicio, fecha_termino)
            VALUES (?, ?, ?, ?)
        `;
    const params = [rut_creador, tipo, fecha_inicio, fecha_termino];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Flujo creado resultados: ' + results);
    } catch (error) {
        console.error('Error creando flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creando flujo');
    }
}

async function read_flow(req, res) {
    const {type} = req.params;
    const query = `SELECT * FROM flujo WHERE tipo = ?`;
    const params = [type];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo flujo');
    }
}

async function edit_flow(req, res) {
    const {id, tipo, fecha_inicio, fecha_termino} = req.body;
    const query = `
            UPDATE flujo
            SET tipo = ?, fecha_inicio = ?, fecha_termino = ?
            WHERE id = ?
        `;
    const params = [tipo, fecha_inicio, fecha_termino, id];
    try {
        const results = await runParametrizedQuery(query, params);
        res.status(200).send('Flujo editado resultados: ' + results);
    } catch (error) {
        console.error('Error editando flujo:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando flujo');
    }
    
}


module.exports = {
    create_flow,
    read_flow,
    edit_flow
};