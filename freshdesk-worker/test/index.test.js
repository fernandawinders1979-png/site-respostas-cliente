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

function req(path, headers = {}) {
  return new Request(`https://freshdesk-proxy.example.workers.dev${path}`, { headers });
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

test("busca com sucesso -> monta payload certo para o dashboard", async () => {
  globalThis.fetch = async (url) => {
    const { pathname } = new URL(url);

    if (pathname === "/api/v2/tickets/58214") {
      return Response.json({
        id: 58214,
        requester_id: 777,
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

    throw new Error("URL inesperada: " + pathname);
  };

  const res = await worker.fetch(req("/ticket/58214", { "X-App-Token": "senha-correta" }), env);
  assert.equal(res.status, 200);
  const payload = await res.json();

  assert.equal(payload.nomeCliente, "Maria Silva");
  assert.equal(payload.email, "maria@exemplo.com");
  assert.equal(payload.numeroPedido, "#58214");
  assert.equal(payload.produto, "Óleo Essencial 30ml");
  assert.equal(payload.valorTotal, "49.90");
  assert.equal(payload.codigoRastreio, "BR123456789");
  assert.equal(payload.status, "Pedido retornou");
  assert.equal(payload.idioma, "pt-BR");
  assert.equal(payload.endereco, "São Paulo, SP");
  assert.ok(payload.tags.includes("vip"));
  assert.ok(payload.tags.some((t) => t.startsWith("Motivo:")));
  assert.match(payload.conversationText, /Cliente: Quero cancelar/);
  assert.match(payload.conversationText, /Atendente: Claro/);
  assert.doesNotMatch(payload.conversationText, /nota interna/);
});
