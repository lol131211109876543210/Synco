const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/vacantes/
// Endpoint para obtener el listado de todas las vacantes registradas
router.get('/', vacantesController.obtenerVacantes);

// POST /api/vacantes/
// Endpoint protegido para registrar y publicar una nueva vacante en el sistema
router.post('/', authMiddleware, vacantesController.crearVacante);

// PUT /api/vacantes/:id
// Endpoint protegido para actualizar los detalles de una vacante existente
router.put('/:id', authMiddleware, vacantesController.actualizarVacante);

// DELETE /api/vacantes/:id
// Endpoint protegido para eliminar una vacante existente
router.delete('/:id', authMiddleware, vacantesController.eliminarVacante);

module.exports = router;