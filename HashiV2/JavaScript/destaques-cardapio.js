const carrossel = document.querySelector("[data-destaques]");
const slides = Array.from(carrossel.querySelectorAll("[data-destaque]"));
const controles = carrossel.querySelector("[data-destaque-controles]");
const areaSlides = carrossel.querySelector(".menu-banner-slides");
const indicadores = Array.from(controles.querySelectorAll("[data-indice-destaque]"));
const rotacao = controles.querySelector("[data-rotacao]");
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");

let atual = 0;
let temporizador;

function mostrarDestaque(indice) {
    indicadores[atual].removeAttribute("aria-current");
    slides[atual].hidden = true;
    atual = (indice + slides.length) % slides.length;
    slides[atual].hidden = false;
    indicadores[atual].setAttribute("aria-current", "true");
}

function pausarDestaques() {
    window.clearInterval(temporizador);
    temporizador = undefined;
    rotacao.removeAttribute("data-reproduzindo");
    rotacao.setAttribute("aria-label", "Reproduzir carrossel");
    areaSlides.setAttribute("aria-live", "polite");
}

function reproduzirDestaques() {
    rotacao.setAttribute("data-reproduzindo", "");
    rotacao.setAttribute("aria-label", "Pausar carrossel");
    areaSlides.setAttribute("aria-live", "off");
    temporizador = window.setInterval(function () {
        if (!document.hidden && !areaSlides.matches(":hover, :focus-within")) {
            mostrarDestaque(atual + 1);
        }
    }, 6000);
}

controles.querySelector("[data-anterior]").addEventListener("click", function () {
    pausarDestaques();
    mostrarDestaque(atual - 1);
});

controles.querySelector("[data-proximo]").addEventListener("click", function () {
    pausarDestaques();
    mostrarDestaque(atual + 1);
});

indicadores.forEach(function (indicador, indice) {
    indicador.addEventListener("click", function () {
        pausarDestaques();
        mostrarDestaque(indice);
    });
});

rotacao.addEventListener("click", function () {
    if (temporizador === undefined) {
        reproduzirDestaques();
    } else {
        pausarDestaques();
    }
});

movimentoReduzido.addEventListener("change", function (evento) {
    if (evento.matches) {
        pausarDestaques();
    }
});

carrossel.querySelectorAll("[data-menu-categoria]").forEach(function (link) {
    link.addEventListener("click", function () {
        const filtro = document.querySelector('input[name="categoria-cardapio"][value="' + link.dataset.menuCategoria + '"]');
        filtro.checked = true;
    });
});

controles.hidden = false;
if (movimentoReduzido.matches) {
    pausarDestaques();
} else {
    reproduzirDestaques();
}
