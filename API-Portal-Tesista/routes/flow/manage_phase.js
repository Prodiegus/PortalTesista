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
        console.log('Fases del flujo:', results);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error obteniendo fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error obteniendo fase');
    }
}

async function edit_phase(req, res) {
    const {id, numero, nombre, descripcion, fecha_inicio, fecha_termino, id_flujo} = req.body;

    // Verificar si ya existe una fase con el nuevo número en el mismo flujo
    const checkQuery = `SELECT id, numero FROM fase WHERE numero = ? AND id_flujo = ?`;
    const checkParams = [numero, id_flujo];

    try {
        const existingPhase = await runParametrizedQuery(checkQuery, checkParams);

        if (existingPhase.length > 0) {
            // Si existe una fase con el nuevo número, intercambiar los números
            const existingPhaseId = existingPhase[0].id;
            const currentPhaseQuery = `SELECT numero FROM fase WHERE id = ?`;
            const currentPhaseParams = [id];
            const currentPhase = await runParametrizedQuery(currentPhaseQuery, currentPhaseParams);
            const currentPhaseNumero = currentPhase[0].numero;

            const swapQuery1 = `UPDATE fase SET numero = ? WHERE id = ?`;
            const swapParams1 = [currentPhaseNumero, existingPhaseId];
            await runParametrizedQuery(swapQuery1, swapParams1);

            const swapQuery2 = `UPDATE fase SET numero = ? WHERE id = ?`;
            const swapParams2 = [numero, id];
            await runParametrizedQuery(swapQuery2, swapParams2);
        } else {
            // Si no existe una fase con el nuevo número, actualizar la fase normalmente
            const query = `
                UPDATE fase
                SET numero = ?, nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_termino = ?, id_flujo = ?
                WHERE id = ?
            `;
            const params = [numero, nombre, descripcion, fecha_inicio, fecha_termino, id_flujo, id];
            await runParametrizedQuery(query, params);
        }

        res.status(200).send('Fase editada correctamente');
    } catch (error) {
        console.error('Error editando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error editando fase');
    }
}

async function delete_phase(req, res) {
    const {id} = req.body;
    const query = `DELETE FROM fase WHERE id = ?`;
    try {
        const results = await runParametrizedQuery(query, [id]);
        console.log('Fase eliminada resultados:', results);
        res.status(200).send('Fase eliminada resultados: ' + results);
    } catch (error) {
        console.error('Error eliminando fase:', error.response ? error.response.data : error.message);
        res.status(500).send('Error eliminando fase');
    }
}

module.exports = {
    create_phase,
    read_phase,
    read_flow_phase,
    edit_phase,
    delete_phase
};