/**
 * Update the loginDone page with the logged username
 */
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const title = document.getElementById('welcome-title');
    if (username && title) {
        title.textContent = `Bem vindo, ${username}!`;
    }
});
