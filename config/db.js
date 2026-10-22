const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear grupo de conexiones (Pool) a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'synco_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL (synco_db)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    });

module.exports = pool;