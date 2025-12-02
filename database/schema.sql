-- Crear base de datos
DROP DATABASE IF EXISTS CONTROL_ACCESO;
CREATE DATABASE IF NOT EXISTS CONTROL_ACCESO;
USE CONTROL_ACCESO;

-- Tabla tipo_usuario
CREATE TABLE IF NOT EXISTS tipo_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar tipos de usuario
INSERT INTO tipo_usuario (nombre) VALUES 
('Administrador'),
('Supervisor'),
('Operador');

-- Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    paterno VARCHAR(100) NOT NULL,
    materno VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    tipo_usuario_id INT NOT NULL,
    FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(id)
);