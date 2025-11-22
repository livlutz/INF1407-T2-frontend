/**
 * Get recipe ID from URL
 * 
 * @return The recipe ID as a number, or null if not found
 */
function getDeleteRecipeIdFromUrl(): number | null {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id, 10) : null;
}

/**
 * Load recipe info for deletion confirmation
 * 
 * @returns Promise<void>
 */
async function loadRecipeForDeletion(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const recipeId = getDeleteRecipeIdFromUrl();
    if (!recipeId) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = '<div class="error">❌ ID da receita não encontrado</div>';
            messageDiv.style.display = 'block';
        }
        setTimeout(() => {
            window.location.href = 'minhasReceitas.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(backendAddress + `receitas/receita/${recipeId}/`, {
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
            if (response.status === 403 || response.status === 404) {
                const messageDiv = document.getElementById('message');
                if (messageDiv) {
                    messageDiv.innerHTML = '<div class="error">❌ Receita não encontrada ou você não tem permissão</div>';
                    messageDiv.style.display = 'block';
                }
                setTimeout(() => {
                    window.location.href = 'minhasReceitas.html';
                }, 2000);
                return;
            }
            throw new Error('Erro ao carregar receita');
        }

        const receita = await response.json();
        displayRecipeInfo(receita);

    } catch (error) {
        console.error('Erro ao carregar receita:', error);

        const container = document.querySelector('.delete-recipe-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>❌ Erro ao Carregar Receita</h2>
                    <p>Não foi possível carregar os dados da receita.</p>
                    <button class="btn-submit" onclick="window.location.href='minhasReceitas.html'" style="margin-top: 1.5rem;">
                        ← Voltar para Minhas Receitas
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Display recipe information
 * 
 * @param receita - The recipe data to display
 */
function displayRecipeInfo(receita: any): void {
    const recipeInfoDiv = document.getElementById('recipe-info');
    if (!recipeInfoDiv) return;

    recipeInfoDiv.innerHTML = `
        <div class="recipe-details">
            <h3>${receita.titulo}</h3>
            <p><strong>Categoria:</strong> ${receita.categoria}</p>
            <p><strong>Tempo de Preparo:</strong> ${receita.tempo_de_preparo} minutos</p>
            <p><strong>Porções:</strong> ${receita.porcoes}</p>
        </div>
    `;
}

/**
 * Delete recipe
 * 
 * @return Promise<void>
 */
async function confirmDeleteRecipe(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const recipeId = getDeleteRecipeIdFromUrl();
    if (!recipeId) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = '<div class="error">❌ ID da receita não encontrado</div>';
            messageDiv.style.display = 'block';
        }
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
        const response = await fetch(backendAddress + `receitas/deletar_receita/${recipeId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            if (response.status === 403) {
                throw new Error('Você não tem permissão para excluir esta receita');
            }

            if (response.status === 404) {
                throw new Error('Receita não encontrada');
            }

            throw new Error('Erro ao excluir receita');
        }

        // Success - backend now returns 200 OK with message
        const data = await response.json();

        window.scrollTo({ top: 0, behavior: 'smooth' });

        messageDiv.innerHTML = '<div class="success">✅ Receita excluída com sucesso! Redirecionando...</div>';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'minhasReceitas.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao excluir receita:', error);

        let errorMessage = 'Erro ao excluir receita. Tente novamente.';

        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            errorMessage = '❌ Erro de conexão com o servidor. Verifique se o backend está rodando e configurado corretamente (CORS).';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        messageDiv.innerHTML = `<div class="error">${errorMessage}</div>`;
        messageDiv.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-enable buttons
        deleteBtn.disabled = false;
        cancelBtn.disabled = false;
        deleteBtn.textContent = 'Sim, Excluir Receita';
    }
}

/**
 * Cancel deletion and go back
 */
function cancelRecipeDeletion(): void {
    window.location.href = 'minhasReceitas.html';
}

/**
 * Initialize delete recipe page
 */
function initializeDeleteRecipePage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load recipe info
    loadRecipeForDeletion();

    // Set up event listeners
    const deleteBtn = document.getElementById('btnDelete');
    const cancelBtn = document.getElementById('btnCancel');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            confirmDeleteRecipe();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelRecipeDeletion();
        });
    }
}

// Run on page load
window.addEventListener('load', initializeDeleteRecipePage);
