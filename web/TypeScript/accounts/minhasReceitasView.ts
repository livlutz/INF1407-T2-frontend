/**
 * Load user's recipes
 * 
 * @returns Promise<void>
 */
async function loadUserRecipes(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const receitasContainer = document.getElementById('receitas-container');
    if (!receitasContainer) return;

    try {
        // First, get user ID from token-auth
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
            const text = await authResponse.text().catch(() => '');
            throw new Error(`Erro ao validar token (status ${authResponse.status}): ${text}`);
        }

        const authData = await authResponse.json();
        const userId = authData.id || authData.user_id;

        if (!userId) {
            throw new Error('ID do usuário não encontrado');
        }

        // Now fetch user's recipes
        const response = await fetch(backendAddress + `usuarios/perfil/receitas/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            const text = await response.text().catch(() => '');
            throw new Error(`Erro ao carregar receitas (status ${response.status}): ${text}`);
        }

        const receitas = await response.json();
        await displayUserRecipes(receitas);

    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        const msg = error instanceof Error ? error.message : String(error);
        receitasContainer.innerHTML = `
            <div class="error-message">
                <h2>Erro ao carregar receitas</h2>
                <p>${msg}</p>
                <p>Tente recarregar a página ou faça logout e login novamente.</p>
            </div>
        `;
    }
}

/**
 * Display user's recipes
 * 
 * @param receitas - Array of recipe objects
 */
async function displayUserRecipes(receitas: any[]): Promise<void> {
    const receitasContainer = document.getElementById('receitas-container');
    if (!receitasContainer) return;

    if (receitas.length === 0) {
        receitasContainer.innerHTML = `
            <div class="no-recipes">
                <h2>📝 Você ainda não criou nenhuma receita</h2>
                <p>Comece a compartilhar suas receitas deliciosas com a comunidade!</p>
                <button class="btn-criar-receita" onclick="window.location.href='criarReceita.html'">
                    ➕ Criar Primeira Receita
                </button>
            </div>
        `;
        return;
    }

    let html = `
        <div class="minhas-receitas-header">
            <h1>🍳 Minhas Receitas</h1>
            <p class="receitas-count">Você tem ${receitas.length} receita${receitas.length !== 1 ? 's' : ''}</p>
            <button class="btn-criar-receita" onclick="window.location.href='criarReceita.html'">
                ➕ Nova Receita
            </button>
        </div>
        <div class="receitas-list">
    `;

    for (let i = 0; i < receitas.length; i++) {
        const receita = receitas[i];
        const isPublic = receita.visibilidade === 'pub' || receita.visibilidade === 'Pub';
        const visibilityBadge = isPublic ? '🌐 Pública' : '🔒 Privada';
        const visibilityClass = isPublic ? 'visibility-public' : 'visibility-private';

        // Handle image URL - check if it's absolute or relative
        let imageUrl = 'https://dummyimage.com/400x300/ffe0b2/232323&text=Sem+imagem';
        if (receita.foto_da_receita) {
            if (receita.foto_da_receita.startsWith('http://') || receita.foto_da_receita.startsWith('https://')) {
                // Already absolute URL
                imageUrl = receita.foto_da_receita;
            } else {
                // Relative URL - prepend backend address
                const cleanBackend = backendAddress.replace(/\/$/, '');
                const cleanPath = receita.foto_da_receita.startsWith('/') ? receita.foto_da_receita : '/' + receita.foto_da_receita;
                imageUrl = cleanBackend + cleanPath;
            }
        }

        // Get category label (backend may return categoria as object {value,label})
        const catField: any = (receita as any).categoria;
        const categoriaLabel = catField && typeof catField === 'object'
            ? (catField.label || catField.value)
            : ((receita as any).categoria_label || receita.categoria);

        html += `
            <div class="receita-card" onclick="window.location.href='receita.html?id=${receita.id}'">
                <span class="visibility-badge ${visibilityClass}">${visibilityBadge}</span>
                <img src="${imageUrl}"
                     alt="${receita.titulo}"
                     class="receita-img"
                     onerror="this.src='https://dummyimage.com/400x300/ffe0b2/232323&text=Sem+imagem'">
                <h2>${receita.titulo}</h2>
                <span class="receita-categoria">📁 ${categoriaLabel}</span>
                <div class="receita-detalhes">
                    <span>⏱️ ${receita.tempo_de_preparo} min</span>
                    <span>👥 ${receita.porcoes} porções</span>
                </div>
                <div class="receita-actions">
                    <button class="btn-editar" onclick="event.stopPropagation(); editarReceita(${receita.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn-deletar" onclick="event.stopPropagation(); deletarReceita(${receita.id})">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `;
    }

    html += '</div>';
    receitasContainer.innerHTML = html;
}

/**
 * Edit recipe
 * 
 * @param id - The ID of the recipe to edit
 */
function editarReceita(id: number): void {
    window.location.href = `editarReceita.html?id=${id}`;
}

/**
 * Delete recipe - redirect to confirmation page
 * 
 * @param id - The ID of the recipe to delete
 */
function deletarReceita(id: number): void {
    window.location.href = `deletarReceita.html?id=${id}`;
}

/**
 * Initialize page
 */
function initializeMinhasReceitasPage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadUserRecipes();
}

// Run on page load
window.addEventListener('load', initializeMinhasReceitasPage);
