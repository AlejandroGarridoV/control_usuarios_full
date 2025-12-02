from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from config import DB_CONFIG
import base64
import os

app = Flask(__name__)
CORS(app)  # Permitir CORS para todas las rutas

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# Ruta de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT u.*, t.nombre as tipo_usuario_nombre 
        FROM usuario u 
        JOIN tipo_usuario t ON u.tipo_usuario_id = t.id 
        WHERE u.usuario = %s AND u.contrasena = %s
    """, (usuario, contrasena))
    
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'nombre': user['nombre'],
                'paterno': user['paterno'],
                'usuario': user['usuario'],
                'tipo_usuario': user['tipo_usuario_nombre']
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Credenciales incorrectas'})

# Obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT u.*, t.nombre as tipo_usuario_nombre 
        FROM usuario u 
        JOIN tipo_usuario t ON u.tipo_usuario_id = t.id
        ORDER BY u.id
    """)
    
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(usuarios)

# Obtener un usuario por ID
@app.route('/api/usuarios/<int:usuario_id>', methods=['GET'])
def get_usuario(usuario_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT u.*, t.nombre as tipo_usuario_nombre 
        FROM usuario u 
        JOIN tipo_usuario t ON u.tipo_usuario_id = t.id 
        WHERE u.id = %s
    """, (usuario_id,))
    
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if usuario:
        return jsonify(usuario)
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

# Crear un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO usuario (nombre, paterno, materno, usuario, contrasena, foto_perfil, tipo_usuario_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (data['nombre'], data['paterno'], data['materno'], data['usuario'], 
              data['contrasena'], data.get('foto_perfil', ''), data['tipo_usuario_id']))
        
        conn.commit()
        nuevo_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'id': nuevo_id})
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

# Actualizar un usuario
@app.route('/api/usuarios/<int:usuario_id>', methods=['PUT'])
def actualizar_usuario(usuario_id):
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE usuario 
            SET nombre = %s, paterno = %s, materno = %s, usuario = %s, 
                contrasena = %s, foto_perfil = %s, tipo_usuario_id = %s
            WHERE id = %s
        """, (data['nombre'], data['paterno'], data['materno'], data['usuario'],
              data['contrasena'], data.get('foto_perfil', ''), data['tipo_usuario_id'], usuario_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

# Eliminar un usuario
@app.route('/api/usuarios/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM usuario WHERE id = %s", (usuario_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

# Obtener tipos de usuario
@app.route('/api/tipos-usuario', methods=['GET'])
def get_tipos_usuario():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM tipo_usuario")
    tipos = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(tipos)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)