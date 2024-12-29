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
        connection.commit((err) => {
            if (err) {
                return rollbackTransaction(connection).then(() => reject(err));
            }
            connection.release();
            resolve();
        });
    });
}

function rollbackTransaction(connection) {
    return new Promise((resolve) => {
        connection.rollback(() => {
            connection.release();
            resolve();
        });
    });
}

module.exports = {
    runQuery,
    runParametrizedQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};