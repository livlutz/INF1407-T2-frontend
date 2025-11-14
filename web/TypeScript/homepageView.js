"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContext = exports.Receita = void 0;
exports.fetchPublicReceitas = fetchPublicReceitas;
exports.renderPubReceitasListView = renderPubReceitasListView;
exports.renderReceitas = renderReceitas;
exports.createReceitaCard = createReceitaCard;
const constantes_js_1 = require("./constantes.js");
/**
 * Busca receitas públicas da API backend
 * Chama o endpoint PubReceitasListView que retorna receitas públicas ordenadas por -id
 *
 * @returns Promise com array de receitas públicas
 */
async function fetchPublicReceitas() {
    try {
        const response = await fetch(constantes_js_1.backendAddress);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const receitas = await response.json();
        return receitas;
    }
    catch (error) {
        console.error('Error fetching public recipes:', error);
        return [];
    }
}
/**
 * Renderiza a view de lista de receitas públicas (equivalente a PubReceitasListView)
 *
 * Esta função busca receitas públicas do backend e as renderiza
 * no DOM, imitando o comportamento da view Django.
 */
async function renderPubReceitasListView() {
    const receitas = await fetchPublicReceitas();
    const contexto = {
        pubReceitas: receitas,
        tituloJanela: 'Receitas Públicas',
        tituloPagina: 'Homepage - Receitas',
    };
    // Atualiza o título da página
    document.title = contexto.tituloJanela;
    // Renderiza as receitas no DOM
    renderReceitas(contexto);
}
/**
 * Renderiza as receitas no DOM
 *
 * @param contexto - O contexto da página contendo receitas e títulos
 */
function renderReceitas(contexto) {
    const container = document.getElementById('receitas-container');
    if (!container) {
        console.error('Container element not found');
        return;
    }
    // Limpa o conteúdo existente
    container.innerHTML = '';
    // Adiciona o título da página
    const pageTitle = document.createElement('h1');
    pageTitle.textContent = contexto.tituloPagina;
    container.appendChild(pageTitle);
    // Verifica se há receitas
    if (contexto.pubReceitas.length === 0) {
        const noRecipesMsg = document.createElement('p');
        noRecipesMsg.textContent = 'Nenhuma receita pública disponível.';
        container.appendChild(noRecipesMsg);
        return;
    }
    // Cria a lista de receitas
    const receitasList = document.createElement('div');
    receitasList.className = 'receitas-list';
    contexto.pubReceitas.forEach(receita => {
        const receitaCard = createReceitaCard(receita);
        receitasList.appendChild(receitaCard);
    });
    container.appendChild(receitasList);
}
/**
 * Cria um elemento de cartão de receita
 *
 * @param receita - O objeto receita
 * @returns HTMLElement representando o cartão de receita
 */
function createReceitaCard(receita) {
    const card = document.createElement('div');
    card.className = 'receita-card';
    // Adiciona imagem se disponível
    if (receita.foto_da_receita) {
        const img = document.createElement('img');
        img.src = `${constantes_js_1.backendAddress.replace(/\/$/, '')}${receita.foto_da_receita}`;
        img.alt = receita.titulo;
        img.className = 'receita-img';
        card.appendChild(img);
    }
    const titulo = document.createElement('h2');
    titulo.textContent = receita.titulo;
    card.appendChild(titulo);
    // Mostra o nome do autor
    const autor = document.createElement('p');
    autor.className = 'receita-autor';
    autor.textContent = `Por: ${receita.autor_nome}`;
    card.appendChild(autor);
    // Mostra a categoria
    const categoria = document.createElement('span');
    categoria.className = 'receita-categoria';
    categoria.textContent = receita.categoria;
    card.appendChild(categoria);
    const detalhes = document.createElement('div');
    detalhes.className = 'receita-detalhes';
    detalhes.innerHTML = `
        <span>⏱️ ${receita.tempo_de_preparo} min</span>
        <span>🍽️ ${receita.porcoes} porções</span>
    `;
    card.appendChild(detalhes);
    // Adiciona evento de clique para visualizar a receita completa
    card.addEventListener('click', () => {
        window.location.href = `receita.html?id=${receita.id}`;
    });
    return card;
}
//# sourceMappingURL=homepageView.js.map