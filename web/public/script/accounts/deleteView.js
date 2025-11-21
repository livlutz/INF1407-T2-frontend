"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Delete user account
 * Calls DELETE endpoint that deletes the authenticated user
 */
function deleteUserAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        const messageDiv = document.getElementById('message');
        const deleteBtn = document.getElementById('btnDelete');
        const cancelBtn = document.getElementById('btnCancel');
        if (!messageDiv || !deleteBtn || !cancelBtn)
            return;
        // Disable buttons during request
        deleteBtn.disabled = true;
        cancelBtn.disabled = true;
        deleteBtn.textContent = 'Excluindo...';
        try {
            // First, get the user ID from token-auth
            const authResponse = yield fetch(backendAddress + 'accounts/token-auth/', {
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
            const userData = yield authResponse.json();
            const userId = userData.id || userData.user_id;
            if (!userId) {
                throw new Error('ID do usuário não encontrado');
            }
            // Now delete the user
            const response = yield fetch(backendAddress + `usuarios/perfil/deletar/${userId}/`, {
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
                if (response.status === 403) {
                    throw new Error('Você não tem permissão para excluir esta conta');
                }
                if (response.status === 404) {
                    throw new Error('Usuário não encontrado');
                }
                throw new Error('Erro ao excluir conta');
            }
            // Success - backend now returns 200 OK with message
            const data = yield response.json();
            messageDiv.innerHTML = '<div class="success">✅ Conta excluída com sucesso! Redirecionando...</div>';
            messageDiv.style.display = 'block';
            // Clear token and redirect
            localStorage.removeItem('token');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
        catch (error) {
            console.error('Erro ao excluir conta:', error);
            messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao excluir conta. Tente novamente.'}</div>`;
            messageDiv.style.display = 'block';
            // Re-enable buttons
            deleteBtn.disabled = false;
            cancelBtn.disabled = false;
            deleteBtn.textContent = 'Sim, Excluir Minha Conta';
        }
    });
}
/**
 * Cancel deletion and go back
 */
function cancelDeletion() {
    window.location.href = 'perfil.html';
}
/**
 * Initialize delete page
 */
function initializeDeletePage() {
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
