const pool = require('../../config/db');

// 1. Obtener listado de todas las vacantes
exports.obtenerVacantes = async (req, res) => {
    try {
        const [vacantes] = await pool.query('SELECT * FROM vacantes ORDER BY fecha_creacion DESC');
        res.json(vacantes);
    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        res.status(500).json({ error: 'Error al obtener las vacantes' });
    }
};

// 2. Crear una nueva vacante o convocatoria
exports.crearVacante = async (req, res) => {
    try {
        const { titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales } = req.body;

        // Validar campos obligatorios corporativos
        if (!titulo || !departamento || !ciudad || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'Faltan campos obligatorios para crear la vacante' });
        }

        // Insertar la nueva vacante con estado 'activa' por defecto
        const [resultado] = await pool.query(`
            INSERT INTO vacantes (titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'activa')
        `, [titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales || 1]);

        // Registrar la creación en la auditoría del sistema
        await pool.query(`
            INSERT INTO auditoria_sistema (usuario_nombre, accion)
            VALUES (?, ?)
        `, ['Administrador', `Creó vacante ${titulo}`]);

        res.status(201).json({ 
            mensaje: 'Vacante creada exitosamente', 
            id: resultado.insertId 
        });

    } catch (error) {
        console.error('Error al crear vacante:', error);
        res.status(500).json({ error: 'Error al crear la vacante' });
    }
};

// 3. Actualizar una vacante existente
exports.actualizarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales, estado } = req.body;

        if (!titulo || !departamento || !ciudad || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'Faltan campos obligatorios para actualizar la vacante' });
        }

        const [resultado] = await pool.query(`
            UPDATE vacantes
            SET titulo = ?, departamento = ?, ciudad = ?, fecha_inicio = ?, fecha_fin = ?,
                cupos_totales = ?, estado = COALESCE(?, estado)
            WHERE id = ?
        `, [titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales || 1, estado || null, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        await pool.query(
            'INSERT INTO auditoria_sistema (usuario_nombre, accion) VALUES (?, ?)',
            ['Administrador', `Actualizó vacante ${titulo}`]
        );

        res.json({ mensaje: 'Vacante actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar vacante:', error);
        res.status(500).json({ error: 'Error al actualizar la vacante' });
    }
};

// 4. Eliminar una vacante
exports.eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query('DELETE FROM vacantes WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        await pool.query(
            'INSERT INTO auditoria_sistema (usuario_nombre, accion) VALUES (?, ?)',
            ['Administrador', `Eliminó vacante #${id}`]
        );

        res.json({ mensaje: 'Vacante eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar vacante:', error);
        res.status(500).json({ error: 'No se pudo eliminar la vacante (puede tener aspirantes asociados)' });
    }
};
