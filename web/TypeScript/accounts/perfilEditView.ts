/**
 * Interface for User Update data
 */
interface UserUpdateData {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
}

/**
 * Interface for User Profile data
 */
interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string;
}

/**
 * Load current user data into the form
 */
async function loadCurrentUserData(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Get user ID from token-auth
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

        // Store userId for later use
        (window as any).currentUserId = userId;

        // Fetch full profile
        const profileResponse = await fetch(backendAddress + `usuarios/perfil/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!profileResponse.ok) {
            throw new Error('Erro ao carregar perfil');
        }

        const profile: UserProfile = await profileResponse.json();

        // Populate form fields
        (document.getElementById('edit-username') as HTMLInputElement).value = profile.username || '';
        (document.getElementById('edit-first-name') as HTMLInputElement).value = profile.first_name || '';
        (document.getElementById('edit-last-name') as HTMLInputElement).value = profile.last_name || '';
        (document.getElementById('edit-email') as HTMLInputElement).value = profile.email || '';

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao carregar dados do usuário'}</div>`;
            messageDiv.style.display = 'block';
        }
    }
}

/**
 * Update user profile
 */
async function updateUserProfile(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('btnSubmit') as HTMLButtonElement;
    const cancelBtn = document.getElementById('btnCancel') as HTMLButtonElement;

    if (!messageDiv || !submitBtn || !cancelBtn) return;

    // Get form values
    const username = (document.getElementById('edit-username') as HTMLInputElement).value.trim();
    const firstName = (document.getElementById('edit-first-name') as HTMLInputElement).value.trim();
    const lastName = (document.getElementById('edit-last-name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('edit-email') as HTMLInputElement).value.trim();

    // Validate required fields
    if (!username || !email) {
        messageDiv.innerHTML = '<div class="error">Nome de usuário e email são obrigatórios</div>';
        messageDiv.style.display = 'block';
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageDiv.innerHTML = '<div class="error">Email inválido</div>';
        messageDiv.style.display = 'block';
        return;
    }

    // Disable buttons during request
    submitBtn.disabled = true;
    cancelBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
        const userId = (window as any).currentUserId;

        if (!userId) {
            throw new Error('ID do usuário não encontrado');
        }

        const updateData: UserUpdateData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email
        };

        const response = await fetch(backendAddress + `usuarios/perfil/atualizar/${userId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': tokenKeyword + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            if (response.status === 400) {
                const errorData = await response.json();
                let errorMessages = '';
                for (const field in errorData) {
                    if (errorData.hasOwnProperty(field)) {
                        const errors = errorData[field];
                        const errorText = Array.isArray(errors) ? errors.join(', ') : errors;
                        errorMessages += `${field}: ${errorText}<br>`;
                    }
                }
                throw new Error(errorMessages || 'Erro de validação');
            }

            throw new Error('Erro ao atualizar perfil');
        }

        // Success
        messageDiv.innerHTML = '<div class="success">Perfil atualizado com sucesso! Redirecionando...</div>';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'perfil.html';
        }, 1500);

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao atualizar perfil. Tente novamente.'}</div>`;
        messageDiv.style.display = 'block';

        // Re-enable buttons
        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        submitBtn.textContent = 'Salvar Alterações';
    }
}

/**
 * Cancel edit and go back to profile
 */
function cancelProfileEdit(): void {
    window.location.href = 'perfil.html';
}

/**
 * Initialize edit profile page
 */
function initializeEditProfilePage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load current user data
    loadCurrentUserData();

    // Set up event listeners
    const submitBtn = document.getElementById('btnSubmit');
    const cancelBtn = document.getElementById('btnCancel');

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateUserProfile();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelProfileEdit();
        });
    }
}

// Run on page load
window.addEventListener('load', initializeEditProfilePage);
