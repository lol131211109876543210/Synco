const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Crea la base de datos y las tablas si no existen, y carga los datos de
 * ejemplo la primera vez. Así el proyecto funciona sin pasos manuales de SQL.
 * Reintenta mientras MySQL termina de arrancar (Docker / Codespaces).
 */
module.exports = async function initDb() {
    const dbName = process.env.DB_NAME || 'synco_db';
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    };

    const leerSql = (archivo) =>
        fs.readFileSync(path.join(__dirname, '..', 'database', archivo), 'utf8')
            .replace(/synco_db/g, dbName);

    let conn;
    const intentos = 30;
    for (let i = 1; i <= intentos; i++) {
        try {
            conn = await mysql.createConnection(config);
            break;
        } catch (err) {
            if (i === intentos) throw err;
            console.log(`⏳ Esperando a MySQL (${i}/${intentos}): ${err.code || err.message}`);
            await esperar(2000);
        }
    }

    try {
        await conn.query(leerSql('schema.sql'));
        await conn.query(`USE \`${dbName}\``);

        const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM roles');
        if (total === 0) {
            await conn.query(leerSql('seeds.sql'));
            console.log('🌱 Datos de ejemplo cargados (admin@synco.co / 12345678)');
        }
        console.log(`🗄️  Base de datos "${dbName}" lista`);
    } finally {
        await conn.end();
    }
};
