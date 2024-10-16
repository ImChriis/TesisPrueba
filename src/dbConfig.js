const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'A1s2d3f4g5*',
    server: 'CHRIS',
    database: 'prueba1',
    options: {
        encrypt: false, // for azure
        enableArithAbort: true // for local networks
    }
}

const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
    console.log('Conexión a SQL Server exitosa');
    return pool;
}).catch(err => console.log('Error en la conexión a SQL Server', err));

module.exports = {
    sql, poolPromise
};