const getDBConnection = require('./dbConection');

async function runQuery(query) {
    return new Promise((resolve, reject) => {
        const connection = getDBConnection();
        connection.connect((err) => {
            if (err) {
                console.error('Error conectando a la base de datos:', err);
                reject(err);
                return;
            }
        });
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error ejecutando la query: ', error);
                reject(error);
            } else {
                resolve(results);
            }
            connection.end();
        });
    });
}

async function runParametrizedQuery(query, params) {
    return new Promise((resolve, reject) => {
        const connection = getDBConnection();
        connection.connect((err) => {
            if (err) {
                console.error('Error conectando a la base de datos:', err);
                reject(err);
                return;
            }
            console.log('Conexión a la base de datos exitosa');
        });
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error ejecutando la query: ', error);
                reject(error);
            } else {
                resolve(results);
            }
            connection.end();
        });
    });
}

module.exports = {
    runQuery,
    runParametrizedQuery
};