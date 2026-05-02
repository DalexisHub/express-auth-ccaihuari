document.getElementById('signUpForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = document.getElementById('message');

    const data = {
        name: document.getElementById('name').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        birthdate: document.getElementById('birthdate').value,
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        roles: ['user']
    };

    try {
        const response = await fetch('/api/auth/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent = result.message || 'Error al registrar usuario';
            return;
        }

        message.className = 'success-text';
        message.textContent = 'Usuario registrado correctamente. Redirigiendo...';
        window.location.href = '/signIn';

    } catch (error) {
        message.textContent = 'Error de conexión con el servidor';
    }
});
