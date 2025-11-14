import { backendAddress } from './constantes.js';

/**
 * Interface representing a Recipe object
 */
interface Receita {
    id: number;
    titulo: string;
    ingredientes: string;
    modo_de_preparo: string;
    tempo_de_preparo: number;
    porcoes: number;
    categoria: string;
    foto_da_receita: string;
    visibilidade: 'pub' | 'priv';
    autor: number;
    autor_nome: string;
}

/**
 * Interface for the page context
 */
interface PageContext {
    pubReceitas: Receita[];
    tituloJanela: string;
    tituloPagina: string;
}

/**
 * Fetches public recipes from the backend API
 * Calls the PubReceitasListView endpoint which returns public recipes ordered by -id
 *
 * @returns Promise with array of public recipes
 */
async function fetchPublicReceitas(): Promise<Receita[]> {
    try {
        const response = await fetch(backendAddress);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const receitas: Receita[] = await response.json();
        // Backend already filters by visibilidade='pub' and orders by -id
        return receitas;
    } catch (error) {
        console.error('Error fetching public recipes:', error);
        return [];
    }
}

/**
 * Renders the public recipes list view (equivalent to PubReceitasListView)
 *
 * This function fetches public recipes from the backend and renders them
 * in the DOM, mimicking the Django view behavior.
 */
async function renderPubReceitasListView(): Promise<void> {
    const receitas = await fetchPublicReceitas();

    const contexto: PageContext = {
        pubReceitas: receitas,
        tituloJanela: 'Receitas Públicas',
        tituloPagina: 'Homepage - Receitas',
    };

    // Update page title
    document.title = contexto.tituloJanela;

    // Render the recipes to the DOM
    renderReceitas(contexto);
}

/**
 * Renders the recipes to the DOM
 *
 * @param contexto - The page context containing recipes and titles
 */
function renderReceitas(contexto: PageContext): void {
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
function createReceitaCard(receita: Receita): HTMLElement {
    const card = document.createElement('div');
    card.className = 'receita-card';

    // Add image if available
    if (receita.foto_da_receita) {
        const img = document.createElement('img');
        img.src = `${backendAddress.replace(/\/$/, '')}${receita.foto_da_receita}`;
        img.alt = receita.titulo;
        img.className = 'receita-img';
        card.appendChild(img);
    }

    const titulo = document.createElement('h2');
    titulo.textContent = receita.titulo;
    card.appendChild(titulo);

    // Show author name
    const autor = document.createElement('p');
    autor.className = 'receita-autor';
    autor.textContent = `Por: ${receita.autor_nome}`;
    card.appendChild(autor);

    // Show category
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

    // Add click event to view full recipe
    card.addEventListener('click', () => {
        window.location.href = `receita.html?id=${receita.id}`;
    });

    return card;
}

// Export functions
export {
    Receita,
    PageContext,
    fetchPublicReceitas,
    renderPubReceitasListView,
    renderReceitas,
    createReceitaCard
};
