const painelEntregas = document.getElementById("painel-entregador");
const chaveEntregaDemo = "entregaDemoHashi-" + (sessaoHashi?.nome || "entregador");
const botaoEntrega = painelEntregas.querySelector("[data-iniciar-entrega]");
const statusEntrega = painelEntregas.querySelector("[data-status-entrega]");
const listaEntregas = painelEntregas.querySelector("[data-lista-entregas]");

if (typeof sessaoHashi?.nome === "string" && sessaoHashi.nome.trim()) {
    painelEntregas.querySelector("[data-saudacao-entregador]").textContent = sessaoHashi.nome.trim().split(/\s+/)[0];
}

function atualizarEntrega() {
    const status = localStorage.getItem(chaveEntregaDemo);
    if (status === "em-rota") {
        statusEntrega.textContent = "Em rota";
        botaoEntrega.textContent = "Concluir entrega";
    } else if (status === "concluida") {
        statusEntrega.textContent = "Entrega concluída";
        botaoEntrega.hidden = true;
        painelEntregas.querySelector("[data-entregas-hoje]").textContent = "4";
        painelEntregas.querySelector("[data-entregas-total]").textContent = "29";
        painelEntregas.querySelector("[data-ganhos-hoje]").textContent = "R$ 87,77";
        if (!listaEntregas.querySelector("[data-entrega-demo]")) {
            listaEntregas.insertAdjacentHTML("afterbegin", `
                <li class="entregas-linha" data-entrega-demo>
                    <span class="entregas-check" aria-hidden="true">✓</span>
                    <div><strong>Pedido #6727</strong><p>Sushi Show</p></div>
                    <div><strong class="entregas-concluida">Entregue</strong></div>
                    <div><strong>Cliente de demonstração</strong><p>Santa Mônica</p></div>
                    <strong class="entregas-valor">R$ 23,00</strong>
                </li>`);
        }
    }
}

if (sessaoHashi?.tipo === "entregador") {
    botaoEntrega.addEventListener("click", function () {
        const status = localStorage.getItem(chaveEntregaDemo);
        if (status !== "concluida") {
            localStorage.setItem(chaveEntregaDemo, status === "em-rota" ? "concluida" : "em-rota");
        }
        atualizarEntrega();
    });
    atualizarEntrega();
}
