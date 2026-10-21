const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
// Endpoint público para procesar el inicio de sesión y emitir el token JWT
router.post('/login', authController.login);

module.exports = router;