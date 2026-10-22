USE synco_db;

-- Insertar Roles
INSERT INTO roles (id, nombre) VALUES 
(1, 'Administrador'),
(2, 'Analista RRHH');

-- Insertar Usuario Administrador y Analista de prueba
-- Contraseña de ambos usuarios de prueba: 12345678 (hash bcrypt real)
INSERT INTO usuarios (nombre, correo, contrasena_hash, rol_id) VALUES 
('Ana Pérez', 'ana.perez@synco.co', '$2b$10$1KUj/er1tYLLgvXLKYonjeweUt3Fr1aEgYivkp03NQ9NDOJD9PkYa', 2),
('Administrador', 'admin@synco.co', '$2b$10$1KUj/er1tYLLgvXLKYonjeweUt3Fr1aEgYivkp03NQ9NDOJD9PkYa', 1);

-- Insertar Tipos de Documentos Requeridos
INSERT INTO tipos_documento (id, nombre, descripcion) VALUES 
(1, 'Cédula de Ciudadanía', 'Documento de identidad por ambas caras'),
(2, 'Hoja de Vida', 'Hoja de vida actualizada en formato PDF o Word'),
(3, 'Certificado de Estudios', 'Diploma de bachillerato, técnico, tecnólogo o universitario'),
(4, 'Certificado Laboral', 'Carta firmada por empleador anterior con cargo y fechas');

-- Insertar Vacantes de Ejemplo (de los mockups)
INSERT INTO vacantes (id, titulo, departamento, ciudad, fecha_inicio, fecha_fin, cupos_totales, cupos_ocupados, estado) VALUES 
(1, 'Conductor Pesado', 'Logística', 'Bogotá', '2026-08-01', '2026-08-31', 10, 4, 'activa'),
(2, 'Auxiliar Logístico', 'Operaciones', 'Medellín', '2026-07-15', '2026-08-15', 5, 5, 'cerrada'),
(3, 'Coord. de Eventos', 'Eventos', 'Bogotá', '2026-08-01', '2026-08-20', 3, 1, 'activa');

-- Insertar Aspirantes de Ejemplo (de los mockups)
INSERT INTO aspirantes (id, vacante_id, nombre_completo, numero_documento, correo, estado_proceso) VALUES 
(1, 1, 'Carlos Mendoza', '1.834.567.890', 'carlos.mendoza@email.com', 'pendiente'),
(2, 1, 'Laura Ríos', '52.768.432.1', 'laura.rios@email.com', 'incompleto'),
(3, 1, 'Tomás Herrera', '79.345.621.8', 'tomas.herrera@email.com', 'aprobado');