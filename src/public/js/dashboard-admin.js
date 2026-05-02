function formatDate(dateValue) {
    if (!dateValue) return 'Sin fecha';
    return new Date(dateValue).toLocaleDateString('es-PE');
}

function renderRoleBadges(roles = []) {
    return roles.map(role => `<span class="role-badge ${role}">${role}</span>`).join('');
}

function showUserModal(user) {
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <div class="info-grid">
            <div class="info-item"><span class="info-label">ID</span><span class="info-value">${user.id}</span></div>
            <div class="info-item"><span class="info-label">Nombre</span><span class="info-value">${user.name} ${user.lastName}</span></div>
            <div class="info-item"><span class="info-label">Email</span><span class="info-value">${user.email}</span></div>
            <div class="info-item"><span class="info-label">Teléfono</span><span class="info-value">${user.phoneNumber}</span></div>
            <div class="info-item"><span class="info-label">Edad</span><span class="info-value">${user.age} años</span></div>
            <div class="info-item"><span class="info-label">Nacimiento</span><span class="info-value">${formatDate(user.birthdate)}</span></div>
            <div class="info-item"><span class="info-label">Dirección</span><span class="info-value">${user.adress || 'Sin registrar'}</span></div>
            <div class="info-item"><span class="info-label">Perfil</span><span class="info-value">${user.url_profile || 'Sin registrar'}</span></div>
            <div class="info-item"><span class="info-label">Roles</span><span class="info-value">${renderRoleBadges(user.roles)}</span></div>
            <div class="info-item"><span class="info-label">Registro</span><span class="info-value">${formatDate(user.createdAt)}</span></div>
        </div>
    `;

    const modal = M.Modal.getInstance(document.getElementById('userModal'));
    modal.open();
}

document.addEventListener('DOMContentLoaded', async () => {
    M.Modal.init(document.querySelectorAll('.modal'));

    if (!guardAuth(['admin'])) return;

    const response = await apiFetch('/api/users');

    if (!response) return;

    const users = await response.json();
    const usersTable = document.getElementById('usersTable');
    const emptyState = document.getElementById('usersEmptyState');

    usersTable.innerHTML = '';
    emptyState.classList.toggle('hidden', users.length > 0);

    users.forEach(user => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.name} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.age}</td>
            <td>${renderRoleBadges(user.roles)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn-small teal darken-3">
                    View details
                </button>
            </td>
        `;

        tr.querySelector('button').addEventListener('click', () => showUserModal(user));
        usersTable.appendChild(tr);
    });
});
