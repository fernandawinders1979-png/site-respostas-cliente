// Vanilla JS test file using Vitest
// Using Vitest globals (configured in vitest.config.js)

function mockApp({ contact, ticket, contactError, ticketError }) {
  return {
    initialized: vi.fn(() =>
      Promise.resolve({
        events: {
          on: vi.fn((eventName, callback) => {
            if (eventName === "app.activated") callback();
          }),
        },
        data: {
          get: vi.fn((key) => {
            if (key === "contact") {
              return contactError
                ? Promise.reject(new Error("contact error"))
                : Promise.resolve({ contact });
            }
            if (key === "ticket") {
              return ticketError
                ? Promise.reject(new Error("ticket error"))
                : Promise.resolve({ ticket });
            }
            return Promise.reject(new Error(`unexpected key: ${key}`));
          }),
        },
      })
    ),
  };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe("app.js - Coverage Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p id="apptext"></p>
      <button id="open-dashboard-btn" style="display:none;"></button>
      <p id="debug-fields"></p>
    `;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  test("shows the contact name and reveals the button", async () => {
    global.app = mockApp({
      contact: { name: "John Doe" },
      ticket: { custom_fields: {} },
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    const button = document.getElementById("open-dashboard-btn");

    expect(global.app.initialized).toHaveBeenCalled();
    expect(text.textContent).toBe("Cliente: John Doe");
    expect(button.style.display).toBe("inline-block");
  });

  test("opens the dashboard URL with the customer name on click", async () => {
    global.app = mockApp({
      contact: { name: "John Doe" },
      ticket: { custom_fields: {} },
    });
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});

    await import("../app/scripts/app.js");
    await flushPromises();

    document.getElementById("open-dashboard-btn").click();

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("nomeCliente=John+Doe"),
      "_blank"
    );
  });

  test("shows a fallback message when there is no contact name", async () => {
    global.app = mockApp({
      contact: {},
      ticket: { custom_fields: {} },
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    expect(text.textContent).toBe(
      "Não foi possível identificar o nome do cliente neste chamado."
    );
  });

  test("shows an error message when the contact data cannot be loaded", async () => {
    global.app = mockApp({
      contactError: true,
      ticket: { custom_fields: {} },
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    expect(text.textContent).toBe(
      "Não foi possível identificar o nome do cliente neste chamado."
    );
  });

  test("lists the technical custom fields found on the ticket", async () => {
    global.app = mockApp({
      contact: { name: "John Doe" },
      ticket: {
        custom_fields: {
          cf_pedido_id: "10234",
          cf_slug_produto: "oleo-essencial-30ml",
          cf_campo_vazio: "",
        },
      },
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const debug = document.getElementById("debug-fields");
    expect(debug.innerHTML).toContain("cf_pedido_id = 10234");
    expect(debug.innerHTML).toContain("cf_slug_produto = oleo-essencial-30ml");
    expect(debug.innerHTML).not.toContain("cf_campo_vazio");
  });

  test("shows a message when there are no technical fields", async () => {
    global.app = mockApp({
      contact: { name: "John Doe" },
      ticket: { custom_fields: {} },
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const debug = document.getElementById("debug-fields");
    expect(debug.textContent).toBe(
      "Nenhum campo técnico preenchido neste chamado."
    );
  });

  test("shows an error message when the ticket data cannot be loaded", async () => {
    global.app = mockApp({
      contact: { name: "John Doe" },
      ticketError: true,
    });

    await import("../app/scripts/app.js");
    await flushPromises();

    const debug = document.getElementById("debug-fields");
    expect(debug.textContent).toBe(
      "Não foi possível carregar os campos do chamado."
    );
  });
});
