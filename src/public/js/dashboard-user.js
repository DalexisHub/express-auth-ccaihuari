function renderRoleBadges(roles = []) {
    return roles.map(role => `<span class="role-badge ${role}">${role}</span>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!guardAuth(['user', 'admin'])) return;

    const response = await apiFetch('/api/users/me');

    if (!response) return;

    const user = await response.json();

    document.getElementById('welcomeText').textContent =
        `Bienvenido ${user.name} ${user.lastName}. Tu sesión está activa y validada por JWT.`;

    document.getElementById('userData').innerHTML = `
        <li class="collection-item"><strong>Email</strong><span>${user.email}</span></li>
        <li class="collection-item"><strong>Teléfono</strong><span>${user.phoneNumber}</span></li>
        <li class="collection-item"><strong>Edad</strong><span>${user.age} años</span></li>
        <li class="collection-item"><strong>Dirección</strong><span>${user.adress || 'Sin registrar'}</span></li>
        <li class="collection-item"><strong>Roles</strong><span>${renderRoleBadges(user.roles)}</span></li>
    `;
});
