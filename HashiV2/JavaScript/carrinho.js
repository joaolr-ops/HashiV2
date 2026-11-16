const produtosCarrinho = {
    "1": {
        "nome": "Combo especial",
        "descricao": "30 peças variadas",
        "preco": 9999,
        "imagem": "Prato-Sushi-principal.png"
    },
    "2": {
        "nome": "Sushi de salmão",
        "descricao": "8 peças de salmão",
        "preco": 3490,
        "imagem": "Mini-sushi.png"
    },
    "3": {
        "nome": "Temaki de salmão",
        "descricao": "Salmão, arroz e cebolinha",
        "preco": 3690,
        "imagem": "Mini-sushi.png"
    },
    "4": {
        "nome": "Hot roll crocante",
        "descricao": "10 peças com cream cheese",
        "preco": 3290,
        "imagem": "Mini-sushi.png"
    },
    "5": {
        "nome": "Combo clássico",
        "descricao": "20 peças selecionadas",
        "preco": 6990,
        "imagem": "Mini-sushi.png"
    },
    "6": {
        "nome": "Uramaki Philadelphia",
        "descricao": "8 peças com salmão e cream cheese",
        "preco": 2990,
        "imagem": "Mini-sushi.png"
    },
    "7": {
        "nome": "Mochi de morango",
        "descricao": "2 unidades",
        "preco": 1890,
        "imagem": "Mini-sushi.png"
    }
};

// Cada conta possui seus proprios itens, cupom e produtos salvos.
let identidadeCarrinho = sessaoHashi?.email;
if (sessaoHashi && !identidadeCarrinho) {
    try {
        const usuarios = JSON.parse(localStorage.getItem("usuariosHashi")) || [];
        const correspondentes = usuarios.filter(usuario => usuario.tipo === sessaoHashi.tipo && usuario.nome === sessaoHashi.nome);
        if (correspondentes.length === 1) identidadeCarrinho = correspondentes[0].email;
    } catch {
        identidadeCarrinho = null;
    }
}
const chaveCarrinho = sessaoHashi
    ? "carrinhoHashi-" + sessaoHashi.tipo + "-" + (identidadeCarrinho || sessaoHashi.nome)
    : "carrinhoHashi";
const chaveEnderecoCarrinho = chaveCarrinho + "-endereco";
const formatoCarrinho = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const raizCarrinho = new URL("../", document.currentScript.src);
const paginaCarrinho = document.querySelector("[data-pagina-carrinho]");
const limiteFreteGratis = 10000;
const taxaEntregaCarrinho = 890;

function lerCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem(chaveCarrinho)) || {};
        const validarItens = function (itens) {
            return Object.fromEntries(Object.entries(itens || {}).filter(function ([codigo, quantidade]) {
                return Object.hasOwn(produtosCarrinho, codigo) && Number.isInteger(quantidade) &&
                    quantidade > 0 && quantidade <= 99;
            }));
        };

        return {
            itens: validarItens(dados.itens),
            salvos: validarItens(dados.salvos),
            cupom: dados.cupom === "HASHI10" ? dados.cupom : ""
        };
    } catch {
        return { itens: {}, salvos: {}, cupom: "" };
    }
}

let estadoCarrinho = lerCarrinho();

function emReais(centavos) {
    return formatoCarrinho.format(centavos / 100);
}

function imagemCarrinho(produto) {
    return new URL("Img-pagina-inicial/" + produto.imagem, raizCarrinho).href;
}

function renderizarContadorCarrinho() {
    const quantidade = Object.values(estadoCarrinho.itens).reduce((total, item) => total + item, 0);
    document.querySelectorAll(".cart-icon-wrapper").forEach(function (link) {
        let contador = link.querySelector(".carrinho-contador");
        if (!contador) {
            contador = document.createElement("span");
            contador.className = "carrinho-contador";
            contador.setAttribute("aria-hidden", "true");
            link.append(contador);
        }

        contador.hidden = quantidade === 0;
        contador.textContent = quantidade;
        link.setAttribute("aria-label", quantidade > 0 ? "Carrinho: " + quantidade + " itens" : "Carrinho");
    });
}

function linhaCarrinho(codigo, quantidade, salvo) {
    const produto = produtosCarrinho[codigo];
    const acoes = salvo
        ? '<button class="carrinho-secundario" type="button" data-acao-carrinho="restaurar">Voltar ao carrinho</button>'
        : '<button class="carrinho-secundario" type="button" data-acao-carrinho="remover">Remover</button>' +
          '<button class="carrinho-secundario" type="button" data-acao-carrinho="salvar">Salvar para depois</button>';
    const controle = salvo ? "" : `
        <div class="carrinho-quantidade" aria-label="Quantidade">
            <button class="carrinho-secundario" type="button" data-acao-carrinho="menos" aria-label="Diminuir quantidade de ${produto.nome}">−</button>
            <span>${quantidade}</span>
            <button class="carrinho-secundario" type="button" data-acao-carrinho="mais" aria-label="Aumentar quantidade de ${produto.nome}">+</button>
        </div>`;

    return `
        <article class="carrinho-item" data-produto="${codigo}">
            <img src="${imagemCarrinho(produto)}" alt="">
            <div>
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="carrinho-item-acoes">${acoes}</div>
            </div>
            <div class="carrinho-item-valores">
                <strong>${emReais(produto.preco * quantidade)}</strong>
                ${controle}
            </div>
        </article>`;
}

function renderizarCarrinho() {
    renderizarContadorCarrinho();
    if (!paginaCarrinho) {
        return;
    }

    const itens = Object.entries(estadoCarrinho.itens);
    const salvos = Object.entries(estadoCarrinho.salvos);
    const subtotal = itens.reduce(function (total, [codigo, quantidade]) {
        return total + produtosCarrinho[codigo].preco * quantidade;
    }, 0);
    const freteGratis = subtotal >= limiteFreteGratis;
    const frete = subtotal > 0 && !freteGratis ? taxaEntregaCarrinho : 0;
    const desconto = estadoCarrinho.cupom ? Math.round(subtotal * .1) : 0;

    paginaCarrinho.querySelector("[data-itens]").innerHTML = itens.length
        ? itens.map(([codigo, quantidade]) => linhaCarrinho(codigo, quantidade, false)).join("")
        : '<p class="carrinho-vazio">Seu carrinho está vazio. Escolha seus favoritos no <a href="cardapios.html#vitrine">cardápio</a>.</p>';
    paginaCarrinho.querySelector("[data-salvos]").innerHTML =
        salvos.map(([codigo, quantidade]) => linhaCarrinho(codigo, quantidade, true)).join("");
    paginaCarrinho.querySelector("[data-secao-salvos]").hidden = salvos.length === 0;
    paginaCarrinho.querySelector("[data-texto-frete]").textContent = freteGratis
        ? "Frete grátis conquistado!"
        : "Faltam " + emReais(limiteFreteGratis - subtotal) + " para o frete grátis";
    paginaCarrinho.querySelector("[data-progresso-frete]").value = Math.min(subtotal, limiteFreteGratis);
    paginaCarrinho.querySelector("[data-subtotal]").textContent = emReais(subtotal);
    paginaCarrinho.querySelector("[data-entrega]").textContent = freteGratis ? "Grátis" : emReais(frete);
    paginaCarrinho.querySelector("[data-linha-desconto]").hidden = desconto === 0;
    paginaCarrinho.querySelector("[data-desconto]").textContent = "−" + emReais(desconto);
    paginaCarrinho.querySelector("[data-total]").textContent = emReais(subtotal + frete - desconto);
}

function salvarCarrinho() {
    localStorage.setItem(chaveCarrinho, JSON.stringify(estadoCarrinho));
    renderizarCarrinho();
}

function adicionarAoCarrinho(codigo, quantidade = 1) {
    const atual = estadoCarrinho.itens[codigo] || 0;
    estadoCarrinho.itens[codigo] = Math.min(99, atual + quantidade);
}

document.addEventListener("click", function (evento) {
    const adicionar = evento.target.closest("[data-adicionar]");
    if (adicionar) {
        const codigo = adicionar.dataset.adicionar;
        if (!Object.hasOwn(produtosCarrinho, codigo)) {
            return;
        }
        estadoCarrinho = lerCarrinho();
        adicionarAoCarrinho(codigo);
        salvarCarrinho();
        adicionar.textContent = "Adicionado";
        window.clearTimeout(adicionar.tempoFeedback);
        adicionar.tempoFeedback = window.setTimeout(function () {
            adicionar.textContent = adicionar.closest("[data-sugestoes]") ? "+" : "Adicionar";
        }, 900);
        return;
    }

    const botao = evento.target.closest("[data-acao-carrinho]");
    if (!botao || !paginaCarrinho) {
        return;
    }

    const codigo = botao.closest("[data-produto]").dataset.produto;
    const acao = botao.dataset.acaoCarrinho;
    estadoCarrinho = lerCarrinho();
    const quantidade = estadoCarrinho.itens[codigo];
    if (acao === "restaurar" && estadoCarrinho.salvos[codigo]) {
        adicionarAoCarrinho(codigo, estadoCarrinho.salvos[codigo]);
        delete estadoCarrinho.salvos[codigo];
    } else if (quantidade && acao === "mais") {
        adicionarAoCarrinho(codigo);
    } else if (quantidade > 1 && acao === "menos") {
        estadoCarrinho.itens[codigo] = quantidade - 1;
    } else if (quantidade && ["remover", "salvar", "menos"].includes(acao)) {
        if (acao === "salvar") {
            estadoCarrinho.salvos[codigo] = Math.min(99, (estadoCarrinho.salvos[codigo] || 0) + quantidade);
        }
        delete estadoCarrinho.itens[codigo];
    }

    salvarCarrinho();
    const proximoFoco = paginaCarrinho.querySelector('[data-produto="' + codigo + '"] [data-acao-carrinho="' + acao + '"]')
        || paginaCarrinho.querySelector("[data-itens] button, [data-itens] a")
        || paginaCarrinho.querySelector("[data-salvos] button");
    proximoFoco?.focus();
});

if (paginaCarrinho) {
    const formCupom = paginaCarrinho.querySelector("[data-form-cupom]");
    const campoCupom = formCupom.elements.cupom;
    campoCupom.value = estadoCarrinho.cupom;

    formCupom.addEventListener("submit", function (evento) {
        evento.preventDefault();
        estadoCarrinho = lerCarrinho();
        const cupom = campoCupom.value.trim().toUpperCase();
        const valido = cupom === "HASHI10";
        estadoCarrinho.cupom = valido ? cupom : "";
        formCupom.querySelector("[data-status-cupom]").textContent = valido
            ? "Cupom aplicado: 10% de desconto."
            : cupom ? "Cupom inválido." : "Cupom removido.";
        salvarCarrinho();
    });

    const formEndereco = paginaCarrinho.querySelector("[data-form-endereco]");
    const campoEndereco = formEndereco.elements.endereco;
    campoEndereco.value = sessionStorage.getItem(chaveEnderecoCarrinho) || "";

    formEndereco.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const endereco = campoEndereco.value.trim();
        if (endereco) {
            sessionStorage.setItem(chaveEnderecoCarrinho, endereco);
            formEndereco.querySelector("[data-status-endereco]").textContent = "Endereço salvo nesta aba.";
        }
    });

    paginaCarrinho.querySelector("[data-finalizar]").addEventListener("click", function () {
        paginaCarrinho.querySelector("[data-status-pedido]").textContent = Object.keys(lerCarrinho().itens).length
            ? "O envio de pedidos ainda não está disponível no protótipo."
            : "Adicione um produto antes de finalizar.";
    });

    paginaCarrinho.querySelector("[data-sugestoes]").innerHTML = ["3", "4", "6"].map(function (codigo) {
        const produto = produtosCarrinho[codigo];
        return `
            <article>
                <img src="${imagemCarrinho(produto)}" alt="">
                <h3>${produto.nome}</h3>
                <div>
                    <strong>${emReais(produto.preco)}</strong>
                    <button class="carrinho-primario" type="button" data-adicionar="${codigo}" aria-label="Adicionar ${produto.nome} ao carrinho">+</button>
                </div>
            </article>`;
    }).join("");
}

window.addEventListener("storage", function (evento) {
    if (evento.key === chaveCarrinho || evento.key === null) {
        estadoCarrinho = lerCarrinho();
        renderizarCarrinho();
    }
});

renderizarCarrinho();


// Mantem o retorno as compras dentro do perfil, inclusive no estado vazio.
if (sessaoHashi?.tipo === "entregador" || sessaoHashi?.tipo === "loja") {
    document.addEventListener("click", function (evento) {
        const link = evento.target.closest('a[href^="cardapios.html"]');
        if (link) {
            link.href = new URL("Html/cardapios-" + sessaoHashi.tipo + ".html" + link.hash, raizCarrinho);
        }
    });
}
