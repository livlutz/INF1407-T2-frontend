onload = () => {
    (document.getElementById('btnLogin') as HTMLInputElement).addEventListener('click', evento => {
        evento.preventDefault();
        const username: String = (document.getElementById('username') as HTMLInputElement).value;
        const password: String = (document.getElementById('password') as HTMLInputElement).value;
        const msg = (document.getElementById('msg') as HTMLDivElement);

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
        .then((response: Response) => {
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
        .then((data: { token: string }) => {
            const token: string = data.token;
            localStorage.setItem('token', token);
            // Store username locally so other pages can know the logged user
            localStorage.setItem('username', username.toString());
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