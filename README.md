# Receitinhas da Vovó
## Segundo trabalho de Programação para a Web (INF1407) - 2025.2
## FRONTEND

![Contributors](https://img.shields.io/github/contributors/livlutz/INF1407-T1)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript)
![JavaScript](https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=plastic&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/css-%231572B6.svg?style=plastic&logo=css3&logoColor=white)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=plastic&logo=gnu-bash&logoColor=white)

## 👥 Membros da Dupla

| Nome | Matrícula |
|------|-----------|
| **Lívia Lutz dos Santos** | 2211055 |
| **Luiza Marcondes Paes Leme** | 2210275 |

---

## Escopo do Projeto

Receitinhas da Vovó é uma plataforma web completa para compartilhamento de receitas culinárias, desenvolvida com Django, TypeScript/JavaScript e Swagger. O projeto implementa um sistema de gerenciamento de usuários e receitas. Para esse trabalho, o frontend e o backend estão em repositórios separados.

## Backend

Disponível no repositório: https://github.com/livlutz/INF1407-T2-backend

### 🌟 O que funcionou

#### Sistema de Usuários
- ✅ Cadastro de usuários 
- ✅ Sistema de login e logout
- ✅ Perfil personalizado com foto de perfil
- ✅ Edição de dados pessoais
- ✅ Exclusão de conta com confirmação

#### Gerenciamento de Receitas
- ✅ Criação de receitas
- ✅ Controle de visibilidade (público/privado)
- ✅ Edição de receitas
- ✅ Exclusão de receitas com confirmação
- ✅ Visualização detalhada de receitas

#### Interface e Experiência
- ✅ Navegação intuitiva entre páginas (Nav-bar com autenticação)
- ✅ Formulários com validação
- ✅ Feedback visual para ações do usuário

---

## O que não funcionou

- Conforme as especificações do trabalho no enunciado, não houve nenhuma funcionalidade que testamos e não funcionou.

---

## 🧪 Testes

### Testes Funcionais de Autenticação

#### 1. Cadastro de Usuário
- [ ] Cadastrar novo usuário com todos os campos obrigatórios
- [ ] Tentar cadastrar com email já existente (deve mostrar erro)
- [✅] Cadastrar com e sem foto de perfil
- [ ] Verificar validação de campos obrigatórios (deixar campos em branco)
- [ ] Testar formato de email inválido

#### 2. Login e Logout
- [✅] Fazer login com credenciais válidas
- [] Tentar login com credenciais inválidas (deve mostrar erro)
- [✅] Verificar se o token é armazenado no localStorage após login
- [ ] Fazer logout e verificar se o token é removido
- [✅] Verificar se a navegação muda após login (navbar com opções do usuário)
- [ ] Tentar acessar páginas protegidas sem estar logado

#### 3. Gerenciamento de Perfil
- [✅] Visualizar perfil próprio com dados corretos
- [✅] Editar informações do perfil (nome, email, foto)
- [✅] Trocar senha com sucesso
- [✅] Recuperar senha com sucesso
- [ ] Tentar trocar senha com senha antiga incorreta
- [✅] Deletar conta e verificar se usuário é removido do sistema

### Testes Funcionais de Receitas

#### 4. Visualização de Receitas
- [✅] Acessar homepage sem login e ver apenas receitas públicas
- [✅] Acessar homepage logado e ver receitas públicas + próprias privadas
- [✅] Clicar em uma receita e visualizar todos os detalhes
- [✅] Verificar se imagens de receitas carregam corretamente
- [✅] Verificar se placeholder aparece quando não há imagem

#### 5. Criação de Receitas
- [ ] Criar receita pública com todos os campos preenchidos
- [✅] Criar receita privada
- [✅] Criar receita com foto
- [✅] Criar receita sem foto
- [ ] Verificar validação de campos obrigatórios
- [✅] Verificar se receita pública aparece na homepage
- [ ] Verificar se receita privada NÃO aparece na homepage para outros usuários

#### 6. Edição de Receitas
- [ ] Editar receita própria (título, ingredientes, modo de preparo)
- [ ] Mudar visibilidade de pública para privada e vice-versa
- [ ] Adicionar/trocar foto da receita
- [ ] Tentar editar receita de outro usuário (não deve permitir)
- [ ] Verificar se mudanças são refletidas na visualização

#### 7. Exclusão de Receitas
- [ ] Deletar receita própria
- [ ] Verificar confirmação antes de deletar
- [ ] Verificar se receita é removida da homepage
- [ ] Verificar se receita é removida do perfil
- [ ] Tentar deletar receita de outro usuário (não deve permitir)

### Testes de Interface e Usabilidade

#### 8. Navegação
- [✅] Testar todos os links da navbar
- [ ] Verificar breadcrumbs e navegação entre páginas
- [✅] Testar botão "voltar" do navegador
- [✅] Verificar se redirecionamentos funcionam corretamente

#### 9. Responsividade
- [✅] Testar em desktop (1920x1080)
- [ ] Testar em tablet (768px)
- [ ] Testar em mobile (375px)
- [ ] Verificar se imagens se adaptam ao tamanho da tela
- [ ] Verificar se navbar é responsiva

#### 10. Validação de Formulários
- [ ] Verificar mensagens de erro em todos os formulários
- [ ] Testar campos com valores extremos (textos muito longos)
- [ ] Verificar feedback visual ao submeter formulários
- [ ] Testar upload de arquivos (formatos válidos e inválidos)

### Testes de Integração Backend-Frontend

#### 11. Comunicação com API
- [ ] Verificar no console do navegador se as requisições são feitas corretamente
- [ ] Verificar tratamento de erros HTTP (404, 500, etc)
- [ ] Testar timeout de requisições
- [ ] Verificar se token de autenticação é enviado nos headers
- [ ] Verificar URLs das requisições (devem estar corretas)

#### 12. Persistência de Dados
- [✅] Criar receita e verificar se persiste após refresh
- [✅] Editar perfil e verificar se mudanças persistem
- [✅] Fazer logout e login novamente, verificar se dados estão corretos
- [ ] Testar múltiplas sessões (abas diferentes do navegador)

### Testes de Segurança Básicos

#### 13. Controle de Acesso
- [ ] Verificar se receitas privadas não são acessíveis por outros usuários
- [ ] Tentar acessar URLs de páginas protegidas sem login
- [ ] Verificar se apenas o autor pode editar/deletar suas receitas


## 🚀 Instalação e Configuração Local

### Instalação Automática

Em um primeiro terminal, rodar:

```bash
./runts.sh
```

Em um segundo terminal, sem fechar o primerio, rodar:

```bash
./run.sh
```

### Conexão com back

Após abrir a porta do frontend, ir na aba Portas, mudar a visibilidade para pública e abrir o link do site no navegador. 

Incluir endereço do backend no backendAddress do constantes.ts se for rodar em um codespace próprio.

Para popular o site e ativar as funcionalidades, configure tudo no repositório do backend.

## 📚 Manual do Usuário

### 🏠 Página Inicial
A página inicial apresenta todas as receitas públicas disponíveis e botões de homepage, login e cadastro.

### 👤 Sistema de Usuários

#### Cadastro de Novo Usuário
1. Clique em **"Cadastrar"** no menu superior
2. Preencha os campos obrigatórios
3. Opcionalmente, adicione uma foto de perfil
4. Clique em **"Cadastrar"** para criar a conta

#### Login
1. Clique em **"Login"** no menu superior
2. Insira seu email e senha
3. Clique em **"Login"** para acessar sua conta
4. Caso tenha esquecido sua senha ou errado sua senha, clique em **Esqueceu a senha?** (ainda não implementado)
5. Caso não tenha uma conta, clique em **Cadastre-se!** 

#### Gerenciamento de Perfil
- **Perfil**: Acesse através do menu superior após fazer login
- **Editar Dados**: Clique em "Atualizar Perfil" no seu perfil para modificar informações
- **Deletar Conta**: Clique em "Deletar Conta" para deletar sua conta com confirmação
- **Trocar senha**: Clique em "Trocar Senha" para trocar a senha da sua conta
- **Ver receitas**: Clique em "Minhas Receitas" para ver as receitas criadas pelo seu usuário, incluindo as privadas - Você pode clicar em cada receita para vê-la, editar ou excluir
- **Criar receitas**: Clique em "Criar Receita" para criar uma receita

### 🍳 Gerenciamento de Receitas

#### Criar Nova Receita
1. Faça login na sua conta
2. Clique em **"Criar Receita"**
3. Preencha todos os campos obrigatórios
4. Defina a visibilidade (Pública ou Privada)
5. Opcionalmente, adicione uma foto da receita
6. Clique em **"Salvar"** para publicar

#### Visualizar Receitas
- **Receitas Próprias**: Acesse através do seu perfil
- **Receitas Públicas**: Disponíveis na página inicial (incluindo as suas públicas)
- **Detalhes**: Clique em qualquer receita para ver informações completas

#### Editar Receitas
1. Acesse sua receita através do perfil ou a partir da homepage clicando em receitas cujo autor é o seu usuário
2. Clique no botão **"Editar"**
3. Modifique os campos desejados
4. Salve as alterações

#### Excluir Receitas
1. Acesse sua receita
2. Clique no botão **"Excluir"**
3. Confirme a exclusão (ação irreversível)

### 🔒 Controle de Privacidade
- **Receitas Públicas**: Visíveis para todos os usuários
- **Receitas Privadas**: Visíveis apenas para o autor
