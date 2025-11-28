window.addEventListener('load', () => {
    // Check if we're in an iframe and use parent's localStorage
    const storage = window.parent !== window ? window.parent.localStorage : localStorage;
    // Verifica o username e coloca no cabeçalho da página
    const token = storage.getItem('token'); // Recupera o token de autenticação
    // Only run if we're in the header (cabecalho.html)
    const identificacaoElement = document.getElementById('identificacao');
    if (!identificacaoElement) {
        return; // Not in cabecalho.html, skip authentication check
    }
    // If no token exists, set as visitante immediately
    if (!token) {
        const loggedElement = document.getElementById('logged');
        const unloggedElement = document.getElementById('unlogged');
        if (identificacaoElement) {
            identificacaoElement.innerHTML = 'visitante';
        }
        if (loggedElement && unloggedElement) {
            unloggedElement.classList.remove('invisivel');
            unloggedElement.classList.add('visivel');
            loggedElement.classList.remove('visivel');
            loggedElement.classList.add('invisivel');
        }
        return;
    }
    fetch(backendAddress + 'accounts/token-auth/', {
        method: 'GET',
        headers: {
            'Authorization': tokenKeyword + token
        }
    }).then(response => {
        const loggedElement = document.getElementById('logged');
        const unloggedElement = document.getElementById('unlogged');
        if (!loggedElement || !unloggedElement) {
            return;
        }
        if (response.ok) {
            response.json().then(data => {
                const usuario = data;
                // token enviado no cabeçalho foi aceito pelo servidor
                loggedElement.classList.remove('invisivel');
                loggedElement.classList.add('visivel');
                unloggedElement.classList.remove('visivel');
                unloggedElement.classList.add('invisivel');
                if (identificacaoElement) {
                    identificacaoElement.innerHTML = usuario.username;
                }
            });
        }
        else {
            // Token invalid/expired - clear it and show as visitante
            storage.removeItem('token');
            if (identificacaoElement) {
                identificacaoElement.innerHTML = 'visitante';
            }
            unloggedElement.classList.remove('invisivel');
            unloggedElement.classList.add('visivel');
            loggedElement.classList.remove('visivel');
            loggedElement.classList.add('invisivel');
        }
    }).catch(erro => {
        // Network error - show as visitante
        if (identificacaoElement) {
            identificacaoElement.innerHTML = 'visitante';
        }
    });
});
/**
 * Updates the header to show logged-in user information
 */
export function updateHeaderAuthentication() {
    const username = localStorage.getItem('username');
    const tokenValue = localStorage.getItem('token');
    const identificacaoElement = document.getElementById('identificacao');
    const loggedElement = document.getElementById('logged');
    const unloggedElement = document.getElementById('unlogged');
    if (!identificacaoElement || !loggedElement || !unloggedElement) {
        return; // Elements don't exist on this page
    }
    if (username && tokenValue) {
        // User is logged in
        identificacaoElement.textContent = username;
        loggedElement.classList.remove('invisivel');
        loggedElement.classList.add('visivel');
        unloggedElement.classList.remove('visivel');
        unloggedElement.classList.add('invisivel');
    }
    else {
        // User is not logged in (visitante)
        identificacaoElement.textContent = 'visitante';
        loggedElement.classList.remove('visivel');
        loggedElement.classList.add('invisivel');
        unloggedElement.classList.remove('invisivel');
        unloggedElement.classList.add('visivel');
    }
}
/**
 * Check if user is authenticated
 *
 * @return boolean indicating authentication status
 */
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null;
}
/**
 * Get current logged-in username
 *
 * @return current username or null if not logged in
 */
export function getCurrentUsername() {
    return localStorage.getItem('username');
}
/**
 * Logout user by clearing authentication data
 */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
