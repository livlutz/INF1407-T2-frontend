/**
 * Delete user account
 * Calls DELETE endpoint that deletes the authenticated user
 */
async function deleteUserAccount(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const messageDiv = document.getElementById('message');
    const deleteBtn = document.getElementById('btnDelete') as HTMLButtonElement;
    const cancelBtn = document.getElementById('btnCancel') as HTMLButtonElement;

    if (!messageDiv || !deleteBtn || !cancelBtn) return;

    // Disable buttons during request
    deleteBtn.disabled = true;
    cancelBtn.disabled = true;
    deleteBtn.textContent = 'Excluindo...';

    try {
        // First, get the user ID from token-auth
        const authResponse = await fetch(backendAddress + 'accounts/token-auth/', {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!authResponse.ok) {
            if (authResponse.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erro ao validar autenticação');
        }

        const userData = await authResponse.json();
        const userId = userData.id || userData.user_id;

        if (!userId) {
            throw new Error('ID do usuário não encontrado');
        }

        // Now delete the user
        const response = await fetch(backendAddress + `usuarios/perfil/deletar/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Not authenticated, redirect to login
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erro ao excluir conta');
        }

        // Success - account deleted (204 No Content)
        messageDiv.innerHTML = '<div class="success">Conta excluída com sucesso! Redirecionando...</div>';
        messageDiv.style.display = 'block';

        // Clear token and redirect
        localStorage.removeItem('token');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao excluir conta. Tente novamente.'}</div>`;
        messageDiv.style.display = 'block';

        // Re-enable buttons
        deleteBtn.disabled = false;
        cancelBtn.disabled = false;
        deleteBtn.textContent = 'Sim, Excluir Minha Conta';
    }
}

/**
 * Cancel deletion and go back
 */
function cancelDeletion(): void {
    window.location.href = 'perfil.html';
}

/**
 * Initialize delete page
 */
function initializeDeletePage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        // Not authenticated, redirect to login
        window.location.href = 'login.html';
        return;
    }

    // Set up event listeners
    const deleteBtn = document.getElementById('btnDelete');
    const cancelBtn = document.getElementById('btnCancel');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteUserAccount();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelDeletion();
        });
    }
}

// Run on page load
window.addEventListener('load', initializeDeletePage);
