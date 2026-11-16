
/* ===== PREFERENCIAS DA CONTA NESTE NAVEGADOR ===== */
const chaveConta = "configHashi-" + sessaoHashi?.tipo + "-" + (sessaoHashi?.email || sessaoHashi?.nome);
let dadosConta = {};
try {
    dadosConta = JSON.parse(localStorage.getItem(chaveConta)) || {};
} catch {
    dadosConta = {};
}
const feedbackConta = document.querySelector("[data-feedback]");
function salvarConta() {
    try {
        localStorage.setItem(chaveConta, JSON.stringify(dadosConta));
        feedbackConta.textContent = "Alterações salvas neste navegador.";
        return true;
    } catch {
        feedbackConta.textContent = "Não foi possível salvar. Verifique o armazenamento do navegador.";
        return false;
    }
}
function mostrarAbaConta() {
    const abas = Array.from(document.querySelectorAll("[data-aba]"));
    const atual = abas.find(aba => aba.hash === location.hash) || abas[0];
    abas.forEach(aba => {
        if (aba === atual) aba.setAttribute("aria-current", "page");
        else aba.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-painel]").forEach(painel => {
        painel.hidden = painel.dataset.painel !== atual.dataset.aba;
    });
    document.querySelector("[data-caminho]").textContent = atual.textContent.replace("›", "").trim();
}
window.addEventListener("hashchange", mostrarAbaConta);
mostrarAbaConta();
document.querySelectorAll("[data-form]").forEach(form => {
    const valores = dadosConta[form.dataset.form] || {};
    form.querySelectorAll("input").forEach(input => {
        const valor = valores[input.name];
        if (input.type === "checkbox") input.checked = valor === true;
        else if (input.type === "radio") {
            if (valor) input.checked = input.value === valor;
        } else input.value = valor || sessaoHashi?.[input.name] || "";
    });
    form.addEventListener("submit", event => {
        event.preventDefault();
        const valores = Object.fromEntries(new FormData(form));
        form.querySelectorAll('[type="checkbox"]').forEach(input => valores[input.name] = input.checked);
        dadosConta[form.dataset.form] = valores;
        const salvo = salvarConta();
        const status = form.querySelector("[data-status-form]");
        if (status) status.textContent = salvo ? "Dados atualizados." : "Não foi possível salvar.";
        if (valores.nome) document.querySelector("[data-nome-conta]").textContent = valores.nome;
    });
});
const formEndereco = document.getElementById("form-endereco");
["apelido", "rua", "cidade"].forEach(nome => formEndereco.elements[nome].required = true);
function mostrarEnderecos() {
    const lista = document.querySelector("[data-enderecos]");
    lista.replaceChildren();
    if (!dadosConta.enderecos?.length) {
        const vazio = document.createElement("p");
        vazio.className = "conta-vazio";
        vazio.textContent = "Seus endereços aparecerão aqui. Adicione o primeiro abaixo.";
        lista.append(vazio);
    }
    (dadosConta.enderecos || []).forEach((endereco, indice) => {
        const card = document.createElement("article");
        card.className = "conta-card";
        const titulo = document.createElement("h2");
        titulo.textContent = endereco.apelido + (indice === 0 ? " - Padrao" : "");
        const texto = document.createElement("p");
        texto.textContent = [endereco.rua, endereco.bairro, endereco.cidade, endereco.cep, endereco.complemento].filter(Boolean).join(", ");
        card.append(titulo, texto);
        ["Editar", "Remover", "Usar como padrao"].forEach(acao => {
            const botao = document.createElement("button");
            botao.className = "conta-secundario";
            botao.textContent = acao;
            botao.addEventListener("click", () => {
                if (acao === "Editar") {
                    Object.entries(endereco).forEach(([nome, valor]) => formEndereco.elements[nome].value = valor);
                    formEndereco.dataset.indice = indice;
                    formEndereco.elements.apelido.focus();
                    return;
                }
                dadosConta.enderecos.splice(indice, 1);
                if (acao === "Usar como padrao") dadosConta.enderecos.unshift(endereco);
                delete formEndereco.dataset.indice;
                formEndereco.reset();
                salvarConta();
                mostrarEnderecos();
            });
            card.append(botao);
        });
        lista.append(card);
    });
}
formEndereco.addEventListener("submit", event => {
    event.preventDefault();
    dadosConta.enderecos ||= [];
    const endereco = Object.fromEntries(new FormData(formEndereco));
    if (formEndereco.dataset.indice !== undefined) dadosConta.enderecos[Number(formEndereco.dataset.indice)] = endereco;
    else dadosConta.enderecos.push(endereco);
    delete formEndereco.dataset.indice;
    formEndereco.reset();
    salvarConta();
    mostrarEnderecos();
});
mostrarEnderecos();
document.querySelector("[data-encerrar]").addEventListener("click", () => document.querySelector("[data-sair-conta]").click());


/* ===== CARTOES DE DEMONSTRACAO: SOMENTE FINAL E IDENTIFICACAO ===== */
const dialogoCartao = document.getElementById("dialogo-cartao");
const formCartao = document.getElementById("form-cartao");
const listaCartoes = document.querySelector("[data-cartoes]");
let cartaoEmEdicao = null;
if (!Array.isArray(dadosConta.cartoes)) dadosConta.cartoes = [];

function validadeCartao(valor) {
    const [ano, mes] = valor.split("-");
    return mes + "/" + ano.slice(-2);
}

function atualizarPreviewCartao() {
    dialogoCartao.querySelector("[data-preview-bandeira]").textContent = formCartao.elements.bandeira.value;
    dialogoCartao.querySelector("[data-preview-final]").textContent = formCartao.elements.final.value || "0000";
    dialogoCartao.querySelector("[data-preview-apelido]").textContent = formCartao.elements.apelido.value || "Meu cartão";
    const validade = formCartao.elements.validade.value;
    dialogoCartao.querySelector("[data-preview-validade]").textContent = validade ? validadeCartao(validade) : "MM/AA";
}

function abrirCartao(indice = null) {
    cartaoEmEdicao = indice;
    formCartao.reset();
    formCartao.elements.validade.min = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0");
    document.getElementById("titulo-cartao").textContent = indice === null ? "Adicionar cartão" : "Editar cartão";
    if (indice !== null) {
        const cartao = dadosConta.cartoes[indice];
        ["apelido", "bandeira", "final", "validade"].forEach(nome => {
            formCartao.elements[nome].value = cartao[nome];
        });
    }
    formCartao.elements.principal.checked = indice === 0 || dadosConta.cartoes.length === 0;
    formCartao.elements.principal.disabled = indice === 0 || dadosConta.cartoes.length === 0;
    atualizarPreviewCartao();
    dialogoCartao.showModal();
    formCartao.elements.apelido.focus();
}

function mostrarCartoes() {
    listaCartoes.replaceChildren();
    if (!dadosConta.cartoes.length) {
        const vazio = document.createElement("p");
        vazio.className = "conta-vazio";
        vazio.textContent = "Sua carteira está vazia. Adicione um cartão para organizar suas preferências.";
        listaCartoes.append(vazio);
    }
    dadosConta.cartoes.forEach((cartao, indice) => {
        const item = document.createElement("article");
        item.className = "conta-cartao-salvo";
        const bandeira = document.createElement("strong");
        bandeira.className = "conta-bandeira";
        bandeira.textContent = cartao.bandeira;
        const info = document.createElement("div");
        const nome = document.createElement("h3");
        nome.textContent = cartao.apelido;
        const numero = document.createElement("p");
        numero.textContent = "•••• " + cartao.final + "  ·  Validade " + validadeCartao(cartao.validade);
        info.append(nome, numero);
        if (indice === 0) {
            const selo = document.createElement("span");
            selo.className = "conta-selo";
            selo.textContent = "Principal";
            info.append(selo);
        }
        const acoes = document.createElement("div");
        acoes.className = "conta-cartao-acoes";
        const opcoes = indice === 0 ? ["Editar", "Remover"] : ["Editar", "Tornar principal", "Remover"];
        opcoes.forEach(acao => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "conta-secundario";
            botao.textContent = acao;
            botao.setAttribute("aria-label", acao + " " + cartao.apelido);
            botao.addEventListener("click", () => {
                if (acao === "Editar") {
                    abrirCartao(indice);
                    return;
                }
                const anteriores = [...dadosConta.cartoes];
                dadosConta.cartoes.splice(indice, 1);
                if (acao === "Tornar principal") dadosConta.cartoes.unshift(cartao);
                if (!salvarConta()) dadosConta.cartoes = anteriores;
                mostrarCartoes();
            });
            acoes.append(botao);
        });
        item.append(bandeira, info, acoes);
        listaCartoes.append(item);
    });
}

document.querySelector("[data-adicionar-cartao]").addEventListener("click", () => abrirCartao());
document.querySelectorAll("[data-fechar-cartao]").forEach(botao => {
    botao.addEventListener("click", () => dialogoCartao.close());
});
formCartao.addEventListener("input", atualizarPreviewCartao);
formCartao.addEventListener("submit", event => {
    event.preventDefault();
    const cartao = {
        apelido: formCartao.elements.apelido.value.trim(),
        bandeira: formCartao.elements.bandeira.value,
        final: formCartao.elements.final.value,
        validade: formCartao.elements.validade.value
    };
    if (!cartao.apelido) {
        formCartao.elements.apelido.focus();
        return;
    }
    const anteriores = [...dadosConta.cartoes];
    if (cartaoEmEdicao !== null) dadosConta.cartoes.splice(cartaoEmEdicao, 1, cartao);
    else dadosConta.cartoes.push(cartao);
    if (formCartao.elements.principal.checked) {
        dadosConta.cartoes = [cartao, ...dadosConta.cartoes.filter(item => item !== cartao)];
    }
    if (!salvarConta()) {
        dadosConta.cartoes = anteriores;
        dialogoCartao.close();
        return;
    }
    mostrarCartoes();
    dialogoCartao.close();
    formCartao.reset();
});
const nomeSalvo = dadosConta["Dados pessoais"]?.nome || sessaoHashi?.nome || "Minha conta";
document.querySelector("[data-nome-conta]").textContent = nomeSalvo;
document.querySelector(".conta-avatar").textContent = nomeSalvo.trim().slice(0, 1).toUpperCase();
mostrarCartoes();
