
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
 * Interface representing the context for the homepage view
 */
interface PageContext {
    pubReceitas: Receita[];
    tituloJanela: string;
    tituloPagina: string;
}

/**
 * Fetch visible recipes from the backend API
 *
 * @returns Promise with an array of visible recipes
 */
async function fetchVisibleReceitas(): Promise<Receita[]> {

    const token = localStorage.getItem('token');

    try {
        // First, try to get user ID from token-auth
        const authResponse = await fetch(backendAddress + 'accounts/token-auth/', {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token
            }
        });

        var userId: any = null;
        var response: any = null;
        var receitas: Receita[] = [];

        if (authResponse.ok) {
            const authData = await authResponse.json();
            userId = authData.id || authData.user_id;

            if (userId) {
                // If user ID is found, fetch recipes visible to this user
                // including public and user's private recipes
                 response = await fetch(backendAddress + `receitas/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': tokenKeyword + token,
                    }
                })
            }
        }
        if (!userId) {
            // If no user ID, fetch only public recipes
            response = await fetch(backendAddress + "receitas/");
        }
        if (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            receitas = await response.json();
        }
        return receitas;
        ;

    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

/**
 * Render visible recipes list view with fetched data
 *
 * @returns Promise that resolves when rendering is complete
 */
async function renderPubReceitasListView(): Promise<void> {
    const receitas = await fetchVisibleReceitas();

    const contexto: PageContext = {
        pubReceitas: receitas,
        tituloJanela: 'Receitas Públicas',
        tituloPagina: 'Homepage - Receitas',
    };

    // Update the page title
    document.title = contexto.tituloJanela;

    // Render recipes into the DOM
    renderReceitas(contexto);
}

/**
 * Renders the list of recipes to the DOM
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

        
    // Create the "Nova Receita" button
    const criarBtn = document.createElement('button');
    criarBtn.textContent = "➕ Nova Receita";
    criarBtn.className = "btn-criar-receita";
    criarBtn.style.display = "block";
    criarBtn.style.margin = "10px auto";

    criarBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");

        if (token) {
            window.location.href = "criarReceita.html";
        } else {
            window.location.href = "login.html";
        }
    });

    container.appendChild(criarBtn);

    // Check if there are recipes
    if (contexto.pubReceitas.length === 0) {
        const noRecipesMsg = document.createElement('p');
        noRecipesMsg.textContent = 'Nenhuma receita visível disponível.';
        container.appendChild(noRecipesMsg);
        return;
    }

    // Create the recipes list
    const receitasList = document.createElement('div');
    receitasList.className = 'receitas-list';

    contexto.pubReceitas.forEach(receita => {
        const receitaCard = createReceitaCard(receita);
        receitasList.appendChild(receitaCard);
    });

    container.appendChild(receitasList);
}

/**
 * Create a recipe card element
 *
 * @param receita - The recipe object
 * @returns HTMLElement representing the recipe card
 */
function createReceitaCard(receita: Receita): HTMLElement {
    const card = document.createElement('div');
    card.className = 'receita-card';

    // Always add image - use placeholder if not available
    const img = document.createElement('img');
    if (receita.foto_da_receita) {
        // The serializer already returns the full URL with the request context
        img.src = receita.foto_da_receita;
    } else {
        img.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    }
    img.alt = receita.titulo;
    img.className = 'receita-img';
    img.onerror = function() {
        (this as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    };
    card.appendChild(img);

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
    fetchVisibleReceitas,
    renderPubReceitasListView,
    renderReceitas,
    createReceitaCard
};
