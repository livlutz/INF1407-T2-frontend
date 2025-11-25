"use strict";
onload = (evento) => {
    document.getElementById('recuperaSenha').addEventListener('click', (evento) => {
        evento.preventDefault();
        const email = document.getElementById('email').value;
        fetch(backendAddress + 'accounts/password_reset/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ 'email': email })
        })
            .then(response => {
            if (response.ok) {
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
                document.getElementById('msg').innerHTML =
                    'Se o email existir em nosso sistema, as instruções de reset foram geradas.';
                return;
            }
            // Hide the form
            document.getElementById('resetForm').style.display = 'none';
            // Show the token message
            const tokenMessage = document.getElementById('tokenMessage');
            tokenMessage.style.display = 'block';
            // Display the username and token
            const username = email.split('@')[0]; // Extract username from email
            document.getElementById('username').textContent = username;
            document.getElementById('tokenValue').textContent = data.token;
            // Show the proceed button
            document.getElementById('proceedButton').style.display = 'block';
        })
            .catch(erro => {
            console.log(erro);
            document.getElementById('msg').innerHTML = erro.message;
        });
    });
    // Add event listener for proceed button
    document.getElementById('proceedButton').addEventListener('click', () => {
        window.location.assign('passwordResetDone.html');
    });
};
