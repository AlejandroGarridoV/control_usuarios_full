const API_BASE_URL = 'http://100.29.29.83:5000/api';

// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('userName').textContent = `${user.nombre} ${user.paterno}`;
    
    // Cargar datos del dashboard
    loadDashboardData();
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`);
        const usuarios = await response.json();
        
        // Actualizar estadísticas
        document.getElementById('totalUsers').textContent = usuarios.length;
        document.getElementById('adminUsers').textContent = usuarios.filter(u => u.tipo_usuario_nombre === 'Administrador').length;
        document.getElementById('supervisorUsers').textContent = usuarios.filter(u => u.tipo_usuario_nombre === 'Supervisor').length;
        document.getElementById('operadorUsers').textContent = usuarios.filter(u => u.tipo_usuario_nombre === 'Operador').length;
        
        // Actualizar tabla
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre} ${usuario.paterno} ${usuario.materno}</td>
                <td>${usuario.usuario}</td>
                <td><span class="badge badge-${usuario.tipo_usuario_nombre.toLowerCase()}">${usuario.tipo_usuario_nombre}</span></td>
            `;
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}