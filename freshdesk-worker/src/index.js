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
 *   POST /stat-event       — soma 1 num contador aberto (motivo de contato,
 *                            template usado ou resposta copiada), por semana
 *   GET  /stat-ranking     — os valores mais frequentes de uma categoria
 *                            (motivo ou template) nas últimas N semanas
 *   GET  /stat-history     — histórico semanal de uma chave específica
 *                            (ex: categoria "resposta", chave "total"), para
 *                            o gráfico de volume de atendimento
 *   POST /csat-sync        — busca no Freshdesk as respostas novas da
 *                            pesquisa de satisfação (CSAT) e soma nos
 *                            contadores semanais. Roda sozinho 1x por dia
 *                            (ver `scheduled` no fim do arquivo), mas também
 *                            pode ser chamado manualmente pelo botão
 *                            "Sincronizar agora" do dashboard de métricas.
 *   GET  /csat-stats       — contadores de CSAT (feliz/neutro/insatisfeito)
 *                            e nota (% feliz) da semana atual
 *   GET  /csat-history     — mesmos contadores das últimas N semanas, para
 *                            o gráfico de tendência de satisfação
 *   POST /fcr-start        — marca que uma resposta acabou de ser copiada
 *                            para um ticket (primeiro contato), começando a
 *                            "janela de espera" de FCR_WINDOW_DAYS dias
 *   POST /fcr-sync         — verifica os tickets cuja janela de espera já
 *                            passou: se o ticket não foi reaberto
 *                            (reopened_at) depois da resposta, conta como
 *                            resolvido no primeiro contato; se foi, conta
 *                            como "precisou de novo contato". Roda sozinho
 *                            1x por dia (ver `scheduled`), mas também pode
 *                            ser chamado manualmente
 *   GET  /fcr-stats        — contadores de FCR (sucesso/reaberto) e taxa
 *                            (% sucesso) da semana atual
 *   GET  /fcr-history      — mesmos contadores das últimas N semanas, para
 *                            o gráfico de tendência de FCR
 *   POST /duration-sync    — busca no Freshdesk os tickets atualizados
 *                            recentemente (com include=stats) e soma nos
 *                            contadores semanais de FRT (tempo até a
 *                            primeira resposta) e AHT (tempo até a
 *                            resolução). Roda sozinho 1x por dia (ver
 *                            `scheduled`), mas também pode ser chamado
 *                            manualmente
 *   GET  /frt-stats        — média de minutos até a primeira resposta e
 *                            quantidade de tickets, na semana atual
 *   GET  /frt-history      — mesmos dados das últimas N semanas
 *   GET  /aht-stats        — média de minutos até a resolução e
 *                            quantidade de tickets, na semana atual
 *   GET  /aht-history      — mesmos dados das últimas N semanas
 *   POST /risk-case-start  — registra um caso de risco alto identificado
 *                            num ticket real, aguardando confirmação manual
 *                            do resultado (evitado ou virou chargeback)
 *   GET  /risk-cases-pending — lista os casos de risco alto ainda sem
 *                            confirmação, para o atendente marcar
 *   POST /risk-outcome     — confirma o resultado de um caso (evitado ou
 *                            chargeback) e soma nos contadores semanais de
 *                            prevenção
 *   GET  /prevention-stats — contadores de prevenção (evitado/chargeback),
 *                            valor evitado e taxa (% evitado) da semana atual
 *   GET  /prevention-history — mesmos dados das últimas N semanas
 * Header obrigatório em todas: X-App-Token (a senha de equipe)
 */

const ALLOWED_ORIGIN = "https://fernandawinders1979-png.github.io";

// Níveis de risco aceitos pelo painel de estatísticas (mesmos usados em
// js/core.js -> classifyRisk).
const RISK_LEVELS = ["baixo", "medio", "alto"];

// Baldes de satisfação (CSAT). A escala real da conta (conferida via API em
// GET /api/v2/surveys na conta hebevi.freshdesk.com) é de 3 pontos com os
// códigos 103 / 100 / -103 em "ratings.default_question" — 100 é sempre o
// ponto neutro da escala do Freshdesk, valores acima são cada vez mais
// felizes e abaixo cada vez mais insatisfeitos (ver classifyCsatRating).
const CSAT_LEVELS = ["feliz", "neutro", "insatisfeito"];
const CSAT_SYNC_PER_PAGE = 100;
const CSAT_SYNC_MAX_PAGES = 10;
const CSAT_LAST_SYNCED_ID_KEY = "csat:lastSyncedId";

// FCR (First Contact Resolution) é calculado por conta própria, não vem
// pronto do Freshdesk: a API de histórico de status (/activities) não está
// disponível nesta conta/plano (conferido ao vivo), e não existe nenhum
// campo customizado já usado pelo time para marcar reabertura. A abordagem
// usada aqui: quando uma resposta é copiada para um ticket, guardamos o
// horário; depois de FCR_WINDOW_DAYS dias, buscamos o ticket com
// include=stats (mesma fonte do FRT/AHT) e conferimos o campo oficial
// "reopened_at". Se o ticket não foi reaberto depois desse horário, conta
// como resolvido no primeiro contato; se foi, conta como reaberto (ver
// classifyFcrOutcome).
const FCR_WINDOW_DAYS = 3;
const FCR_PENDING_PREFIX = "fcr:pending:";

// FRT (First Response Time) e AHT (tempo até a resolução) vêm prontos do
// Freshdesk: GET /api/v2/tickets/{id}?include=stats devolve um objeto
// "stats" com first_responded_at e resolved_at (conferido ao vivo na conta
// hebevi.freshdesk.com). Cada ticket só é somado 1x por métrica (flags
// "done" no KV), e o cursor de sincronização (updated_since) só avança pela
// sequência de tickets processados com sucesso — se algum falhar no meio do
// lote, o cursor para ali, para não perder aquele ticket na próxima rodada.
const DURATION_METRICS = {
  frt: { statsField: "first_responded_at" },
  aht: { statsField: "resolved_at" },
};
const DURATION_LAST_SYNCED_KEY = "duration:lastSyncedAt";
const DURATION_SYNC_PER_PAGE = 100;
const DURATION_SYNC_MAX_PAGES = 10;
const DURATION_INITIAL_LOOKBACK_DAYS = 30;

// "Fecha o ciclo" do risco de chargeback: diferente de CSAT/FCR/FRT/AHT, o
// resultado real (o caso virou chargeback de verdade ou foi evitado) não
// está em nenhum campo do Freshdesk — só quem cuida do caso sabe. Por isso
// essa confirmação é sempre manual, feita no dashboard de métricas, sem
// nenhum agendamento automático.
const RISK_CASE_PREFIX = "riskcase:";
const RISK_OUTCOMES = ["evitado", "chargeback"];

// Categorias aceitas em /stat-event, /stat-ranking e /stat-history. Motivo e
// template têm uma lista aberta de valores; resposta usa sempre a mesma
// chave fixa ("total") — é só uma contagem simples por semana.
const STAT_CATEGORIES = ["motivo", "template", "resposta"];

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
 * Classifica o valor bruto de "ratings.default_question" (devolvido pela API
 * de satisfaction_ratings do Freshdesk) num dos baldes de CSAT_LEVELS. 100 é
 * sempre o ponto neutro da escala do Freshdesk; acima é feliz, abaixo é
 * insatisfeito (ver comentário de CSAT_LEVELS no topo do arquivo).
 * @param {number} rawValue
 * @returns {"feliz"|"neutro"|"insatisfeito"|null}
 */
function classifyCsatRating(rawValue) {
  if (typeof rawValue !== "number") return null;
  if (rawValue > 100) return "feliz";
  if (rawValue === 100) return "neutro";
  return "insatisfeito";
}

/**
 * Busca no Freshdesk todas as avaliações de satisfação com id maior que
 * `lastId` (percorrendo páginas até encontrar uma página incompleta, ou até
 * o limite de segurança CSAT_SYNC_MAX_PAGES).
 * @param {Object} env
 * @param {number} lastId
 * @returns {Promise<Array>}
 */
async function fetchNewSatisfactionRatings(env, lastId) {
  const collected = [];
  for (let page = 1; page <= CSAT_SYNC_MAX_PAGES; page++) {
    const batch = await freshdeskGet(
      env,
      `/api/v2/surveys/satisfaction_ratings?page=${page}&per_page=${CSAT_SYNC_PER_PAGE}`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    collected.push(...batch);
    if (batch.length < CSAT_SYNC_PER_PAGE) break;
  }
  return collected.filter((rating) => Number(rating.id) > lastId);
}

/**
 * Soma 1 no contador CSAT de uma semana/balde.
 * @param {Object} env
 * @param {string} week
 * @param {string} level
 */
async function incrementCsatCounter(env, week, level) {
  const key = `csat:${week}:${level}`;
  const current = Number(await env.RISK_STATS.get(key)) || 0;
  await env.RISK_STATS.put(key, String(current + 1));
}

/**
 * Busca as avaliações de satisfação novas no Freshdesk (desde a última
 * sincronização, controlada pelo cursor CSAT_LAST_SYNCED_ID_KEY guardado no
 * KV) e soma nos contadores semanais. Chamada tanto pelo gatilho agendado
 * (1x por dia) quanto pelo botão "Sincronizar agora" do dashboard.
 * @param {Object} env
 * @returns {Promise<{synced: number}>}
 */
async function syncCsatRatings(env) {
  const lastId = Number(await env.RISK_STATS.get(CSAT_LAST_SYNCED_ID_KEY)) || 0;
  const newRatings = await fetchNewSatisfactionRatings(env, lastId);

  let maxId = lastId;
  for (const rating of newRatings) {
    const level = classifyCsatRating(rating.ratings && rating.ratings.default_question);
    if (level) {
      const week = getIsoWeekKey(new Date(rating.created_at || Date.now()));
      await incrementCsatCounter(env, week, level);
    }
    if (Number(rating.id) > maxId) maxId = Number(rating.id);
  }

  if (maxId > lastId) {
    await env.RISK_STATS.put(CSAT_LAST_SYNCED_ID_KEY, String(maxId));
  }

  return { synced: newRatings.length };
}

/**
 * Trata POST /csat-sync.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleCsatSync(env) {
  try {
    const result = await syncCsatRatings(env);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    return jsonResponse({ error: "Não foi possível sincronizar com o Freshdesk agora." }, 502);
  }
}

/**
 * Busca no KV os contadores de CSAT de uma semana e calcula a nota (%
 * feliz sobre o total de respostas).
 * @param {Object} env
 * @param {string} week
 * @returns {Promise<Object>} ex: { week, feliz, neutro, insatisfeito, total, score }
 */
async function readWeekCsat(env, week) {
  const values = await Promise.all(CSAT_LEVELS.map((level) => env.RISK_STATS.get(`csat:${week}:${level}`)));

  const entry = { week };
  CSAT_LEVELS.forEach((level, index) => {
    entry[level] = Number(values[index]) || 0;
  });
  entry.total = CSAT_LEVELS.reduce((sum, level) => sum + entry[level], 0);
  entry.score = entry.total > 0 ? Math.round((entry.feliz / entry.total) * 1000) / 10 : null;
  return entry;
}

/**
 * Trata GET /csat-stats: devolve os contadores e a nota de CSAT da semana
 * atual.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleCsatStats(env) {
  const stats = await readWeekCsat(env, getIsoWeekKey(new Date()));
  return jsonResponse(stats);
}

/**
 * Trata GET /csat-history: devolve os contadores e a nota de CSAT das
 * últimas N semanas (da mais antiga para a mais recente), para o gráfico de
 * tendência de satisfação do dashboard de métricas.
 * @param {Object} env
 * @param {string|null} weeksParam
 * @returns {Promise<Response>}
 */
async function handleCsatHistory(env, weeksParam) {
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

  const history = await Promise.all(weekKeys.map((week) => readWeekCsat(env, week)));
  return jsonResponse({ weeks: history });
}

/**
 * Trata POST /fcr-start: registra que uma resposta acabou de ser copiada
 * para um ticket, começando a janela de espera. Se o ticket já estiver
 * pendente (o atendente copiou mais de uma vez o mesmo caso, ex: PT e
 * depois EN), mantém o horário já guardado — o relógio começa a contar no
 * primeiro contato, não no último.
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleFcrStart(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
  if (!ticketId || !/^\d+$/.test(ticketId)) {
    return jsonResponse({ error: "Campo ticketId é obrigatório (número do ticket)." }, 400);
  }

  const key = `${FCR_PENDING_PREFIX}${ticketId}`;
  const existing = await env.RISK_STATS.get(key);
  if (!existing) {
    await env.RISK_STATS.put(key, JSON.stringify({ firstResponseAt: new Date().toISOString() }));
  }

  return jsonResponse({ ok: true });
}

/**
 * Busca o ticket no Freshdesk com include=stats e verifica o campo oficial
 * "reopened_at" (a mesma fonte usada pelo FRT/AHT). Antes, essa checagem
 * era feita vasculhando a conversa atrás de qualquer mensagem nova do
 * cliente — mas isso gerava falso positivo em casos normais de atendimento
 * (ex: ticket em "Pending" aguardando uma informação do cliente, que
 * responde exatamente o que foi pedido; isso não é uma reabertura, é o
 * fluxo esperado). reopened_at só é preenchido quando o Freshdesk de fato
 * reabre o ticket (Resolvido/Fechado voltando para Aberto), o que reflete
 * melhor a intenção da métrica.
 * @param {Object} env
 * @param {string} ticketId
 * @param {string} firstResponseAt
 * @returns {Promise<boolean>} true = resolvido no primeiro contato (não reaberto depois)
 */
async function classifyFcrOutcome(env, ticketId, firstResponseAt) {
  const detail = await freshdeskGet(env, `/api/v2/tickets/${ticketId}?include=stats`);
  const reopenedAt = detail.stats && detail.stats.reopened_at;
  if (!reopenedAt) return true;

  const reopenedTime = new Date(reopenedAt).getTime();
  const firstResponseTime = new Date(firstResponseAt).getTime();
  return !(reopenedTime > firstResponseTime);
}

/**
 * Soma 1 no contador FCR de uma semana/resultado.
 * @param {Object} env
 * @param {string} week
 * @param {"sucesso"|"reaberto"} outcome
 */
async function incrementFcrCounter(env, week, outcome) {
  const key = `fcr:${week}:${outcome}`;
  const current = Number(await env.RISK_STATS.get(key)) || 0;
  await env.RISK_STATS.put(key, String(current + 1));
}

/**
 * Percorre os tickets pendentes de FCR e finaliza os que já passaram da
 * janela de espera (FCR_WINDOW_DAYS), consultando o Freshdesk para saber se
 * o ticket foi reaberto. Tickets ainda dentro da janela, ou que dão erro na
 * consulta (ex: Freshdesk fora do ar), continuam pendentes para a próxima
 * varredura.
 * @param {Object} env
 * @returns {Promise<{processed: number, pending: number}>}
 */
async function sweepFcrPending(env) {
  const { keys } = await env.RISK_STATS.list({ prefix: FCR_PENDING_PREFIX });
  const now = Date.now();
  let processed = 0;
  let pending = 0;

  for (const keyObj of keys) {
    const raw = await env.RISK_STATS.get(keyObj.name);
    if (!raw) continue;

    let firstResponseAt;
    try {
      ({ firstResponseAt } = JSON.parse(raw));
    } catch (error) {
      await env.RISK_STATS.delete(keyObj.name);
      continue;
    }

    const firstResponseTime = new Date(firstResponseAt).getTime();
    if (!Number.isFinite(firstResponseTime)) {
      await env.RISK_STATS.delete(keyObj.name);
      continue;
    }

    const ageDays = (now - firstResponseTime) / 86400000;
    if (ageDays < FCR_WINDOW_DAYS) {
      pending += 1;
      continue;
    }

    const ticketId = keyObj.name.slice(FCR_PENDING_PREFIX.length);
    try {
      const resolvedFirstContact = await classifyFcrOutcome(env, ticketId, firstResponseAt);
      const week = getIsoWeekKey(new Date(firstResponseAt));
      await incrementFcrCounter(env, week, resolvedFirstContact ? "sucesso" : "reaberto");
      await env.RISK_STATS.delete(keyObj.name);
      processed += 1;
    } catch (error) {
      // Não deu pra confirmar agora (ticket excluído, Freshdesk fora do ar
      // etc.) — mantém pendente e tenta de novo na próxima varredura.
      pending += 1;
    }
  }

  return { processed, pending };
}

/**
 * Trata POST /fcr-sync.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleFcrSync(env) {
  try {
    const result = await sweepFcrPending(env);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    return jsonResponse({ error: "Não foi possível verificar os chamados agora." }, 502);
  }
}

/**
 * Busca no KV os contadores de FCR de uma semana e calcula a taxa (%
 * resolvido no primeiro contato sobre o total já finalizado).
 * @param {Object} env
 * @param {string} week
 * @returns {Promise<Object>} ex: { week, sucesso, reaberto, total, rate }
 */
async function readWeekFcr(env, week) {
  const [sucesso, reaberto] = await Promise.all([
    env.RISK_STATS.get(`fcr:${week}:sucesso`),
    env.RISK_STATS.get(`fcr:${week}:reaberto`),
  ]);

  const entry = {
    week,
    sucesso: Number(sucesso) || 0,
    reaberto: Number(reaberto) || 0,
  };
  entry.total = entry.sucesso + entry.reaberto;
  entry.rate = entry.total > 0 ? Math.round((entry.sucesso / entry.total) * 1000) / 10 : null;
  return entry;
}

/**
 * Trata GET /fcr-stats: devolve os contadores e a taxa de FCR da semana
 * atual (semana em que a primeira resposta foi copiada, não a semana em
 * que a verificação aconteceu).
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleFcrStats(env) {
  const stats = await readWeekFcr(env, getIsoWeekKey(new Date()));
  return jsonResponse(stats);
}

/**
 * Trata GET /fcr-history: devolve os contadores e a taxa de FCR das
 * últimas N semanas (da mais antiga para a mais recente).
 * @param {Object} env
 * @param {string|null} weeksParam
 * @returns {Promise<Response>}
 */
async function handleFcrHistory(env, weeksParam) {
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

  const history = await Promise.all(weekKeys.map((week) => readWeekFcr(env, week)));
  return jsonResponse({ weeks: history });
}

/**
 * Busca no Freshdesk os tickets atualizados desde `sinceIso`, paginando até
 * encontrar uma página incompleta ou até o limite de segurança
 * DURATION_SYNC_MAX_PAGES.
 * @param {Object} env
 * @param {string} sinceIso
 * @returns {Promise<Array>}
 */
async function fetchUpdatedTickets(env, sinceIso) {
  const collected = [];
  for (let page = 1; page <= DURATION_SYNC_MAX_PAGES; page++) {
    const batch = await freshdeskGet(
      env,
      `/api/v2/tickets?updated_since=${encodeURIComponent(sinceIso)}&order_by=updated_at&order_type=asc&per_page=${DURATION_SYNC_PER_PAGE}&page=${page}`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    collected.push(...batch);
    if (batch.length < DURATION_SYNC_PER_PAGE) break;
  }
  return collected;
}

/**
 * Soma uma amostra (em minutos) no acumulador semanal de uma métrica de
 * duração (frt ou aht) — guarda soma e contagem separadas para poder
 * calcular a média a qualquer momento.
 * @param {Object} env
 * @param {"frt"|"aht"} metric
 * @param {string} week
 * @param {number} minutes
 */
async function recordDurationSample(env, metric, week, minutes) {
  const sumKey = `${metric}:${week}:sum`;
  const countKey = `${metric}:${week}:count`;
  const [currentSum, currentCount] = await Promise.all([
    env.RISK_STATS.get(sumKey),
    env.RISK_STATS.get(countKey),
  ]);
  await Promise.all([
    env.RISK_STATS.put(sumKey, String((Number(currentSum) || 0) + minutes)),
    env.RISK_STATS.put(countKey, String((Number(currentCount) || 0) + 1)),
  ]);
}

/**
 * Sincroniza FRT e AHT: busca os tickets tocados desde a última
 * sincronização, pega o detalhe de cada um com include=stats, e soma nos
 * contadores semanais os que ainda não tinham sido contados (flags
 * "done" no KV evitam duplicar quando o mesmo ticket aparece de novo por
 * outro motivo, ex: reaberto ou campo editado depois de resolvido).
 * @param {Object} env
 * @returns {Promise<{ticketsChecked: number, frtRecorded: number, ahtRecorded: number}>}
 */
async function syncDurationMetrics(env) {
  const lastSyncedAt =
    (await env.RISK_STATS.get(DURATION_LAST_SYNCED_KEY)) ||
    new Date(Date.now() - DURATION_INITIAL_LOOKBACK_DAYS * 86400000).toISOString();

  const tickets = await fetchUpdatedTickets(env, lastSyncedAt);

  let frtRecorded = 0;
  let ahtRecorded = 0;
  let cursorAdvance = lastSyncedAt;
  let stopAdvancing = false;

  for (const summary of tickets) {
    let detail;
    try {
      detail = await freshdeskGet(env, `/api/v2/tickets/${summary.id}?include=stats`);
    } catch (error) {
      stopAdvancing = true;
      continue;
    }

    const stats = detail.stats || {};
    const createdTime = new Date(detail.created_at).getTime();
    const week = getIsoWeekKey(new Date(detail.created_at));

    for (const [metric, config] of Object.entries(DURATION_METRICS)) {
      const finishedAt = stats[config.statsField];
      if (!finishedAt) continue;

      const doneKey = `duration:${metric}Done:${summary.id}`;
      if (await env.RISK_STATS.get(doneKey)) continue;

      const minutes = (new Date(finishedAt).getTime() - createdTime) / 60000;
      if (!Number.isFinite(minutes) || minutes < 0) continue;

      await recordDurationSample(env, metric, week, minutes);
      await env.RISK_STATS.put(doneKey, "1");
      if (metric === "frt") frtRecorded += 1;
      if (metric === "aht") ahtRecorded += 1;
    }

    if (!stopAdvancing && summary.updated_at) {
      cursorAdvance = summary.updated_at;
    }
  }

  if (cursorAdvance !== lastSyncedAt) {
    await env.RISK_STATS.put(DURATION_LAST_SYNCED_KEY, cursorAdvance);
  }

  return { ticketsChecked: tickets.length, frtRecorded, ahtRecorded };
}

/**
 * Trata POST /duration-sync.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleDurationSync(env) {
  try {
    const result = await syncDurationMetrics(env);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    return jsonResponse({ error: "Não foi possível sincronizar com o Freshdesk agora." }, 502);
  }
}

/**
 * Busca no KV a soma e a contagem de uma métrica de duração numa semana, e
 * calcula a média em minutos.
 * @param {Object} env
 * @param {"frt"|"aht"} metric
 * @param {string} week
 * @returns {Promise<Object>} ex: { week, count, avgMinutes }
 */
async function readWeekDuration(env, metric, week) {
  const [sum, count] = await Promise.all([
    env.RISK_STATS.get(`${metric}:${week}:sum`),
    env.RISK_STATS.get(`${metric}:${week}:count`),
  ]);

  const totalCount = Number(count) || 0;
  const totalSum = Number(sum) || 0;
  return {
    week,
    count: totalCount,
    avgMinutes: totalCount > 0 ? Math.round((totalSum / totalCount) * 10) / 10 : null,
  };
}

/**
 * Trata GET /frt-stats e GET /aht-stats (mesma lógica, métrica diferente).
 * @param {Object} env
 * @param {"frt"|"aht"} metric
 * @returns {Promise<Response>}
 */
async function handleDurationStats(env, metric) {
  const stats = await readWeekDuration(env, metric, getIsoWeekKey(new Date()));
  return jsonResponse(stats);
}

/**
 * Trata GET /frt-history e GET /aht-history.
 * @param {Object} env
 * @param {"frt"|"aht"} metric
 * @param {string|null} weeksParam
 * @returns {Promise<Response>}
 */
async function handleDurationHistory(env, metric, weeksParam) {
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

  const history = await Promise.all(weekKeys.map((week) => readWeekDuration(env, metric, week)));
  return jsonResponse({ weeks: history });
}

/**
 * Trata POST /risk-case-start: registra que um caso de risco alto foi
 * identificado num ticket real, aguardando confirmação manual depois. Se o
 * ticket já tiver um caso registrado (ex: a mensagem foi analisada de novo),
 * mantém o registro original — o horário de detecção não deve mudar.
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleRiskCaseStart(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
  if (!ticketId || !/^\d+$/.test(ticketId)) {
    return jsonResponse({ error: "Campo ticketId é obrigatório (número do ticket)." }, 400);
  }

  const key = `${RISK_CASE_PREFIX}${ticketId}`;
  const existing = await env.RISK_STATS.get(key);
  if (!existing) {
    const valor = typeof body.valor === "number" && Number.isFinite(body.valor) ? body.valor : null;
    const now = new Date();
    await env.RISK_STATS.put(
      key,
      JSON.stringify({
        ticketId,
        valor,
        week: getIsoWeekKey(now),
        detectedAt: now.toISOString(),
        outcome: null,
      }),
    );
  }

  return jsonResponse({ ok: true });
}

/**
 * Trata GET /risk-cases-pending: lista os casos de risco alto ainda sem
 * confirmação de resultado, mais recentes primeiro.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleRiskCasesPending(env) {
  const { keys } = await env.RISK_STATS.list({ prefix: RISK_CASE_PREFIX });
  const entries = await Promise.all(keys.map((k) => env.RISK_STATS.get(k.name)));

  const cases = entries
    .map((raw) => (raw ? JSON.parse(raw) : null))
    .filter((item) => item && !item.outcome)
    .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));

  return jsonResponse({ cases });
}

/**
 * Trata POST /risk-outcome: confirma se um caso de risco alto foi evitado
 * ou virou chargeback de verdade, e soma nos contadores semanais de
 * prevenção (na semana em que o caso foi DETECTADO, não a de hoje).
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handleRiskOutcome(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400);
  }

  const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
  const outcome = body.outcome;
  if (!ticketId || !RISK_OUTCOMES.includes(outcome)) {
    return jsonResponse({ error: "Campos ticketId e outcome (evitado ou chargeback) são obrigatórios." }, 400);
  }

  const key = `${RISK_CASE_PREFIX}${ticketId}`;
  const raw = await env.RISK_STATS.get(key);
  if (!raw) {
    return jsonResponse({ error: "Caso não encontrado." }, 404);
  }

  const caseData = JSON.parse(raw);
  if (caseData.outcome) {
    return jsonResponse({ error: "Esse caso já foi confirmado antes." }, 409);
  }

  caseData.outcome = outcome;
  caseData.resolvedAt = new Date().toISOString();
  await env.RISK_STATS.put(key, JSON.stringify(caseData));

  const countKey = `prevention:${caseData.week}:${outcome}`;
  const currentCount = Number(await env.RISK_STATS.get(countKey)) || 0;
  await env.RISK_STATS.put(countKey, String(currentCount + 1));

  if (outcome === "evitado" && typeof caseData.valor === "number") {
    const valorKey = `prevention:${caseData.week}:evitadoValor`;
    const currentValor = Number(await env.RISK_STATS.get(valorKey)) || 0;
    await env.RISK_STATS.put(valorKey, String(currentValor + caseData.valor));
  }

  return jsonResponse({ ok: true });
}

/**
 * Busca no KV os contadores de prevenção de uma semana e calcula a taxa (%
 * evitado sobre o total de casos já confirmados).
 * @param {Object} env
 * @param {string} week
 * @returns {Promise<Object>} ex: { week, evitado, chargeback, evitadoValor, total, rate }
 */
async function readWeekPrevention(env, week) {
  const [evitado, chargeback, evitadoValor] = await Promise.all([
    env.RISK_STATS.get(`prevention:${week}:evitado`),
    env.RISK_STATS.get(`prevention:${week}:chargeback`),
    env.RISK_STATS.get(`prevention:${week}:evitadoValor`),
  ]);

  const entry = {
    week,
    evitado: Number(evitado) || 0,
    chargeback: Number(chargeback) || 0,
    evitadoValor: Number(evitadoValor) || 0,
  };
  entry.total = entry.evitado + entry.chargeback;
  entry.rate = entry.total > 0 ? Math.round((entry.evitado / entry.total) * 1000) / 10 : null;
  return entry;
}

/**
 * Trata GET /prevention-stats.
 * @param {Object} env
 * @returns {Promise<Response>}
 */
async function handlePreventionStats(env) {
  const stats = await readWeekPrevention(env, getIsoWeekKey(new Date()));
  return jsonResponse(stats);
}

/**
 * Trata GET /prevention-history.
 * @param {Object} env
 * @param {string|null} weeksParam
 * @returns {Promise<Response>}
 */
async function handlePreventionHistory(env, weeksParam) {
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

  const history = await Promise.all(weekKeys.map((week) => readWeekPrevention(env, week)));
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

/**
 * Trata GET /stat-history: devolve o histórico semanal (mais antiga ->
 * mais recente) de UMA chave específica dentro de uma categoria — ex:
 * category=resposta, key=total, para o gráfico de volume de atendimento.
 * Mesmo padrão de janela de semanas de handleRiskHistory, generalizado
 * para categoria/chave em vez dos 3 níveis fixos de risco.
 * @param {Object} env
 * @param {URLSearchParams} searchParams
 * @returns {Promise<Response>}
 */
async function handleStatHistory(env, searchParams) {
  const category = searchParams.get("category");
  if (!STAT_CATEGORIES.includes(category)) {
    return jsonResponse({ error: "Categoria inválida. Use motivo, template ou resposta." }, 400);
  }

  const key = searchParams.get("key");
  const slug = slugify(key || "");
  if (!slug) {
    return jsonResponse({ error: "Campo key é obrigatório." }, 400);
  }

  const requestedWeeks = parseInt(searchParams.get("weeks"), 10);
  const weeks = Math.min(
    Math.max(Number.isFinite(requestedWeeks) ? requestedWeeks : DEFAULT_HISTORY_WEEKS, 1),
    MAX_HISTORY_WEEKS,
  );

  const now = new Date();
  const weekKeys = [];
  for (let i = weeks - 1; i >= 0; i--) {
    weekKeys.push(getIsoWeekKey(new Date(now.getTime() - i * 7 * 86400000)));
  }

  const history = await Promise.all(
    weekKeys.map(async (week) => {
      const raw = await env.RISK_STATS.get(`stat:${category}:${week}:${slug}`);
      const count = raw ? JSON.parse(raw).count : 0;
      return { week, count };
    }),
  );

  return jsonResponse({ category, key: slug, weeks: history });
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

    if (request.method === "GET" && url.pathname === "/stat-history") {
      return handleStatHistory(env, url.searchParams);
    }

    if (request.method === "POST" && url.pathname === "/csat-sync") {
      return handleCsatSync(env);
    }

    if (request.method === "GET" && url.pathname === "/csat-stats") {
      return handleCsatStats(env);
    }

    if (request.method === "GET" && url.pathname === "/csat-history") {
      return handleCsatHistory(env, url.searchParams.get("weeks"));
    }

    if (request.method === "POST" && url.pathname === "/fcr-start") {
      return handleFcrStart(request, env);
    }

    if (request.method === "POST" && url.pathname === "/fcr-sync") {
      return handleFcrSync(env);
    }

    if (request.method === "GET" && url.pathname === "/fcr-stats") {
      return handleFcrStats(env);
    }

    if (request.method === "GET" && url.pathname === "/fcr-history") {
      return handleFcrHistory(env, url.searchParams.get("weeks"));
    }

    if (request.method === "POST" && url.pathname === "/duration-sync") {
      return handleDurationSync(env);
    }

    if (request.method === "GET" && url.pathname === "/frt-stats") {
      return handleDurationStats(env, "frt");
    }

    if (request.method === "GET" && url.pathname === "/frt-history") {
      return handleDurationHistory(env, "frt", url.searchParams.get("weeks"));
    }

    if (request.method === "GET" && url.pathname === "/aht-stats") {
      return handleDurationStats(env, "aht");
    }

    if (request.method === "GET" && url.pathname === "/aht-history") {
      return handleDurationHistory(env, "aht", url.searchParams.get("weeks"));
    }

    if (request.method === "POST" && url.pathname === "/risk-case-start") {
      return handleRiskCaseStart(request, env);
    }

    if (request.method === "GET" && url.pathname === "/risk-cases-pending") {
      return handleRiskCasesPending(env);
    }

    if (request.method === "POST" && url.pathname === "/risk-outcome") {
      return handleRiskOutcome(request, env);
    }

    if (request.method === "GET" && url.pathname === "/prevention-stats") {
      return handlePreventionStats(env);
    }

    if (request.method === "GET" && url.pathname === "/prevention-history") {
      return handlePreventionHistory(env, url.searchParams.get("weeks"));
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

  /**
   * Gatilho agendado (ver [triggers] em wrangler.toml): roda sozinho 1x por
   * dia — busca as respostas novas da pesquisa de satisfação (CSAT),
   * verifica os tickets de FCR cuja janela de espera já passou, e
   * sincroniza os tempos de primeira resposta e resolução (FRT/AHT) — sem
   * precisar que ninguém abra o dashboard.
   */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(syncCsatRatings(env));
    ctx.waitUntil(sweepFcrPending(env));
    ctx.waitUntil(syncDurationMetrics(env));
  },
};
