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
 * Create new recipe
 *
 * @returns Promise<void>
 */
function createRecipe() {
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
        const titulo = document.getElementById('titulo').value.trim();
        const ingredientes = document.getElementById('ingredientes').value.trim();
        const modoDePreparo = document.getElementById('modo_de_preparo').value.trim();
        const tempoDePreparo = document.getElementById('tempo_de_preparo').value;
        const porcoes = document.getElementById('porcoes').value;
        const categoria = document.getElementById('categoria').value.trim();
        const visibilidade = document.getElementById('visibilidade').value;
        const fotoInput = document.getElementById('foto_da_receita');
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
            const response = yield fetch(backendAddress + 'receitas/criar_receita/', {
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
                    const errorData = yield response.json();
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
            document.getElementById('recipeForm').reset();
            setTimeout(() => {
                window.location.href = 'minhasReceitas.html';
            }, 2000);
        }
        catch (error) {
            console.error('Erro ao criar receita:', error);
            messageDiv.innerHTML = `<div class="error">${error instanceof Error ? error.message : 'Erro ao criar receita. Tente novamente.'}</div>`;
            messageDiv.style.display = 'block';
            // Re-enable buttons
            submitBtn.disabled = false;
            cancelBtn.disabled = false;
            submitBtn.textContent = 'Criar Receita';
        }
    });
}
/**
 * Cancel creation and go back
 */
function cancelCreate() {
    if (confirm('Tem certeza que deseja cancelar? Os dados não serão salvos.')) {
        window.location.href = 'index.html';
    }
}
/**
 * Initialize create recipe page
 */
function initializeCreateRecipePage() {
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
