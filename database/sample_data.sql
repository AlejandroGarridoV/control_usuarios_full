USE CONTROL_ACCESO;

-- Insertar usuarios de ejemplo
INSERT INTO usuario (nombre, paterno, materno, usuario, contrasena, foto_perfil, tipo_usuario_id) VALUES
('Juan', 'Pérez', 'Gómez', 'jperez', 'password123', 'avatar1.png', 1), -- Administrador
('María', 'López', 'Hernández', 'mlopez', 'password123', 'avatar2.png', 2),
('Carlos', 'García', 'Martínez', 'cgarcia', 'password123', 'avatar3.png', 3),
('Ana', 'Rodríguez', 'Sánchez', 'arodriguez', 'password123', 'avatar4.png', 3),
('Pedro', 'Fernández', 'Díaz', 'pfernandez', 'password123', 'avatar5.png', 3),
('Laura', 'Martínez', 'Romero', 'lmartinez', 'password123', 'avatar6.png', 2),
('Miguel', 'Sánchez', 'Alvarez', 'msanchez', 'password123', 'avatar7.png', 3),
('Sofia', 'Ramírez', 'Castro', 'sramirez', 'password123', 'avatar8.png', 3),
('Diego', 'Torres', 'Mendoza', 'dtorres', 'password123', 'avatar9.png', 3),
('Elena', 'Flores', 'Ortega', 'eflores', 'password123', 'avatar10.png', 3),
('Ricardo', 'Vargas', 'Silva', 'rvargas', 'password123', 'avatar11.png', 3),
('Carmen', 'Reyes', 'Guerrero', 'creyes', 'password123', 'avatar12.png', 3);