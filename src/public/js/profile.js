function formatDateForInput(dateValue) {
    if (!dateValue) return '';
    return new Date(dateValue).toISOString().split('T')[0];
}

function renderRoleBadges(roles = []) {
    return roles.map(role => `<span class="role-badge ${role}">${role}</span>`).join('');
}

async function loadProfile() {
    if (!guardAuth(['user', 'admin'])) return;

    const response = await apiFetch('/api/users/me');

    if (!response) return;

    const user = await response.json();

    document.getElementById('name').value = user.name || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('phoneNumber').value = user.phoneNumber || '';
    document.getElementById('birthdate').value = formatDateForInput(user.birthdate);
    document.getElementById('url_profile').value = user.url_profile || '';
    document.getElementById('adress').value = user.adress || '';

    document.getElementById('emailText').textContent = user.email;
    document.getElementById('ageText').textContent = `${user.age} años`;
    document.getElementById('rolesText').innerHTML = renderRoleBadges(user.roles);

    if (user.url_profile) {
        document.getElementById('profilePreview').src = user.url_profile;
    }

    M.updateTextFields();
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    document.getElementById('profileForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const message = document.getElementById('message');

        const data = {
            name: document.getElementById('name').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            birthdate: document.getElementById('birthdate').value,
            url_profile: document.getElementById('url_profile').value.trim(),
            adress: document.getElementById('adress').value.trim()
        };

        const response = await apiFetch('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {
            message.className = 'error-text';
            message.textContent = result.message || 'Error al actualizar perfil';
            return;
        }

        message.className = 'success-text';
        message.textContent = 'Perfil actualizado correctamente';

        loadProfile();
    });
});
