/**
 * Set favicon dynamically from backend
 */
(function setFavicon(): void {
    const faviconUrl = `${backendAddress}static/favicon.ico`;

    function updateFavicon() {
        // Create or update favicon link element
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;

        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }

        link.href = faviconUrl;

        // Also set header favicon image if it exists
        const headerFavicon = document.getElementById('header-favicon') as HTMLImageElement;
        if (headerFavicon) {
            headerFavicon.src = faviconUrl;
            headerFavicon.onerror = () => {
                console.error('Failed to load favicon from:', faviconUrl);
            };
        }
    }

    // Run immediately and also when DOM is fully loaded
    updateFavicon();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateFavicon);
    }
})();
