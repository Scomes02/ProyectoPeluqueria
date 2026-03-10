// js/login.js

// Mantener el modo oscuro en el login
if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
}

// Botón flotante para cambiar el tema desde el login (Opcional, pero sugerido para UX)
const toggleBtn = document.createElement('button');
toggleBtn.className = 'btn-tema-flotante';
toggleBtn.innerHTML = '🌙';
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const respuesta = await fetch('api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'login', username: user, password: pass })
        });
        
        const data = await respuesta.json();

        if (data.exito) {
            window.location.href = 'index.php'; 
        } else {
            errorDiv.textContent = data.mensaje;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Error de conexión con el servidor.';
        errorDiv.style.display = 'block';
    }
});