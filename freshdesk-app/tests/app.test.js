// Vanilla JS test file using Vitest
// Using Vitest globals (configured in vitest.config.js)

function mockApp(getContact) {
  return {
    initialized: vi.fn(() =>
      Promise.resolve({
        events: {
          on: vi.fn((eventName, callback) => {
            if (eventName === "app.activated") callback();
          }),
        },
        data: {
          get: getContact,
        },
      })
    ),
  };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("app.js - Coverage Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p id="apptext"></p>
      <button id="open-dashboard-btn" style="display:none;"></button>
    `;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  test("shows the contact name and reveals the button", async () => {
    global.app = mockApp(() =>
      Promise.resolve({ contact: { name: "John Doe" } })
    );

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    const button = document.getElementById("open-dashboard-btn");

    expect(global.app.initialized).toHaveBeenCalled();
    expect(text.textContent).toBe("Cliente: John Doe");
    expect(button.style.display).toBe("inline-block");
  });

  test("opens the dashboard URL with the customer name on click", async () => {
    global.app = mockApp(() =>
      Promise.resolve({ contact: { name: "John Doe" } })
    );
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});

    await import("../app/scripts/app.js");
    await flushPromises();

    document.getElementById("open-dashboard-btn").click();

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("nomeCliente=John%20Doe"),
      "_blank"
    );
  });

  test("shows a fallback message when there is no contact name", async () => {
    global.app = mockApp(() => Promise.resolve({ contact: {} }));

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    expect(text.textContent).toBe(
      "Não foi possível identificar o nome do cliente neste chamado."
    );
  });

  test("shows an error message when the contact data cannot be loaded", async () => {
    global.app = mockApp(() => Promise.reject(new Error("network error")));

    await import("../app/scripts/app.js");
    await flushPromises();

    const text = document.getElementById("apptext");
    expect(text.textContent).toBe(
      "Não foi possível carregar os dados do cliente."
    );
  });
});
