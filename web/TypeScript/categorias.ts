/**
 * Interface for Category data from backend
 */
interface Categoria {
    value: string;
    label: string;
}

/**
 * Fetch available categories from the backend API
 *
 * @returns Promise with an array of categories
 */
async function fetchCategorias(): Promise<Categoria[]> {
    try {
        const response = await fetch(backendAddress + "receitas/categorias/");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categorias: Categoria[] = await response.json();
        return categorias;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Populate a select element with categories from the backend
 *
 * @param selectElement - The select element to populate
 * @param selectedValue - Optional value to pre-select
 */
async function populateCategoriasSelect(selectElement: HTMLSelectElement, selectedValue?: string): Promise<void> {
    const categorias = await fetchCategorias();

    // Clear existing options
    selectElement.innerHTML = '';

    // Add a default placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Selecione uma categoria';
    placeholderOption.disabled = true;
    placeholderOption.selected = !selectedValue;
    selectElement.appendChild(placeholderOption);

    // Add all categories
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.value;
        option.textContent = categoria.label;
        
        if (selectedValue && categoria.value === selectedValue) {
            option.selected = true;
        }
        
        selectElement.appendChild(option);
    });
}

// Cache for categories
let categoriasCache: Categoria[] | null = null;

/**
 * Get category label from value
 *
 * @param value - The category value
 * @returns The category label or the value if not found
 */
async function getCategoriaLabel(value: string): Promise<string> {
    if (!categoriasCache) {
        categoriasCache = await fetchCategorias();
    }
    
    const categoria = categoriasCache.find(cat => cat.value === value);
    return categoria ? categoria.label : value;
}

