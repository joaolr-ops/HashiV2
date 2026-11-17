const chaveSessaoHashi = "usuarioLogadoHashi";
const raizHashi = new URL("../", document.currentScript.src);
const paginasPerfilHashi = new Map([
    ["cliente", "Html/index-cliente.html"],
    ["entregador", "Html/index-entregador.html"],
    ["loja", "Html/index-loja.html"]
]);

function destinoPerfilHashi(tipo) {
    return new URL(paginasPerfilHashi.get(tipo) ?? "index.html", raizHashi);
}

function lerSessaoHashi() {
    try {
        const sessao = JSON.parse(localStorage.getItem(chaveSessaoHashi));
        return paginasPerfilHashi.has(sessao?.tipo) ? sessao : null;
    } catch {
        return null;
    }
}

function areaPerfilHashi(tipo) {
    return new URL("Html/conta-" + tipo + ".html", raizHashi);
}

const sessaoHashi = lerSessaoHashi();
const painelPerfil = document.body.dataset.painelPerfil;
const vitrinePublica = document.body.dataset.vitrinePublica;
const inicioPublico = document.body.hasAttribute("data-inicio-publico");
const abrindoCadastroEntregador = inicioPublico && window.location.hash === "#cadastro-entregador";
const gatilhoLoginHashi = document.getElementById("abrir-login");

if (painelPerfil && sessaoHashi?.tipo !== painelPerfil) {
    const destino = sessaoHashi
        ? destinoPerfilHashi(sessaoHashi.tipo)
        : new URL("index.html#abrir-login", raizHashi);
    window.location.replace(destino);
} else if (document.body.hasAttribute("data-carrinho-publico") && sessaoHashi) {
    window.location.replace(new URL("Html/carrinho-" + sessaoHashi.tipo + ".html", raizHashi));
} else if (vitrinePublica && (sessaoHashi?.tipo === "entregador" || sessaoHashi?.tipo === "loja")) {
    const destino = new URL(`Html/${vitrinePublica}-${sessaoHashi.tipo}.html`, raizHashi);
    destino.search = window.location.search;
    destino.hash = window.location.hash;
    window.location.replace(destino);
} else if (inicioPublico && sessaoHashi && !abrindoCadastroEntregador) {
    let destino = destinoPerfilHashi(sessaoHashi.tipo);
    const fragmento = window.location.hash;
    if (fragmento === "#carrinho" || fragmento === "#atendimento") {
        destino.hash = fragmento;
    } else if (fragmento === "#abrir-login") {
        destino = areaPerfilHashi(sessaoHashi.tipo);
    }
    window.location.replace(destino);
} else if (sessaoHashi) {
    document.querySelectorAll(".cart-icon-wrapper").forEach(function (link) {
        link.href = new URL("Html/carrinho-" + sessaoHashi.tipo + ".html", raizHashi);
    });
    const inicioConta = destinoPerfilHashi(sessaoHashi.tipo);
    const areaConta = areaPerfilHashi(sessaoHashi.tipo);

    document.querySelectorAll("[data-inicio-hashi]").forEach(function (link) {
        link.href = inicioConta;
    });

    const conta = document.querySelector("body > header .conta-buttom, .conta-principal header .conta-buttom");
    if (conta) conta.href = areaConta;

    if (!painelPerfil) {
        const linkMinhaConta = document.querySelector("body > header .conta-buttom");
        linkMinhaConta.href = areaConta;
        linkMinhaConta.addEventListener("click", function (event) {
            event.stopImmediatePropagation();
        }, true);
    } else {
        const nomeConta = document.querySelector("[data-nome-conta]");
        if (nomeConta && typeof sessaoHashi.nome === "string" && sessaoHashi.nome.trim()) {
            nomeConta.textContent = sessaoHashi.nome;
        }

        document.querySelector("[data-sair-conta]")?.addEventListener("click", function () {
            localStorage.removeItem(chaveSessaoHashi);
            window.location.replace(new URL("index.html", raizHashi));
        });
    }
} else if (window.location.hash === "#abrir-login" && gatilhoLoginHashi) {
    gatilhoLoginHashi.click();
}

window.addEventListener("pageshow", function (event) {
    if (event.persisted && lerSessaoHashi()?.tipo !== sessaoHashi?.tipo) {
        window.location.reload();
    }
});

window.addEventListener("storage", function (event) {
    if (event.key === chaveSessaoHashi || event.key === null) {
        window.location.reload();
    }
});
