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
 * Load user's recipes
 */
function loadUserRecipes() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        const receitasContainer = document.getElementById('receitas-container');
        if (!receitasContainer)
            return;
        try {
            // First, get user ID from token-auth
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
                throw new Error('Erro ao validar token');
            }
            const authData = yield authResponse.json();
            const userId = authData.id || authData.user_id;
            if (!userId) {
                throw new Error('ID do usuário não encontrado');
            }
            // Now fetch user's recipes
            const response = yield fetch(backendAddress + `usuarios/perfil/receitas/${userId}/`, {
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
                throw new Error('Erro ao carregar receitas');
            }
            const receitas = yield response.json();
            displayUserRecipes(receitas);
        }
        catch (error) {
            console.error('Erro ao carregar receitas:', error);
            receitasContainer.innerHTML = `
            <div class="error-message">
                <h2>Erro ao carregar receitas</h2>
                <p>Não foi possível carregar suas receitas. Tente novamente mais tarde.</p>
            </div>
        `;
        }
    });
}
/**
 * Display user's recipes
 */
function displayUserRecipes(receitas) {
    const receitasContainer = document.getElementById('receitas-container');
    if (!receitasContainer)
        return;
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
        html += `
            <div class="receita-card" onclick="window.location.href='receita.html?id=${receita.id}'">
                <span class="visibility-badge ${visibilityClass}">${visibilityBadge}</span>
                <img src="${receita.foto_da_receita || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}"
                     alt="${receita.titulo}"
                     class="receita-img"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Sem+Imagem'">
                <h2>${receita.titulo}</h2>
                <span class="receita-categoria">📁 ${receita.categoria}</span>
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
 */
function editarReceita(id) {
    window.location.href = `editarReceita.html?id=${id}`;
}
/**
 * Delete recipe
 */
function deletarReceita(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        try {
            const response = yield fetch(backendAddress + `receitas/${id}/`, {
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
                throw new Error('Erro ao excluir receita');
            }
            // Reload recipes after deletion
            loadUserRecipes();
        }
        catch (error) {
            console.error('Erro ao excluir receita:', error);
            alert('Erro ao excluir receita. Tente novamente.');
        }
    });
}
/**
 * Initialize page
 */
function initializeMinhasReceitasPage() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    loadUserRecipes();
}
// Run on page load
window.addEventListener('load', initializeMinhasReceitasPage);
