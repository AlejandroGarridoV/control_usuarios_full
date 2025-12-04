const API_BASE_URL = 'http://100.29.29.83:5000/api';

let tiposUsuario = [];
let usuarios = [];

// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('userName').textContent = `${user.nombre} ${user.paterno}`;
    
    // Cargar datos
    loadTiposUsuario();
    loadUsuarios();
    
    // Configurar eventos
    setupEventListeners();
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Configurar event listeners
function setupEventListeners() {
    // Modal
    document.getElementById('addUserBtn').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', () => closeModal());
    document.getElementById('cancelBtn').addEventListener('click', () => closeModal());
    
    // Formulario
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
}

// Cargar tipos de usuario
async function loadTiposUsuario() {
    try {
        const response = await fetch(`${API_BASE_URL}/tipos-usuario`);
        tiposUsuario = await response.json();
        
        const select = document.getElementById('tipoUsuario');
        select.innerHTML = '<option value="">Seleccionar tipo</option>';
        
        tiposUsuario.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tipos de usuario:', error);
        showAlert('Error al cargar tipos de usuario', 'error');
    }
}

// Cargar usuarios
async function loadUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`);
        usuarios = await response.json();
        
        renderUsuariosTable();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        showAlert('Error al cargar usuarios', 'error');
    }
}

// Renderizar tabla de usuarios
function renderUsuariosTable() {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>
                <img src="${usuario.foto_perfil || 'assets/defautl-avatar.png'}" alt="Foto de perfil" class="avatar" onerror="this.src='assets/defautl-avatar.png'">
            </td>
            <td>${usuario.nombre} ${usuario.paterno} ${usuario.materno}</td>
            <td>${usuario.usuario}</td>
            <td><span class="badge badge-${usuario.tipo_usuario_nombre.toLowerCase()}">${usuario.tipo_usuario_nombre}</span></td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" data-id="${usuario.id}">✏️</button>
                    <button class="action-btn delete-btn" data-id="${usuario.id}">🗑️</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.closest('button').dataset.id;
            editUsuario(userId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.closest('button').dataset.id;
            deleteUsuario(userId);
        });
    });
}

// Abrir modal
function openModal(usuario = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    
    if (usuario) {
        title.textContent = 'Editar Usuario';
        document.getElementById('userId').value = usuario.id;
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('paterno').value = usuario.paterno;
        document.getElementById('materno').value = usuario.materno;
        document.getElementById('usuario').value = usuario.usuario;
        document.getElementById('contrasena').value = usuario.contrasena;
        document.getElementById('tipoUsuario').value = usuario.tipo_usuario_id;
        document.getElementById('fotoPerfil').value = usuario.foto_perfil || '';
    } else {
        title.textContent = 'Agregar Usuario';
        form.reset();
        document.getElementById('userId').value = '';
    }
    
    modal.style.display = 'flex';
}

// Cerrar modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const formData = {
        nombre: document.getElementById('nombre').value,
        paterno: document.getElementById('paterno').value,
        materno: document.getElementById('materno').value,
        usuario: document.getElementById('usuario').value,
        contrasena: document.getElementById('contrasena').value,
        tipo_usuario_id: parseInt(document.getElementById('tipoUsuario').value),
        foto_perfil: document.getElementById('fotoPerfil').value
    };
    
    try {
        let response;
        
        if (userId) {
            // Actualizar usuario existente
            response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Crear nuevo usuario
            response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Usuario ${userId ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeModal();
            loadUsuarios();
        } else {
            showAlert(result.error || 'Error al guardar usuario', 'error');
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        showAlert('Error de conexión. Intente nuevamente.', 'error');
    }
}

// Editar usuario
function editUsuario(userId) {
    const usuario = usuarios.find(u => u.id == userId);
    
    if (usuario) {
        openModal(usuario);
    }
}

// Eliminar usuario
async function deleteUsuario(userId) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Usuario eliminado correctamente', 'success');
            loadUsuarios();
        } else {
            showAlert(result.error || 'Error al eliminar usuario', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        showAlert('Error de conexión. Intente nuevamente.', 'error');
    }
}

// Mostrar alerta
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}