const { json } = require('express');
const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const { get } = require('..');

async function getIssue(req, res) {
    const { id } = req.params;

    const query_get_meeting = `
        SELECT fecha, resumen, estado FROM reunion WHERE id_tema = ?;
    `;
    const qeury_get_flujos = `
        SELECT fase.fecha_inicio as fecha_inicio, fase.fecha_termino as fecha_termino, nombre, descripcion, fase.tipo as tipo
        FROM fase JOIN (
            SELECT *
            FROM flujo JOIN flujo_tiene_tema ON flujo.id = flujo_tiene_tema.id_flujo
        ) AS flujo ON flujo.id = fase.id_flujo
        WHERE id_tema = ?;
    `;
    const query_get_avances = `
        SELECT fecha, nota, comentarios FROM avance WHERE id_tema = ?;
    `;
    const params = [id];

    try {
        const meeting = await runParametrizedQuery(query_get_meeting, params);
        const flow = await runParametrizedQuery(qeury_get_flujos, params);
        const advances = await runParametrizedQuery(query_get_avances, params);
        let response = [];
        if (meeting.length > 0) {
            for (let i = 0; i < meeting.length; i++) {
                response.push({
                    [meeting[i].fecha]: {
                        titulo: 'Reunion en estado '+meeting[i].estado,
                        contenido: meeting[i].resumen ? meeting[i].resumen : 'No hay resumen disponible',
                    }
                });
            }
        }
        if (flow.length > 0) {
            for (let i = 0; i < flow.length; i++) {
                response.push({
                    [flow[i].fecha_inicio]: {
                        titulo: 'Inicio fase '+flow[i].nombre,
                        contenido: flow[i].descripcion ? flow[i].descripcion : 'No hay descripcion disponible',
                    }
                });
                response.push({
                    [flow[i].fecha_termino]: {
                        titulo: 'Termino fase '+flow[i].nombre,
                        contenido: flow[i].descripcion ? flow[i].descripcion : 'No hay descripcion disponible',
                    }
                });
            }
        }
        if (advances.length > 0) {
            for (let i = 0; i < advances.length; i++) {
                response.push(
                    [advances[i].fecha]: {
                        titulo: advances[i].nota ? 'Avance '+advances[i].nota : 'avance no calificado',
                        contenido: advances[i].comentarios ? advances[i].comentarios : 'No hay comentarios disponibles',
                    }
                );
            }
        }
        response.sort((a, b) => {
            const dateA = new Date(Object.keys(a)[0]);
            const dateB = new Date(Object.keys(b)[0]);
            return dateA - dateB;
        });
        res.status(200).send(response);
    } catch (error) {
        console.error('Error al obtener el tema:', error);
        res.status(500).json({ error: 'Error al obtener el tema' });
    }
}

module.exports = {
    getIssue
}