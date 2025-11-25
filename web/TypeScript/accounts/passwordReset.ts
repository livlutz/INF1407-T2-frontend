onload = (evento) => {
    (document.getElementById('recuperaSenha') as HTMLButtonElement).addEventListener('click', (evento) => {
        evento.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;

        fetch(backendAddress + 'accounts/password_reset/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ 'email': email })
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            else {
                throw new Error('Erro: ' + response.status + ' ' + response.statusText);
            }
        })
        .then(data => {
            // Check if token was actually generated
            if (!data.token) {
                // Security response - email might not exist
                (document.getElementById('msg') as HTMLDivElement).innerHTML =
                    'Se o email existir em nosso sistema, as instruções de reset foram geradas.';
                return;
            }

            // Hide the form
            (document.getElementById('resetForm') as HTMLFormElement).style.display = 'none';

            // Show the token message
            const tokenMessage = document.getElementById('tokenMessage') as HTMLDivElement;
            tokenMessage.style.display = 'block';

            // Display the username and token
            const username = email.split('@')[0]; // Extract username from email
            (document.getElementById('username') as HTMLSpanElement).textContent = username;
            (document.getElementById('tokenValue') as HTMLSpanElement).textContent = data.token;

            // Show the proceed button
            (document.getElementById('proceedButton') as HTMLButtonElement).style.display = 'block';
        })
        .catch(erro => {
            console.log(erro);
            (document.getElementById('msg') as HTMLDivElement).innerHTML = erro.message;
        });
    });

    // Add event listener for proceed button
    (document.getElementById('proceedButton') as HTMLButtonElement).addEventListener('click', () => {
        window.location.assign('passwordResetDone.html');
    });
}