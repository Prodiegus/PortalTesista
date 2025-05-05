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
    if (connection && !connection._pool._closed) {
        try {
            connection.release();
        } catch (error) {
            console.error('Error liberando la conexión: ', error.message);
        }
    }
}


module.exports = {
    runQuery,
    runParametrizedQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};