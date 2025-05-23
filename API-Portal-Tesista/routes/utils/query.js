const {pool} = require('./dbConection');

async function runQuery(query, connection = pool) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error ejecutando la query: ', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function runParametrizedQuery(query, params, connection = pool) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error ejecutando la query: ', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function beginTransaction() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return reject(err);
                }
                resolve(connection);
            });
        });
    });
}

function commitTransaction(connection) {
    return new Promise((resolve, reject) => {
        if (!connection || connection._pool._closed) {
            console.error('Error: La conexión ya ha sido liberada o cerrada.');
            return reject(new Error('La conexión ya ha sido liberada o cerrada.'));
        }
        connection.commit((err) => {
            if (err) {
                return rollbackTransaction(connection).then(() => reject(err));
            }
            safeRelease(connection);
            resolve();
        });
    });
}

function rollbackTransaction(connection) {
    return new Promise((resolve) => {
        if (!connection || connection._pool._closed) {
            console.error('Error: La conexión ya ha sido liberada o cerrada.');
            return resolve(); 
        }
        connection.rollback(() => {
            safeRelease(connection);
            resolve();
        });
    });
}

function safeRelease(connection) {
    // Verifica que la conexión exista, que tenga la propiedad _pool y que el pool no esté cerrado.
    if (connection && connection._pool && !connection._pool._closed) {
        try {
            connection.release();
        } catch (error) {
            // Loguea el error si connection.release() falla, aunque generalmente es seguro.
            console.error('Error durante connection.release() en safeRelease: ', error.message);
        }
    } else if (connection && !connection._pool) {
        // Esta condición puede indicar un problema con el objeto de conexión en sí,
        console.warn('safeRelease: connection._pool no está definido. La conexión podría estar en un estado inválido o no ser del pool.');
        // Intento de llamar a release() si el método existe, como un intento de limpieza.
        if (typeof connection.release === 'function') {
            try { connection.release(); } catch (e) { console.error('Error en intento de liberación forzada en safeRelease:', e.message); }
        }
    } else if (connection && connection._pool && connection._pool._closed) {
        // El pool está cerrado, la conexión probablemente ya es inutilizable/liberada.
        console.log('safeRelease: El pool de conexiones ya está cerrado.');
    } else {
        console.warn('safeRelease: No se proporcionó una conexión válida.');
    }
}   


module.exports = {
    runQuery,
    runParametrizedQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};