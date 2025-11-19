onload = () => {
    const form = document.getElementById('cadastroForm') as HTMLFormElement;
    const profilePicInput = document.getElementById('profilePic') as HTMLInputElement;
    const previewImage = document.getElementById('previewImage') as HTMLImageElement;
    const mensagemDiv = document.getElementById('mensagem') as HTMLParagraphElement;

    // Clear all error messages
    function clearErrors(): void {
        const errorDivs = document.querySelectorAll('.field-errors');
        errorDivs.forEach(div => {
            (div as HTMLDivElement).textContent = '';
        });
        mensagemDiv.textContent = '';
        mensagemDiv.style.display = 'none';
    }

    // Display field-specific errors
    function displayFieldErrors(errors: any): void {
        clearErrors();

        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                const messages = errors[field];
                const errorDiv = document.getElementById(`${field}-errors`) as HTMLDivElement;
                if (errorDiv && Array.isArray(messages)) {
                    errorDiv.textContent = messages.join(', ');
                }
            }
        }
    }

    // Display general message
    function displayMessage(message: string, isError: boolean = true): void {
        mensagemDiv.textContent = message;
        mensagemDiv.style.display = 'block';
        mensagemDiv.style.color = isError ? 'red' : 'green';
    }

    // Preview image when selected
    profilePicInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
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
                previewImage.src = e.target?.result as string;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        clearErrors();

        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const firstName = (document.getElementById('first_name') as HTMLInputElement).value;
        const lastName = (document.getElementById('last_name') as HTMLInputElement).value;
        const password1 = (document.getElementById('password1') as HTMLInputElement).value;
        const password2 = (document.getElementById('password2') as HTMLInputElement).value;
        const profilePic = profilePicInput.files?.[0];

        // Client-side validation
        if (password1 !== password2) {
            displayMessage('As senhas não coincidem.');
            const errorDiv = document.getElementById('password2-errors') as HTMLDivElement;
            errorDiv.textContent = 'As senhas devem ser iguais.';
            return;
        }

        if (password1.length < 8) {
            displayMessage('A senha deve ter pelo menos 8 caracteres.');
            const errorDiv = document.getElementById('password1-errors') as HTMLDivElement;
            errorDiv.textContent = 'A senha deve ter pelo menos 8 caracteres.';
            return;
        }

        // Create JSON payload
        const payload: any = {
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
                payload.foto_de_perfil = e.target?.result as string;
                sendRequest(payload);
            };
            reader.readAsDataURL(profilePic);
        } else {
            sendRequest(payload);
        }
    });

    function sendRequest(payload: any): void {
        fetch(backendAddress + 'usuarios/cadastro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then((response: Response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(data => {
                    throw { status: response.status, data: data };
                });
            }
        })
        .then((data: any) => {
            displayMessage('Cadastro realizado com sucesso! Redirecionando...', false);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.replace('login.html');
            }, 2000);
        })
        .catch(erro => {
            console.log('Erro no cadastro:', erro);

            // Display field-specific errors if available
            if (erro.data) {
                displayFieldErrors(erro.data);
            }

            // Display general error message
            const errorMessage = erro.data?.message || erro.data?.error || 'Erro ao realizar cadastro. Tente novamente.';
            displayMessage(errorMessage);
        });
    }
};