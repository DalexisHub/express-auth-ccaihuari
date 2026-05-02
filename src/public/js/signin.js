document.getElementById('signInForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = document.getElementById('message');

    const data = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent = result.message || 'Error al iniciar sesión';
            return;
        }

        saveToken(result.token);

        const roles = result.roles || [];

        if (roles.includes('admin')) {
            window.location.href = '/dashboard/admin';
        } else {
            window.location.href = '/dashboard/user';
        }

    } catch (error) {
        message.textContent = 'Error de conexión con el servidor';
    }
});