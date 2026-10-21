-- Base de Datos para SynCO (Sincronización Corporativa)
CREATE DATABASE IF NOT EXISTS synco_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE synco_db;

-- 1. Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla de Usuarios (Panel RRHH y Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 3. Tabla de Vacantes / Convocatorias
CREATE TABLE IF NOT EXISTS vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    departamento VARCHAR(80) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    cupos_totales INT NOT NULL DEFAULT 1,
    cupos_ocupados INT DEFAULT 0,
    documentos_requeridos_count INT DEFAULT 4,
    estado ENUM('activa', 'cerrada', 'pausada') DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Aspirantes
CREATE TABLE IF NOT EXISTS aspirantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vacante_id INT NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    correo VARCHAR(120) NOT NULL,
    telefono VARCHAR(30),
    estado_proceso ENUM('pendiente', 'aprobado', 'rechazado', 'incompleto') DEFAULT 'incompleto',
    token_temporal VARCHAR(100) UNIQUE,
    token_expiracion DATETIME,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE CASCADE
);

-- 5. Tabla de Tipos de Documentos
CREATE TABLE IF NOT EXISTS tipos_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_obligatorio BOOLEAN DEFAULT TRUE
);

-- 6. Tabla de Documentos Subidos por Aspirante
CREATE TABLE IF NOT EXISTS documentos_aspirante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aspirante_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    estado_revision ENUM('subido', 'pendiente', 'verificado', 'rechazado') DEFAULT 'pendiente',
    motivo_rechazo TEXT,
    metodo_carga ENUM('pc', 'webcam') DEFAULT 'pc',
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aspirante_id) REFERENCES aspirantes(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documento(id) ON DELETE CASCADE
);

-- 7. Tabla de Empleados (Generados tras aprobar a un aspirante)
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aspirante_id INT UNIQUE,
    nombre_completo VARCHAR(120) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(80) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    numero_documento VARCHAR(30) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    estado_laboral ENUM('activo', 'inactivo', 'vacaciones') DEFAULT 'activo',
    fecha_vinculacion DATE NOT NULL,
    FOREIGN KEY (aspirante_id) REFERENCES aspirantes(id) ON DELETE SET NULL
);

-- 8. Tabla de Auditoría / Actividad Reciente
CREATE TABLE IF NOT EXISTS auditoria_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_nombre VARCHAR(100) NOT NULL,
    accion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);