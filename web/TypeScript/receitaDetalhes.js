"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constantes_js_1 = require("./constantes.js");
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
async function fetchReceita(id) {
    try {
        const response = await fetch(`${constantes_js_1.backendAddress}receitas/${id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const receita = await response.json();
        return receita;
    }
    catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
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
        img.src = `${constantes_js_1.backendAddress.replace(/\/$/, '')}${receita.foto_da_receita}`;
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
    const categoria = document.createElement('span');
    categoria.className = 'ver-receita-cat';
    categoria.textContent = receita.categoria;
    meta.appendChild(categoria);
    const tempo = document.createElement('span');
    tempo.className = 'ver-receita-time';
    tempo.textContent = `⏱️ ${receita.tempo_de_preparo} min`;
    meta.appendChild(tempo);
    const porcoes = document.createElement('span');
    porcoes.className = 'ver-receita-porc';
    porcoes.textContent = `🍽️ ${receita.porcoes} porções`;
    meta.appendChild(porcoes);
    const autor = document.createElement('span');
    autor.className = 'ver-receita-author';
    autor.textContent = `👨‍🍳 ${receita.autor_nome}`;
    meta.appendChild(autor);
    content.appendChild(meta);
    // Ingredientes section
    const ingredientesTitle = document.createElement('h2');
    ingredientesTitle.className = 'ver-receita-section';
    ingredientesTitle.textContent = 'Ingredientes';
    content.appendChild(ingredientesTitle);
    const ingredientesList = document.createElement('ul');
    ingredientesList.className = 'ver-receita-list';
    // Split ingredients by newlines and create list items
    const ingredientesArray = receita.ingredientes.split(/\r?\n/).filter(line => line.trim());
    ingredientesArray.forEach(ingrediente => {
        const li = document.createElement('li');
        li.textContent = ingrediente;
        ingredientesList.appendChild(li);
    });
    content.appendChild(ingredientesList);
    // Modo de preparo section
    const preparoTitle = document.createElement('h2');
    preparoTitle.className = 'ver-receita-section';
    preparoTitle.textContent = 'Modo de Preparo';
    content.appendChild(preparoTitle);
    const preparo = document.createElement('div');
    preparo.className = 'ver-receita-prep';
    // Preserve line breaks in the preparation text
    preparo.innerHTML = receita.modo_de_preparo.replace(/\r?\n/g, '<br>');
    content.appendChild(preparo);
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
    const container = document.getElementById('receita-detalhes-container');
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
async function init() {
    const receitaId = getRecipeIdFromUrl();
    if (!receitaId) {
        showError('ID da receita não fornecido.');
        return;
    }
    const receita = await fetchReceita(receitaId);
    if (!receita) {
        showError('Receita não encontrada.');
        return;
    }
    renderReceitaDetalhes(receita);
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=receitaDetalhes.js.map