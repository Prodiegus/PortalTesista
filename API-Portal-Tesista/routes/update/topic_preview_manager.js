const { json } = require('express');
const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const { get } = require('..');

async function addPreview(req, res) {
    const { id_tema, nombre_archivo, archivo64, fecha } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!id_tema || !nombre_archivo || !archivo64 || !fecha) {
        return res.status(400).send('Faltan campos requeridos en la solicitud');
    }

    const query_insert_preview = `
        INSERT INTO avance (id_tema, comentarios, nota, aprobado, fecha, revision_visible)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params_insert_preview = [id_tema, null, null, null, fecha, 0];

    const query_get_last_id = `SELECT LAST_INSERT_ID() AS id;`;

    const query_insert_file = `
        INSERT INTO archivo (id_avance, nombre, file, fecha, tipo)
        VALUES (?, ?, ?, ?, ?)
    `;

    let connection;
    try {
        connection = await beginTransaction();

        // Insertar el avance
        await runParametrizedQuery(query_insert_preview, params_insert_preview, connection);

        const results = await runQuery(query_get_last_id, connection);
        const newPreviewId = results[0].id;

        const params_insert_file = [newPreviewId, nombre_archivo, archivo64, fecha, 'avance'];

        // Insertar el archivo
        await runParametrizedQuery(query_insert_file, params_insert_file, connection);

        await commitTransaction(connection);

        res.status(200).json({ id: newPreviewId, message: 'Preview added successfully' });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error adding preview:', error.response ? error.response.data : error.message);
        res.status(500).send('Error adding preview');
    } finally {
        if (connection) {
            commitTransaction(connection).catch(error => {
                console.error('Error committing transaction:', error.message);
            }   );
        }
    }
}

async function getTopicPreviews(req, res) {
    const { id_tema } = req.params;

    if (!id_tema) {
        return res.status(400).send('Falta el id_tema en la solicitud');
    }

    const query = `
        SELECT a.*, ar.id_avance, ar.nombre AS nombre_archivo, ar.file AS archivo
        FROM avance a
        JOIN (
            SELECT id_avance, MAX(fecha) AS fecha_reciente
            FROM archivo
            WHERE tipo = 'avance'
            GROUP BY id_avance
        ) subquery ON a.id = subquery.id_avance
        JOIN archivo ar ON subquery.id_avance = ar.id_avance AND subquery.fecha_reciente = ar.fecha
        WHERE a.id_tema = ?
    `;

    const feedbackQuery = `
        SELECT ar.id_avance, ar.nombre AS nombre_archivo, ar.file AS archivo
        FROM avance a
        JOIN (
            SELECT id_avance, MAX(fecha) AS fecha_reciente
            FROM archivo
            WHERE tipo = 'feedback'
            GROUP BY id_avance
        ) subquery ON a.id = subquery.id_avance
        JOIN archivo ar ON subquery.id_avance = ar.id_avance AND subquery.fecha_reciente = ar.fecha
        WHERE a.id_tema = ?
    `;

    const params = [id_tema];
    const connection = await beginTransaction();

    try {
        const results = await runParametrizedQuery(query, params, connection);
        const feedbackResults = await runParametrizedQuery(feedbackQuery, params, connection);

        if (results.length === 0) {
            return res.status(404).send('No se encontraron avances para el tema especificado');
        }

        // Crear un mapa de feedbacks por id_avance
        const feedbackMap = new Map();
        feedbackResults.forEach(feedback => {
            feedbackMap.set(feedback.id_avance, {
                nombre_archivo: feedback.nombre_archivo,
                archivo: feedback.archivo
                    ? (() => {
                        const archivo = feedback.archivo.toString();
                        const prefix = 'data:application/pdf;base64,';
                
                        // 1. Si ya tiene el prefijo, devolver tal cual
                        if (archivo.startsWith(prefix)) {
                            return archivo;
                        }
                
                        // 2. Si parece una cadena Base64 válida, agregar el prefijo
                        if (/^[A-Za-z0-9+/=]+$/.test(archivo) && archivo.length > 100) {
                            return prefix + archivo;
                        }
                
                        // 3. De lo contrario, tratar como Buffer y convertir a Base64
                        const base64String = Buffer.from(feedback.archivo).toString('base64');
                        return prefix + base64String;
                    })()
                    : null
            });
        });

        // Procesar los resultados y asociar el feedback correspondiente
        const processedResults = results.map(result => {
            const archivo = result.archivo
                    ? (() => {
                        const archivo = result.archivo.toString();
                        const prefix = 'data:application/pdf;base64,';
                
                        // 1. Si ya tiene el prefijo, devolver tal cual
                        if (archivo.startsWith(prefix)) {
                            return archivo;
                        }
                
                        // 2. Si parece una cadena Base64 válida, agregar el prefijo
                        if (/^[A-Za-z0-9+/=]+$/.test(archivo) && archivo.length > 100) {
                            return prefix + archivo;
                        }
                
                        // 3. De lo contrario, tratar como Buffer y convertir a Base64
                        const base64String = Buffer.from(feedback.archivo).toString('base64');
                        return prefix + base64String;
                    })()
                    : null

            const feedback = feedbackMap.get(result.id_avance) || null;
            result.aprobado = result.aprobado > 5 ? true : false;
            return {
                ...result,
                archivo,
                feedback
            };
        });

        await commitTransaction(connection);
        res.status(200).json(processedResults);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error fetching topic previews:', error.message);
        res.status(500).send('Error fetching topic previews');
    }
}

async function getLatetsTopicPreview(req, res) {
    const { id_tema } = req.params;

    if (!id_tema) {
        return res.status(400).send('Falta el id_tema en la solicitud');
    }

    const query = `
        SELECT a.*, ar.nombre AS nombre_archivo, ar.file AS archivo
        FROM avance a
        JOIN (
            SELECT id_avance, MAX(fecha) AS fecha_reciente
            FROM archivo
            WHERE tipo = 'avance'
            GROUP BY id_avance
        ) subquery ON a.id = subquery.id_avance
        JOIN archivo ar ON subquery.id_avance = ar.id_avance AND subquery.fecha_reciente = ar.fecha
        WHERE a.id_tema = ? ORDER BY a.fecha DESC
        LIMIT 1
    `;

    const feedbackQuery = `
        SELECT ar.id_avance, ar.nombre AS nombre_archivo, ar.file AS archivo
        FROM avance a
        JOIN (
            SELECT id_avance, MAX(fecha) AS fecha_reciente
            FROM archivo
            WHERE tipo = 'feedback'
            GROUP BY id_avance
        ) subquery ON a.id = subquery.id_avance
        JOIN archivo ar ON subquery.id_avance = ar.id_avance AND subquery.fecha_reciente = ar.fecha
        WHERE a.id_tema = ?
    `;

    const params = [id_tema];
    const connection = await beginTransaction();

    try {
        const results = await runParametrizedQuery(query, params, connection);
        const feedbackResults = await runParametrizedQuery(feedbackQuery, params, connection);

        if (results.length === 0) {
            return res.status(404).send('No se encontraron avances para el tema especificado');
        }

        // Crear un mapa de feedbacks por id_avance
        const feedbackMap = new Map();
        feedbackResults.forEach(feedback => {
            feedbackMap.set(feedback.id_avance, {
                nombre_archivo: feedback.nombre_archivo,
                archivo: feedback.archivo
                    ? (() => {
                        const archivo = feedback.archivo.toString();
                        const prefix = 'data:application/pdf;base64,';

                        // 1. Si ya tiene el prefijo, devolver tal cual
                        if (archivo.startsWith(prefix)) {
                            return archivo;
                        }

                        // 2. Si parece una cadena Base64 válida, agregar el prefijo
                        if (/^[A-Za-z0-9+/=]+$/.test(archivo) && archivo.length > 100) {
                            return prefix + archivo;
                        }

                        // 3. De lo contrario, tratar como Buffer y convertir a Base64
                        const base64String = Buffer.from(feedback.archivo).toString('base64');
                        return prefix + base64String;
                    })()
                    : null
            });
        });

        // Procesar el resultado más reciente y asociar el feedback correspondiente
        const result = results[0]; // Solo el avance más reciente
        const archivo = result.archivo
            ? (() => {
                const archivo = result.archivo.toString();
                const prefix = 'data:application/pdf;base64,';

                // 1. Si ya tiene el prefijo, devolver tal cual
                if (archivo.startsWith(prefix)) {
                    return archivo;
                }

                // 2. Si parece una cadena Base64 válida, agregar el prefijo
                if (/^[A-Za-z0-9+/=]+$/.test(archivo) && archivo.length > 100) {
                    return prefix + archivo;
                }

                // 3. De lo contrario, tratar como Buffer y convertir a Base64
                const base64String = Buffer.from(result.archivo).toString('base64');
                return prefix + base64String;
            })()
            : null;

        const feedback = feedbackMap.get(result.id_avance) || null;
        result.aprobado = result.aprobado > 5 ? true : false;
        const processedResult = {
            ...result,
            archivo,
            feedback
        };

        await commitTransaction(connection);
        res.status(200).json(processedResult);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        console.error('Error fetching latest topic preview:', error.message);
        res.status(500).send('Error fetching latest topic preview');
    }
}

module.exports = {
    addPreview,
    getTopicPreviews,
    getLatetsTopicPreview
};