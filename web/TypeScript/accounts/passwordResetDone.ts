onload = (evento) => {
    const btnEnviaNovaSenha = document.getElementById('enviaNovaSenha') as HTMLButtonElement;

    if (!btnEnviaNovaSenha) {
        console.error('Botão enviaNovaSenha não encontrado');
        return;
    }

    btnEnviaNovaSenha.addEventListener('click', (evento) => {
            evento.preventDefault();
            const token = (document.getElementById('token') as HTMLInputElement).value;
            const senha = (document.getElementById('senha') as HTMLInputElement).value;
            const senha2 = (document.getElementById('senha2') as HTMLInputElement).value;
            const msg = (document.getElementById('msg') as HTMLDivElement);

        // verifica se as duas senhas são iguais
        if(senha != senha2) {
            msg.innerHTML = 'As senhas devem ser iguais';
            return;
        }

        // Valida se o token foi preenchido
        if(!token) {
            msg.innerHTML = 'Por favor, insira o token';
            return;
        }

        fetch(backendAddress + 'accounts/password_reset/confirm/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                password: senha
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if(response.ok) {
                return response.json().then(data => {
                    console.log('Sucesso:', data);
                    window.location.href = 'passwordResetFinish.html';
                });
            }
            else {
                return response.text().then(text => {
                    console.error('Erro do servidor (status ' + response.status + '):', text);
                    try {
                        const errorData = JSON.parse(text);
                        msg.innerHTML = errorData.message ||
                            (errorData.password?.[0] || errorData.token?.[0] ||
                            'Erro: ' + response.status + ' - ' + response.statusText);
                    } catch(e) {
                        msg.innerHTML = 'Erro do servidor (status ' + response.status + '). Verifique o console para detalhes.';
                    }
                });
            }
        })
        .catch(erro => {
            console.error('Erro de conexão:', erro);
            msg.innerHTML = 'Erro de conexão: ' + erro.message;
        })
    })
}


