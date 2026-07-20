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

// Mesmo grupo usado em src/index.js (BADROCK_GROUP_ID) — todas as métricas só
// contam tickets desse grupo, então os testes precisam simular a checagem.
const BADROCK_GROUP_ID = 156001126409;
const OTHER_GROUP_ID = 156001053742;

// Fetch simulado que responde group_id do grupo Badrock (ou outro) para
// qualquer /api/v2/tickets/{id}, e delega o resto para um fetch extra
// (usado quando o teste também precisa simular outras rotas do Freshdesk).
function mockTicketGroupFetch(groupId, extraFetch) {
  return async (url, ...rest) => {
    const { pathname } = new URL(url);
    const match = pathname.match(/^\/api\/v2\/tickets\/(\d+)$/);
    if (match) {
      return Response.json({ id: Number(match[1]), group_id: groupId });
    }
    if (extraFetch) return extraFetch(url, ...rest);
    throw new Error("URL inesperada: " + pathname);
  };
}

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
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  const res1 = await worker.fetch(
    postReq("/risk-event", { level: "alto", ticketId: "70100" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res1.status, 200);

  const res2 = await worker.fetch(
    postReq("/risk-event", { level: "alto", ticketId: "70100" }, { "X-App-Token": "senha-correta" }),
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

test("registrar risco sem ticket do grupo Suporte Badrock não conta", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(OTHER_GROUP_ID);

  const semTicket = await worker.fetch(
    postReq("/risk-event", { level: "alto" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(semTicket.status, 200);
  assert.equal((await semTicket.json()).counted, false);

  const outroGrupo = await worker.fetch(
    postReq("/risk-event", { level: "alto", ticketId: "70101" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal((await outroGrupo.json()).counted, false);

  const statsRes = await worker.fetch(req("/risk-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await statsRes.json();
  assert.equal(stats.alto, 0);
});

test("registrar risco com valor soma no total da semana", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-event", { level: "alto", valor: 49.9, ticketId: "70102" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  await worker.fetch(
    postReq("/risk-event", { level: "alto", valor: 100.1, ticketId: "70102" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  // valor inválido não deve quebrar a requisição nem entrar na soma
  const res3 = await worker.fetch(
    postReq(
      "/risk-event",
      { level: "alto", valor: "não é número", ticketId: "70102" },
      { "X-App-Token": "senha-correta" },
    ),
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
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-event", { level: "medio", valor: 30, ticketId: "70103" }, { "X-App-Token": "senha-correta" }),
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
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq(
      "/stat-event",
      { category: "motivo", key: "Atraso na Entrega", label: "Atraso na Entrega", ticketId: "70104" },
      { "X-App-Token": "senha-correta" },
    ),
    testEnv,
  );
  await worker.fetch(
    postReq(
      "/stat-event",
      { category: "motivo", key: "atraso na entrega", label: "Atraso na Entrega", ticketId: "70104" },
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
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  const record = (key) =>
    worker.fetch(
      postReq(
        "/stat-event",
        { category: "template", key, label: key, ticketId: "70105" },
        { "X-App-Token": "senha-correta" },
      ),
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
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  const record = () =>
    worker.fetch(
      postReq(
        "/stat-event",
        { category: "resposta", key: "total", label: "Respostas copiadas", ticketId: "70106" },
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

  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID, async (url) => {
    const { pathname, searchParams } = new URL(url);
    assert.equal(pathname, "/api/v2/surveys/satisfaction_ratings");
    if (searchParams.get("page") === "1") {
      return Response.json([
        { id: 1, ticket_id: 501, created_at: hoje, ratings: { default_question: 103 } },
        { id: 2, ticket_id: 502, created_at: hoje, ratings: { default_question: 100 } },
        { id: 3, ticket_id: 503, created_at: hoje, ratings: { default_question: -103 } },
        { id: 4, ticket_id: 504, created_at: hoje, ratings: { default_question: 103 } },
      ]);
    }
    return Response.json([]);
  });

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

test("/csat-sync ignora avaliações de tickets fora do grupo Suporte Badrock", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const hoje = new Date().toISOString();

  globalThis.fetch = mockTicketGroupFetch(OTHER_GROUP_ID, async (url) => {
    const { searchParams } = new URL(url);
    if (searchParams.get("page") === "1") {
      return Response.json([{ id: 1, ticket_id: 601, created_at: hoje, ratings: { default_question: 103 } }]);
    }
    return Response.json([]);
  });

  const syncRes = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await syncRes.json()).synced, 1); // "synced" só conta que o cursor avançou, não que somou

  const statsRes = await worker.fetch(req("/csat-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await statsRes.json();
  assert.equal(stats.total, 0);
});

test("/csat-sync não conta de novo respostas já sincronizadas antes (cursor por id)", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const hoje = new Date().toISOString();
  let allRatings = [{ id: 1, ticket_id: 501, created_at: hoje, ratings: { default_question: 103 } }];

  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID, async (url) => {
    const { searchParams } = new URL(url);
    if (searchParams.get("page") === "1") return Response.json(allRatings);
    return Response.json([]);
  });

  const first = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await first.json()).synced, 1);

  // Segunda sincronização: nenhuma resposta nova além da já processada (id 1).
  const second = await worker.fetch(postReq("/csat-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await second.json()).synced, 0);

  // Chega uma resposta nova (id 2): só ela deve ser contada.
  allRatings = [...allRatings, { id: 2, ticket_id: 502, created_at: hoje, ratings: { default_question: -103 } }];
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

test("/fcr-sync: ticket não foi reaberto após a janela -> conta como resolvido no 1º contato", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58214", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url);
    assert.equal(pathname, "/api/v2/tickets/58214");
    assert.equal(searchParams.get("include"), "stats");
    return Response.json({ id: 58214, group_id: BADROCK_GROUP_ID, stats: { reopened_at: null } });
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

test("/fcr-sync: ticket foi reaberto depois da nossa resposta -> conta como reaberto", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  const tresDiasAtras = new Date(Date.now() - 3.5 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58215", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async () =>
    Response.json({ id: 58215, group_id: BADROCK_GROUP_ID, stats: { reopened_at: tresDiasAtras } });

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

test("/fcr-sync: reopened_at de um ciclo antigo (antes da nossa resposta) não conta como reaberto", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const dezDiasAtras = new Date(Date.now() - 10 * 86400000).toISOString();
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58217", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  // reopened_at é de ANTES da nossa resposta (reabertura de um ciclo
  // anterior, já tratado) — não deve penalizar este contato.
  globalThis.fetch = async () =>
    Response.json({ id: 58217, group_id: BADROCK_GROUP_ID, stats: { reopened_at: dezDiasAtras } });

  await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);

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

test("/fcr-sync: ticket fora do grupo Suporte Badrock é descartado sem contar", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const quatroDiasAtras = new Date(Date.now() - 4 * 86400000).toISOString();
  await testEnv.RISK_STATS.put("fcr:pending:58218", JSON.stringify({ firstResponseAt: quatroDiasAtras }));

  globalThis.fetch = async () =>
    Response.json({ id: 58218, group_id: OTHER_GROUP_ID, stats: { reopened_at: null } });

  const syncRes = await worker.fetch(postReq("/fcr-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const syncBody = await syncRes.json();
  assert.equal(syncBody.processed, 1); // removido da fila...
  assert.equal(await testEnv.RISK_STATS.get("fcr:pending:58218"), null);

  const historyRes = await worker.fetch(
    req("/fcr-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  const total = weeks.reduce((sum, w) => sum + w.sucesso + w.reaberto, 0);
  assert.equal(total, 0); // ...mas não soma no contador
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

test("/duration-sync sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/duration-sync", {}), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("/duration-sync soma FRT e AHT dos tickets com stats preenchidas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const createdAt = new Date(Date.now() - 2 * 86400000).toISOString();
  const updatedAt = new Date(Date.now() - 1 * 86400000).toISOString();
  const firstRespondedAt = new Date(new Date(createdAt).getTime() + 30 * 60000).toISOString(); // 30 min depois
  const resolvedAt = new Date(new Date(createdAt).getTime() + 240 * 60000).toISOString(); // 240 min depois

  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url);
    if (pathname === "/api/v2/tickets") {
      if (searchParams.get("page") === "1") {
        return Response.json([{ id: 501, group_id: BADROCK_GROUP_ID, updated_at: updatedAt }]);
      }
      return Response.json([]);
    }
    if (pathname === "/api/v2/tickets/501") {
      return Response.json({
        id: 501,
        created_at: createdAt,
        stats: { first_responded_at: firstRespondedAt, resolved_at: resolvedAt },
      });
    }
    throw new Error("URL inesperada: " + pathname);
  };

  const res = await worker.fetch(postReq("/duration-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ticketsChecked, 1);
  assert.equal(body.frtRecorded, 1);
  assert.equal(body.ahtRecorded, 1);

  // Soma as últimas 2 semanas para não depender de em qual dia da semana o
  // teste roda (a semana usada é a do created_at do ticket, não a de hoje).
  const frtRes = await worker.fetch(req("/frt-history?weeks=2", { "X-App-Token": "senha-correta" }), testEnv);
  const { weeks: frtWeeks } = await frtRes.json();
  const frtWeekWithData = frtWeeks.find((w) => w.count > 0);
  assert.ok(frtWeekWithData, "esperava encontrar uma semana com dado de FRT");
  assert.equal(frtWeekWithData.avgMinutes, 30);

  const ahtRes = await worker.fetch(req("/aht-history?weeks=2", { "X-App-Token": "senha-correta" }), testEnv);
  const { weeks: ahtWeeks } = await ahtRes.json();
  const ahtWeekWithData = ahtWeeks.find((w) => w.count > 0);
  assert.ok(ahtWeekWithData, "esperava encontrar uma semana com dado de AHT");
  assert.equal(ahtWeekWithData.avgMinutes, 240);

  // Sincronizar de novo não deve somar o mesmo ticket 2x.
  const res2 = await worker.fetch(postReq("/duration-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const body2 = await res2.json();
  assert.equal(body2.frtRecorded, 0);
  assert.equal(body2.ahtRecorded, 0);
});

test("/duration-sync mantém tickets com erro na consulta para tentar de novo na próxima sincronização", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const createdAt = new Date(Date.now() - 2 * 86400000).toISOString();
  const updatedAt = new Date(Date.now() - 1 * 86400000).toISOString();

  let detailShouldFail = true;
  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url);
    if (pathname === "/api/v2/tickets") {
      if (searchParams.get("page") === "1") {
        return Response.json([{ id: 601, group_id: BADROCK_GROUP_ID, updated_at: updatedAt }]);
      }
      return Response.json([]);
    }
    if (pathname === "/api/v2/tickets/601") {
      if (detailShouldFail) return new Response("erro", { status: 500 });
      return Response.json({
        id: 601,
        created_at: createdAt,
        stats: { first_responded_at: createdAt, resolved_at: createdAt },
      });
    }
    throw new Error("URL inesperada: " + pathname);
  };

  const first = await worker.fetch(postReq("/duration-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const firstBody = await first.json();
  assert.equal(firstBody.frtRecorded, 0);
  assert.equal(firstBody.ahtRecorded, 0);

  // Na próxima sincronização o Freshdesk já responde bem: o ticket precisa
  // ser tentado de novo (o cursor não pode ter avançado para além dele).
  detailShouldFail = false;
  const second = await worker.fetch(postReq("/duration-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const secondBody = await second.json();
  assert.equal(secondBody.frtRecorded, 1);
  assert.equal(secondBody.ahtRecorded, 1);
});

test("/duration-sync ignora tickets fora do grupo Suporte Badrock sem consultar o detalhe", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const updatedAt = new Date(Date.now() - 1 * 86400000).toISOString();

  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url);
    if (pathname === "/api/v2/tickets") {
      if (searchParams.get("page") === "1") {
        return Response.json([{ id: 701, group_id: OTHER_GROUP_ID, updated_at: updatedAt }]);
      }
      return Response.json([]);
    }
    throw new Error("não deveria buscar o detalhe de um ticket fora do grupo Badrock: " + pathname);
  };

  const res = await worker.fetch(postReq("/duration-sync", {}, { "X-App-Token": "senha-correta" }), testEnv);
  const body = await res.json();
  assert.equal(body.ticketsChecked, 1);
  assert.equal(body.frtRecorded, 0);
  assert.equal(body.ahtRecorded, 0);
});

test("/frt-stats e /aht-stats sem nenhum ticket -> avgMinutes null", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  const frtRes = await worker.fetch(req("/frt-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const frtStats = await frtRes.json();
  assert.equal(frtStats.count, 0);
  assert.equal(frtStats.avgMinutes, null);

  const ahtRes = await worker.fetch(req("/aht-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const ahtStats = await ahtRes.json();
  assert.equal(ahtStats.count, 0);
  assert.equal(ahtStats.avgMinutes, null);
});

test("/frt-history e /aht-history devolvem o número certo de semanas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };

  const frtRes = await worker.fetch(req("/frt-history?weeks=4", { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await frtRes.json()).weeks.length, 4);

  const ahtRes = await worker.fetch(req("/aht-history?weeks=4", { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await ahtRes.json()).weeks.length, 4);
});

test("/risk-case-start sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/risk-case-start", { ticketId: "123" }), { ...env, RISK_STATS: createMockKv() });
  assert.equal(res.status, 401);
});

test("/risk-case-start com ticketId inválido -> 400", async () => {
  const res = await worker.fetch(
    postReq("/risk-case-start", { ticketId: "abc" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("/risk-case-start cria o caso e ele aparece em /risk-cases-pending", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  const res = await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70001", valor: 49.9 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);

  const pendingRes = await worker.fetch(
    req("/risk-cases-pending", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { cases } = await pendingRes.json();
  assert.equal(cases.length, 1);
  assert.equal(cases[0].ticketId, "70001");
  assert.equal(cases[0].valor, 49.9);
  assert.equal(cases[0].outcome, null);
});

test("/risk-case-start não cria caso para ticket fora do grupo Suporte Badrock", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(OTHER_GROUP_ID);

  const res = await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70007", valor: 49.9 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(res.status, 200);
  assert.equal((await res.json()).counted, false);

  const pendingRes = await worker.fetch(
    req("/risk-cases-pending", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal((await pendingRes.json()).cases.length, 0);
});

test("/risk-case-start chamado 2x pro mesmo ticket não duplica o caso", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70002", valor: 10 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70002", valor: 999 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );

  const pendingRes = await worker.fetch(
    req("/risk-cases-pending", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { cases } = await pendingRes.json();
  assert.equal(cases.length, 1);
  assert.equal(cases[0].valor, 10); // mantém o valor do primeiro registro
});

test("/risk-outcome sem senha -> 401", async () => {
  const res = await worker.fetch(postReq("/risk-outcome", { ticketId: "1", outcome: "evitado" }), {
    ...env,
    RISK_STATS: createMockKv(),
  });
  assert.equal(res.status, 401);
});

test("/risk-outcome outcome inválido -> 400", async () => {
  const res = await worker.fetch(
    postReq("/risk-outcome", { ticketId: "70003", outcome: "sei-la" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 400);
});

test("/risk-outcome ticket sem caso registrado -> 404", async () => {
  const res = await worker.fetch(
    postReq("/risk-outcome", { ticketId: "99999", outcome: "evitado" }, { "X-App-Token": "senha-correta" }),
    { ...env, RISK_STATS: createMockKv() },
  );
  assert.equal(res.status, 404);
});

test("/risk-outcome marca 'evitado', soma no valor evitado e some da lista de pendentes", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70004", valor: 120.5 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const outcomeRes = await worker.fetch(
    postReq("/risk-outcome", { ticketId: "70004", outcome: "evitado" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(outcomeRes.status, 200);

  const pendingRes = await worker.fetch(
    req("/risk-cases-pending", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal((await pendingRes.json()).cases.length, 0);

  // Soma as últimas 2 semanas para não depender de em qual dia da semana o
  // teste roda (a semana usada é a da detecção, não a da confirmação).
  const historyRes = await worker.fetch(
    req("/prevention-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  const totalEvitado = weeks.reduce((sum, w) => sum + w.evitado, 0);
  const totalChargeback = weeks.reduce((sum, w) => sum + w.chargeback, 0);
  const totalValorEvitado = weeks.reduce((sum, w) => sum + w.evitadoValor, 0);
  assert.equal(totalEvitado, 1);
  assert.equal(totalChargeback, 0);
  assert.equal(totalValorEvitado, 120.5);
});

test("/risk-outcome marca 'chargeback' corretamente", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70005", valor: 30 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  await worker.fetch(
    postReq("/risk-outcome", { ticketId: "70005", outcome: "chargeback" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );

  const historyRes = await worker.fetch(
    req("/prevention-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  const totalEvitado = weeks.reduce((sum, w) => sum + w.evitado, 0);
  const totalChargeback = weeks.reduce((sum, w) => sum + w.chargeback, 0);
  assert.equal(totalEvitado, 0);
  assert.equal(totalChargeback, 1);
});

test("/risk-outcome chamado 2x pro mesmo ticket -> 409 na segunda vez", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  globalThis.fetch = mockTicketGroupFetch(BADROCK_GROUP_ID);

  await worker.fetch(
    postReq("/risk-case-start", { ticketId: "70006", valor: 10 }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const first = await worker.fetch(
    postReq("/risk-outcome", { ticketId: "70006", outcome: "evitado" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(first.status, 200);

  const second = await worker.fetch(
    postReq("/risk-outcome", { ticketId: "70006", outcome: "chargeback" }, { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  assert.equal(second.status, 409);

  // O primeiro resultado registrado não deve ter sido sobrescrito.
  const historyRes = await worker.fetch(
    req("/prevention-history?weeks=2", { "X-App-Token": "senha-correta" }),
    testEnv,
  );
  const { weeks } = await historyRes.json();
  assert.equal(weeks.reduce((sum, w) => sum + w.evitado, 0), 1);
  assert.equal(weeks.reduce((sum, w) => sum + w.chargeback, 0), 0);
});

test("/prevention-stats sem nenhum caso confirmado -> rate null", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(req("/prevention-stats", { "X-App-Token": "senha-correta" }), testEnv);
  const stats = await res.json();
  assert.equal(stats.total, 0);
  assert.equal(stats.rate, null);
});

test("/prevention-history devolve o número certo de semanas", async () => {
  const testEnv = { ...env, RISK_STATS: createMockKv() };
  const res = await worker.fetch(req("/prevention-history?weeks=4", { "X-App-Token": "senha-correta" }), testEnv);
  assert.equal((await res.json()).weeks.length, 4);
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

test("busca com sucesso -> pedido sem CartPanda usa o produto do campo do ticket (PagAmerican/Shopify)", async () => {
  globalThis.fetch = async (url) => {
    const { pathname } = new URL(url);

    if (pathname === "/api/v2/tickets/73336") {
      return Response.json({
        id: 73336,
        requester_id: 555,
        responder_id: null,
        tags: [],
        created_at: "2026-07-18T16:46:38Z",
        description_text: "Produto veio errado",
        custom_fields: {
          cf_pedido_cart: "86788",
          cf_slug_da_loja_cartpanda: "BadBadRock - Beef Organ Complex",
          cf_status_do_atendimento: "Respondido [Aguardando cliente]",
        },
      });
    }

    if (pathname === "/api/v2/tickets/73336/conversations") {
      return Response.json([]);
    }

    if (pathname === "/api/v2/contacts/555") {
      // Conta sem CartPanda: os campos de contato antigos vêm sempre nulos.
      return Response.json({
        name: "Carlos Souza",
        email: "carlos@exemplo.com",
        custom_fields: {
          id_do_pedido_cartpanda: null,
          loja_cartpanda: null,
          vlr_da_ltima_compra: null,
        },
      });
    }

    throw new Error("URL inesperada: " + pathname);
  };

  const res = await worker.fetch(req("/ticket/73336", { "X-App-Token": "senha-correta" }), env);
  assert.equal(res.status, 200);
  const payload = await res.json();

  assert.equal(payload.numeroPedido, "86788");
  assert.equal(payload.produto, "BadBadRock - Beef Organ Complex");
  assert.equal(payload.valorTotal, ""); // sem fonte nenhuma no Freshdesk hoje — fica em branco de propósito
});
