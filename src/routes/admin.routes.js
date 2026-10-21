const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas de administración están protegidas por JWT

// GET /api/admin/dashboard
// Carga métricas consolidadas (totales, pendientes, aprobados, etc.) y los últimos 10 registros de auditoría
router.get('/dashboard', authMiddleware, adminController.obtenerDashboardAdmin);

// PUT /api/admin/configuracion
// Actualiza parámetros globales (días de vigencia, correo de notificaciones, etc.)
router.put('/configuracion', authMiddleware, adminController.actualizarConfiguracion);

module.exports = router;