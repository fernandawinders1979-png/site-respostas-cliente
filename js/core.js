/**
 * Dashboard de Atendimento ao Cliente
 * Responsável por: ler os dados do pedido, montar a lista de templates,
 * inserir templates na resposta, sugerir uma resposta automática (placeholder
 * de IA) e copiar o texto final para a área de transferência.
 */

(function () {
  "use strict";

  /* =========================================================
     Referências dos elementos do DOM
     ========================================================= */
  const TEMPLATES = window.TEMPLATES;
  const CATEGORIES = window.CATEGORIES;
  const CATEGORY_GROUPS = window.CATEGORY_GROUPS;

  const orderFields = {
    nomeCliente: document.getElementById("order-nome-cliente"),
    email: document.getElementById("order-email"),
    nomeAgente: document.getElementById("order-nome-agente"),
    numeroPedido: document.getElementById("order-numero-pedido"),
    dataCompra: document.getElementById("order-data-compra"),
    produto: document.getElementById("order-produto"),
    valorTotal: document.getElementById("order-valor-total"),
    endereco: document.getElementById("order-endereco"),
    status: document.getElementById("order-status"),
    idioma: document.getElementById("order-idioma"),
    codigoRastreio: document.getElementById("order-codigo-rastreio"),
    linkRastreio: document.getElementById("order-link-rastreio"),
    percentualOferta: document.getElementById("order-percentual-oferta"),
    percentualConfirmado: document.getElementById("order-percentual-confirmado"),
    dataReembolso: document.getElementById("order-data-reembolso"),
    valorReembolso: document.getElementById("order-valor-reembolso"),
    assinatura: document.getElementById("order-assinatura"),
  };

  // Template atualmente inserido na resposta (null se nenhum foi escolhido ainda).
  // Usado para re-aplicar o template automaticamente quando os Detalhes do
  // Pedido são editados, sem precisar clicar no template de novo.
  let activeTemplateId = null;

  const loadSampleBtn = document.getElementById("load-sample-btn");
  const welcomePreview = document.getElementById("welcome-preview");
  const orderAssinatura = document.getElementById("order-assinatura");

  const templateCategoriesEl = document.getElementById("template-categories");
  const messageInput = document.getElementById("customer-message");
  const generateBtn = document.getElementById("generate-btn");
  const responsePt = document.getElementById("response-pt");
  const responseEn = document.getElementById("response-en");
  const copyFeedback = document.getElementById("copy-feedback");
  const translationStatus = document.getElementById("translation-status");
  const riskBtn = document.getElementById("risk-btn");
  const riskResult = document.getElementById("risk-result");
  const riskBadge = document.getElementById("risk-badge");
  const riskExplanation = document.getElementById("risk-explanation");
  const riskStatsPanel = document.getElementById("risk-stats-panel");
  const riskStatsAlto = document.getElementById("risk-stats-alto");
  const riskStatsMedio = document.getElementById("risk-stats-medio");
  const riskStatsBaixo = document.getElementById("risk-stats-baixo");
  const orderTagsEl = document.getElementById("order-tags");
  const suggestionBox = document.getElementById("suggestion-box");
  const suggestionText = document.getElementById("suggestion-text");
  const suggestionUseBtn = document.getElementById("suggestion-use-btn");

  /**
   * Ajusta a altura de uma textarea de resposta ao tamanho do seu
   * conteúdo, para que a mensagem inteira (PT ou EN) apareça sem
   * barra de rolagem. Chamada sempre que o texto é preenchido, seja
   * por um template, pela tradução automática ou pelo atendente digitando.
   * @param {HTMLTextAreaElement} el
   */
  function autosizeResponse(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  /**
   * Define o valor de uma caixa de resposta (PT ou EN) e reajusta a
   * altura dela imediatamente, para nunca deixar texto escondido atrás
   * de uma barra de rolagem.
   * @param {HTMLTextAreaElement} el
   * @param {string} value
   */
  function setResponseValue(el, value) {
    el.value = value;
    autosizeResponse(el);
  }

  /* =========================================================
     Texto de fallback exibido quando um campo do pedido
     ainda não foi preenchido pelo atendente.
     ========================================================= */
  const FALLBACKS_PT = {
    nomeCliente: "[NOME DO CLIENTE]",
    nomeAgente: "[NOME DO AGENTE]",
    numeroPedido: "[NÚMERO DO PEDIDO]",
    dataCompra: "[DATA DA COMPRA]",
    produto: "[PRODUTO]",
    valorTotal: "[VALOR TOTAL]",
    endereco: "[ENDEREÇO DE ENTREGA]",
    status: "[STATUS DO PEDIDO]",
    codigoRastreio: "[CÓDIGO DE RASTREAMENTO]",
    linkRastreio: "[LINK DE RASTREAMENTO]",
    percentualOferta: "[PERCENTUAL]",
    percentualConfirmado: "[PERCENTUAL]",
    dataReembolso: "[DATA DO REEMBOLSO]",
    valorReembolso: "[VALOR DO REEMBOLSO]",
  };

  const FALLBACKS_EN = {
    nomeCliente: "[CUSTOMER NAME]",
    nomeAgente: "[AGENT NAME]",
    numeroPedido: "[ORDER NUMBER]",
    dataCompra: "[PURCHASE DATE]",
    produto: "[PRODUCT]",
    valorTotal: "[TOTAL AMOUNT]",
    endereco: "[SHIPPING ADDRESS]",
    status: "[ORDER STATUS]",
    codigoRastreio: "[TRACKING CODE]",
    linkRastreio: "[TRACKING LINK]",
    percentualOferta: "[PERCENTAGE]",
    percentualConfirmado: "[PERCENTAGE]",
    dataReembolso: "[REFUND DATE]",
    valorReembolso: "[REFUND AMOUNT]",
  };

  /**
   * Lê os valores atuais preenchidos no painel de dados do pedido.
   * @returns {Object} mapa campo -> valor (string, pode ser vazia)
   */
  function getOrderData() {
    const data = {};
    for (const [key, el] of Object.entries(orderFields)) {
      data[key] = el ? el.value.trim() : "";
    }
    return data;
  }

  /**
   * Igual a getOrderData(), mas aplica o percentual padrão do template
   * (template.defaultPercentual) quando o campo "Percentual a Ofertar" do
   * painel de dados do pedido estiver em branco. Permite que cada template
   * de oferta de reembolso já venha com sua taxa própria, mas continue
   * podendo ser sobrescrito manualmente pelo atendente.
   * @param {Object} template
   * @returns {Object}
   */
  function getOrderDataForTemplate(template) {
    const data = getOrderData();
    if (!data.percentualOferta && template.defaultPercentual) {
      data.percentualOferta = template.defaultPercentual;
    }
    return data;
  }

  // Cabeçalhos usados nos templates para o bloco de dados do pedido/assinatura.
  // Cobrem todas as variações encontradas nos dois painéis (FEG Brands e
  // Direct Response). A linha de Assinatura é inserida automaticamente logo
  // após a última linha "•" desses blocos, em vez de precisar editar cada
  // template um por um.
  const ORDER_DETAILS_HEADERS = {
    pt: ["Detalhes do Pedido", "Detalhes da Assinatura"],
    en: ["Order Details", "Subscription Details"],
  };

  const ASSINATURA_LINE_LABEL = { pt: "Assinatura", en: "Subscription" };
  const ASSINATURA_VALUE_LABELS = {
    pt: { sim: "Sim", nao: "Não" },
    en: { sim: "Yes", nao: "No" },
  };
  const ASSINATURA_FALLBACK = { pt: "[SIM/NÃO]", en: "[YES/NO]" };

  /**
   * Insere a linha "Assinatura: Sim/Não" (ou "Subscription: Yes/No") logo
   * após a última linha "•" do bloco de Detalhes do Pedido/Assinatura,
   * usando o valor selecionado no campo Assinatura do painel de dados do
   * pedido. Se o texto não tiver nenhum desses blocos (ex: um template sem
   * dados de pedido), devolve o texto sem alterar.
   * @param {string} text
   * @param {Object} data
   * @param {"pt"|"en"} lang
   * @returns {string}
   */
  function insertAssinaturaLine(text, data, lang) {
    const lines = text.split("\n");
    const headerIndex = lines.findIndex((line) => ORDER_DETAILS_HEADERS[lang].includes(line.trim()));
    if (headerIndex === -1) return text;

    let insertAt = headerIndex + 1;
    while (insertAt < lines.length && lines[insertAt].trim().startsWith("•")) {
      insertAt++;
    }

    const label = ASSINATURA_VALUE_LABELS[lang][data.assinatura] || ASSINATURA_FALLBACK[lang];
    lines.splice(insertAt, 0, `• ${ASSINATURA_LINE_LABEL[lang]}: ${label}`);

    return lines.join("\n");
  }

  /**
   * Substitui os placeholders {{campo}} de um texto pelos valores do
   * pedido. Quando o campo está vazio, usa o texto entre colchetes
   * (ex: [NOME DO CLIENTE]) como indicação para o atendente preencher.
   * Também insere a linha de Assinatura no bloco de Detalhes do Pedido,
   * quando esse bloco existir no template (ver insertAssinaturaLine).
   * @param {string} text
   * @param {Object} data
   * @param {Object} fallbacks
   * @param {"pt"|"en"} [lang="pt"]
   * @returns {string}
   */
  function fillPlaceholders(text, data, fallbacks, lang = "pt") {
    const filled = text.replace(/{{(\w+)}}/g, (match, key) => {
      return data[key] || fallbacks[key] || match;
    });
    return insertAssinaturaLine(filled, data, lang);
  }

  /**
   * Converte uma data digitada no formato brasileiro (dd/mm/aaaa) para o
   * formato em inglês por extenso (ex: "June 10, 2026"). Usado só nos
   * templates em inglês, para a data não ficar ambígua para o cliente.
   * Se o texto não estiver nesse formato, devolve o texto original sem alterar.
   * @param {string} dateStr
   * @returns {string}
   */
  function formatDateToEnglish(dateStr) {
    if (!dateStr) return dateStr;

    const match = dateStr.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (!match) return dateStr;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    if (year < 100) year += 2000;

    if (month < 1 || month > 12 || day < 1 || day > 31) return dateStr;

    const MONTH_NAMES = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
  }

  /**
   * Monta uma versão "imediata" dos dados do pedido para o template em
   * inglês, só com as datas convertidas. Usada como preview instantâneo
   * enquanto a tradução de produto/status (que depende de uma chamada de
   * rede) ainda não voltou.
   * @param {Object} data
   * @returns {Object}
   */
  function toEnglishOrderDataPreview(data) {
    return {
      ...data,
      dataCompra: formatDateToEnglish(data.dataCompra),
      dataReembolso: formatDateToEnglish(data.dataReembolso),
    };
  }

  // Campos de texto livre dos Detalhes do Pedido que precisam ser traduzidos
  // para inglês (ex: "Em trânsito" -> "In transit"). Os demais campos
  // (nomes, números, códigos, links, endereço) são mantidos como estão,
  // pois não devem ser traduzidos.
  const TRANSLATABLE_ORDER_FIELDS = ["produto", "status"];

  // Cache de traduções já feitas (campo + texto original -> texto em inglês),
  // para não chamar a API de novo para o mesmo valor.
  const orderFieldTranslationCache = {};

  /**
   * Traduz o valor de um campo do pedido (ex: produto, status) de
   * português para inglês, usando a mesma API de tradução do campo de
   * Resposta do Atendente. Se a tradução falhar (ex: sem internet),
   * devolve o texto original em português em vez de travar a tela.
   * @param {string} field
   * @param {string} text
   * @returns {Promise<string>}
   */
  async function translateOrderFieldToEnglish(field, text) {
    if (!text || !text.trim()) return text;

    const cacheKey = `${field}::${text}`;
    if (orderFieldTranslationCache[cacheKey]) {
      return orderFieldTranslationCache[cacheKey];
    }

    try {
      const translated = await translateChunk(text);
      orderFieldTranslationCache[cacheKey] = translated;
      return translated;
    } catch (error) {
      return text;
    }
  }

  /**
   * Monta os dados do pedido prontos para o template em inglês,
   * convertendo os campos de data para o formato em inglês e traduzindo
   * os campos de texto livre (produto, status) para inglês.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async function toEnglishOrderData(data) {
    const translatedEntries = await Promise.all(
      TRANSLATABLE_ORDER_FIELDS.map((field) =>
        translateOrderFieldToEnglish(field, data[field]).then((value) => [field, value])
      )
    );

    return {
      ...toEnglishOrderDataPreview(data),
      ...Object.fromEntries(translatedEntries),
    };
  }

  /* =========================================================
     Tradução automática (português -> inglês) da Resposta do
     Atendente. Usa a API gratuita do MyMemory (sem chave de API).
     Disparada com um pequeno atraso (debounce) depois que o
     atendente para de digitar no campo em português, e é
     cancelada automaticamente quando um template é aplicado
     (nesse caso o texto em inglês já escrito à mão é usado).
     ========================================================= */
  const MYMEMORY_MAX_CHARS = 480;
  const TRANSLATE_DEBOUNCE_MS = 700;

  let translateDebounceTimer = null;
  let translateRequestId = 0;

  /**
   * Cancela qualquer tradução automática pendente (timer ainda não
   * disparado ou chamadas à API já em andamento). Chamada sempre que
   * o texto em português é definido programaticamente (por um
   * template), para que a tradução automática não sobrescreva o
   * texto em inglês escrito à mão.
   */
  function cancelPendingTranslation() {
    window.clearTimeout(translateDebounceTimer);
    translateRequestId++;
    setTranslationStatus("");
  }

  function setTranslationStatus(message) {
    if (!translationStatus) return;
    translationStatus.textContent = message;
    window.clearTimeout(setTranslationStatus._timeoutId);
    if (message && message.startsWith("✅")) {
      setTranslationStatus._timeoutId = window.setTimeout(() => {
        translationStatus.textContent = "";
      }, 2500);
    }
  }

  /**
   * Quebra o texto em português em linhas, preparando cada linha para
   * tradução. Linhas em branco são preservadas sem tradução. Linhas
   * muito longas (acima do limite da API) são quebradas em frases.
   * @param {string} text
   * @returns {Array<{translate: boolean, parts: string[]}>}
   */
  function buildLineChunks(text) {
    return text.split("\n").map((line) => {
      if (!line.trim()) return { translate: false, parts: [line] };
      if (line.length <= MYMEMORY_MAX_CHARS) return { translate: true, parts: [line] };

      const sentences = (line.match(/[^.!?]+[.!?]*\s*/g) || [line]).filter((s) => s.length > 0);
      return { translate: true, parts: sentences };
    });
  }

  /**
   * Traduz um trecho de texto (até o limite da API) usando o par de idiomas
   * informado (ex: "pt|en" ou "en|pt").
   * @param {string} text
   * @param {string} langpair
   * @returns {Promise<string>}
   */
  async function translateChunk(text, langpair = "pt|en") {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha na tradução");

    const data = await response.json();
    const translated = data && data.responseData && data.responseData.translatedText;
    if (!translated) throw new Error("Tradução vazia");
    return translated;
  }

  /**
   * Traduz todas as partes de uma linha e as junta de volta em uma única linha.
   * @param {string[]} parts
   * @param {string} langpair
   * @returns {Promise<string>}
   */
  async function translateLineParts(parts, langpair = "pt|en") {
    const translatedParts = [];
    for (const part of parts) {
      if (!part.trim()) {
        translatedParts.push(part);
        continue;
      }
      translatedParts.push(await translateChunk(part, langpair));
    }
    return translatedParts.join(" ").replace(/\s+/g, " ").trim();
  }

  /**
   * Traduz o texto atual do campo de resposta em português e atualiza
   * o campo em inglês. Ignora o resultado se o texto em português
   * mudar de novo (ou um template for aplicado) antes da tradução terminar.
   */
  async function translatePtToEn() {
    const sourceText = responsePt.value;

    if (!sourceText.trim()) {
      setResponseValue(responseEn, "");
      setTranslationStatus("");
      return;
    }

    const requestId = ++translateRequestId;
    setTranslationStatus("🔄 Traduzindo para inglês...");

    const lineChunks = buildLineChunks(sourceText);

    try {
      const translatedLines = await Promise.all(
        lineChunks.map((lineChunk) =>
          lineChunk.translate ? translateLineParts(lineChunk.parts) : lineChunk.parts[0]
        )
      );

      if (requestId !== translateRequestId) return;
      setResponseValue(responseEn, translatedLines.join("\n"));
      setTranslationStatus("✅ Inglês atualizado automaticamente.");
    } catch (error) {
      if (requestId !== translateRequestId) return;
      setTranslationStatus("⚠️ Não foi possível traduzir agora. Verifique sua internet e edite o texto novamente.");
    }
  }

  /* =========================================================
     Tradução da Mensagem do Cliente (inglês -> português). Usa a
     mesma API gratuita do MyMemory. Funciona tanto para uma mensagem
     colada manualmente quanto para uma preenchida automaticamente
     pela busca do ticket no Freshdesk — o botão sempre traduz o que
     estiver na caixa no momento do clique.
     ========================================================= */
  const translateMessageBtn = document.getElementById("translate-message-btn");
  const messageTranslateStatus = document.getElementById("message-translate-status");

  let messageTranslateRequestId = 0;

  function setMessageTranslateStatus(message) {
    if (!messageTranslateStatus) return;
    messageTranslateStatus.textContent = message;
    window.clearTimeout(setMessageTranslateStatus._timeoutId);
    if (message && message.startsWith("✅")) {
      setMessageTranslateStatus._timeoutId = window.setTimeout(() => {
        messageTranslateStatus.textContent = "";
      }, 2500);
    }
  }

  async function translateMessageToPortuguese() {
    const sourceText = messageInput.value;

    if (!sourceText.trim()) {
      setMessageTranslateStatus("Cole ou busque a mensagem do cliente antes de traduzir.");
      return;
    }

    const requestId = ++messageTranslateRequestId;
    setMessageTranslateStatus("🔄 Traduzindo para português...");

    const lineChunks = buildLineChunks(sourceText);

    try {
      const translatedLines = await Promise.all(
        lineChunks.map((lineChunk) =>
          lineChunk.translate ? translateLineParts(lineChunk.parts, "en|pt") : lineChunk.parts[0]
        )
      );

      if (requestId !== messageTranslateRequestId) return;
      messageInput.value = translatedLines.join("\n");
      setMessageTranslateStatus("✅ Mensagem traduzida. Revise antes de usar.");
    } catch (error) {
      if (requestId !== messageTranslateRequestId) return;
      setMessageTranslateStatus("⚠️ Não foi possível traduzir agora. Verifique sua internet e tente de novo.");
    }
  }

  /* =========================================================
     Renderização da barra lateral de templates
     ========================================================= */
  function buildCategoryDetails(category, templatesInCategory, openByDefault) {
    const details = document.createElement("details");
    details.className = category.featured
      ? "template-category template-category--featured"
      : "template-category";
    details.style.setProperty("--cat-color", category.color);
    if (openByDefault) details.open = true;

    const summary = document.createElement("summary");
    const dot = document.createElement("span");
    dot.className = "category-dot";
    summary.appendChild(dot);
    summary.appendChild(document.createTextNode(category.label));
    details.appendChild(summary);

    const list = document.createElement("ul");
    list.className = "template-list";

    templatesInCategory.forEach((template) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "template-btn";
      button.textContent = template.label;
      button.addEventListener("click", () => handleTemplateClick(template.id));
      li.appendChild(button);
      list.appendChild(li);
    });

    details.appendChild(list);
    return details;
  }

  function renderTemplateSidebar() {
    templateCategoriesEl.innerHTML = "";

    CATEGORIES.forEach((category, index) => {
      const templatesInCategory = TEMPLATES
        .filter((t) => t.category === category.id)
        .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
      if (templatesInCategory.length === 0) return;

      const details = buildCategoryDetails(category, templatesInCategory, index === 0);
      templateCategoriesEl.appendChild(details);
    });

    CATEGORY_GROUPS.forEach((group) => {
      const groupDetails = document.createElement("details");
      groupDetails.className = "template-category template-category--group";
      groupDetails.style.setProperty("--cat-color", group.color);

      const summary = document.createElement("summary");
      const dot = document.createElement("span");
      dot.className = "category-dot";
      summary.appendChild(dot);
      summary.appendChild(document.createTextNode(group.label));
      groupDetails.appendChild(summary);

      const subcategoriesWrap = document.createElement("div");
      subcategoriesWrap.className = "template-subcategories";

      group.subcategories.forEach((subcategory) => {
        const templatesInSubcategory = TEMPLATES
          .filter((t) => t.category === subcategory.id)
          .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
        if (templatesInSubcategory.length === 0) return;

        const subDetails = buildCategoryDetails(subcategory, templatesInSubcategory, false);
        subcategoriesWrap.appendChild(subDetails);
      });

      groupDetails.appendChild(subcategoriesWrap);
      templateCategoriesEl.appendChild(groupDetails);
    });
  }

  // Evita que uma chamada de tradução de campo do pedido (produto/status)
  // que demorou para responder sobrescreva uma atualização mais recente.
  let orderFieldTranslationRequestId = 0;
  // Debounce da tradução dos campos do pedido: evita chamar a API a cada
  // letra digitada nos campos de Detalhes do Pedido.
  let orderFieldTranslateDebounceTimer = null;
  const ORDER_FIELD_TRANSLATE_DEBOUNCE_MS = 600;

  /**
   * Atualiza a caixa de resposta em inglês com o template preenchido.
   * Primeiro mostra um preview imediato (com produto/status ainda em
   * português, só com as datas já convertidas) e, em seguida, busca a
   * tradução de produto/status e atualiza a caixa de novo quando ela
   * chegar. Se `immediate` for true, a tradução é buscada na hora (ex: ao
   * clicar em um template); senão, espera o atendente parar de digitar.
   * @param {Object} template
   * @param {Object} data
   * @param {{immediate: boolean}} options
   */
  function updateResponseEnFromTemplate(template, data, { immediate }) {
    setResponseValue(responseEn, fillPlaceholders(template.en, toEnglishOrderDataPreview(data), FALLBACKS_EN, "en"));

    window.clearTimeout(orderFieldTranslateDebounceTimer);
    const requestId = ++orderFieldTranslationRequestId;

    const runTranslation = async () => {
      const translatedData = await toEnglishOrderData(data);
      if (requestId !== orderFieldTranslationRequestId) return;
      setResponseValue(responseEn, fillPlaceholders(template.en, translatedData, FALLBACKS_EN, "en"));
    };

    if (immediate) {
      runTranslation();
    } else {
      orderFieldTranslateDebounceTimer = window.setTimeout(runTranslation, ORDER_FIELD_TRANSLATE_DEBOUNCE_MS);
    }
  }

  /**
   * Preenche as caixas de resposta (PT/EN) com o texto de um template,
   * substituindo os placeholders pelos dados atuais do pedido.
   * @param {string} templateId
   */
  function applyTemplate(templateId) {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    cancelPendingTranslation();
    const data = getOrderDataForTemplate(template);
    setResponseValue(responsePt, fillPlaceholders(template.pt, data, FALLBACKS_PT));
    activeTemplateId = templateId;
    updateResponseEnFromTemplate(template, data, { immediate: true });
  }

  /**
   * Re-aplica o template ativo (se houver um) usando os valores atuais
   * do pedido. Chamada sempre que um campo de Detalhes do Pedido muda,
   * para que a resposta fique sempre sincronizada automaticamente.
   */
  function refreshActiveTemplate() {
    if (!activeTemplateId) return;

    const template = TEMPLATES.find((item) => item.id === activeTemplateId);
    if (!template) return;

    cancelPendingTranslation();
    const data = getOrderDataForTemplate(template);
    setResponseValue(responsePt, fillPlaceholders(template.pt, data, FALLBACKS_PT));
    updateResponseEnFromTemplate(template, data, { immediate: false });
  }

  /**
   * Lida com o clique em um template da barra lateral.
   * Pede confirmação antes de sobrescrever uma resposta já editada.
   * @param {string} templateId
   */
  function handleTemplateClick(templateId) {
    const hasContent = responsePt.value.trim() || responseEn.value.trim();

    if (hasContent) {
      const confirmed = window.confirm(
        "Já existe uma resposta no campo. Deseja substituir pelo template selecionado?"
      );
      if (!confirmed) return;
    }

    applyTemplate(templateId);
  }

  // Template usado quando a mensagem do cliente não bate com nenhuma
  // palavra-chave conhecida: pede mais detalhes em vez de não fazer nada.
  const FALLBACK_TEMPLATE_ID = "fegComoPossoAjudar";

  /**
   * Calcula, para cada template com autoDetect, quantas palavras-chave
   * batem com o texto informado. Devolve a lista ordenada da maior
   * pontuação para a menor (mantendo a ordem de TEMPLATES em caso de
   * empate). Templates com autoDetect: null (ex: "Cliente não localizado",
   * "Como posso te ajudar") não entram nessa busca automática, pois
   * dependem de uma decisão do atendente, não do conteúdo da mensagem.
   * @param {string} text
   * @returns {Array<{id: string, score: number}>}
   */
  function scoreTemplates(text) {
    const normalized = text.toLowerCase();

    return TEMPLATES.filter((template) => template.autoDetect)
      .map((template) => ({
        id: template.id,
        score: template.autoDetect.reduce(
          (count, word) => (normalized.includes(word) ? count + 1 : count),
          0
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Detecta, por palavras-chave, qual template combina com a mensagem
   * do cliente. Vence quem tiver mais pontos (não só o primeiro que
   * bater uma palavra), para escolher o template mais específico quando
   * mais de um combina com a mensagem.
   * @param {string} text
   * @returns {string} id do template (cai no FALLBACK_TEMPLATE_ID se nada combinar)
   */
  function detectTemplateId(text) {
    const best = scoreTemplates(text)[0];
    return (best && best.score > 0 && best.id) || FALLBACK_TEMPLATE_ID;
  }

  /**
   * Igual a detectTemplateId, mas também calcula um "nível de confiança"
   * (0 a 0.95) para exibir ao atendente antes de aplicar o template.
   * A confiança sobe quando o template vencedor tem uma vantagem clara
   * sobre o segundo colocado e quando várias palavras-chave bateram (não
   * só uma). Usada só na sugestão automática vinda do Freshdesk — não
   * afeta o botão "Gerar Resposta com IA", que continua usando
   * detectTemplateId normalmente.
   * @param {string} text
   * @returns {{templateId: string|null, confidence: number}}
   */
  function detectTemplateWithConfidence(text) {
    const scored = scoreTemplates(text);
    const best = scored[0];

    if (!best || best.score === 0) {
      return { templateId: null, confidence: 0 };
    }

    const runnerUpScore = (scored[1] && scored[1].score) || 0;
    const margin = best.score - runnerUpScore;
    const confidence = Math.min(0.95, 0.5 + margin * 0.15 + Math.min(best.score, 4) * 0.05);

    return { templateId: best.id, confidence };
  }

  /**
   * Lida com o clique no botão "Gerar Resposta com IA".
   * ESTE É UM PLACEHOLDER baseado em palavras-chave. Para conectar a uma
   * IA real (ex: Claude), substitua o corpo desta função por uma chamada
   * assíncrona à API, usando o texto retornado no lugar do template local.
   */
  function handleGenerateClick() {
    const text = messageInput.value.trim();

    if (!text) {
      showFeedback("Cole a mensagem do cliente antes de gerar a resposta.");
      messageInput.focus();
      return;
    }

    const templateId = detectTemplateId(text);
    applyTemplate(templateId);
  }

  /* =========================================================
     Análise de risco de chargeback
     ========================================================= */

  /**
   * Procura, na mensagem do cliente, as frases de alerta cadastradas em
   * window.CHARGEBACK_RISK_PHRASES (alto, médio, baixo peso) e devolve
   * quais frases bateram em cada grupo.
   * @param {string} text
   * @returns {{high: string[], medium: string[], low: string[]}}
   */
  function findRiskMatches(text) {
    const normalized = text.toLowerCase();
    const phrases = window.CHARGEBACK_RISK_PHRASES || { high: [], medium: [], low: [] };

    const matchGroup = (list) => list.filter((phrase) => normalized.includes(phrase));

    return {
      high: matchGroup(phrases.high),
      medium: matchGroup(phrases.medium),
      low: matchGroup(phrases.low),
    };
  }

  /**
   * Calcula o placar de risco (alto vale 3, médio vale 2, baixo vale 1)
   * e classifica o resultado em "alto", "medio" ou "baixo".
   * Qualquer frase de alto peso encontrada (menção direta a chargeback,
   * banco, fraude, advogado, etc.) já classifica como "alto", mesmo que
   * seja só uma frase — esse tipo de sinal é sério mesmo sozinho.
   * @param {{high: string[], medium: string[], low: string[]}} matches
   * @returns {{level: "alto"|"medio"|"baixo", score: number}}
   */
  function classifyRisk(matches) {
    const score = matches.high.length * 3 + matches.medium.length * 2 + matches.low.length * 1;

    let level = "baixo";
    if (matches.high.length >= 1 || score >= 6) {
      level = "alto";
    } else if (score >= 2) {
      level = "medio";
    }

    return { level, score };
  }

  const RISK_LABELS = {
    alto: "🔴 Risco Alto",
    medio: "🟡 Risco Médio",
    baixo: "🟢 Risco Baixo",
  };

  const RISK_ADVICE = {
    alto:
      "⚠️ Sinal forte de chargeback. Priorize resolver rápido: considere oferecer reembolso, " +
      "solução imediata ou escalar o caso antes que o cliente abra a disputa no banco/cartão.",
    medio:
      "Cliente insatisfeito e propenso a pedir reembolso. Responda com empatia, agilidade e " +
      "uma solução concreta antes que a situação piore.",
    baixo:
      "Sem sinais fortes de chargeback. Uma resposta padrão, clara e cordial deve ser suficiente.",
  };

  /**
   * Monta o texto explicando quais frases de alerta foram encontradas,
   * agrupadas por nível, para o atendente entender o motivo do selo.
   * @param {{high: string[], medium: string[], low: string[]}} matches
   * @returns {string}
   */
  function buildRiskExplanation(matches) {
    const lines = [];

    if (matches.high.length) {
      lines.push(`Frases de alerta grave: "${matches.high.join('", "')}"`);
    }
    if (matches.medium.length) {
      lines.push(`Frases de alerta médio: "${matches.medium.join('", "')}"`);
    }
    if (matches.low.length) {
      lines.push(`Frases de alerta leve: "${matches.low.join('", "')}"`);
    }
    if (!lines.length) {
      lines.push("Nenhuma frase de alerta conhecida foi encontrada na mensagem.");
    }

    const level = classifyRisk(matches).level;
    lines.push(RISK_ADVICE[level]);

    return lines.join("\n");
  }

  /**
   * Toca um bipe de alerta (dois tons curtos) quando o risco é alto.
   * Usa a Web Audio API em vez de um arquivo de áudio, então não depende
   * de nenhum arquivo externo. Se o navegador bloquear ou não suportar,
   * falha em silêncio — o selo vermelho piscando continua funcionando.
   */
  function playHighRiskAlertSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      [0, 0.22].forEach((startOffset) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = 880;
        oscillator.connect(gain);
        gain.connect(ctx.destination);

        const startAt = ctx.currentTime + startOffset;
        const endAt = startAt + 0.16;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.35, startAt + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

        oscillator.start(startAt);
        oscillator.stop(endAt + 0.02);
      });

      setTimeout(() => ctx.close(), 800);
    } catch (error) {
      // Sem suporte a áudio no navegador: segue só com o alerta visual.
    }
  }

  /**
   * Converte um valor de moeda digitado livremente (ex: "49,90", "$49.90",
   * "1.234,56") num número. Usado para somar o valor dos pedidos no painel
   * de métricas — devolve null quando não dá pra reconhecer um número.
   * @param {string} raw
   * @returns {number|null}
   */
  function parseCurrencyValue(raw) {
    if (!raw) return null;
    const cleaned = String(raw).replace(/[^0-9.,]/g, "");
    if (!cleaned) return null;

    let normalized = cleaned;
    if (cleaned.includes(",") && cleaned.includes(".")) {
      normalized =
        cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
          ? cleaned.replace(/\./g, "").replace(",", ".")
          : cleaned.replace(/,/g, "");
    } else if (cleaned.includes(",")) {
      normalized = cleaned.replace(",", ".");
    }

    const value = parseFloat(normalized);
    return Number.isFinite(value) ? value : null;
  }

  /**
   * Lida com o clique no botão "Analisar Risco de Chargeback".
   * ESTE É UM PLACEHOLDER baseado em palavras-chave (mesma lógica usada
   * para detectar templates), não uma IA real analisando o contexto.
   */
  function handleRiskClick() {
    if (!riskResult || !riskBadge || !riskExplanation) return;

    const text = messageInput.value.trim();
    if (!text) {
      showFeedback("Cole a mensagem do cliente antes de analisar o risco.");
      messageInput.focus();
      return;
    }

    const matches = findRiskMatches(text);
    const { level, score } = classifyRisk(matches);

    riskResult.hidden = false;
    riskBadge.textContent = `${RISK_LABELS[level]} (${score})`;
    riskBadge.className = `risk-badge risk-${level}`;
    riskExplanation.textContent = buildRiskExplanation(matches);

    if (level === "alto") {
      playHighRiskAlertSound();
    }

    const valor = parseCurrencyValue(getOrderData().valorTotal);
    recordRiskEvent(level, valor);
  }

  /* =========================================================
     Pré-visualização da mensagem de boas-vindas
     ========================================================= */
  function updateWelcomePreview() {
    if (!welcomePreview) return;
    const data = getOrderData();
    const nomeCliente = data.nomeCliente || FALLBACKS_PT.nomeCliente;
    const nomeAgente = data.nomeAgente || FALLBACKS_PT.nomeAgente;
    welcomePreview.textContent = `Olá ${nomeCliente}, meu nome é ${nomeAgente} e estarei cuidando do seu atendimento hoje. 🤝`;
  }

  /**
   * Preenche o painel de pedido com dados de exemplo, só para
   * demonstrar o funcionamento do dashboard sem um sistema real conectado.
   */
  function loadSampleOrder() {
    const sample = {
      nomeCliente: "Maria Silva",
      nomeAgente: "João Souza",
      numeroPedido: "#10234",
      dataCompra: "10/06/2026",
      produto: "Óleo Essencial 30ml",
      valorTotal: "49.90",
      endereco: "São Paulo, SP",
      status: "Em trânsito",
      codigoRastreio: "BR123456789",
      linkRastreio: "https://rastreio.exemplo.com/BR123456789",
    };
    for (const [key, value] of Object.entries(sample)) {
      if (orderFields[key]) orderFields[key].value = value;
    }
    updateWelcomePreview();
    refreshActiveTemplate();
  }

  /* =========================================================
     Cópia para a área de transferência
     ========================================================= */
  function showFeedback(message) {
    copyFeedback.textContent = message;
    window.clearTimeout(showFeedback._timeoutId);
    showFeedback._timeoutId = window.setTimeout(() => {
      copyFeedback.textContent = "";
    }, 2500);
  }

  function copyResponseToClipboard(targetId) {
    const target = document.getElementById(targetId);
    const text = target.value;

    if (!text) {
      showFeedback("Não há resposta gerada para copiar ainda.");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => showFeedback("Resposta copiada para a área de transferência!"))
      .catch(() => showFeedback("Não foi possível copiar automaticamente. Selecione o texto manualmente."));
  }

  /**
   * Mostra as tags do chamado (vindas do Freshdesk) como uma lista simples,
   * só para leitura — contexto extra para o atendente, não um campo do
   * template.
   * @param {string[]} tags
   */
  function renderTags(tags) {
    if (!orderTagsEl) return;
    if (!tags || tags.length === 0) {
      orderTagsEl.hidden = true;
      orderTagsEl.innerHTML = "";
      return;
    }
    orderTagsEl.hidden = false;
    orderTagsEl.innerHTML = tags
      .map((tag) => `<span class="order-tag">${tag}</span>`)
      .join("");
  }

  /**
   * Mostra a sugestão de template calculada a partir da conversa vinda do
   * Freshdesk: destaca o botão do template sugerido na barra lateral
   * (abrindo a categoria dele, se estiver fechada) e exibe um selo com o
   * nome do template e o nível de confiança. O atendente decide se quer
   * usar a sugestão (botão "Usar este template") ou clicar em outro
   * template qualquer, como sempre.
   * @param {string} text
   */
  function showTemplateSuggestion(text) {
    if (!suggestionBox || !suggestionText) return;
    if (!text || !text.trim()) {
      suggestionBox.hidden = true;
      return;
    }

    const { templateId, confidence } = detectTemplateWithConfidence(text);
    if (!templateId) {
      suggestionBox.hidden = true;
      return;
    }

    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) {
      suggestionBox.hidden = true;
      return;
    }

    document.querySelectorAll(".template-btn--suggested").forEach((btn) => {
      btn.classList.remove("template-btn--suggested");
    });

    const suggestedButton = Array.from(document.querySelectorAll(".template-btn")).find(
      (btn) => btn.textContent === template.label
    );
    if (suggestedButton) {
      suggestedButton.classList.add("template-btn--suggested");
      const details = suggestedButton.closest("details");
      if (details) details.open = true;
    }

    suggestionBox.hidden = false;
    suggestionText.textContent = `Sugestão da IA: ${template.label} (${Math.round(confidence * 100)}% de confiança)`;

    if (suggestionUseBtn) {
      suggestionUseBtn.onclick = () => handleTemplateClick(templateId);
    }
  }

  /**
   * Aplica no painel todos os dados coletados automaticamente pelo app do
   * Freshdesk: preenche os campos do pedido, cola a conversa do cliente na
   * caixa de mensagem, mostra as tags do chamado e sugere um template com
   * base na conversa. Todos os campos continuam editáveis pelo atendente
   * depois disso.
   * @param {Object} payload
   */
  function applyFreshdeskPayload(payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "conversationText" || key === "tags") return;
      if (orderFields[key] && value) {
        orderFields[key].value = value;
      }
    });

    if (payload.conversationText && messageInput) {
      messageInput.value = payload.conversationText;
    }

    renderTags(payload.tags);
    showTemplateSuggestion(payload.conversationText || "");
  }

  /**
   * Preenche o campo "Nome do Cliente" a partir de um link antigo
   * (ex: index.html?nomeCliente=Maria%20Silva), mantido por compatibilidade.
   */
  function applyPrefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const nomeCliente = params.get("nomeCliente");
    if (nomeCliente && orderFields.nomeCliente) {
      orderFields.nomeCliente.value = nomeCliente;
    }
  }

  /* =========================================================
     Busca de dados pelo número do ticket (Freshdesk), via o Worker
     que guarda a API Key em segredo (ver freshdesk-worker/).
     ========================================================= */

  // Endereço do Worker publicado. Substituir pelo endereço real depois de
  // rodar `wrangler deploy` (ex: https://freshdesk-proxy.SEU-USUARIO.workers.dev).
  const FRESHDESK_WORKER_URL = "https://freshdesk-proxy.fernandawinders1979.workers.dev";

  const APP_TOKEN_STORAGE_KEY = "freshdeskAppToken";

  const ticketSearchInput = document.getElementById("ticket-search-input");
  const ticketSearchBtn = document.getElementById("ticket-search-btn");
  const ticketSearchStatus = document.getElementById("ticket-search-status");

  /**
   * Pega a senha de equipe já guardada nesta aba (sessionStorage), ou pede
   * ao atendente (só uma vez por sessão do navegador — some ao fechar a
   * aba). Nunca fica salva permanentemente no computador.
   * @returns {string|null}
   */
  function getAppToken() {
    // Em navegadores/modos que bloqueiam sessionStorage (ex: aba anônima
    // restrita), segue sem guardar entre buscas em vez de travar a tela —
    // o atendente só precisa digitar a senha de novo a cada busca.
    let token = "";
    try {
      token = window.sessionStorage.getItem(APP_TOKEN_STORAGE_KEY) || "";
    } catch (error) {
      // Sem acesso a sessionStorage: segue sem token salvo.
    }

    if (!token) {
      token = window.prompt("Senha de equipe para buscar dados do Freshdesk:");
      if (token) {
        try {
          window.sessionStorage.setItem(APP_TOKEN_STORAGE_KEY, token);
        } catch (error) {
          // Sem acesso a sessionStorage: só não persiste, segue com o valor em mãos.
        }
      }
    }

    return token || null;
  }

  /**
   * Pega a senha de equipe já guardada nesta aba, sem pedir ao atendente.
   * Usado para ações "de fundo" (estatísticas) que não podem interromper
   * quem só está usando o site normalmente.
   * @returns {string|null}
   */
  function getStoredAppToken() {
    try {
      return window.sessionStorage.getItem(APP_TOKEN_STORAGE_KEY) || null;
    } catch (error) {
      return null;
    }
  }

  function setTicketSearchStatus(message, kind) {
    if (!ticketSearchStatus) return;
    ticketSearchStatus.textContent = message;
    ticketSearchStatus.className = "ticket-search-status" + (kind ? ` is-${kind}` : "");
  }

  /**
   * Busca os dados de um ticket no Worker e aplica no painel (mesma função
   * usada por qualquer outra fonte de dados do Freshdesk). Se a senha de
   * equipe estiver errada, limpa a senha guardada para pedir de novo na
   * próxima tentativa, em vez de ficar travado com uma senha inválida.
   * @param {string} ticketId
   */
  async function fetchFreshdeskTicket(ticketId) {
    if (!ticketId || !ticketId.trim()) {
      setTicketSearchStatus("Digite o número do ticket antes de buscar.", "error");
      return;
    }

    const token = getAppToken();
    if (!token) {
      setTicketSearchStatus("É preciso informar a senha de equipe para buscar.", "error");
      return;
    }

    setTicketSearchStatus("🔄 Buscando dados do ticket...");
    if (ticketSearchBtn) ticketSearchBtn.disabled = true;

    try {
      const response = await fetch(`${FRESHDESK_WORKER_URL}/ticket/${encodeURIComponent(ticketId.trim())}`, {
        headers: { "X-App-Token": token },
      });

      if (response.status === 401) {
        try {
          window.sessionStorage.removeItem(APP_TOKEN_STORAGE_KEY);
        } catch (error) {
          // Sem acesso a sessionStorage: não tinha nada guardado mesmo.
        }
        setTicketSearchStatus("Senha de equipe incorreta. Tente buscar de novo para digitar outra vez.", "error");
        return;
      }

      if (response.status === 404) {
        setTicketSearchStatus("Ticket não encontrado com esse número.", "error");
        return;
      }

      if (!response.ok) {
        setTicketSearchStatus("Não foi possível buscar esse ticket agora. Tente de novo em instantes.", "error");
        return;
      }

      const payload = await response.json();
      applyFreshdeskPayload(payload);
      updateWelcomePreview();
      setTicketSearchStatus("✅ Dados carregados! Revise os campos antes de responder.", "success");
    } catch (error) {
      setTicketSearchStatus("Erro de conexão com o Freshdesk. Verifique sua internet e tente de novo.", "error");
    } finally {
      if (ticketSearchBtn) ticketSearchBtn.disabled = false;
    }
  }

  /* =========================================================
     Painel de estatísticas de risco (contagem centralizada, compartilhada
     entre todos os atendentes, guardada no Worker via Cloudflare KV).
     ========================================================= */

  const RISK_STATS_LABELS = { alto: "alto", medio: "médio", baixo: "baixo" };

  /**
   * Atualiza os números mostrados no painel de estatísticas. Passar `null`
   * volta o painel para "--" (ex: quando ainda não há senha de equipe).
   * @param {{alto:number, medio:number, baixo:number}|null} stats
   */
  function renderRiskStats(stats) {
    if (!riskStatsPanel) return;
    if (riskStatsAlto) riskStatsAlto.textContent = stats ? String(stats.alto) : "--";
    if (riskStatsMedio) riskStatsMedio.textContent = stats ? String(stats.medio) : "--";
    if (riskStatsBaixo) riskStatsBaixo.textContent = stats ? String(stats.baixo) : "--";
  }

  /**
   * Busca os contadores de risco da semana atual no Worker, para mostrar no
   * painel. Só busca se já existir uma senha de equipe guardada nesta aba —
   * nunca pede senha aqui, para não interromper quem só está olhando a tela.
   */
  async function fetchRiskStats() {
    if (!riskStatsPanel) return;

    const token = getStoredAppToken();
    if (!token) {
      renderRiskStats(null);
      return;
    }

    try {
      const response = await fetch(`${FRESHDESK_WORKER_URL}/risk-stats`, {
        headers: { "X-App-Token": token },
      });

      if (!response.ok) {
        renderRiskStats(null);
        return;
      }

      renderRiskStats(await response.json());
    } catch (error) {
      renderRiskStats(null);
    }
  }

  /**
   * Avisa o Worker que uma mensagem foi classificada com determinado nível
   * de risco, para somar no contador compartilhado da semana. É um "extra"
   * de estatística — se falhar (sem senha guardada, sem internet, etc.),
   * ignora em silêncio e não afeta o uso normal do site.
   * @param {string} level "baixo" | "medio" | "alto"
   * @param {number|null} valor valor do pedido (Detalhes do Pedido), quando disponível
   */
  async function recordRiskEvent(level, valor) {
    const token = getStoredAppToken();
    if (!token) return;

    try {
      const body = { level };
      if (typeof valor === "number" && Number.isFinite(valor)) {
        body.valor = valor;
      }

      const response = await fetch(`${FRESHDESK_WORKER_URL}/risk-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-App-Token": token },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchRiskStats();
      }
    } catch (error) {
      // Sem internet ou Worker fora do ar: a análise de risco em si já foi
      // mostrada ao atendente, só a estatística compartilhada não atualiza.
    }
  }

  /* =========================================================
     Eventos
     ========================================================= */
  renderTemplateSidebar();
  applyPrefillFromUrl();
  updateWelcomePreview();
  fetchRiskStats();

  generateBtn.addEventListener("click", handleGenerateClick);
  loadSampleBtn.addEventListener("click", loadSampleOrder);

  if (translateMessageBtn) {
    translateMessageBtn.addEventListener("click", translateMessageToPortuguese);
  }

  if (riskBtn) {
    riskBtn.addEventListener("click", handleRiskClick);
  }

  if (ticketSearchBtn && ticketSearchInput) {
    ticketSearchBtn.addEventListener("click", () => fetchFreshdeskTicket(ticketSearchInput.value));
    ticketSearchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") fetchFreshdeskTicket(ticketSearchInput.value);
    });
  }

  Object.values(orderFields).forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      updateWelcomePreview();
      refreshActiveTemplate();
    });
  });

  // Ao escolher se o pedido tem assinatura (Sim/Não), leva o atendente
  // direto para o campo de Mensagem do Cliente, para agilizar o atendimento.
  if (orderAssinatura) {
    orderAssinatura.addEventListener("change", () => {
      if (!orderAssinatura.value) return;
      messageInput.scrollIntoView({ behavior: "smooth", block: "center" });
      messageInput.focus();
    });
  }

  responsePt.addEventListener("input", () => {
    autosizeResponse(responsePt);
    window.clearTimeout(translateDebounceTimer);
    setTranslationStatus("⌛ Aguardando você terminar de digitar...");
    translateDebounceTimer = window.setTimeout(translatePtToEn, TRANSLATE_DEBOUNCE_MS);
  });

  responseEn.addEventListener("input", () => {
    autosizeResponse(responseEn);
  });

  document.querySelectorAll(".btn-copy").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      copyResponseToClipboard(targetId);
    });
  });
})();
