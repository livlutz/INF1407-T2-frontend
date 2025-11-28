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
 * Fetch available categories from the backend API
 *
 * @returns Promise with an array of categories
 */
function fetchCategorias() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(backendAddress + "receitas/categorias/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categorias = yield response.json();
            return categorias;
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    });
}
/**
 * Populate a select element with categories from the backend
 *
 * @param selectElement - The select element to populate
 * @param selectedValue - Optional value to pre-select
 */
function populateCategoriasSelect(selectElement, selectedValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const categorias = yield fetchCategorias();
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
    });
}
// Cache for categories
let categoriasCache = null;
/**
 * Get category label from value
 *
 * @param value - The category value
 * @returns The category label or the value if not found
 */
function getCategoriaLabel(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!categoriasCache) {
            categoriasCache = yield fetchCategorias();
        }
        const categoria = categoriasCache.find(cat => cat.value === value);
        return categoria ? categoria.label : value;
    });
}
