/**
 * Interface for User Profile data from UsuarioSerializer
 */
interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string;
    foto_de_perfil?: string;
}

/**
 * Interface for Token Authentication response
 */
interface AuthResponse {
    id?: number;
    user_id?: number;
    username: string;
    token?: string;
    [key: string]: any; // Allow other fields
}

/**
 * Load and display user profile
 * 
 * @return Promise<void>
 */
async function loadUserProfile(): Promise<void> {
    const content = document.getElementById('perfil-content');
    if (!content) return;

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // First, validate the token and get user info
        const authResponse = await fetch(backendAddress + 'accounts/token-auth/', {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!authResponse.ok) {
            if (authResponse.status === 401) {
                // Token invalid, clear and redirect
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erro ao validar autenticação');
        }

        const userData: AuthResponse = await authResponse.json();
        console.log('User data from token-auth:', userData);

        // Try to get user ID from different possible fields
        const userId = userData.id || userData.user_id;

        if (!userId) {
            console.error('No user ID found in response:', userData);
            throw new Error('ID do usuário não encontrado na resposta');
        }

        console.log('Fetching profile for user ID:', userId);

        // Now fetch the full profile using the PerfilView endpoint
        // GET /accounts/perfil/{id}/ with Token authentication
        const profileResponse = await fetch(backendAddress + `usuarios/perfil/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!profileResponse.ok) {
            const errorText = await profileResponse.text();
            console.error('Profile fetch failed:', profileResponse.status, errorText);

            if (profileResponse.status === 404) {
                throw new Error('Usuário não encontrado');
            }
            throw new Error(`Erro ao carregar perfil (${profileResponse.status})`);
        }

        const profile: UserProfile = await profileResponse.json();
        console.log('Profile loaded:', profile);
        displayProfile(profile);

    } catch (error) {
        console.error('Erro:', error);
        content.innerHTML = `
            <div class="error">
                Erro ao carregar perfil. Por favor, tente novamente mais tarde.
                <br><small>${error instanceof Error ? error.message : 'Erro desconhecido'}</small>
            </div>
        `;
    }
}

/**
 * Display profile information on the page
 * 
 * @param profile - UserProfile object
 */
function displayProfile(profile: UserProfile): void {
    const content = document.getElementById('perfil-content');
    if (!content) return;

    // Handle profile picture URL
    let profilePictureUrl = 'https://via.placeholder.com/150?text=Sem+Foto';
    if (profile.foto_de_perfil) {
        if (profile.foto_de_perfil.startsWith('http://') || profile.foto_de_perfil.startsWith('https://')) {
            profilePictureUrl = profile.foto_de_perfil;
        } else {
            const cleanBackend = backendAddress.replace(/\/$/, '');
            const cleanPath = profile.foto_de_perfil.startsWith('/') ? profile.foto_de_perfil : '/' + profile.foto_de_perfil;
            profilePictureUrl = cleanBackend + cleanPath;
        }
    }

    content.innerHTML = `
        <div class="perfil-header">
            <div class="perfil-picture-container">
                <img src="${profilePictureUrl}"
                     alt="Foto de perfil de ${profile.username}"
                     class="perfil-picture"
                     onerror="this.src='https://via.placeholder.com/150?text=Sem+Foto'">
            </div>
        </div>
        <div class="perfil-info">
            <div class="perfil-field">
                <label>Nome de Usuário</label>
                <div class="value">${profile.username || '-'}</div>
            </div>
            <div class="perfil-field">
                <label>Nome</label>
                <div class="value">${profile.first_name || '-'}</div>
            </div>
            <div class="perfil-field">
                <label>Sobrenome</label>
                <div class="value">${profile.last_name || '-'}</div>
            </div>
            <div class="perfil-field">
                <label>Email</label>
                <div class="value">${profile.email || '-'}</div>
            </div>
            <div class="perfil-field">
                <label>Data de Cadastro</label>
                <div class="value">${profile.date_joined ? new Date(profile.date_joined).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
        </div>
    `;
}

/**
 * Initialize profile page
 */
function initializeProfilePage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        // Not authenticated, redirect to login
        window.location.href = 'login.html';
    } else {
        loadUserProfile();
    }
}

// Run on page load
window.addEventListener('load', initializeProfilePage);
