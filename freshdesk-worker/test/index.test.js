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
    async delete(key) {
      store.delete(key);
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

test("/csat-sync sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/csat-sync", {}), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("/csat-sync classifica as respostas (feliz/neutro/insatisfeito) e soma em /csat-stats", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const hoje = new Date().toISOString();

  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url);
    assert.equal(pathname, "/api/v2/surveys/satisfaction_ratings");
    if (searchParams.get("page") === "1") {
      return Response.json([
        { id: 1, created_at: hoje, ratings: { default_question: 103 } },
        { id: 2, created_at: hoje, ratings: { default_question: 100 } },
        { id: 3, created_at: hoje, ratings: { default_question: -103 } },
        { id: 4, created_at: hoje, ratings: { default_question: 103 } },
      ]);
    }
    return Response.json([]);
  };

  const syncRes = await worker.fetch(
    postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(syncRes.status, 200);
  const syncBody = await syncRes.json();
  assert.equal(syncBody.synced, 4);

  const statsRes = await worker.fetch(req("/csat-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await statsRes.json();

  assert.equal(stats.feliz, 2);
  assert.equal(stats.neutro, 1);
  assert.equal(stats.insatisfeito, 1);
  assert.equal(stats.total, 4);
  assert.equal(stats.score, 50);
});

test("/csat-sync não conta de novo respostas já sincronizadas antes (cursor por id)", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const hoje = new Date().toISOString();
  let allRatings = [{ id: 1, created_at: hoje, ratings: { default_question: 103 } }];

  globalThis.fetch = async (url) => {
    const { searchParams } = new URL(url);
    if (searchParams.get("page") === "1") return Response.json(allRatings);
    return Response.json([]);
  };

  const first = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await first.json()).synced, 1);

  // Segunda sincronização: nenhuma resposta nova além da já processada (id 1).
  const second = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await second.json()).synced, 0);

  // Chega uma resposta nova (id 2): só ela deve ser contada.
  allRatings = [...allRatings, { id: 2, created_at: hoje, ratings: { default_question: -103 } }];
  const third = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await third.json()).synced, 1);

  const statsRes = await worker.fetch(req("/csat-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await statsRes.json();
  assert.equal(stats.feliz, 1);
  assert.equal(stats.insatisfeito, 1);
});

test("/csat-stats sem nenhuma resposta -> score null", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(req("/csat-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await res.json();
  assert.equal(stats.total, 0);
  assert.equal(stats.score, null);
});

test("/csat-history devolve o número certo de semanas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(
    req("/csat-history?weeks=4", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.weeks.length, 4);
});

test("/fcr-start sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/fcr-start", { ticketId: "123" }), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("/fcr-start com ticketId inválido -> 400", async () => {
  const res = await worker.fetch(
    postReq("/fcr-start", { ticketId: "não-é-número" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("/fcr-sync não consulta nem conta tickets ainda dentro da janela de espera", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  await worker.fetch(postReq("/fcr-start", { ticketId: "58214" }, { "X-App-Token": "senha-correta" }), testEnv);

  globalThis.fetch = async () => {
    throw new Error("não deveria consultar o Freshdesk para ticket ainda dentro da janela!");
  };

  const res = await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.processed, 0);
  assert.equal(body.pending, 1);

  assert.ok(await testEnv.RISK_STATS.get("fcr:pending:58214"));
});

test("/fcr-sync: cliente não respondeu de novo após a janela -> conta como resolvido no 1º contato", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58214", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async (url) => {
    const { pathname } = new URL(url);
    assert.equal(pathname, "/api/v2/tickets/58214/conversations");
    return Response.json([{ incoming: false, created_at: quatroDiasAtras }]);
  };

  const syncRes = await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const syncBody = await syncRes.json();
  assert.equal(syncBody.processed, 1);
  assert.equal(syncBody.pending, 0);
  assert.equal(await testEnv.RISK_STATS.get("fcr:pending:58214"), null);

  // Soma as últimas 2 semanas para não depender de em qual dia da semana o
  // teste roda (a semana usada é a do firstResponseAt, não a de hoje).
  const historyRes = await worker.fetch(
    req("/fcr-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  const totalSucesso = weeks.reduce((sum, week) => sum + week.sucesso, 0);
  const totalReaberto = weeks.reduce((sum, week) => sum + week.reaberto, 0);
  assert.equal(totalSucesso, 1);
  assert.equal(totalReaberto, 0);
});

test("/fcr-sync: cliente respondeu de novo depois da nossa resposta -> conta como reaberto", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  const tresDiasAtras = new Date(Date.now() - 3.5 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58215", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async () =>
    Response.json([
      { incoming: false, created_at: quatroDiasAtras },
      { incoming: true, created_at: tresDiasAtras },
    ]);

  await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);

  const historyRes = await worker.fetch(
    req("/fcr-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  const totalSucesso = weeks.reduce((sum, week) => sum + week.sucesso, 0);
  const totalReaberto = weeks.reduce((sum, week) => sum + week.reaberto, 0);
  assert.equal(totalSucesso, 0);
  assert.equal(totalReaberto, 1);
});

test("/fcr-sync erro ao consultar o Freshdesk mantém o ticket pendente para a próxima varredura", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58216", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async () => new Response("erro", { status: 500 });

  const res = await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const body = await res.json();
  assert.equal(body.processed, 0);
  assert.equal(body.pending, 1);
  assert.ok(await testEnv.RISK_STATS.get("fcr:pending:58216"));
});

test("/fcr-stats sem nenhum ticket finalizado -> rate null", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(req("/fcr-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await res.json();
  assert.equal(stats.total, 0);
  assert.equal(stats.rate, null);
});

test("/fcr-history devolve o número certo de semanas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(req("/fcr-history?weeks=4", { "X-App-Token": "senha-correta" }), testEnv);
  const body = await res.json();
  assert.equal(body.weeks.length, 4);
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
