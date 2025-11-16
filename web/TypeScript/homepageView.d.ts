/**
 * Interface com o objeto receita
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
 * Interface para o contexto da página
 */
interface PageContext {
    pubReceitas: Receita[];
    tituloJanela: string;
    tituloPagina: string;
}
/**
 * Busca receitas públicas da API backend
 * Chama o endpoint PubReceitasListView que retorna receitas públicas ordenadas por -id
 *
 * @returns Promise com array de receitas públicas
 */
declare function fetchPublicReceitas(): Promise<Receita[]>;
/**
 * Renderiza a view de lista de receitas públicas (equivalente a PubReceitasListView)
 *
 * Esta função busca receitas públicas do backend e as renderiza
 * no DOM, imitando o comportamento da view Django.
 */
declare function renderPubReceitasListView(): Promise<void>;
/**
 * Renderiza as receitas no DOM
 *
 * @param contexto - O contexto da página contendo receitas e títulos
 */
declare function renderReceitas(contexto: PageContext): void;
/**
 * Cria um elemento de cartão de receita
 *
 * @param receita - O objeto receita
 * @returns HTMLElement representando o cartão de receita
 */
declare function createReceitaCard(receita: Receita): HTMLElement;
export { Receita, PageContext, fetchPublicReceitas, renderPubReceitasListView, renderReceitas, createReceitaCard };
//# sourceMappingURL=homepageView.d.ts.map