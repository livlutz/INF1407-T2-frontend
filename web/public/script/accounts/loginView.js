"use strict";
onload = () => {
    document.getElementById('btnLogin').addEventListener('click', evento => {
        evento.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const msg = document.getElementById('msg');
        // Clear previous error message
        msg.innerHTML = '';
        msg.style.display = 'none';
        fetch(backendAddress + 'accounts/token-auth/', {
            method: 'POST',
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                if (response.status == 401) {
                    msg.innerHTML = 'Usuário ou senha inválidos.';
                    msg.style.display = 'block';
                    msg.style.color = 'red';
                }
                throw new Error('Falha na autenticação');
            }
        })
            .then((data) => {
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.replace('loginDone.html');
        })
            .catch(erro => {
            console.log(erro);
            // Show generic error if not already shown
            if (msg.innerHTML === '') {
                msg.innerHTML = 'Erro ao tentar fazer login. Tente novamente.';
                msg.style.display = 'block';
                msg.style.color = 'red';
            }
        });
    });
};
