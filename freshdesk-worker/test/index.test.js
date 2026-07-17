// Testa a lógica do Worker com fetch() simulado (não faz nenhuma chamada
// real ao Freshdesk): falta de senha, senha errada, ticket não encontrado,
// e busca com sucesso montando o payload certo para o dashboard.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const env = {
  FRESHDESK_DOMAIN: "hebevi.freshdesk.com",
  FRESHDESK_API_KEY: "chave-de-teste",
  APP_TOKEN: "senha-correta",
};

const AGENT_RESPONSE = {
  contact: { name: "João Souza" },
};

function req(path, headers = {}) {
  return new Request(`https://freshdesk-proxy.example.workers.dev${path}`, { headers });
}

function postReq(path, body, headers = {}) {
  return new Request(`https://freshdesk-proxy.example.workers.dev${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

// KV falso em memória, só para os testes: imita as funções do Workers KV
// que o Worker usa (get/put/list), sem precisar de uma conta Cloudflare real.
function createMockKv() {
  const store = new Map();
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async list({ prefix } = {}) {
      const keys = [...store.keys()]
        .filter((key) => !prefix || key.startsWith(prefix))
        .map((name) => ({ name }));
      return { keys, list_complete: true };
    },
  };
}

test("sem senha -> 401", async () => {
  globalThis.fetch = async () => {
    throw new Error("não deveria chamar o Freshdesk sem senha!");
  };
  const res = await worker.fetch(req("/ticket/123"), env);
  assert.equal(res.status, 401);
});

test("senha errada -> 401", async () => {
  globalThis.fetch = async () => {
    throw new Error("não deveria chamar o Freshdesk com senha errada!");
  };
  const res = await worker.fetch(req("/ticket/123", { "X-App-Token": "senha-errada" }), env);
  assert.equal(res.status, 401);
});

test("ticket inexistente -> 404", async () => {
  globalThis.fetch = async () => new Response("not found", { status: 404 });
  const res = await worker.fetch(req("/ticket/99999", { "X-App-Token": "senha-correta" }), env);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.match(body.error, /não encontrado/);
});

test("rota inválida -> 404", async () => {
  const res = await worker.fetch(req("/qualquer-coisa", { "X-App-Token": "senha-correta" }), env);
  assert.equal(res.status, 404);
});

test("registrar risco sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/risk-event", { level: "alto" }), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("registrar risco com nível inválido -> 400", async () => {
  const res = await worker.fetch(
    postReq("/risk-event", { level: "urgente" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("registrar risco soma no contador da semana e aparece em /risk-stats", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  const res1 = await worker.fetch(
    postReq("/risk-event", { level: "alto" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res1.status, 200);

  const res2 = await worker.fetch(
    postReq("/risk-event", { level: "alto" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res2.status, 200);

  const statsRes = await worker.fetch(req("/risk-stats", { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal(statsRes.status, 200);
  const stats = await statsRes.json();

  assert.equal(stats.alto, 2);
  assert.equal(stats.medio, 0);
  assert.equal(stats.baixo, 0);
  assert.match(stats.week, /^\d{4}-W\d{2}$/);
});

test("registrar risco com valor soma no total da semana", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  await worker.fetch(
    postReq("/risk-event", { level: "alto", valor: 49.9 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  await worker.fetch(
    postReq("/risk-event", { level: "alto", valor: 100.1 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  // valor inválido não deve quebrar a requisição nem entrar na soma
  const res3 = await worker.fetch(
    postReq("/risk-event", { level: "alto", valor: "não é número" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res3.status, 200);

  const statsRes = await worker.fetch(req("/risk-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await statsRes.json();

  assert.equal(stats.alto, 3);
  assert.equal(stats.altoValor, 150);
  assert.equal(stats.medioValor, 0);
});

test("/risk-history sem senha -> 401", async () => {
  const res = await worker.fetch(req("/risk-history"), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("/risk-history devolve as semanas certas com os totais acumulados", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  await worker.fetch(
    postReq("/risk-event", { level: "medio", valor: 30 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );

  const res = await worker.fetch(
    req("/risk-history?weeks=4", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);
  const body = await res.json();

  assert.equal(body.weeks.length, 4);
  const currentWeek = body.weeks[body.weeks.length - 1];
  assert.equal(currentWeek.medio, 1);
  assert.equal(currentWeek.medioValor, 30);
  assert.equal(body.weeks[0].medio, 0);
});

test("/risk-history limita o número máximo de semanas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(
    req("/risk-history?weeks=999", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const body = await res.json();
  assert.equal(body.weeks.length, 26);
});

test("registrar estatística com categoria inválida -> 400", async () => {
  const res = await worker.fetch(
    postReq("/stat-event", { category: "outra-coisa", key: "x" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("registrar estatística sem key -> 400", async () => {
  const res = await worker.fetch(
    postReq("/stat-event", { category: "motivo" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("registrar motivo repetido soma no mesmo contador (ignora acento/maiúscula)", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  await worker.fetch(
    postReq(
      "/stat-event",
      { category: "motivo", key: "Atraso na Entrega", label: "Atraso na Entrega" },
      { "X-App-Token": "senha-correta" },
    ),
    testEnv,
  );
  await worker.fetch(
    postReq(
      "/stat-event",
      { category: "motivo", key: "atraso na entrega", label: "Atraso na Entrega" },
      { "X-App-Token": "senha-correta" },
    ),
    testEnv,
  );

  const res = await worker.fetch(
    req("/stat-ranking?category=motivo", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);
  const body = await res.json();

  assert.equal(body.items.length, 1);
  assert.equal(body.items[0].count, 2);
  assert.equal(body.items[0].label, "Atraso na Entrega");
});

test("/stat-ranking ordena do mais frequente para o menos e respeita o limit", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  const record = (key) =>
    worker.fetch(
      postReq("/stat-event", { category: "template", key, label: key }, { "X-App-Token": "senha-correta" }),
      testEnv,
    );

  await record("Template A");
  await record("Template B");
  await record("Template B");
  await record("Template C");
  await record("Template C");
  await record("Template C");

  const res = await worker.fetch(
    req("/stat-ranking?category=template&limit=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const body = await res.json();

  assert.equal(body.items.length, 2);
  assert.equal(body.items[0].label, "Template C");
  assert.equal(body.items[0].count, 3);
  assert.equal(body.items[1].label, "Template B");
});

test("/stat-history categoria inválida -> 400", async () => {
  const res = await worker.fetch(
    req("/stat-history?category=outra-coisa&key=total", { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("/stat-history sem key -> 400", async () => {
  const res = await worker.fetch(
    req("/stat-history?category=resposta", { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("/stat-history devolve o histórico semanal da chave certa", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  const record = () =>
    worker.fetch(
      postReq(
        "/stat-event",
        { category: "resposta", key: "total", label: "Respostas copiadas" },
        { "X-App-Token": "senha-correta" },
      ),
      testEnv,
    );

  await record();
  await record();
  await record();

  const res = await worker.fetch(
    req("/stat-history?category=resposta&key=total&weeks=4", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);
  const body = await res.json();

  assert.equal(body.weeks.length, 4);
  assert.equal(body.weeks[body.weeks.length - 1].count, 3);
  assert.equal(body.weeks[0].count, 0);
  assert.match(body.weeks[0].week, /^\d{4}-W\d{2}$/);
});

test("busca com sucesso -> monta payload certo para o dashboard", async () => {
  globalThis.fetch = async (url) => {
    const { pathname } = new URL(url);

    if (pathname === "/api/v2/tickets/58214") {
      return Response.json({
        id: 58214,
        requester_id: 777,
        responder_id: 888,
        tags: ["vip"],
        created_at: "2026-07-01T10:00:00Z",
        description_text: "Quero cancelar minha assinatura",
        custom_fields: {
          cf_status_pedido_suporte_ativo: "Pedido retornou",
          cf_rastreio_17track: "BR123456789",
          cf_motivo_do_contato: "Sol. Cancelamento - sem pedido ter sido entregue",
        },
      });
    }

    if (pathname === "/api/v2/tickets/58214/conversations") {
      return Response.json([
        {
          created_at: "2026-07-01T11:00:00Z",
          incoming: false,
          private: false,
          body_text: "Claro, já estou verificando.",
        },
        {
          created_at: "2026-07-01T10:30:00Z",
          incoming: false,
          private: true,
          body_text: "nota interna, não deve aparecer",
        },
      ]);
    }

    if (pathname === "/api/v2/contacts/777") {
      return Response.json({
        name: "Maria Silva",
        email: "maria@exemplo.com",
        address: "São Paulo, SP",
        language: "pt-BR",
        custom_fields: {
          id_do_pedido_cartpanda: "#58214",
          loja_cartpanda: "Óleo Essencial 30ml",
          vlr_da_ltima_compra: "49.90",
        },
      });
    }

    if (pathname === "/api/v2/agents/888") {
      return Response.json(AGENT_RESPONSE);
    }

    throw new Error("URL inesperada: " + pathname);
  };

  const res = await worker.fetch(req("/ticket/58214", { "X-App-Token": "senha-correta" }), env);
  assert.equal(res.status, 200);
  const payload = await res.json();

  assert.equal(payload.nomeCliente, "Maria Silva");
  assert.equal(payload.email, "maria@exemplo.com");
  assert.equal(payload.nomeAgente, "João Souza");
  assert.equal(payload.numeroPedido, "#58214");
  assert.equal(payload.produto, "Óleo Essencial 30ml");
  assert.equal(payload.valorTotal, "49.90");
  assert.equal(payload.codigoRastreio, "BR123456789");
  assert.equal(payload.status, "Pedido retornou");
  assert.equal(payload.idioma, "pt-BR");
  assert.equal(payload.endereco, "São Paulo, SP");
  assert.equal(payload.motivo, "Sol. Cancelamento - sem pedido ter sido entregue");
  assert.ok(payload.tags.includes("vip"));
  assert.ok(payload.tags.some((t) => t.startsWith("Motivo:")));
  assert.match(payload.conversationText, /Cliente: Quero cancelar/);
  assert.match(payload.conversationText, /Atendente: Claro/);
  assert.doesNotMatch(payload.conversationText, /nota interna/);
});
