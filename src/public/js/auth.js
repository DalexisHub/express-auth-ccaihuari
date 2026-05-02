function saveToken(token) {
    sessionStorage.setItem('token', token);
}

function getToken() {
    return sessionStorage.getItem('token');
}

function clearToken() {
    sessionStorage.removeItem('token');
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        return null;
    }
}

function isTokenExpired(token) {
    const payload = decodeToken(token);

    if (!payload || !payload.exp) {
        return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

function getUserRoles() {
    const token = getToken();

    if (!token) {
        return [];
    }

    const payload = decodeToken(token);
    return payload?.roles || [];
}

function logout() {
    clearToken();
    window.location.href = '/signIn';
}

function guardAuth(requiredRoles = []) {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
        clearToken();
        window.location.href = '/signIn';
        return false;
    }

    if (requiredRoles.length > 0) {
        const roles = getUserRoles();

        const hasRole = roles.some(role => requiredRoles.includes(role));

        if (!hasRole) {
            window.location.href = '/403';
            return false;
        }
    }

    return true;
}

async function apiFetch(url, options = {}) {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
        clearToken();
        window.location.href = '/signIn';
        return;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    if (response.status === 401) {
        clearToken();
        window.location.href = '/signIn';
        return;
    }

    if (response.status === 403) {
        window.location.href = '/403';
        return;
    }

    return response;
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('[data-logout]');

    logoutButtons.forEach(button => {
        button.addEventListener('click', logout);
    });
});