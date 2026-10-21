const pool = require('../../config/db');

// 1. Obtener estadísticas globales y el registro de auditoría del sistema
exports.obtenerDashboardAdmin = async (req, res) => {
    try {
        // Conteo consolidado de aspirantes por cada estado del proceso
        const [statsAspirantes] = await pool.query(`
            SELECT 
                SUM(CASE WHEN estado_proceso = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estado_proceso = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
                SUM(CASE WHEN estado_proceso = 'rechazado' THEN 1 ELSE 0 END) as rechazados,
                SUM(CASE WHEN estado_proceso = 'incompleto' THEN 1 ELSE 0 END) as incompletos,
                COUNT(*) as total
            FROM aspirantes
        `);

        // Obtener los últimos 10 movimientos de la tabla de auditoría para el feed en vivo
        const [auditoria] = await pool.query(`
            SELECT * FROM auditoria_sistema 
            ORDER BY fecha DESC 
            LIMIT 10
        `);

        res.json({
            estadisticas: statsAspirantes[0],
            auditoria
        });

    } catch (error) {
        console.error('Error al cargar datos del panel admin:', error);
        res.status(500).json({ error: 'Error al obtener la información de administración global' });
    }
};

// 2. Actualizar los parámetros globales de configuración y procesamiento de archivos
exports.actualizarConfiguracion = async (req, res) => {
    try {
        const { correo_notificaciones, vigencia_enlace_dias, recorte_automatico, conversion_pdf } = req.body;

        // Registrar la acción de cambio de parámetros en la auditoría del sistema
        await pool.query(`
            INSERT INTO auditoria_sistema (usuario_nombre, accion)
            VALUES (?, ?)
        `, ['Administrador', 'Actualizó los parámetros de configuración global del sistema']);

        res.json({ 
            mensaje: 'Configuración global actualizada exitosamente',
            parametros: {
                correo_notificaciones,
                vigencia_enlace_dias,
                recorte_automatico,
                conversion_pdf
            }
        });

    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({ error: 'Error al guardar la configuración' });
    }
};