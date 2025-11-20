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
 * Change user password
 */
function changePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        const messageDiv = document.getElementById('message');
        const submitBtn = document.getElementById('btnSubmit');
        const cancelBtn = document.getElementById('btnCancel');
        if (!messageDiv || !submitBtn || !cancelBtn)
            return;
        // Get form values
        const oldPassword = document.getElementById('old-password').value;
        const newPassword1 = document.getElementById('new-password1').value;
        const newPassword2 = document.getElementById('new-password2').value;
        // Validate required fields
        if (!oldPassword || !newPassword1 || !newPassword2) {
            messageDiv.innerHTML = '<div class="error">Todos os campos são obrigatórios</div>';
            messageDiv.style.display = 'block';
            return;
        }
        // Validate password match
        if (newPassword1 !== newPassword2) {
            messageDiv.innerHTML = '<div class="error">As novas senhas não coincidem</div>';
            messageDiv.style.display = 'block';
            return;
        }
        // Validate password length
        if (newPassword1.length < 6) {
            messageDiv.innerHTML = '<div class="error">A nova senha deve ter pelo menos 6 caracteres</div>';
            messageDiv.style.display = 'block';
            return;
        }
        // Disable buttons during request
        submitBtn.disabled = true;
        cancelBtn.disabled = true;
        submitBtn.textContent = 'Alterando...';
        try {
            const response = yield fetch(backendAddress + 'accounts/token-auth/', {
                method: 'PUT',
                headers: {
                    'Authorization': tokenKeyword + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password1: newPassword1,
                    new_password2: newPassword2
                })
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
                if (response.status === 400) {
                    const errorData = yield response.json();
                    let errorMessages = '';
                    for (const field in errorData) {
                        if (errorData.hasOwnProperty(field)) {
                            const errors = errorData[field];
                            const errorText = Array.isArray(errors) ? errors.join(', ') : errors;
                            errorMessages += `${errorText}<br>`;
                        }
                    }
                    throw new Error(errorMessages || 'Erro de validação');
                }
                throw new Error('Erro ao alterar senha');
            }
            // Success - update token if returned
            const data = yield response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            messageDiv.innerHTML = '<div class="success">Senha alterada com sucesso! Redirecionando...</div>';
            messageDiv.style.display = 'block';
            // Clear form
            document.getElementById('passwordForm').reset();
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 2000);
        }
        catch (error) {
            console.error('Erro ao alterar senha:', error);
            messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao alterar senha. Tente novamente.'}</div>`;
            messageDiv.style.display = 'block';
            // Re-enable buttons
            submitBtn.disabled = false;
            cancelBtn.disabled = false;
            submitBtn.textContent = 'Alterar Senha';
        }
    });
}
/**
 * Cancel password change and go back
 */
function cancelPasswordChange() {
    window.location.href = 'perfil.html';
}
/**
 * Initialize change password page
 */
function initializePasswordChangePage() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Set up event listeners
    const submitBtn = document.getElementById('btnSubmit');
    const cancelBtn = document.getElementById('btnCancel');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            changePassword();
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelPasswordChange();
        });
    }
}
// Run on page load
window.addEventListener('load', initializePasswordChangePage);
