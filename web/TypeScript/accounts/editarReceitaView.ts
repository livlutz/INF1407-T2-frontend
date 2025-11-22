/**
 * Interface for Recipe data
 */
interface ReceitaData {
    id: number;
    titulo: string;
    ingredientes: string;
    modo_de_preparo: string;
    tempo_de_preparo: number;
    porcoes: number;
    categoria: string;
    foto_da_receita?: string;
    visibilidade: string;
}

/**
 * Get recipe ID from URL for editing
 * 
 * @return The recipe ID as a number, or null if not found
 */
function getEditRecipeIdFromUrl(): number | null {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id, 10) : null;
}

/**
 * Load recipe data for editing
 * 
 * @returns Promise<void>
 */
async function loadRecipeData(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const recipeId = getEditRecipeIdFromUrl();
    if (!recipeId) {
        alert('ID da receita não encontrado');
        window.location.href = 'minhasReceitas.html';
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
            if (response.status === 403) {
                alert('Você não tem permissão para editar esta receita');
                window.location.href = 'minhasReceitas.html';
                return;
            }
            throw new Error('Erro ao carregar receita');
        }

        const receita: ReceitaData = await response.json();
        populateForm(receita);

    } catch (error) {
        console.error('Erro ao carregar receita:', error);

        // Display error on page instead of alert
        const container = document.querySelector('.edit-recipe-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>❌ Erro ao Carregar Receita</h2>
                    <p>Não foi possível carregar os dados da receita.</p>
                    <p style="font-size: 0.9rem; color: #999;">Você pode não ter permissão para editar esta receita ou ela pode não existir.</p>
                    <button class="btn-submit" onclick="window.location.href='minhasReceitas.html'" style="margin-top: 1.5rem;">
                        ← Voltar para Minhas Receitas
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Populate form with recipe data
 * 
 * @param receita - The recipe data to populate the form with
 */
function populateForm(receita: ReceitaData): void {
    (document.getElementById('titulo') as HTMLInputElement).value = receita.titulo;
    (document.getElementById('ingredientes') as HTMLTextAreaElement).value = receita.ingredientes;
    (document.getElementById('modo_de_preparo') as HTMLTextAreaElement).value = receita.modo_de_preparo;
    (document.getElementById('tempo_de_preparo') as HTMLInputElement).value = receita.tempo_de_preparo.toString();
    (document.getElementById('porcoes') as HTMLInputElement).value = receita.porcoes.toString();
    (document.getElementById('categoria') as HTMLInputElement).value = receita.categoria;
    (document.getElementById('visibilidade') as HTMLSelectElement).value = receita.visibilidade;

    // Show current image if exists
    if (receita.foto_da_receita) {
        const currentImageDiv = document.getElementById('current-image');
        if (currentImageDiv) {
            currentImageDiv.innerHTML = `
                <p>Imagem atual:</p>
                <img src="${receita.foto_da_receita}"
                     alt="Foto atual"
                     style="max-width: 200px; border-radius: 0.5rem; margin-top: 0.5rem;"
                     onerror="this.style.display='none'; this.previousElementSibling.textContent='Imagem não disponível';">
            `;
            currentImageDiv.style.display = 'block';
        }
    }
}

/**
 * Update recipe
 * 
 * @return Promise<void>
 */
async function updateRecipe(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const recipeId = getEditRecipeIdFromUrl();
    if (!recipeId) {
        alert('ID da receita não encontrado');
        return;
    }

    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('btnSubmit') as HTMLButtonElement;
    const cancelBtn = document.getElementById('btnCancel') as HTMLButtonElement;

    if (!messageDiv || !submitBtn || !cancelBtn) return;

    // Get form values
    const titulo = (document.getElementById('titulo') as HTMLInputElement).value.trim();
    const ingredientes = (document.getElementById('ingredientes') as HTMLTextAreaElement).value.trim();
    const modoDePreparo = (document.getElementById('modo_de_preparo') as HTMLTextAreaElement).value.trim();
    const tempoDePreparo = (document.getElementById('tempo_de_preparo') as HTMLInputElement).value;
    const porcoes = (document.getElementById('porcoes') as HTMLInputElement).value;
    const categoria = (document.getElementById('categoria') as HTMLInputElement).value.trim();
    const visibilidade = (document.getElementById('visibilidade') as HTMLSelectElement).value;
    const fotoInput = document.getElementById('foto_da_receita') as HTMLInputElement;

    // Validate required fields
    if (!titulo || !ingredientes || !modoDePreparo || !tempoDePreparo || !porcoes || !categoria) {
        messageDiv.innerHTML = '<div class="error">Todos os campos obrigatórios devem ser preenchidos</div>';
        messageDiv.style.display = 'block';
        return;
    }

    // Disable buttons during request
    submitBtn.disabled = true;
    cancelBtn.disabled = true;
    submitBtn.textContent = 'Atualizando...';

    try {
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('ingredientes', ingredientes);
        formData.append('modo_de_preparo', modoDePreparo);
        formData.append('tempo_de_preparo', tempoDePreparo);
        formData.append('porcoes', porcoes);
        formData.append('categoria', categoria);
        formData.append('visibilidade', visibilidade);

        // Add image if selected
        if (fotoInput.files && fotoInput.files.length > 0) {
            formData.append('foto_da_receita', fotoInput.files[0]);
        }

        const response = await fetch(backendAddress + `receitas/editar_receita/${recipeId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': tokenKeyword + token
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }

            if (response.status === 403) {
                throw new Error('Você não tem permissão para editar esta receita');
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

            throw new Error('Erro ao atualizar receita');
        }

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        messageDiv.innerHTML = '<div class="success">✅ Receita atualizada com sucesso! Redirecionando para suas receitas...</div>';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'minhasReceitas.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao atualizar receita. Tente novamente.'}</div>`;
        messageDiv.style.display = 'block';

        // Re-enable buttons
        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        submitBtn.textContent = 'Atualizar Receita';
    }
}

/**
 * Cancel edit and go back
 */
function cancelRecipeEdit(): void {
    if (confirm('Tem certeza que deseja cancelar? As alterações não serão salvas.')) {
        window.location.href = 'minhasReceitas.html';
    }
}

/**
 * Initialize edit recipe page
 */
function initializeEditRecipePage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load recipe data
    loadRecipeData();

    // Set up event listeners
    const submitBtn = document.getElementById('btnSubmit');
    const cancelBtn = document.getElementById('btnCancel');

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateRecipe();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelRecipeEdit();
        });
    }
}

// Run on page load
window.addEventListener('load', initializeEditRecipePage);
