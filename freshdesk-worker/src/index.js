/**
 * Cofre entre o dashboard (site público no GitHub Pages) e a API do
 * Freshdesk. A API Key do Freshdesk e a senha de equipe (APP_TOKEN) ficam
 * guardadas como segredos deste Worker (`wrangler secret put ...`), nunca
 * em código — o dashboard nunca fala direto com o Freshdesk, só com este
 * Worker.
 *
 * Rotas:
 *   GET  /ticket/{numero}  — dados do chamado, para preencher o painel
 *   POST /risk-event       — soma 1 (e o valor do pedido, se informado) no
 *                            contador semanal de um nível de risco
 *   GET  /risk-stats       — contadores e valores da semana atual
 *   GET  /risk-history     — contadores e valores das últimas N semanas,
 *                            para o gráfico de tendência (dashboard.html)
 *   POST /stat-event       — soma 1 num contador aberto (motivo de contato
 *                            ou template usado), por semana
 *   GET  /stat-ranking     — os valores mais frequentes de uma categoria
 *                            (motivo ou template) nas últimas N semanas
 * Header obrigatório em todas: X-App-Token (a senha de equipe)
 */

const ALLOWED_ORIGIN = "https://fernandawinders1979-png.github.io";

// Níveis de risco aceitos pelo painel de estatísticas (mesmos usados em
// js/core.js -> classifyRisk).
const RISK_LEVELS = ["baixo", "medio", "alto"];

// Categorias aceitas em /stat-event e /stat-ranking — listas abertas
// (motivos de contato, templates usados), diferente dos níveis fixos de risco.
const STAT_CATEGORIES = ["motivo", "template"];

const DEFAULT_HISTORY_WEEKS = 8;
const MAX_HISTORY_WEEKS = 26;
const MAX_RANKING_LIMIT = 20;

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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

/**
 * Calcula a chave da semana ISO 8601 de uma data (ex: "2026-W29"), usada
 * para agrupar os contadores de risco por semana, começando na segunda-feira.
 * @param {Date} date
 * @returns {string}
 */
function getIsoWeekKey(date) {
  const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = current.getUTCDay() || 7;
  current.setUTCDate(current.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((current - yearStart) / 86400000) + 1) / 7);
  return `${current.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
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
 * Monta o payload combinando os dados do chamado, do contato e do agente
 * responsável, no mesmo formato que o dashboard (js/core.js ->
 * applyFreshdeskPayload) espera.
 * @param {Object} ticket
 * @param {Array} conversations
 * @param {Object|null} fullContact
 * @param {Object|null} agent
 * @returns {Object}
 */
function buildPayload(ticket, conversations, fullContact, agent) {
  const customFields = ticket.custom_fields || {};
  const contactFields = (fullContact && fullContact.custom_fields) || {};

  const pickOrderField = (key) =>
    pickCustomField(contactFields, CONTACT_FIELD_CANDIDATES[key] || []) ||
    pickCustomField(customFields, CUSTOM_FIELD_CANDIDATES[key] || []);

  return {
    nomeCliente: (fullContact && fullContact.name) || "",
    email: (fullContact && fullContact.email) || "",
    nomeAgente: (agent && agent.contact && agent.contact.name) || "",
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
    motivo: pickCustomField(customFields, ["cf_motivo_do_contato"]),
    tags: [...(ticket.tags || []), ...buildContextTags(customFields)],
    conversationText: buildConversationText(ticket, conversations),
  };
}

/**
 * Soma 1 no contador de uma semana para o nível de risco informado, e
 * opcionalmente soma um valor em R$ no total acumulado da mesma semana.
 * @param {Object} env
 * @param {string} week chave de semana ISO (ex: "2026-W29")
 * @param {string} level
 * @param {number|null} valor
 */
async function incrementRiskCounter(env, week, level, valor) {
  const countKey = `risk:${week}:${level}`;
  const currentCount = Number(await env.RISK_STATS.get(countKey)) || 0;
  await env.RISK_STATS.put(countKey, String(currentCount + 1));

  if (typeof valor === "number" && Number.isFinite(valor) && valor > 0) {
    const valorKey = `risk:${week}:${level}:valor`;
    const currentValor = Number(await env.RISK_STATS.get(valorKey)) || 0;
    await env.RISK_STATS.put(valorKey, String(currentValor + valor));
  }
}

/**
 * Trata POST /risk-event: registra que uma mensagem foi classificada com
 * determinado nível de risco (e, se informado, o valor do pedido), para o
 * painel de estatísticas e o gráfico de tendência.
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleRiskEvent(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  if (!RISK_LEVELS.includes(body && body.level)) {
    return jsonResponse({ error: "Nível de risco inválido. Use baixo, medio ou alto." }, 400);
  }

  const valor = typeof body.valor === "number" ? body.valor : null;
  await incrementRiskCounter(env, getIsoWeekKey(new Date()), body.level, valor);
  return jsonResponse({ ok: true });
}

/**
 * Busca no KV o contador e o valor acumulado de cada nível de risco numa
 * semana específica.
 * @param {Object} env
 * @param {string} week
 * @returns {Promise<Object>} ex: { week, alto, medio, baixo, altoValor, medioValor, baixoValor }
 */
async function readWeekStats(env, week) {
  const values = await Promise.all(
    RISK_LEVELS.flatMap((level) => [
      env.RISK_STATS.get(`risk:${week}:${level}`),
      env.RISK_STATS.get(`risk:${week}:${level}:valor`),
    ])
  );

  const entry = { week };
  RISK_LEVELS.forEach((level, index) => {
    entry[level] = Number(values[index * 2]) || 0;
    entry[`${level}Valor`] = Number(values[index * 2 + 1]) || 0;
  });
  return entry;
}

/**
 * Trata GET /risk-stats: devolve os contadores e valores de risco da
 * semana atual, para o painel pequeno mostrar no dashboard principal.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleRiskStats(env) {
  const stats = await readWeekStats(env, getIsoWeekKey(new Date()));
  return jsonResponse(stats);
}

/**
 * Trata GET /risk-history: devolve os contadores e valores das últimas N
 * semanas (da mais antiga para a mais recente), para o gráfico de
 * tendência do dashboard de métricas.
 * @param {Object} env
 * @param {string|null} weeksParam
 * @returns {Promise<Response>}
 */
async function handleRiskHistory(env, weeksParam) {
  const requested = parseInt(weeksParam, 10);
  const weeks = Math.min(
    Math.max(Number.isFinite(requested) ? requested : DEFAULT_HISTORY_WEEKS, 1),
    MAX_HISTORY_WEEKS,
  );

  const now = new Date();
  const weekKeys = [];
  for (let i = weeks - 1; i >= 0; i--) {
    weekKeys.push(getIsoWeekKey(new Date(now.getTime() - i * 7 * 86400000)));
  }

  const history = await Promise.all(weekKeys.map((week) => readWeekStats(env, week)));
  return jsonResponse({ weeks: history });
}

/**
 * Transforma um texto livre (ex: "Atraso na Entrega") numa chave segura
 * para o KV: minúsculo, sem acento, só letras/números/hífen, tamanho
 * limitado. Usado para agrupar motivos/templates que só diferem em
 * maiúscula/acentuação sob a mesma chave.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Soma 1 no contador de uma categoria/semana/valor (motivo de contato ou
 * template usado). Guarda um JSON { count, label } — o label preserva o
 * texto original pra exibição, mesmo com a chave "limpa" pelo slugify.
 * @param {Object} env
 * @param {string} category
 * @param {string} week
 * @param {string} rawKey
 * @param {string} label
 */
async function incrementNamedCounter(env, category, week, rawKey, label) {
  const slug = slugify(rawKey);
  if (!slug) return;

  const kvKey = `stat:${category}:${week}:${slug}`;
  const current = await env.RISK_STATS.get(kvKey);
  const parsed = current ? JSON.parse(current) : { count: 0, label: label || rawKey };
  parsed.count += 1;
  if (label) parsed.label = label;
  await env.RISK_STATS.put(kvKey, JSON.stringify(parsed));
}

/**
 * Trata POST /stat-event: registra uma ocorrência de motivo de contato ou
 * template usado, para os rankings do dashboard de métricas.
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleStatEvent(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  if (!STAT_CATEGORIES.includes(body && body.category)) {
    return jsonResponse({ error: "Categoria inválida. Use motivo ou template." }, 400);
  }

  const key = typeof body.key === "string" ? body.key.trim().slice(0, 200) : "";
  if (!key) {
    return jsonResponse({ error: "Campo key é obrigatório." }, 400);
  }
  const label = typeof body.label === "string" ? body.label.trim().slice(0, 120) : "";

  await incrementNamedCounter(env, body.category, getIsoWeekKey(new Date()), key, label);
  return jsonResponse({ ok: true });
}

/**
 * Trata GET /stat-ranking: soma, entre as últimas N semanas, quantas vezes
 * cada valor apareceu numa categoria (motivo ou template), e devolve os
 * mais frequentes primeiro.
 * @param {Object} env
 * @param {URLSearchParams} searchParams
 * @returns {Promise<Response>}
 */
async function handleStatRanking(env, searchParams) {
  const category = searchParams.get("category");
  if (!STAT_CATEGORIES.includes(category)) {
    return jsonResponse({ error: "Categoria inválida. Use motivo ou template." }, 400);
  }

  const requestedWeeks = parseInt(searchParams.get("weeks"), 10);
  const weeks = Math.min(
    Math.max(Number.isFinite(requestedWeeks) ? requestedWeeks : DEFAULT_HISTORY_WEEKS, 1),
    MAX_HISTORY_WEEKS,
  );
  const requestedLimit = parseInt(searchParams.get("limit"), 10);
  const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 5, 1), MAX_RANKING_LIMIT);

  const now = new Date();
  const weekKeys = [];
  for (let i = weeks - 1; i >= 0; i--) {
    weekKeys.push(getIsoWeekKey(new Date(now.getTime() - i * 7 * 86400000)));
  }

  const totals = new Map();
  for (const week of weekKeys) {
    const { keys } = await env.RISK_STATS.list({ prefix: `stat:${category}:${week}:` });
    const entries = await Promise.all(keys.map((k) => env.RISK_STATS.get(k.name)));

    keys.forEach((k, index) => {
      const raw = entries[index];
      if (!raw) return;
      const { count, label } = JSON.parse(raw);
      const slug = k.name.split(":").pop();
      const existing = totals.get(slug) || { slug, label, count: 0 };
      existing.count += count;
      existing.label = label || existing.label;
      totals.set(slug, existing);
    });
  }

  const items = [...totals.values()].sort((a, b) => b.count - a.count).slice(0, limit);
  return jsonResponse({ category, weeks, items });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const token = request.headers.get("X-App-Token");
    if (!env.APP_TOKEN || token !== env.APP_TOKEN) {
      return jsonResponse({ error: "Senha de equipe inválida ou ausente." }, 401);
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/risk-event") {
      return handleRiskEvent(request, env);
    }

    if (request.method === "GET" && url.pathname === "/risk-stats") {
      return handleRiskStats(env);
    }

    if (request.method === "GET" && url.pathname === "/risk-history") {
      return handleRiskHistory(env, url.searchParams.get("weeks"));
    }

    if (request.method === "POST" && url.pathname === "/stat-event") {
      return handleStatEvent(request, env);
    }

    if (request.method === "GET" && url.pathname === "/stat-ranking") {
      return handleStatRanking(env, url.searchParams);
    }

    const match = url.pathname.match(/^\/ticket\/(\d+)$/);
    if (!match) {
      return jsonResponse({ error: "Rota não encontrada. Use /ticket/{numero}." }, 404);
    }

    const ticketId = match[1];

    try {
      const ticket = await freshdeskGet(env, `/api/v2/tickets/${ticketId}`);

      const [conversations, fullContact, agent] = await Promise.all([
        freshdeskGet(env, `/api/v2/tickets/${ticketId}/conversations?per_page=100`).catch(() => []),
        ticket.requester_id
          ? freshdeskGet(env, `/api/v2/contacts/${ticket.requester_id}`).catch(() => null)
          : Promise.resolve(null),
        ticket.responder_id
          ? freshdeskGet(env, `/api/v2/agents/${ticket.responder_id}`).catch(() => null)
          : Promise.resolve(null),
      ]);

      return jsonResponse(buildPayload(ticket, conversations, fullContact, agent));
    } catch (error) {
      if (error.status === 404) {
        return jsonResponse({ error: "Ticket não encontrado nesse número." }, 404);
      }
      return jsonResponse({ error: "Não foi possível buscar esse ticket agora. Tente de novo em instantes." }, 502);
    }
  },
};
