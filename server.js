const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos: /css, /js y también /pages/xxx.html
app.use(express.static(path.join(__dirname, 'public')));

// Las páginas HTML también se sirven desde la raíz: /admin.html, /login.html, etc.
app.use(express.static(path.join(__dirname, 'public', 'pages')));

// Archivos subidos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function iniciar() {
    // 1. Abrir el servidor de inmediato (las páginas ya se pueden ver)
    app.listen(PORT, () => {
        console.log(`🚀 Servidor SynCO corriendo en: http://localhost:${PORT}`);
    });

    // 2. Crear la base de datos y cargar datos de ejemplo si es la primera vez
    try {
        await initDb();
    } catch (err) {
        console.error('❌ No se pudo preparar la base de datos:', err.message);
        console.error('   Revisa que MySQL esté encendido y los datos DB_* de tu .env (ver .env.example).');
        console.error('   Las páginas se ven, pero el login y la API no funcionarán hasta que MySQL responda.');
        return;
    }

    // 3. Rutas de la API (se cargan después para que la BD ya exista)
    app.use('/api/auth', require('./src/routes/auth.routes'));
    app.use('/api/admin', require('./src/routes/admin.routes'));
    app.use('/api/vacantes', require('./src/routes/vacantes.routes'));
    app.use('/api/expedientes', require('./src/routes/expedientes.routes'));
    app.use('/api/aspirantes', require('./src/routes/aspirantes.routes'));
}

// Rutas de páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// Portal del aspirante con token único: /portal/TOKEN
app.get('/portal/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'portal.html'));
});

iniciar();
