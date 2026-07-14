let client;

const DASHBOARD_URL = "https://fernandawinders1979-png.github.io/site-respostas-cliente/index.html";

init();

async function init() {
  client = await app.initialized();
  client.events.on("app.activated", renderApp);
}

async function renderApp() {
  const textElement = document.getElementById("apptext");
  const button = document.getElementById("open-dashboard-btn");

  try {
    const { contact } = await client.data.get("contact");
    const nomeCliente = contact && contact.name ? contact.name : "";

    textElement.textContent = nomeCliente
      ? `Cliente: ${nomeCliente}`
      : "Não foi possível identificar o nome do cliente neste chamado.";

    button.addEventListener("click", () => {
      const url = nomeCliente
        ? `${DASHBOARD_URL}?nomeCliente=${encodeURIComponent(nomeCliente)}`
        : DASHBOARD_URL;
      window.open(url, "_blank");
    });

    button.style.display = "inline-block";
  } catch (error) {
    textElement.textContent = "Não foi possível carregar os dados do cliente.";
  }
}
