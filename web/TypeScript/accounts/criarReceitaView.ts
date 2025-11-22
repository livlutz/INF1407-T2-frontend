/**
 * Create new recipe
 * 
 * @returns Promise<void>
 */
async function createRecipe(): Promise<void> {
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
    submitBtn.textContent = 'Criando...';

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

        const response = await fetch(backendAddress + 'receitas/criar_receita/', {
            method: 'POST',
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

            throw new Error('Erro ao criar receita');
        }

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        messageDiv.innerHTML = '<div class="success">✅ Receita criada com sucesso! Redirecionando...</div>';
        messageDiv.style.display = 'block';

        // Clear form
        (document.getElementById('recipeForm') as HTMLFormElement).reset();

        setTimeout(() => {
            window.location.href = 'minhasReceitas.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao criar receita:', error);
        messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao criar receita. Tente novamente.'}</div>`;
        messageDiv.style.display = 'block';

        // Re-enable buttons
        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        submitBtn.textContent = 'Criar Receita';
    }
}

/**
 * Cancel creation and go back
 */
function cancelCreate(): void {
    if (confirm('Tem certeza que deseja cancelar? Os dados não serão salvos.')) {
        window.location.href = 'index.html';
    }
}

/**
 * Initialize create recipe page
 */
function initializeCreateRecipePage(): void {
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
            createRecipe();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cancelCreate();
        });
    }
}

// Run on page load
window.addEventListener('load', initializeCreateRecipePage);
