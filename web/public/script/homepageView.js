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
 * Busca receitas públicas da API backend
 * Chama o endpoint PubReceitasListView que retorna receitas públicas ordenadas por -id
 *
 * @returns Promise com array de receitas públicas
 */
function fetchPublicReceitas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(backendAddress + "receitas/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const receitas = yield response.json();
            return receitas;
        }
        catch (error) {
            console.error('Error fetching public recipes:', error);
            return [];
        }
    });
}
/**
 * Renderiza a view de lista de receitas públicas (equivalente a PubReceitasListView)
 *
 * Esta função busca receitas públicas do backend e as renderiza
 * no DOM, imitando o comportamento da view Django.
 */
function renderPubReceitasListView() {
    return __awaiter(this, void 0, void 0, function* () {
        const receitas = yield fetchPublicReceitas();
        const contexto = {
            pubReceitas: receitas,
            tituloJanela: 'Receitas Públicas',
            tituloPagina: 'Homepage - Receitas',
        };
        // Atualiza o título da página
        document.title = contexto.tituloJanela;
        // Renderiza as receitas no DOM
        renderReceitas(contexto);
    });
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
    // Header section
    const header = document.createElement('div');
    header.className = 'login-e-cadastro';
    //botao para fazer cadastro
    const cadastroBtn = document.createElement('button');
    cadastroBtn.className = 'modern-btn';
    cadastroBtn.textContent = 'Cadastro';
    cadastroBtn.style.marginTop = '2rem';
    cadastroBtn.addEventListener('click', () => {
        window.location.href = 'cadastro.html';
    });
    header.appendChild(cadastroBtn);
    //botao de login
    const loginBtn = document.createElement('button');
    loginBtn.className = 'modern-btn';
    loginBtn.textContent = 'Login';
    loginBtn.style.marginTop = '2rem';
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    header.appendChild(loginBtn);
    container.appendChild(header);
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
        img.src = `${backendAddress.replace(/\/$/, '')}${receita.foto_da_receita}`;
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
// Exporta funções
export { fetchPublicReceitas, renderPubReceitasListView, renderReceitas, createReceitaCard };
