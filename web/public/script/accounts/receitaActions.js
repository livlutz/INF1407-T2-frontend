"use strict";
/**
 * Recipe Actions - Edit and Delete navigation functions
 * This file contains helper functions called from minhasReceitas.html
 */
/**
 * Navigate to edit recipe page
 */
function editarReceita(id) {
    window.location.href = `editarReceita.html?id=${id}`;
}
/**
 * Navigate to delete recipe confirmation page
 */
function deletarReceita(id) {
    window.location.href = `deletarReceita.html?id=${id}`;
}
