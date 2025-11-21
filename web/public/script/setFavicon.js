"use strict";
/**
 * Set favicon dynamically from backend
 */
(function setFavicon() {
    const faviconUrl = `${backendAddress}site_receitas/static/imagens/favicon.ico`;
    // Create or update favicon link element
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = faviconUrl;
})();
