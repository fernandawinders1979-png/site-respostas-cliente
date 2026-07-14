let client;

const DASHBOARD_URL = "https://fernandawinders1979-png.github.io/site-respostas-cliente/index.html";

init();

async function init() {
  client = await app.initialized();
  client.events.on("app.activated", renderApp);
}

async function renderApp() {
  const textElement = document.getElementById("apptext");
  const debugElement = document.getElementById("debug-fields");
  const button = document.getElementById("open-dashboard-btn");

  let nomeCliente = "";
  const numeroPedido = "";
  const produto = "";

  try {
    const { contact } = await client.data.get("contact");
    nomeCliente = contact && contact.name ? contact.name : "";
  } catch (error) {
    // Segue sem o nome do contato em vez de travar o app inteiro.
  }

  textElement.textContent = nomeCliente
    ? `Cliente: ${nomeCliente}`
    : "Não foi possível identificar o nome do cliente neste chamado.";

  // MODO DESCOBERTA (temporário): lista todos os campos técnicos do chamado,
  // para identificarmos os nomes internos de "Pedido ID" e "Slug do produto"
  // usados pelo Freshdesk (ex: cf_pedido_id). Depois de identificar, trocar
  // esta listagem por uma leitura direta, ex: customFields.cf_pedido_id.
  try {
    const { ticket } = await client.data.get("ticket");
    const customFields = (ticket && ticket.custom_fields) || {};
    const entries = Object.entries(customFields).filter(([, value]) => value);

    if (entries.length > 0) {
      debugElement.innerHTML =
        "<strong>Campos técnicos encontrados neste chamado:</strong><br>" +
        entries.map(([key, value]) => `${key} = ${value}`).join("<br>");
    } else {
      debugElement.textContent = "Nenhum campo técnico preenchido neste chamado.";
    }
  } catch (error) {
    debugElement.textContent = "Não foi possível carregar os campos do chamado.";
  }

  button.addEventListener("click", () => {
    const params = new URLSearchParams();
    if (nomeCliente) params.set("nomeCliente", nomeCliente);
    if (numeroPedido) params.set("numeroPedido", numeroPedido);
    if (produto) params.set("produto", produto);

    const query = params.toString();
    window.open(query ? `${DASHBOARD_URL}?${query}` : DASHBOARD_URL, "_blank");
  });

  button.style.display = "inline-block";
}
