onload = (evento) => {
    // If there's no token, redirect to login page immediately
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const logoutBtn = document.getElementById('logout') as HTMLButtonElement | null;
    if (!logoutBtn) {
        console.warn('Logout button not found');
        return;
    }

    logoutBtn.addEventListener('click', (evento) => {
        fetch(backendAddress + 'accounts/token-auth/', {
            method: 'DELETE',
            headers: {
                'Authorization': tokenKeyword + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const mensagem = document.getElementById('mensagem') as HTMLDivElement | null;
            if(response.ok) window.location.assign('/');
            else if (mensagem) mensagem.innerHTML = 'Erro ' + response.status;
        })
        .catch(erro => { console.log(erro); })
    });
}
