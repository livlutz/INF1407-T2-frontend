"use strict";
onload = () => {
    const form = document.getElementById('cadastroForm');
    const profilePicInput = document.getElementById('profilePic');
    const previewImage = document.getElementById('previewImage');
    const mensagemDiv = document.getElementById('mensagem');
    // Clear all error messages
    function clearErrors() {
        const errorDivs = document.querySelectorAll('.field-errors');
        errorDivs.forEach(div => {
            div.textContent = '';
        });
        mensagemDiv.textContent = '';
        mensagemDiv.style.display = 'none';
    }
    // Display field-specific errors
    function displayFieldErrors(errors) {
        clearErrors();
        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                const messages = errors[field];
                const errorDiv = document.getElementById(`${field}-errors`);
                if (errorDiv && Array.isArray(messages)) {
                    errorDiv.textContent = messages.join(', ');
                }
            }
        }
    }
    // Display general message
    function displayMessage(message, isError = true) {
        mensagemDiv.textContent = message;
        mensagemDiv.style.display = 'block';
        mensagemDiv.style.color = isError ? 'red' : 'green';
    }
    // Preview image when selected
    profilePicInput.addEventListener('change', (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                displayMessage('A imagem deve ter no máximo 5MB.');
                profilePicInput.value = '';
                previewImage.style.display = 'none';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                previewImage.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
        else {
            previewImage.style.display = 'none';
        }
    });
    // Handle form submission
    form.addEventListener('submit', (evento) => {
        var _a;
        evento.preventDefault();
        clearErrors();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;
        const profilePic = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
        // Client-side validation
        if (password1 !== password2) {
            displayMessage('As senhas não coincidem.');
            const errorDiv = document.getElementById('password2-errors');
            errorDiv.textContent = 'As senhas devem ser iguais.';
            return;
        }
        if (password1.length < 8) {
            displayMessage('A senha deve ter pelo menos 8 caracteres.');
            const errorDiv = document.getElementById('password1-errors');
            errorDiv.textContent = 'A senha deve ter pelo menos 8 caracteres.';
            return;
        }
        // Create JSON payload
        const payload = {
            username: username,
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password1,
            password_confirm: password2,
            foto_de_perfil: null
        };
        // If there's a profile pic, convert to base64
        if (profilePic) {
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                payload.foto_de_perfil = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                sendRequest(payload);
            };
            reader.readAsDataURL(profilePic);
        }
        else {
            sendRequest(payload);
        }
    });
    function sendRequest(payload) {
        fetch(backendAddress + 'usuarios/cadastro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(data => {
                    throw { status: response.status, data: data };
                });
            }
        })
            .then((data) => {
            displayMessage('Cadastro realizado com sucesso! Redirecionando...', false);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.replace('login.html');
            }, 2000);
        })
            .catch(erro => {
            var _a, _b;
            console.log('Erro no cadastro:', erro);
            // Display field-specific errors if available
            if (erro.data) {
                displayFieldErrors(erro.data);
            }
            // Display general error message
            const errorMessage = ((_a = erro.data) === null || _a === void 0 ? void 0 : _a.message) || ((_b = erro.data) === null || _b === void 0 ? void 0 : _b.error) || 'Erro ao realizar cadastro. Tente novamente.';
            displayMessage(errorMessage);
        });
    }
};
