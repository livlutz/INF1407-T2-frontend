"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homepageView_1 = require("./homepageView");
/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    (0, homepageView_1.renderPubReceitasListView)();
});
