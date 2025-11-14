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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPublicReceitas = fetchPublicReceitas;
exports.renderPubReceitasListView = renderPubReceitasListView;
exports.renderReceitas = renderReceitas;
exports.createReceitaCard = createReceitaCard;
/**
 * Fetches public recipes from the backend API
 * Calls the PubReceitasListView endpoint which returns public recipes ordered by -id
 *
 * @returns Promise with array of public recipes
 */
function fetchPublicReceitas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(backendAddress);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const receitas = yield response.json();
            // Backend already filters by visibilidade='pub' and orders by -id
            return receitas;
        }
        catch (error) {
            console.error('Error fetching public recipes:', error);
            return [];
        }
    });
}
/**
 * Renders the public recipes list view (equivalent to PubReceitasListView)
 *
 * This function fetches public recipes from the backend and renders them
 * in the DOM, mimicking the Django view behavior.
 */
function renderPubReceitasListView() {
    return __awaiter(this, void 0, void 0, function* () {
        const receitas = yield fetchPublicReceitas();
        const contexto = {
            pubReceitas: receitas,
            tituloJanela: 'Receitas Públicas',
            tituloPagina: 'Homepage - Receitas',
        };
        // Update page title
        document.title = contexto.tituloJanela;
        // Render the recipes to the DOM
        renderReceitas(contexto);
    });
}
/**
 * Renders the recipes to the DOM
 *
 * @param contexto - The page context containing recipes and titles
 */
function renderReceitas(contexto) {
    const container = document.getElementById('receitas-container');
    if (!container) {
        console.error('Container element not found');
        return;
    }
    // Clear existing content
    container.innerHTML = '';
    // Add page title
    const pageTitle = document.createElement('h1');
    pageTitle.textContent = contexto.tituloPagina;
    container.appendChild(pageTitle);
    // Check if there are recipes
    if (contexto.pubReceitas.length === 0) {
        const noRecipesMsg = document.createElement('p');
        noRecipesMsg.textContent = 'Nenhuma receita pública disponível.';
        container.appendChild(noRecipesMsg);
        return;
    }
    // Create recipe list
    const receitasList = document.createElement('div');
    receitasList.className = 'receitas-list';
    contexto.pubReceitas.forEach(receita => {
        const receitaCard = createReceitaCard(receita);
        receitasList.appendChild(receitaCard);
    });
    container.appendChild(receitasList);
}
/**
 * Creates a recipe card element
 *
 * @param receita - The recipe object
 * @returns HTMLElement representing the recipe card
 */
function createReceitaCard(receita) {
    const card = document.createElement('div');
    card.className = 'receita-card';
    const titulo = document.createElement('h2');
    titulo.textContent = receita.titulo;
    card.appendChild(titulo);
    if (receita.descricao) {
        const descricao = document.createElement('p');
        descricao.textContent = receita.descricao;
        card.appendChild(descricao);
    }
    const detalhes = document.createElement('div');
    detalhes.className = 'receita-detalhes';
    detalhes.innerHTML = `
        <span>⏱️ ${receita.tempo_preparo} min</span>
        <span>🍽️ ${receita.porcoes} porções</span>
    `;
    card.appendChild(detalhes);
    // Add click event to view full recipe
    card.addEventListener('click', () => {
        window.location.href = `receita.html?id=${receita.id}`;
    });
    return card;
}
