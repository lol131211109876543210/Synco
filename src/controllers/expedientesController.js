const pool = require('../../config/db');

// 1. Obtener todos los aspirantes con los datos de su respectiva vacante
exports.obtenerAspirantes = async (req, res) => {
    try {
        const [aspirantes] = await pool.query(`
            SELECT a.*, v.titulo as vacante_titulo 
            FROM aspirantes a
            JOIN vacantes v ON a.vacante_id = v.id
            ORDER BY a.fecha_registro DESC
        `);
        res.json(aspirantes);
    } catch (error) {
        console.error('Error al obtener aspirantes:', error);
        res.status(500).json({ error: 'Error al obtener la lista de expedientes' });
    }
};

// 2. Aprobar expediente y convertir automáticamente al aspirante en Empleado activo
exports.aprobarExpediente = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        // Iniciamos una transacción SQL para garantizar atomicidad (todo o nada)
        await connection.beginTransaction();
        const { id } = req.params; // ID del aspirante

        // Paso A: Actualizar estado del aspirante a 'aprobado'
        await connection.query(
            'UPDATE aspirantes SET estado_proceso = "aprobado" WHERE id = ?', 
            [id]
        );

        // Paso B: Obtener los datos completos del aspirante y su vacante para pasarlos a empleados
        const [aspRows] = await connection.query(`
            SELECT a.*, v.titulo as cargo, v.departamento, v.ciudad 
            FROM aspirantes a
            JOIN vacantes v ON a.vacante_id = v.id
            WHERE a.id = ?
        `, [id]);

        if (aspRows.length === 0) {
            throw new Error('Aspirante no encontrado');
        }

        const asp = aspRows[0];

        // Paso C: Registrar automáticamente al nuevo empleado en la tabla correspondiente
        await connection.query(`
            INSERT INTO empleados (aspirante_id, nombre_completo, cargo, departamento, ciudad, numero_documento, correo, estado_laboral, fecha_vinculacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'activo', CURDATE())
        `, [asp.id, asp.nombre_completo, asp.cargo, asp.departamento, asp.ciudad, asp.numero_documento, asp.correo]);

        // Paso D: Registrar la acción en la tabla de auditoría del sistema
        await connection.query(`
            INSERT INTO auditoria_sistema (usuario_nombre, accion)
            VALUES (?, ?)
        `, ['Ana Pérez', `Aprobó expediente de ${asp.nombre_completo}`]);

        // Confirmar transacción exitosa
        await connection.commit();
        connection.release();

        res.json({ mensaje: 'Expediente aprobado y empleado registrado exitosamente' });

    } catch (error) {
        // Si ocurre cualquier error, revertimos todos los cambios de la base de datos
        await connection.rollback();
        connection.release();
        console.error('Error al aprobar expediente:', error);
        res.status(500).json({ error: 'Error al procesar la aprobación del expediente' });
    }
};

// 3. Rechazar expediente exigiendo el motivo obligatorio
exports.rechazarExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        // Validar que el motivo de rechazo no esté vacío (coincidiendo con la interfaz del mockup)
        if (!motivo) {
            return res.status(400).json({ error: 'El motivo de rechazo es obligatorio' });
        }

        await pool.query(
            'UPDATE aspirantes SET estado_proceso = "rechazado" WHERE id = ?', 
            [id]
        );

        // Registrar la acción de rechazo en la auditoría
        await pool.query(`
            INSERT INTO auditoria_sistema (usuario_nombre, accion)
            VALUES (?, ?)
        `, ['Ana Pérez', `Rechazó expediente ID ${id}: ${motivo}`]);

        res.json({ mensaje: 'Expediente rechazado correctamente' });

    } catch (error) {
        console.error('Error al rechazar expediente:', error);
        res.status(500).json({ error: 'Error al rechazar el expediente' });
    }
};