/**
 * Cofre entre o dashboard (site público no GitHub Pages) e a API do
 * Freshdesk. A API Key do Freshdesk e a senha de equipe (APP_TOKEN) ficam
 * guardadas como segredos deste Worker (`wrangler secret put ...`), nunca
 * em código — o dashboard nunca fala direto com o Freshdesk, só com este
 * Worker.
 *
 * Rota: GET /ticket/{numero}
 * Header obrigatório: X-App-Token (a senha de equipe)
 */

const ALLOWED_ORIGIN = "https://fernandawinders1979-png.github.io";

// Nomes técnicos reais dos campos personalizados do CHAMADO, conferidos via
// API em GET /api/v2/ticket_fields na conta hebevi.freshdesk.com.
const CUSTOM_FIELD_CANDIDATES = {
  numeroPedido: ["cf_pedido_cart", "cf_nmero_pedido_eagle_labs"],
  status: ["cf_status_pedido_suporte_ativo", "cf_status_do_atendimento"],
  codigoRastreio: ["cf_rastreio_17track", "cf_novo_nmero_de_rastreio"],
  endereco: ["cf_se_endereo_for_diferente_da_cp_informar_o_correto_aqui"],
};

// Nomes técnicos reais dos campos personalizados do CONTATO, conferidos via
// API em GET /api/v2/contact_fields — é onde os dados do pedido da
// CartPanda ficam salvos nesta conta (não no chamado).
const CONTACT_FIELD_CANDIDATES = {
  numeroPedido: ["id_do_pedido_cartpanda", "pedido_cartpanda"],
  produto: ["loja_cartpanda"],
  valorTotal: ["vlr_da_ltima_compra"],
};

// Campos de contexto extra (dropdowns já usados pelo time para categorizar o
// chamado), mostrados como tags de leitura no dashboard, quando preenchidos.
const CONTEXT_FIELD_LABELS = {
  cf_motivo_do_contato: "Motivo",
  cf_status_do_reembolso: "Status do reembolso",
};

const MAX_CONVERSATION_CHARS = 15000;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "X-App-Token, Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

/**
 * Remove tags HTML de um texto (respostas do Freshdesk vêm em HTML) e
 * normaliza espaços em branco, para virar um texto simples e legível.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Procura, entre uma lista de nomes candidatos de campo personalizado, o
 * primeiro que existe e tem valor preenchido.
 * @param {Object} fields
 * @param {string[]} candidates
 * @returns {string}
 */
function pickCustomField(fields, candidates) {
  for (const key of candidates) {
    const value = fields ? fields[key] : undefined;
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

/**
 * Monta as tags de contexto extra (ex: "Motivo: Alergia - Doença - Médico")
 * a partir dos campos listados em CONTEXT_FIELD_LABELS, quando preenchidos.
 * @param {Object} customFields
 * @returns {string[]}
 */
function buildContextTags(customFields) {
  return Object.entries(CONTEXT_FIELD_LABELS)
    .map(([field, label]) => [label, customFields ? customFields[field] : ""])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);
}

/**
 * Monta o texto completo da conversa do chamado (descrição original +
 * respostas), da mais antiga para a mais recente, identificando quem
 * escreveu cada mensagem. Notas internas (privadas) são ignoradas, pois
 * não fazem parte da conversa com o cliente.
 * @param {Object} ticket
 * @param {Array} conversations
 * @returns {string}
 */
function buildConversationText(ticket, conversations) {
  const entries = [];

  if (ticket && ticket.description_text) {
    entries.push({
      createdAt: ticket.created_at || "",
      from: "Cliente",
      text: ticket.description_text.trim(),
    });
  }

  (conversations || [])
    .filter((entry) => !entry.private)
    .forEach((entry) => {
      const text = (entry.body_text && entry.body_text.trim()) || stripHtml(entry.body);
      if (!text) return;
      entries.push({
        createdAt: entry.created_at || "",
        from: entry.incoming ? "Cliente" : "Atendente",
        text,
      });
    });

  entries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let fullText = entries.map((entry) => `${entry.from}: ${entry.text}`).join("\n\n");

  if (fullText.length > MAX_CONVERSATION_CHARS) {
    fullText =
      "[...conversa mais antiga omitida por tamanho...]\n\n" +
      fullText.slice(fullText.length - MAX_CONVERSATION_CHARS);
  }

  return fullText;
}

/**
 * Chama a API do Freshdesk com a API Key guardada nos segredos do Worker.
 * Lança um erro com `.status` igual ao código HTTP devolvido pelo
 * Freshdesk, para quem chamar poder tratar "não encontrado" (404)
 * diferente de outras falhas.
 * @param {Object} env
 * @param {string} path
 * @returns {Promise<Object>}
 */
async function freshdeskGet(env, path) {
  const auth = btoa(`${env.FRESHDESK_API_KEY}:X`);
  const response = await fetch(`https://${env.FRESHDESK_DOMAIN}${path}`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!response.ok) {
    const error = new Error(`Freshdesk respondeu ${response.status} em ${path}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Monta o payload combinando os dados do chamado e do contato, no mesmo
 * formato que o dashboard (js/core.js -> applyFreshdeskPayload) espera.
 * @param {Object} ticket
 * @param {Array} conversations
 * @param {Object|null} fullContact
 * @returns {Object}
 */
function buildPayload(ticket, conversations, fullContact) {
  const customFields = ticket.custom_fields || {};
  const contactFields = (fullContact && fullContact.custom_fields) || {};

  const pickOrderField = (key) =>
    pickCustomField(contactFields, CONTACT_FIELD_CANDIDATES[key] || []) ||
    pickCustomField(customFields, CUSTOM_FIELD_CANDIDATES[key] || []);

  return {
    nomeCliente: (fullContact && fullContact.name) || "",
    email: (fullContact && fullContact.email) || "",
    numeroPedido: pickOrderField("numeroPedido"),
    produto: pickOrderField("produto"),
    valorTotal: pickOrderField("valorTotal"),
    endereco:
      pickCustomField(customFields, CUSTOM_FIELD_CANDIDATES.endereco) ||
      (fullContact && fullContact.address) ||
      "",
    status: pickCustomField(customFields, CUSTOM_FIELD_CANDIDATES.status),
    codigoRastreio: pickCustomField(customFields, CUSTOM_FIELD_CANDIDATES.codigoRastreio),
    idioma: (fullContact && fullContact.language) || "",
    tags: [...(ticket.tags || []), ...buildContextTags(customFields)],
    conversationText: buildConversationText(ticket, conversations),
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/ticket\/(\d+)$/);
    if (!match) {
      return jsonResponse({ error: "Rota não encontrada. Use /ticket/{numero}." }, 404);
    }

    const token = request.headers.get("X-App-Token");
    if (!env.APP_TOKEN || token !== env.APP_TOKEN) {
      return jsonResponse({ error: "Senha de equipe inválida ou ausente." }, 401);
    }

    const ticketId = match[1];

    try {
      const ticket = await freshdeskGet(env, `/api/v2/tickets/${ticketId}`);

      const [conversations, fullContact] = await Promise.all([
        freshdeskGet(env, `/api/v2/tickets/${ticketId}/conversations?per_page=100`).catch(() => []),
        ticket.requester_id
          ? freshdeskGet(env, `/api/v2/contacts/${ticket.requester_id}`).catch(() => null)
          : Promise.resolve(null),
      ]);

      return jsonResponse(buildPayload(ticket, conversations, fullContact));
    } catch (error) {
      if (error.status === 404) {
        return jsonResponse({ error: "Ticket não encontrado nesse número." }, 404);
      }
      return jsonResponse({ error: "Não foi possível buscar esse ticket agora. Tente de novo em instantes." }, 502);
    }
  },
};
