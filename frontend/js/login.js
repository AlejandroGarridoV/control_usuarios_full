const API_BASE_URL = 'http://100.29.29.83:5000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar información del usuario en sessionStorage
            sessionStorage.setItem('user', JSON.stringify(data.user));
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showAlert('Error de conexión. Intente nuevamente.', 'error');
    }
});

function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}