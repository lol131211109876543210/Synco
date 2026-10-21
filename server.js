const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta public como sitio web estático
app.use(express.static(path.join(__dirname, 'public')));

// Servir la carpeta de archivos subidos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta principal -> Redirige al Login corporativo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor SynCO corriendo en: http://localhost:${PORT}`);
});