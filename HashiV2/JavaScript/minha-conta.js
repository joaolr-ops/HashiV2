const abrirLogin = document.getElementById("abrir-login");
const loginOverlay = document.getElementById("flex-login");

const cadastroOverlay = document.querySelector(".fundo-cadastro");
const cadastro2Overlay = document.querySelector(".fundo-cadastro2");

const abrirCadastro = document.getElementById("abrir-cadastro");
const fecharCadastro = document.querySelector(".fechar-cadastro");
const fecharCadastro2 = document.querySelector(".fechar-cadastro2");


const voltarParaLogin = document.getElementById("voltar-login");
const voltarParaLogin2 = document.getElementById("voltar-login2");



const telaSelecao = document.getElementById("tela-selecao");

if (telaSelecao) {
    const cadastroLoja = document.getElementById("cadastro-loja");
    const cadastrosPorPerfil = {
        cliente: cadastroOverlay,
        entregador: cadastro2Overlay,
        loja: cadastroLoja
    };

    telaSelecao.querySelector(".selecao-continuar").addEventListener("click", function () {
        const perfil = telaSelecao.querySelector("input[name='perfil']:checked").value;
        const cadastro = cadastrosPorPerfil[perfil];

        telaSelecao.close();
        if (cadastro === cadastroLoja) {
            cadastroLoja.showModal();
        } else {
            cadastro.style.display = "flex";
        }
        cadastro.querySelector("input").focus();
    });

    document.querySelectorAll("[data-voltar-selecao]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const cadastro = botao.closest(".fundo-cadastro, .fundo-cadastro2, .cadastro-loja");
            if (cadastro === cadastroLoja) {
                cadastroLoja.close();
            } else {
                cadastro.style.display = "none";
            }
            telaSelecao.show();
            telaSelecao.querySelector("input[name='perfil']:checked").focus();
        });
    });

    document.getElementById("selecao-voltar-login").addEventListener("click", function () {
        telaSelecao.close();
        loginOverlay.style.display = "flex";
        document.getElementById("email").focus();
    });
}


// ABRIR / FECHAR MODAL DE LOGIN

if (abrirLogin) {
    abrirLogin.addEventListener("click", function (event) {
        event.preventDefault();
        if (telaSelecao?.open) {
            telaSelecao.close();
        }
        loginOverlay.style.display = "flex";
    });
}

if (loginOverlay) {
    loginOverlay.addEventListener("click", function (event) {
        if (event.target === loginOverlay) {
            loginOverlay.style.display = "none";
        }
    });
}


// RECUPERAÇÃO DE SENHA

const dialogoRecuperacao = document.getElementById("recuperar-senha");

if (dialogoRecuperacao && loginOverlay) {
    const abrirRecuperacao = loginOverlay.querySelector(".Senha-Esq");
    const formularioRecuperacao = dialogoRecuperacao.querySelector(".recuperar-form");
    const campoRecuperacao = document.getElementById("recuperar-email");
    const statusRecuperacao = dialogoRecuperacao.querySelector(".recuperar-status");

    abrirRecuperacao.addEventListener("click", function (event) {
        event.preventDefault();
        campoRecuperacao.value = document.getElementById("email").value.trim();
        statusRecuperacao.textContent = "";
        loginOverlay.style.display = "none";
        dialogoRecuperacao.showModal();
    });

    dialogoRecuperacao.querySelectorAll("[data-fechar-recuperacao]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            dialogoRecuperacao.close();
        });
    });

    dialogoRecuperacao.addEventListener("close", function () {
        loginOverlay.style.display = "flex";
        abrirRecuperacao.focus();
    });

    formularioRecuperacao.addEventListener("submit", function (event) {
        event.preventDefault();
        statusRecuperacao.textContent = "O envio de links de recuperação por e-mail ainda não está disponível neste protótipo.";
    });

    campoRecuperacao.addEventListener("input", function () {
        statusRecuperacao.textContent = "";
    });
}


// ABRIR CADASTRO (a partir do link "Cadastrar-se" no login)

if (abrirCadastro) {
    abrirCadastro.addEventListener("click", function (event) {
        event.preventDefault();
        loginOverlay.style.display = "none";
        if (telaSelecao) {
            telaSelecao.show();
            telaSelecao.querySelector("input[name='perfil']:checked").focus();
        } else {
            cadastroOverlay.style.display = "flex";
        }
    });
}


// FECHAR TELAS DE CADASTRO (botão X e clique fora)

if (fecharCadastro) {
    fecharCadastro.addEventListener("click", function () {
        cadastroOverlay.style.display = "none";
    });
}

if (cadastroOverlay) {
    cadastroOverlay.addEventListener("click", function (event) {
        if (event.target === cadastroOverlay) {
            cadastroOverlay.style.display = "none";
        }
    });
}

if (fecharCadastro2) {
    fecharCadastro2.addEventListener("click", function () {
        cadastro2Overlay.style.display = "none";
    });
}

if (cadastro2Overlay) {
    cadastro2Overlay.addEventListener("click", function (event) {
        if (event.target === cadastro2Overlay) {
            cadastro2Overlay.style.display = "none";
        }
    });
}


// VOLTAR PARA O LOGIN (link "Já tem uma conta? Entrar")

if (voltarParaLogin) {
    voltarParaLogin.addEventListener("click", function (event) {
        event.preventDefault();
        cadastroOverlay.style.display = "none";
        loginOverlay.style.display = "flex";
    });
}

if (voltarParaLogin2) {
    voltarParaLogin2.addEventListener("click", function (event) {
        event.preventDefault();
        cadastro2Overlay.style.display = "none";
        loginOverlay.style.display = "flex";
    });
}


// ALTERNAR ENTRE CADASTRO DE CLIENTE E DE ENTREGADOR


function selecionarTipo(botaoClicado) {
    if (botaoClicado.classList.contains("entregador-button")) {
        cadastroOverlay.style.display = "none";
        cadastro2Overlay.style.display = "flex";
    }
    
}

function selecionarTipo2(botaoClicado) {
    if (botaoClicado.classList.contains("cliente-button2")) {
        cadastro2Overlay.style.display = "none";
        cadastroOverlay.style.display = "flex";
    }
    
}


// MOSTRAR / OCULTAR SENHA

function alternarSenha() {
    const campo = document.getElementById("campo-senha");
    const icone = document.getElementById("icone-olho");
    if (campo.type === "password") {
        campo.type = "text";
        icone.innerHTML = '<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 004.24 4.24"/><path d="M6.7 6.7C4.3 8.2 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M17.3 17.3C19.7 15.8 22 12 22 12s-1.2-2.4-3.3-4.3"/>';
    } else {
        campo.type = "password";
        icone.innerHTML = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>';
    }
}

function alternarSenha2() {
    const campo = document.getElementById("campo-senha-2");
    const icone = document.getElementById("icone-olho-2");
    if (campo.type === "password") {
        campo.type = "text";
        icone.innerHTML = '<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 004.24 4.24"/><path d="M6.7 6.7C4.3 8.2 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M17.3 17.3C19.7 15.8 22 12 22 12s-1.2-2.4-3.3-4.3"/>';
    } else {
        campo.type = "password";
        icone.innerHTML = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>';
    }
}


// "BANCO DE DADOS" FALSO (localStorage)


function pegarUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosHashi")) || [];
}

function salvarUsuarios(lista) {
    localStorage.setItem("usuariosHashi", JSON.stringify(lista));
}

function emailJaExiste(email) {
    return pegarUsuarios().some(u => u.email.toLowerCase() === email.toLowerCase());
}


// CONTAS DE DEMONSTRAÇÃO
// Login no prototipo: cliente@hashi.com, entregador@hashi.com ou loja@hashi.com.
// Senha das tres contas de teste: 123456.

function seedContasDemo() {
    const usuarios = pegarUsuarios();

    const temCliente = usuarios.some(u => u.email === "cliente@hashi.com");
    const temEntregador = usuarios.some(u => u.email === "entregador@hashi.com");

    if (!temCliente) {
        usuarios.push({
            nome: "Cliente Demo",
            email: "cliente@hashi.com",
            telefone: "(34) 99999-0001",
            senha: "123456",
            tipo: "cliente"
        });
    }

    if (!temEntregador) {
        usuarios.push({
            nome: "Entregador Demo",
            email: "entregador@hashi.com",
            telefone: "(34) 99999-0002",
            cpf: "000.000.000-00",
            veiculo: "Moto",
            senha: "123456",
            tipo: "entregador"
        });
    }

    if (!usuarios.some(u => u.email === "loja@hashi.com")) {
        usuarios.push({
            nome: "Loja Demo",
            email: "loja@hashi.com",
            senha: "123456",
            tipo: "loja"
        });
    }

    salvarUsuarios(usuarios);
}

seedContasDemo();


// CADASTRO - CLIENTE

const formCadastroCliente = document.querySelector(".fundo-cadastro .cadastro");
const btnCadastrarCliente = formCadastroCliente ? formCadastroCliente.querySelector(".btn-cadastrar") : null;

if (btnCadastrarCliente) {
    btnCadastrarCliente.addEventListener("click", function (event) {
        event.preventDefault();

        const campos = formCadastroCliente.querySelectorAll(".Caixa input");
        const nome = campos[0].value.trim();
        const email = campos[1].value.trim();
        const telefone = campos[2].value.trim();
        const campoEndereco = formCadastroCliente.querySelector("#cliente-endereco");
        const endereco = campoEndereco?.value.trim();
        const senha = document.getElementById("campo-senha").value;
        const aceitouTermos = formCadastroCliente.querySelector(".termos input[type='checkbox']").checked;

        if (!nome || !email || !telefone || !senha || (campoEndereco && !endereco)) {
            alert("Preencha todos os campos antes de continuar.");
            return;
        }

        if (!aceitouTermos) {
            alert("Você precisa aceitar os Termos de Uso.");
            return;
        }

        if (emailJaExiste(email)) {
            alert("Já existe uma conta cadastrada com esse e-mail.");
            return;
        }

        const usuarios = pegarUsuarios();
        usuarios.push({ nome, email, telefone, endereco, senha, tipo: "cliente" });
        salvarUsuarios(usuarios);

        alert("Conta de Cliente criada com sucesso! Faça login para continuar.");
        cadastroOverlay.style.display = "none";
        loginOverlay.style.display = "flex";
    });
}


// CADASTRO - ENTREGADOR

const formCadastroEntregador = document.querySelector(".fundo-cadastro2 .cadastro2");
const btnCadastrarEntregador = formCadastroEntregador ? formCadastroEntregador.querySelector(".btn-cadastrar2") : null;

if (btnCadastrarEntregador) {
    btnCadastrarEntregador.addEventListener("click", function (event) {
        event.preventDefault();

        const campos = formCadastroEntregador.querySelectorAll(".Caixa2 input");
        const nome = campos[0].value.trim();
        const email = campos[1].value.trim();
        const telefone = campos[2].value.trim();
        const cpf = campos[3].value.trim();
        const veiculo = campos[4].value.trim();
        const senha = document.getElementById("campo-senha-2").value;
        const aceitouTermos = formCadastroEntregador.querySelector(".termos2 input[type='checkbox']").checked;

        if (!nome || !email || !telefone || !cpf || !veiculo || !senha) {
            alert("Preencha todos os campos antes de continuar.");
            return;
        }

        if (!aceitouTermos) {
            alert("Você precisa aceitar os Termos de Uso.");
            return;
        }

        if (emailJaExiste(email)) {
            alert("Já existe uma conta cadastrada com esse e-mail.");
            return;
        }

        const usuarios = pegarUsuarios();
        usuarios.push({ nome, email, telefone, cpf, veiculo, senha, tipo: "entregador" });
        salvarUsuarios(usuarios);

        alert("Conta de Entregador criada com sucesso! Faça login para continuar.");
        cadastro2Overlay.style.display = "none";
        loginOverlay.style.display = "flex";
    });
}


// LOGIN - verifica e redireciona conforme o tipo da conta

const btnEntrar = document.getElementById("btn-entrar");

if (btnEntrar) {
    btnEntrar.addEventListener("click", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        if (!email || !senha) {
            alert("Preencha e-mail e senha.");
            return;
        }

        const usuario = pegarUsuarios().find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
        );

        if (!usuario) {
            alert("E-mail ou senha incorretos.");
            return;
        }

        // guarda quem está logado, pra ser lido na página de painel
        const { nome, tipo } = usuario;
        localStorage.setItem("usuarioLogadoHashi", JSON.stringify({ nome, tipo, email: usuario.email }));

        window.location.href = destinoPerfilHashi(tipo);
    });
}