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
 * Gets the recipe ID from the URL query parameters
 */
function getRecipeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id, 10) : null;
}
/**
 * Fetches a single recipe from the backend API
 */
function fetchReceita(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${backendAddress}receita/${id}/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const receita = yield response.json();
            return receita;
        }
        catch (error) {
            console.error('Error fetching recipe:', error);
            return null;
        }
    });
}
/**
 * Renders the recipe details to the DOM
 */
function renderReceitaDetalhes(receita) {
    const container = document.getElementById('receita-detalhes-container');
    if (!container) {
        console.error('Container element not found');
        return;
    }
    container.className = 'ver-receita-section';
    // Clear existing content
    container.innerHTML = '';
    // Create the main card
    const card = document.createElement('div');
    card.className = 'ver-receita-card';
    // Add image if available
    if (receita.foto_da_receita) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'ver-receita-img-wrap';
        const img = document.createElement('img');
        img.src = `${backendAddress.replace(/\/$/, '')}${receita.foto_da_receita}`;
        img.alt = receita.titulo;
        img.className = 'ver-receita-img';
        imgWrap.appendChild(img);
        card.appendChild(imgWrap);
    }
    // Content section
    const content = document.createElement('div');
    content.className = 'ver-receita-content';
    // Title
    const titulo = document.createElement('h1');
    titulo.className = 'ver-receita-title';
    titulo.textContent = receita.titulo;
    content.appendChild(titulo);
    // Meta information
    const meta = document.createElement('div');
    meta.className = 'ver-receita-meta';
    const autor = document.createElement('span');
    autor.className = 'ver-receita-author';
    autor.textContent = `👨‍🍳 ${receita.autor_nome}`;
    meta.appendChild(autor);
    const itens = document.createElement('div');
    itens.className = 'ver-receita-info';
    const categoria = document.createElement('span');
    categoria.className = 'receita-info-item';
    categoria.textContent = receita.categoria;
    itens.appendChild(categoria);
    const tempo = document.createElement('span');
    tempo.className = 'receita-info-item';
    tempo.textContent = `⏱️ ${receita.tempo_de_preparo} min`;
    itens.appendChild(tempo);
    const porcoes = document.createElement('span');
    porcoes.className = 'receita-info-item';
    porcoes.textContent = `🍽️ ${receita.porcoes} porções`;
    itens.appendChild(porcoes);
    meta.appendChild(itens);
    content.appendChild(meta);
    // TODO: ações de editar/excluir para o autor da receita
    // Ingredientes section
    const infos = document.createElement('div');
    infos.className = 'ver-receita-section';
    const ingredientesTitle = document.createElement('h2');
    ingredientesTitle.className = 'ver-receita-title';
    ingredientesTitle.textContent = 'Ingredientes';
    infos.appendChild(ingredientesTitle);
    const ingredientesList = document.createElement('ul');
    ingredientesList.className = 'receita-ingredientes-list';
    // Split ingredients by newlines and create list items
    const ingredientesArray = receita.ingredientes.split(/\r?\n/).filter(line => line.trim());
    ingredientesArray.forEach(ingrediente => {
        const li = document.createElement('li');
        li.textContent = ingrediente;
        ingredientesList.appendChild(li);
    });
    infos.appendChild(ingredientesList);
    content.appendChild(infos);
    // Modo de preparo section
    const infos2 = document.createElement('div');
    infos2.className = 'ver-receita-section';
    const preparoTitle = document.createElement('h2');
    preparoTitle.className = 'ver-receita-title';
    preparoTitle.textContent = 'Modo de Preparo';
    infos2.appendChild(preparoTitle);
    const preparo = document.createElement('div');
    preparo.className = 'receita-instrucoes';
    // Preserve line breaks in the preparation text
    preparo.innerHTML = receita.modo_de_preparo.replace(/\r?\n/g, '<br>');
    infos2.appendChild(preparo);
    content.appendChild(infos2);
    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'modern-btn';
    backBtn.textContent = '← Voltar para Homepage';
    backBtn.style.marginTop = '2rem';
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    content.appendChild(backBtn);
    card.appendChild(content);
    container.appendChild(card);
    // Update page title
    document.title = `${receita.titulo} - Receita`;
}
/**
 * Displays an error message
 */
function showError(message) {
    const container = document.getElementById('ver-receita-section');
    if (!container)
        return;
    container.innerHTML = `
        <div class="ver-receita-card">
            <div class="ver-receita-content">
                <h1 class="ver-receita-title">Erro</h1>
                <p style="color: #ffe0b2; text-align: center; margin: 2rem 0;">${message}</p>
                <button class="modern-btn" onclick="window.location.href='index.html'">← Voltar para Homepage</button>
            </div>
        </div>
    `;
}
/**
 * Initialize the page
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const receitaId = getRecipeIdFromUrl();
        if (!receitaId) {
            showError('ID da receita não fornecido.');
            return;
        }
        const receita = yield fetchReceita(receitaId);
        if (!receita) {
            showError('Receita não encontrada.');
            return;
        }
        renderReceitaDetalhes(receita);
    });
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
