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
  const orderFields = {
    nomeCliente: document.getElementById("order-nome-cliente"),
    nomeAgente: document.getElementById("order-nome-agente"),
    numeroPedido: document.getElementById("order-numero-pedido"),
    dataCompra: document.getElementById("order-data-compra"),
    produto: document.getElementById("order-produto"),
    valorTotal: document.getElementById("order-valor-total"),
    endereco: document.getElementById("order-endereco"),
    status: document.getElementById("order-status"),
    codigoRastreio: document.getElementById("order-codigo-rastreio"),
    linkRastreio: document.getElementById("order-link-rastreio"),
    percentualOferta: document.getElementById("order-percentual-oferta"),
    percentualConfirmado: document.getElementById("order-percentual-confirmado"),
    dataReembolso: document.getElementById("order-data-reembolso"),
    valorReembolso: document.getElementById("order-valor-reembolso"),
  };

  // Template atualmente inserido na resposta (null se nenhum foi escolhido ainda).
  // Usado para re-aplicar o template automaticamente quando os Detalhes do
  // Pedido são editados, sem precisar clicar no template de novo.
  let activeTemplateId = null;

  const loadSampleBtn = document.getElementById("load-sample-btn");
  const welcomePreview = document.getElementById("welcome-preview");

  const templateCategoriesEl = document.getElementById("template-categories");
  const messageInput = document.getElementById("customer-message");
  const generateBtn = document.getElementById("generate-btn");
  const responsePt = document.getElementById("response-pt");
  const responseEn = document.getElementById("response-en");
  const copyFeedback = document.getElementById("copy-feedback");
  const translationStatus = document.getElementById("translation-status");

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
      data[key] = el.value.trim();
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

  /**
   * Substitui os placeholders {{campo}} de um texto pelos valores do
   * pedido. Quando o campo está vazio, usa o texto entre colchetes
   * (ex: [NOME DO CLIENTE]) como indicação para o atendente preencher.
   * @param {string} text
   * @param {Object} data
   * @param {Object} fallbacks
   * @returns {string}
   */
  function fillPlaceholders(text, data, fallbacks) {
    return text.replace(/{{(\w+)}}/g, (match, key) => {
      return data[key] || fallbacks[key] || match;
    });
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
   * Traduz um trecho de texto (até o limite da API) de português para inglês.
   * @param {string} text
   * @returns {Promise<string>}
   */
  async function translateChunk(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`;
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
   * @returns {Promise<string>}
   */
  async function translateLineParts(parts) {
    const translatedParts = [];
    for (const part of parts) {
      if (!part.trim()) {
        translatedParts.push(part);
        continue;
      }
      translatedParts.push(await translateChunk(part));
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
      responseEn.value = "";
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
      responseEn.value = translatedLines.join("\n");
      setTranslationStatus("✅ Inglês atualizado automaticamente.");
    } catch (error) {
      if (requestId !== translateRequestId) return;
      setTranslationStatus("⚠️ Não foi possível traduzir agora. Verifique sua internet e edite o texto novamente.");
    }
  }

  /* =========================================================
     Templates de resposta.
     Para adicionar um novo template, basta incluir um novo objeto
     neste array com: id (único), label (texto do botão), autoDetect
     (lista de palavras-chave que disparam o template automaticamente
     no "Gerar Resposta com IA", ou null se for só manual), pt e en
     (textos com placeholders {{campo}}).
     ========================================================= */
  const TEMPLATES = [
    {
      id: "naoLocalizado",
      category: "geral",
      label: "Cliente não localizado",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você hoje em nome da nossa equipe de suporte.\n" +
        "Para ajudá-lo da forma mais rápida e precisa possível, poderia, por favor, fornecer as seguintes informações 💛:\n" +
        "  - Qual produto foi encomendado?\n" +
        "  - Número do pedido\n" +
        "  - Nome sob o qual o pedido foi realizado\n" +
        "  - E-mail utilizado para realizar a compra\n" +
        "Fico no aguardo da sua resposta!\n" +
        "Atenciosamente, {{nomeAgente}} 🤝 Equipe de Suporte ao Cliente",
      en:
        "Hello {{nomeCliente}},\n" +
        "My name is {{nomeAgente}} and I'll be assisting you today on behalf of our support team.\n" +
        "To help you as quickly and accurately as possible, could you please provide the following information 💛:\n" +
        "  - Which product did you order?\n" +
        "  - Order number\n" +
        "  - Name the order was placed under\n" +
        "  - Email used to make the purchase\n" +
        "I'll be looking forward to your reply!\n" +
        "Best regards, {{nomeAgente}} 🤝 Customer Support Team",
    },
    {
      id: "pedidoLocalizado",
      category: "geral",
      label: "Pedido localizado",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n" +
        "Consegui localizar o seguinte pedido em nosso sistema:\n\n" +
        "Detalhes do Pedido\n" +
        "• Número do Pedido: {{numeroPedido}}\n" +
        "• Data da Compra: {{dataCompra}}\n" +
        "• Produto: {{produto}}\n" +
        "• Valor Total: ${{valorTotal}}\n" +
        "• Endereço de Entrega: {{endereco}}\n" +
        "• Status Atual: {{status}}\n\n" +
        "Você poderia, por favor, confirmar se este é o pedido correto?\n\n" +
        "Se tiver alguma dúvida ou precisar de mais informações, estou à disposição.\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n" +
        "I was able to locate the following order in our system:\n\n" +
        "Order Details\n" +
        "• Order Number: {{numeroPedido}}\n" +
        "• Purchase Date: {{dataCompra}}\n" +
        "• Product: {{produto}}\n" +
        "• Total Amount: ${{valorTotal}}\n" +
        "• Shipping Address: {{endereco}}\n" +
        "• Current Status: {{status}}\n\n" +
        "Could you please confirm if this is the correct order?\n\n" +
        "If you have any questions or need more information, I'm here to help.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "pedidoLocalizadoMotivo",
      category: "geral",
      label: "Pedido localizado - motivo da devolução",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n" +
        "Consegui localizar o seguinte pedido em nosso sistema:\n\n" +
        "Detalhes do Pedido\n" +
        "• Número do Pedido: {{numeroPedido}}\n" +
        "• Data da Compra: {{dataCompra}}\n" +
        "• Produto: {{produto}}\n" +
        "• Valor Total: ${{valorTotal}}\n" +
        "• Endereço de Entrega: {{endereco}}\n" +
        "• Status Atual: {{status}}\n\n" +
        "Você poderia, por favor, confirmar se este é o pedido correto?\n\n" +
        "Além disso, poderia nos informar o que motivou o seu contato hoje? Gostaria de ajudá-lo(a) a encontrar a melhor solução para o seu caso.\n\n" +
        "Quero assegurar que estou totalmente preparado(a) para ajudá-lo(a) a resolver esta situação o mais rapidamente possível. Assim que o pedido for confirmado, seguirei com os próximos passos para atender à sua solicitação específica.\n\n" +
        "Se tiver alguma dúvida ou precisar de mais informações, estou à disposição.\n\n" +
        "Atenciosamente,\n" +
        "{{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n" +
        "I was able to locate the following order in our system:\n\n" +
        "Order Details\n" +
        "• Order Number: {{numeroPedido}}\n" +
        "• Purchase Date: {{dataCompra}}\n" +
        "• Product: {{produto}}\n" +
        "• Total Amount: ${{valorTotal}}\n" +
        "• Shipping Address: {{endereco}}\n" +
        "• Current Status: {{status}}\n\n" +
        "Could you please confirm if this is the correct order?\n\n" +
        "Also, could you let us know what prompted your contact today? I'd like to help you find the best solution for your case.\n\n" +
        "I want to assure you that I'm fully prepared to help you resolve this situation as quickly as possible. Once the order is confirmed, I'll move forward with the next steps to address your specific request.\n\n" +
        "If you have any questions or need more information, I'm here to help.\n\n" +
        "Best regards,\n" +
        "{{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "enderecoConfirmadoEnvioHoje",
      category: "geral",
      label: "Endereço confirmado e correto",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Obrigado por confirmar o endereço!

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora. Consegui localizar o seguinte pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Está tudo perfeito por aqui. Seu pedido já está sendo preparado pela nossa equipe e será enviado hoje, conforme planejado.

Assim que o pacote for enviado, você receberá outro e-mail com o número de rastreamento (em até 2 dias) para que possa acompanhar a entrega até a sua porta.

Enquanto isso, não se esqueça de conferir seu presente especial em nossa área exclusiva para membros, usando o link fornecido no e-mail anterior.

Estamos muito felizes em tê-lo(a) conosco nesta jornada. Se precisar de algo mais ou tiver alguma dúvida sobre como utilizar o suplemento, entre em contato conosco.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte`,
      en: `Hello {{nomeCliente}},

Thank you for confirming your address!

My name is {{nomeAgente}} and I'll be assisting you from now on. I was able to locate the following order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Everything looks perfect on our end. Your order is already being prepared by our team and will be shipped today, as planned.

As soon as the package ships, you'll receive another email with the tracking number (within 2 business days) so you can follow the delivery all the way to your door.

In the meantime, don't forget to check out your special gift in our exclusive members area, using the link provided in our previous email.

We're very happy to have you with us on this journey. If you need anything else or have any questions about how to use the supplement, please reach out to us.

Best regards,
{{nomeAgente}}
Support Team`,
    },
    {
      id: "statusEntrega",
      category: "geral",
      label: "Status da entrega",
      autoDetect: ["entrega", "rastreio", "rastreamento", "chegou", "tracking", "delivery", "shipping"],
      pt:
        "Olá {{nomeCliente}},\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você.\n" +
        "Consegui localizar o pedido:\n\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Informações de Rastreamento\n" +
        "- Código de Rastreamento: {{codigoRastreio}}\n" +
        "- Link de Rastreamento: {{linkRastreio}}\n\n" +
        "O pedido está dentro do prazo estimado de entrega e a caminho. Caso tenha qualquer dúvida sobre o rastreamento, estou à disposição.\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "My name is {{nomeAgente}} and I'll be assisting you.\n" +
        "I was able to locate your order:\n\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "Tracking Information\n" +
        "- Tracking Code: {{codigoRastreio}}\n" +
        "- Tracking Link: {{linkRastreio}}\n\n" +
        "The order is within the estimated delivery window and on its way. If you have any questions about the tracking, I'm happy to help.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "cancelarSemReceber",
      category: "geral",
      label: "Cancelar sem ter recebido",
      autoDetect: ["cancelar", "cancelamento", "cancel"],
      pt:
        "Olá {{nomeCliente}},\n" +
        "Entendo seu desejo de cancelar o pedido e sinto muito pelo inconveniente.\n" +
        "Verifiquei aqui e seu pedido já está em uma etapa avançada de processamento/envio, então infelizmente não conseguimos interromper o envio neste momento.\n\n" +
        "Detalhes do Pedido\n" +
        "• Número do Pedido: {{numeroPedido}}\n" +
        "• Data da Compra: {{dataCompra}}\n" +
        "• Produto: {{produto}}\n" +
        "• Valor Total: ${{valorTotal}}\n" +
        "• Endereço de Entrega: {{endereco}}\n" +
        "• Status Atual: {{status}}\n\n" +
        "A boa notícia é que, assim que o pedido chegar até você, podemos avaliar as melhores opções, incluindo devolução, conforme nossa política de garantia.\n" +
        "Posso te avisar assim que tivermos uma atualização sobre a entrega?\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "I understand you'd like to cancel your order, and I'm sorry for the inconvenience.\n" +
        "I checked here and your order is already at an advanced processing/shipping stage, so unfortunately we can't stop the shipment at this time.\n\n" +
        "Order Details\n" +
        "• Order Number: {{numeroPedido}}\n" +
        "• Purchase Date: {{dataCompra}}\n" +
        "• Product: {{produto}}\n" +
        "• Total Amount: ${{valorTotal}}\n" +
        "• Shipping Address: {{endereco}}\n" +
        "• Current Status: {{status}}\n\n" +
        "The good news is that once the order reaches you, we can look at the best options together, including a return, in line with our warranty policy.\n" +
        "Can I let you know as soon as we have an update on the delivery?\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "devolucaoEngano",
      category: "geral",
      label: "Compra por engano (devolução)",
      autoDetect: ["engano", "devolver", "devolucao", "devolução", "errado", "return", "mistake"],
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Lamento o transtorno e entendo perfeitamente que isso possa acontecer.\n" +
        "Nossa política de garantia permite a devolução em até 30 dias corridos a partir da data de compra, desde que o produto esteja lacrado e sem uso.\n" +
        "Pelo que vejo em nosso sistema, seu pedido {{numeroPedido}} foi realizado em {{dataCompra}}, então ainda está dentro do prazo para solicitarmos a devolução.\n" +
        "Para seguirmos com o processo, poderia confirmar se o produto permanece lacrado e sem uso?\n" +
        "Estou aqui para te ajudar a resolver isso da melhor forma possível.\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "I'm sorry for the inconvenience, and I completely understand that this can happen.\n" +
        "Our warranty policy allows returns within 30 calendar days from the purchase date, as long as the product is sealed and unused.\n" +
        "From what I see in our system, your order {{numeroPedido}} was placed on {{dataCompra}}, so it's still within the window to request a return.\n" +
        "To move forward, could you confirm whether the product is still sealed and unused?\n" +
        "I'm here to help you resolve this in the best way possible.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "garantiaVencendo",
      category: "geral",
      label: "Garantia próxima do vencimento",
      autoDetect: ["garantia", "warranty", "vencimento"],
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Notei que seu pedido {{numeroPedido}} está se aproximando do prazo final de 60 dias da nossa garantia de satisfação.\n" +
        "Antes de prosseguirmos com qualquer solicitação, gostaria de te oferecer uma alternativa: podemos processar um reembolso parcial imediato de 15% caso você queira continuar utilizando o produto.\n" +
        "Vale lembrar que nossos produtos são 100% naturais e os benefícios costumam se intensificar com o uso contínuo. Muitos clientes também aproveitam para presentear alguém querido quando decidem não usar o produto integralmente.\n" +
        "Me avisa como prefere seguir que cuido de tudo para você!\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "I noticed your order {{numeroPedido}} is approaching the 60-day deadline of our satisfaction warranty.\n" +
        "Before we move forward with any request, I'd like to offer you an alternative: we can process an immediate partial refund of 15% if you'd like to keep using the product.\n" +
        "It's worth mentioning that our products are 100% natural and the benefits tend to build up with continued use. Many customers also choose to gift the product to a loved one when they decide not to use it fully themselves.\n" +
        "Let me know how you'd like to proceed and I'll take care of everything for you!\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "naoRecebidoMarcadoEntregue",
      category: "geral",
      label: "Não recebeu, mas consta entregue",
      autoDetect: ["não recebi", "nao recebi", "consta como entregue", "marcado como entregue", "not received", "marked as delivered", "never arrived"],
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Sinto muito pela situação. Verifiquei aqui e o sistema da transportadora indica que o pedido {{numeroPedido}} foi entregue no endereço {{endereco}}.\n" +
        "Às vezes esse tipo de caso acontece quando o pacote é deixado com um porteiro, vizinho ou em uma área comum do prédio/condomínio.\n" +
        "Você poderia, por favor, verificar essas possibilidades e confirmar comigo o resultado? Assim posso te ajudar a resolver isso o quanto antes.\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "I'm really sorry about this situation. I checked here and the carrier's system shows that order {{numeroPedido}} was delivered to {{endereco}}.\n" +
        "Sometimes this happens when the package is left with a doorman, a neighbor, or in a common area of the building.\n" +
        "Could you please check those possibilities and let me know the outcome? That way I can help you resolve this as quickly as possible.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "garantiaVencida",
      category: "geral",
      label: "Garantia já vencida (negar reembolso)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Agradeço pela sua mensagem — entendo completamente sua frustração e agradeço por ter dedicado um tempo para explicar a sua situação 💛

Reconheço que você seguiu as instruções de uso com cuidado e agradeço pelo esforço em dar uma chance justa ao produto.

No entanto, preciso ser totalmente transparente com você. Nossa garantia de satisfação de 60 dias é baseada estritamente na data original da compra, e após esse período terminar, o sistema bloqueia automaticamente qualquer solicitação de reembolso, sem exceções.

De acordo com nossos registros, o seu período de garantia já expirou e, por esse motivo, não conseguimos mais processar um reembolso ou aceitar uma devolução para este pedido.

Entendo que esse não é o resultado que você esperava, e peço sinceras desculpas por qualquer frustração causada durante esse processo.

Se houver mais alguma coisa em que eu possa te ajudar, por favor me avise — estou aqui para ajudar da forma que for possível.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}}, and I will be assisting you from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Thank you for your message — I completely understand your frustration and appreciate the time you took to explain your situation 💛

I recognize that you followed the usage instructions carefully and appreciate your effort in giving the product a fair chance.

However, I need to be fully transparent with you. Our 60-day satisfaction guarantee is strictly based on the original purchase date, and after this period ends, the system automatically blocks any refund requests, without exception.

According to our records, your guarantee period has already expired, and for this reason, we can no longer process a refund or accept a return for this order.

I understand that this is not the outcome you were hoping for, and I sincerely apologize for any frustration caused during this process.

If there is anything else I can assist you with, please let me know — I am here to help in any way I can.

Sincerely,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "produtoDanificado",
      category: "geral",
      label: "Produto chegou danificado",
      autoDetect: ["danificado", "quebrado", "avariado", "damaged", "broken"],
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Agradecemos por nos informar sobre o ocorrido e lamentamos sinceramente que o seu pedido não tenha chegado em perfeitas condições. Essa não é a experiência que desejamos oferecer, e fique tranquilo(a): estamos aqui para resolver essa situação da melhor forma possível.

Trabalhamos com processos rigorosos de controle de qualidade, embalagem e envio, porém, em raras situações, danos podem ocorrer durante o transporte. Quando isso acontece, nossa prioridade é agir com agilidade, transparência e total suporte ao cliente.

Para que possamos verificar o ocorrido e providenciar a solução adequada o mais rápido possível, pedimos, por gentileza, que nos informe:

Quantos frascos chegaram danificados
Fotos claras dos frascos danificados
Fotos da embalagem externa, mostrando o estado em que o pedido foi recebido

Essas informações nos ajudam a:

Identificar a origem do problema
Acionar nossos protocolos internos de qualidade e logística
Garantir a reposição ou solução mais adequada para o seu caso

Assim que recebermos essas informações, nossa equipe dará andamento imediato ao atendimento e manterá você informado(a) sobre os próximos passos.

Agradecemos pela sua compreensão e confiança. Conte conosco para oferecer uma experiência segura, responsável e satisfatória do início ao fim.

Atenciosamente,
{{nomeAgente}}
Equipe de Atendimento Premium`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Thank you for letting us know about this, and we sincerely apologize that your order didn't arrive in perfect condition. This isn't the experience we want to provide, and please don't worry: we're here to resolve this in the best possible way.

We follow strict quality control, packaging, and shipping processes, but in rare cases, damage can occur during transport. When this happens, our priority is to act quickly, transparently, and with full customer support.

So we can look into what happened and arrange the right solution as soon as possible, could you please share:

How many bottles arrived damaged
Clear photos of the damaged bottles
Photos of the outer packaging, showing the condition the order arrived in

This information helps us to:

Identify the source of the issue
Trigger our internal quality and logistics protocols
Ensure the right replacement or solution for your case

As soon as we receive this information, our team will move forward with your case right away and keep you updated on the next steps.

Thank you for your understanding and trust. Count on us to provide a safe, responsible, and satisfying experience from start to finish.

Best regards,
{{nomeAgente}}
Premium Support Team`,
    },
    {
      id: "chargebackEnvioProdutos",
      category: "geral",
      label: "Chargeback realizado - solicitar envio dos produtos",
      autoDetect: ["chargeback", "estorno bancario", "estorno bancário", "contestação", "contestacao"],
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Agradecemos por entrar em contato.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Verificamos que sua compra foi cancelada diretamente pelo seu banco. Como cada instituição financeira possui suas próprias regras e procedimentos para cancelamentos e reembolsos, recomendamos que você entre em contato com o seu banco para confirmar os próximos passos.

Além disso, solicitamos que você devolva o produto para o endereço abaixo, para que possamos dar o devido andamento ao seu caso:

📍 Endereço de Devolução:
11870 62nd St. N
Largo, FL 33773

👉 Importante: Caso o produto ainda não tenha sido entregue, por favor, recuse a entrega. Ao recusar o pacote, ele será automaticamente retornado à nossa empresa, agilizando o processo de resolução e evitando etapas desnecessárias.

Assim que o produto for devolvido — seja por recusa ou envio para o endereço acima — poderemos dar continuidade à assistência de forma adequada.

Se precisar de informações adicionais ou suporte, não hesite em nos contatar. Estamos à disposição para ajudá-lo(a).

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

Thank you for reaching out.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

We've verified that your purchase was canceled directly by your bank. Since each financial institution has its own rules and procedures for cancellations and refunds, we recommend contacting your bank to confirm the next steps.

Additionally, we kindly ask that you return the product to the address below so we can move forward with your case:

📍 Return Address:
11870 62nd St. N
Largo, FL 33773

👉 Important: If the product hasn't been delivered yet, please refuse the delivery. By refusing the package, it will be automatically returned to our company, speeding up the resolution process and avoiding unnecessary steps.

Once the product has been returned — either by refusal or by shipping it to the address above — we'll be able to continue assisting you appropriately.

If you need any additional information or support, please don't hesitate to contact us. We're happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "geral",
      category: "geral",
      label: "Resposta geral / acolhimento",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Obrigado por entrar em contato! Meu nome é {{nomeAgente}} e recebi sua mensagem. Vou te ajudar com isso o mais rápido possível.\n" +
        "Pode me dar mais detalhes para que eu possa te auxiliar melhor?\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "Thank you for reaching out! My name is {{nomeAgente}} and I've received your message. I'll help you with this as quickly as possible.\n" +
        "Could you share more details so I can assist you better?\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "comoPossoAjudar",
      category: "geral",
      label: "Como posso te ajudar",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n\n" +
        "Agradecemos por entrar em contato. Esperamos que você esteja bem!\n\n" +
        "Somos a equipe de suporte do {{produto}} e nosso principal objetivo é garantir que você tenha a melhor experiência possível.\n\n" +
        "Para que possamos atendê-lo(a) da forma mais eficiente, por favor, compartilhe conosco sua dúvida ou necessidade. Estamos prontos para oferecer todo o suporte necessário e ajudá-lo(a) a encontrar a solução ideal.\n\n" +
        "Aguardamos seu retorno e permanecemos à disposição para qualquer esclarecimento.\n\n" +
        "Atenciosamente,\n" +
        "{{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n\n" +
        "Thank you for reaching out. We hope you're doing well!\n\n" +
        "We are the support team for {{produto}}, and our main goal is to make sure you have the best possible experience.\n\n" +
        "So we can assist you as efficiently as possible, please share your question or need with us. We're ready to provide all the necessary support and help you find the ideal solution.\n\n" +
        "We look forward to your reply and remain available for any clarification.\n\n" +
        "Best regards,\n" +
        "{{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "enderecoInsuficiente",
      category: "geral",
      label: "Pedido voltou para a empresa, endereço insuficiente",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n\n" +
        "Verifiquei na plataforma de transporte e consta que o seu pedido não foi entregue devido a endereço insuficiente. Mas não se preocupe, irei resolver essa questão da melhor forma possível.\n\n" +
        "O endereço cadastrado é o endereço acima. Esse endereço está correto?\n\n" +
        "Aguardo o seu retorno para solicitar o reenvio sem custos imediatamente.\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n\n" +
        "I checked with the shipping carrier and your order was not delivered due to an insufficient address. Don't worry, I'll take care of this for you in the best way possible.\n\n" +
        "The address on file is the one shown above. Is this address correct?\n\n" +
        "I'll be looking forward to your reply so I can request a free reshipment right away.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "reembolsoRealizadoConfirmacao",
      category: "geral",
      label: "Reembolso realizado - confirmação",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Gostaríamos de informar que o reembolso de {{percentualConfirmado}}% do valor total do seu pedido, no valor de \${{valorReembolso}}, foi realizado no dia {{dataReembolso}}.

O valor será creditado na mesma forma de pagamento utilizada na compra. Por favor, note que o tempo necessário para que o reembolso apareça em sua conta pode variar de acordo com as políticas do seu banco ou operadora de cartão, podendo levar alguns dias úteis.

Se tiver qualquer dúvida adicional ou precisar de suporte, estamos à disposição.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

We'd like to let you know that the {{percentualConfirmado}}% refund of your order's total amount, in the amount of \${{valorReembolso}}, was processed on {{dataReembolso}}.

The amount will be credited to the same payment method used for the purchase. Please note that the time it takes for the refund to appear in your account may vary depending on your bank's or card issuer's policies, and it may take a few business days.

If you have any further questions or need support, we're happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "naoAceitouNenhumaPropostaReembolso",
      category: "geral",
      label: "Não aceitou nenhuma proposta de reembolso",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Vamos seguir então com o processo de devolução para posterior reembolso. Por favor, siga as instruções abaixo para proceder com a devolução dos itens.

📦 Como devolver seu pedido:

1. Produtos lacrados e sem uso: Os produtos devem ser lacrados e em perfeitas condições, sem sinais de uso. Produtos abertos ou usados não serão aceitos para reembolso.
2. Endereço para devolução:
11870 62nd St. N
Largo, FL 33773
3. Anote o número do seu pedido {{numeroPedido}} na etiqueta de devolução para facilitar o processamento.
4. Após o envio, nos envie o código de rastreamento para que possamos acompanhar a devolução.

⚠️ Informações Importantes:

- Custos de devolução: Você será responsável pelos custos de envio e manuseio da devolução. O valor da devolução será pago diretamente na transportadora ou Correios.
- Processamento do reembolso: O reembolso total será realizado após o recebimento e inspeção dos produtos na nossa fábrica. O prazo para processamento é de até 7 dias úteis após a conferência.
- Frascos abertos ou vazios não serão reembolsados. Se você os enviar mesmo assim, pagará pelo peso do envio e, ao serem inspecionados, esses frascos não contarão para o valor do reembolso.
- Ao processarmos seu reembolso, será descontada uma taxa de reestocagem de 15%. Essa taxa cobre os custos de recebimento, inspeção e reintegração do produto ao nosso estoque.

Se precisar de ajuda adicional durante o processo de devolução, estamos à disposição para orientá-la.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte`,
      en: `Hello {{nomeCliente}},

Let's proceed then with the return process for a subsequent refund. Please follow the instructions below to return the items.

📦 How to return your order:

1. Sealed, unused products: The products must be sealed and in perfect condition, with no signs of use. Opened or used products will not be accepted for a refund.
2. Return address:
11870 62nd St. N
Largo, FL 33773
3. Write your order number {{numeroPedido}} on the return label to make processing easier.
4. After shipping, please send us the tracking code so we can follow the return.

⚠️ Important information:

- Return costs: You will be responsible for the shipping and handling costs of the return. The return shipping fee is paid directly to the carrier or postal service.
- Refund processing: The full refund will be issued after the products are received and inspected at our facility. Processing takes up to 7 business days after the review.
- Opened or empty bottles will not be refunded. If you send them anyway, you'll still pay for the shipping weight, and once inspected, those bottles won't count toward the refund amount.
- A 15% restocking fee will be deducted when we process your refund. This fee covers the costs of receiving, inspecting, and restocking the product.

If you need any further help during the return process, we're happy to guide you.

Best regards,
{{nomeAgente}}
Support Team`,
    },

    /* ---- Produtos Memória ---- */
    {
      id: "memoriaVendaDuplicada",
      category: "memoria",
      label: "Venda duplicada (oferta promocional)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},
Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.
Consegui localizar o seguinte pedido em nosso sistema:

Detalhes do Pedido
Número do Pedido: {{numeroPedido}}
Data da Compra: {{dataCompra}}
Produto: {{produto}}
Valor Total: R$ {{valorTotal}}
Endereço de Entrega: {{endereco}}
Status Atual: {{status}}

Compreendo totalmente a sua preocupação e quero garantir que encontraremos a melhor solução para você.

Vejo que você possui dois pedidos separados conosco:

Pedido 1 (Principal)
Número do Pedido: [NÚMERO_PEDIDO_1]
Produto: [PRODUTO_1]
Valor Total: R$ [VALOR_PEDIDO_1]

Pedido 2 (Adicional)
Número do Pedido: [NÚMERO_PEDIDO_2]
Produto: [PRODUTO_2]
Valor Total: R$ [VALOR_PEDIDO_2]

Recebemos seu contato informando que deseja realizar a devolução do seu pedido. Entendemos perfeitamente a sua situação e gostaríamos de esclarecer o que aconteceu com sua compra para que não reste nenhuma dúvida.

Ao aceitar nossa oferta promocional durante o processo de compra, a sua escolha inicial não foi substituída ou anulada, mas sim adicionada ao seu carrinho. Por conta disso, o seu pedido final acabou incluindo tanto os itens da primeira escolha quanto os da promoção.

Como seu pedido já foi processado e enviado, queremos evitar o transtorno de você ter que devolver os produtos e aguardar todo o processo de reembolso.

Nossa proposta especial para você:

15% de desconto (Reembolso Parcial): Receba 15% do valor total do pedido diretamente na sua forma de pagamento original.
Fique com todos os produtos: Você mantém todos os itens recebidos por um preço muito mais vantajoso.
Sugestão adicional: Como os produtos são 100% naturais e seguros, você pode presentear algum amigo ou familiar com os itens extras — uma forma de compartilhar saúde e bem-estar.

Além do reembolso de 15%, como cliente VIP, você receberá 3 ebooks exclusivos 📚 criados para potencializar seus resultados:

📕 Easy Weight Loss – Estratégias para melhorar a circulação e oxigenação, auxiliando no equilíbrio do peso e na clareza mental
📘 Healing an Anxiety Disorder – Técnicas para reduzir o estresse e a ansiedade que podem impactar a memória e o foco
📗 Brain Booster – Um guia passo a passo para aumentar o foco, a motivação e a capacidade de memória, ajudando você a se manter produtivo e mentalmente ativo por muitos anos

💎 Esses materiais normalmente possuem um valor significativo, mas como parte do nosso Suporte Premium VIP, você receberá totalmente gratuito para melhorar ainda mais sua experiência e resultados.

📊 Resultados Observados em até 30 Dias

🟢 Resultados Muito Satisfatórios – 68%
██████████████████████████░░ 68%

🟡 Resultados Gradativos / Moderados – 27%
███████████████░░░░░░░░░░░░░ 27%

⚪ Sem Mudanças Perceptíveis – 5%
██░░░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📌 95% dos clientes relatam benefícios perceptíveis em até 30 dias, especialmente com o uso contínuo e seguindo corretamente as orientações.

Benefícios relatados:
✔️ Auxilia na memória e concentração
✔️ Promove maior clareza mental
✔️ Contribui para foco e desempenho cognitivo
✔️ Estimula uma mente mais ativa e alerta
✔️ Apoia a saúde cerebral com fórmula natural

Muitas pessoas que inicialmente acreditavam não precisar dos produtos relatam melhora significativa na disposição mental e no bem-estar geral após o uso contínuo.

Dessa forma, resolvemos sua situação de maneira rápida, sem burocracia e você ainda sai ganhando.

Gostaria de prosseguir com esta alternativa? Se sim, responda a este e-mail e processaremos imediatamente seu reembolso parcial.

Ficamos no aguardo da sua resposta!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte / Atendimento ao Cliente`,
      en: `Hello {{nomeCliente}},
My name is {{nomeAgente}} and I'll be assisting you from now on.
I was able to locate the following order in our system:

Order Details
Order Number: {{numeroPedido}}
Purchase Date: {{dataCompra}}
Product: {{produto}}
Total Amount: \${{valorTotal}}
Shipping Address: {{endereco}}
Current Status: {{status}}

I completely understand your concern, and I want to make sure we find the best solution for you.

I can see you have two separate orders with us:

Order 1 (Main)
Order Number: [ORDER_NUMBER_1]
Product: [PRODUCT_1]
Total Amount: $[AMOUNT_1]

Order 2 (Additional)
Order Number: [ORDER_NUMBER_2]
Product: [PRODUCT_2]
Total Amount: $[AMOUNT_2]

We received your message letting us know you'd like to return your order. We completely understand your situation and would like to clarify what happened with your purchase so there's no doubt left.

When you accepted our promotional offer during checkout, your original choice wasn't replaced or cancelled — it was added to your cart instead. Because of that, your final order ended up including both the items from your first choice and the items from the promotion.

Since your order has already been processed and shipped, we'd like to avoid the inconvenience of having you return the products and wait through the entire refund process.

Our special offer for you:

15% discount (Partial Refund): Receive 15% of the total order value back to your original payment method.
Keep all the products: You keep every item you received at a much better price.
Extra suggestion: Since our products are 100% natural and safe, you could gift the extra items to a friend or family member — a way to share health and wellness.

In addition to the 15% refund, as a VIP customer you'll receive 3 exclusive ebooks 📚 created to boost your results:

📕 Easy Weight Loss – Strategies to improve circulation and oxygenation, supporting weight balance and mental clarity
📘 Healing an Anxiety Disorder – Techniques to reduce stress and anxiety that can affect memory and focus
📗 Brain Booster – A step-by-step guide to increase focus, motivation, and memory capacity, helping you stay productive and mentally active for years to come

💎 These materials usually carry significant value, but as part of our VIP Premium Support, you'll receive them completely free to further improve your experience and results.

📊 Results Observed Within 30 Days

🟢 Very Satisfying Results – 68%
██████████████████████████░░ 68%

🟡 Gradual / Moderate Results – 27%
███████████████░░░░░░░░░░░░░ 27%

⚪ No Noticeable Change – 5%
██░░░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📌 95% of customers report noticeable benefits within 30 days, especially with continued use and by correctly following the instructions.

Reported benefits:
✔️ Supports memory and concentration
✔️ Promotes greater mental clarity
✔️ Contributes to focus and cognitive performance
✔️ Encourages a more active and alert mind
✔️ Supports brain health with a natural formula

Many people who initially believed they didn't need the products report a significant improvement in mental sharpness and overall well-being after continued use.

This way, we resolve your situation quickly, without bureaucracy, and you still come out ahead.

Would you like to move forward with this alternative? If so, just reply to this email and we'll process your partial refund right away.

Looking forward to your reply!

Best regards,
{{nomeAgente}}
Support / Customer Service Team`,
    },
    {
      id: "memoriaFraudeCancelar",
      category: "memoria",
      label: "Cancelamento - alega fraude (produto em posse)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},
Meu nome é {{nomeAgente}} e estarei auxiliando você hoje.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo a sua preocupação, mas quero assegurar que nossa empresa e o produto {{produto}} são totalmente confiáveis e não se tratam de fraude. Temos clientes satisfeitos que obtiveram resultados significativos ao usar o {{produto}}, um suplemento natural desenvolvido para melhorar a memória e a função cognitiva.

Para que você possa experimentar o produto com total segurança, convidamos você a testá-lo pelos próximos 30 dias. Caso necessário, você poderá solicitar o reembolso facilmente entrando em contato por e-mail, e eu irei ajudá-la pessoalmente.

🧠 Por que muitas pessoas buscam um suplemento para memória?

Recebemos diariamente relatos de clientes que enfrentam desafios como:
Esquecimentos frequentes no dia a dia
Dificuldade de concentração no trabalho ou estudos
Sensação de "mente cansada" ou lenta
Falhas ao lembrar nomes, compromissos ou tarefas simples
Diminuição do foco com o avanço da idade
Impactos do estresse e da rotina intensa na clareza mental

O {{produto}} foi pensado justamente para apoiar essas necessidades, oferecendo:
✔️ Suporte à memória e retenção de informações
✔️ Auxílio na concentração e no foco mental
✔️ Estímulo à clareza cognitiva
✔️ Apoio à circulação e oxigenação cerebral
✔️ Contribuição para uma mente mais ativa e alerta
✔️ Suporte ao envelhecimento saudável do cérebro

Sempre reforçando: os melhores resultados são observados quando o uso é contínuo, responsável e com orientação adequada.

📊 Experiência Geral dos Clientes com o {{produto}} (até 30 dias)
🟢 Clientes Muito Satisfeitos – 68%
██████████████████████████░ 68%

🟡 Satisfação Moderada / Gradual – 27%
███████████████░░░░░░░░░░░░░ 27%

⚪ Sem Percepção de Resultados – 5%
██░░░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% relatam satisfação em até 30 dias, principalmente em relação à melhora da clareza mental, foco e sensação de bem-estar cognitivo.

🎁 Bônus VIP

Além de experimentar o produto, você receberá 3 ebooks digitais exclusivos, enviados gratuitamente para você como parte do nosso compromisso com sua experiência:
📕 Easy Weight Loss – Estratégias para melhorar circulação e oxigenação, auxiliando na perda de peso e saúde cerebral
📘 Healing Anxiety Disorder – Técnicas para reduzir estresse e ansiedade que podem impactar memória e foco
📗 Brain Booster – Guia passo a passo para aumentar foco, motivação e capacidade de memória

Estou à disposição para qualquer dúvida e ficarei feliz em orientá-la durante sua experiência com o {{produto}}.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte`,
      en: `Hello {{nomeCliente}},
My name is {{nomeAgente}} and I'll be assisting you today.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I understand your concern, but I want to assure you that our company and the {{produto}} are completely trustworthy and not a scam. We have satisfied customers who achieved significant results using the {{produto}}, a natural supplement developed to support memory and cognitive function.

So you can try the product with complete peace of mind, we invite you to test it for the next 30 days. If needed, you can request a refund easily by reaching out via email, and I'll personally help you with that.

🧠 Why do many people look for a memory supplement?

We hear from customers every day who face challenges such as:
Frequent forgetfulness in daily life
Difficulty concentrating at work or while studying
A feeling of a "tired" or slow mind
Trouble remembering names, appointments, or simple tasks
Decreased focus as they get older
The impact of stress and a busy routine on mental clarity

The {{produto}} was designed precisely to support these needs, offering:
✔️ Support for memory and information retention
✔️ Help with concentration and mental focus
✔️ Support for cognitive clarity
✔️ Support for brain circulation and oxygenation
✔️ A more active and alert mind
✔️ Support for healthy brain aging

As always: the best results are seen with continued, responsible use and proper guidance.

📊 Overall Customer Experience with the {{produto}} (within 30 days)
🟢 Very Satisfied Customers – 68%
██████████████████████████░ 68%

🟡 Moderate / Gradual Satisfaction – 27%
███████████████░░░░░░░░░░░░░ 27%

⚪ No Perceived Results – 5%
██░░░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% report satisfaction within 30 days, mainly regarding improved mental clarity, focus, and a sense of cognitive well-being.

🎁 VIP Bonus

In addition to trying the product, you'll receive 3 exclusive digital ebooks, sent to you free of charge as part of our commitment to your experience:
📕 Easy Weight Loss – Strategies to improve circulation and oxygenation, supporting weight loss and brain health
📘 Healing Anxiety Disorder – Techniques to reduce stress and anxiety that can affect memory and focus
📗 Brain Booster – A step-by-step guide to increase focus, motivation, and memory capacity

I'm here for any questions and would be happy to guide you through your experience with the {{produto}}.

Best regards,
{{nomeAgente}}
Support Team`,
    },
    {
      id: "memoriaSemResultados",
      category: "memoria",
      label: "Sem resultados (protocolo extra de cortesia)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}}, tudo bem? Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Consegui localizar o seguinte pedido em nosso sistema:

Detalhes do Pedido
- Número do Pedido: {{numeroPedido}}
- Data da Compra: {{dataCompra}}
- Produto: {{produto}}
- Valor Total: R$ {{valorTotal}}
- Endereço de Entrega: {{endereco}}
- Status Atual: {{status}}

Muito obrigado por compartilhar sua experiência de forma tão clara — entendo perfeitamente sua frustração após usar o suplemento sem ver os resultados esperados.

📌 Antes de prosseguirmos com a solicitação de reembolso, nossa equipe analisou cuidadosamente seu caso e identificou algo importante: pequenos ajustes podem fazer toda a diferença para acelerar os resultados de forma natural e eficaz.

Compreendemos perfeitamente sua expectativa em perceber resultados rapidamente. Quando falamos de foco, memória e clareza mental, cada avanço é valioso — e sua atenção a esse processo é totalmente legítima.

Nosso objetivo é que você se sinta seguro(a), bem orientado(a) e acompanhado(a) em cada etapa. Por isso, gostaríamos de explicar, de forma simples e transparente, como os resultados costumam ocorrer com o uso contínuo do suplemento, desenvolvido para atuar de maneira gradual e respeitosa ao ritmo natural do organismo:

📈 Etapas de adaptação e evolução

Fase 1 — Preparação (0 a 30 dias)
Período inicial de adaptação, no qual o organismo começa a responder aos nutrientes.

Fase 2 — Ativação (31 a 60 dias)
Momento em que muitos clientes começam a relatar melhorias mais perceptíveis, como maior clareza mental e melhor organização do pensamento.

Fase 3 — Otimização (60 dias ou mais)
Os benefícios tendem a se estabilizar, trazendo mais confiança, constância e satisfação.

📊 Evolução média observada pelos clientes

Progresso Percebido
Baixo ────────────────────────────── Alto
0–30 dias ▓▓▓▓░░░░░░░░░░
31–60 dias ▓▓▓▓▓▓▓▓░░░░░
60+ dias ▓▓▓▓▓▓▓▓▓▓▓▓▓░░

Satisfação dos Clientes
Baixa ────────────────────────────── Alta
0–30 dias ▓▓▓▓▓░░░░░░░░░░
31–60 dias ▓▓▓▓▓▓▓▓▓░░░░░
60+ dias ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

Estes dados mostram que os resultados mais consistentes aparecem com o uso contínuo, especialmente após o período inicial de adaptação. Você se encontra agora em uma fase considerada muito promissora.

🎁 Protocolo de Aceleração Cognitiva — Cortesia Especial

Para apoiar ainda mais o seu progresso, desenvolvemos o Protocolo de Aceleração Cognitiva, especialmente criado para clientes que passaram por situações semelhantes.

Este não é um guia genérico — é um sistema baseado na análise de mais de 3.700 voluntários, que, após um início mais lento, conseguiram alcançar a melhoria da memória desejada.

✨ O que você receberá COMPLETAMENTE GRÁTIS antes de prosseguir com o reembolso:

✅ Cronograma Estratégico de 21 Dias para uma Mente Blindada – passo a passo para utilização máxima do suplemento, auxiliando na desintoxicação cerebral
✅ Guia "Neurônios a Todo Vapor" – 5 hábitos diários para proteger o cérebro, aumentar foco e estimular neurotransmissores
✅ Lista de Alimentos Neuroprotetores – alimentos que fortalecem as conexões neurais
✅ Protocolo de Hidratação Cerebral – orientações para hidratação adequada, auxiliando na eliminação de toxinas

💰 Valor total dos materiais: R$ 297
✨ Seu investimento hoje: R$ 0 (totalmente gratuito)

Nossa proposta é simples: dê uma última chance à sua memória. Utilize estes materiais pelos próximos 30 dias, junto com o suplemento que você já possui.

👉 Se ainda assim você não perceber melhora na clareza mental e memória, realizaremos seu reembolso integral sem questionamentos.

Mas se funcionar — como ocorreu com 97% dos clientes que seguiram este protocolo — você poderá recuperar clareza mental, confiança e proteger seu cérebro contra o declínio cognitivo.

⚠️ Esta oportunidade especial é válida por 48 horas e exclusiva para clientes que solicitaram reembolso.

Para aceitar, responda este e-mail com: "SIM, QUERO TENTAR", e enviaremos todo o material imediatamente.

🔑 Lembre-se: você não tem nada a perder. Se não funcionar, seu reembolso permanece garantido. Mas, se funcionar, você poderá conquistar a mente ativa e clara que busca.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte Especializado`,
      en: `Hello {{nomeCliente}}, how are you? My name is {{nomeAgente}} and I'll be assisting you from now on.

I was able to locate the following order in our system:

Order Details
- Order Number: {{numeroPedido}}
- Purchase Date: {{dataCompra}}
- Product: {{produto}}
- Total Amount: \${{valorTotal}}
- Shipping Address: {{endereco}}
- Current Status: {{status}}

Thank you so much for sharing your experience so clearly — I completely understand your frustration after using the supplement without seeing the results you expected.

📌 Before we move forward with the refund request, our team carefully reviewed your case and identified something important: small adjustments can make all the difference in accelerating results naturally and effectively.

We completely understand your expectation of seeing results quickly. When it comes to focus, memory, and mental clarity, every bit of progress matters — and your attention to this process is entirely valid.

Our goal is for you to feel safe, well guided, and supported at every step. That's why we'd like to explain, simply and transparently, how results usually unfold with continued use of the supplement, which was designed to work gradually and in line with the body's natural pace:

📈 Adaptation and Progress Stages

Stage 1 — Preparation (0 to 30 days)
Initial adaptation period, during which the body starts responding to the nutrients.

Stage 2 — Activation (31 to 60 days)
The point where many customers begin reporting more noticeable improvements, such as greater mental clarity and better-organized thinking.

Stage 3 — Optimization (60+ days)
Benefits tend to stabilize, bringing more confidence, consistency, and satisfaction.

📊 Average Progress Reported by Customers

Perceived Progress
Low ────────────────────────────── High
0–30 days ▓▓▓▓░░░░░░░░░░
31–60 days ▓▓▓▓▓▓▓▓░░░░░
60+ days ▓▓▓▓▓▓▓▓▓▓▓▓▓░░

Customer Satisfaction
Low ────────────────────────────── High
0–30 days ▓▓▓▓▓░░░░░░░░░░
31–60 days ▓▓▓▓▓▓▓▓▓░░░░░
60+ days ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

This data shows that the most consistent results appear with continued use, especially after the initial adaptation period. You're currently at a stage considered very promising.

🎁 Cognitive Acceleration Protocol — Special Courtesy

To further support your progress, we developed the Cognitive Acceleration Protocol, created especially for customers who went through similar situations.

This isn't a generic guide — it's a system based on the analysis of more than 3,700 volunteers who, after a slower start, were able to achieve the memory improvement they were looking for.

✨ What you'll receive COMPLETELY FREE before proceeding with the refund:

✅ 21-Day Strategic Schedule for a Sharper Mind – a step-by-step plan to get the most out of the supplement, supporting brain detoxification
✅ "Neurons at Full Speed" Guide – 5 daily habits to protect the brain, boost focus, and stimulate neurotransmitters
✅ Neuroprotective Foods List – foods that strengthen neural connections
✅ Brain Hydration Protocol – guidance on proper hydration, helping eliminate toxins

💰 Total value of the materials: $297
✨ Your investment today: $0 (completely free)

Our proposal is simple: give your memory one last chance. Use these materials for the next 30 days, together with the supplement you already have.

👉 If you still don't notice improvement in mental clarity and memory, we'll issue a full refund, no questions asked.

But if it works — as it did for 97% of customers who followed this protocol — you'll be able to regain mental clarity, confidence, and protect your brain against cognitive decline.

⚠️ This special opportunity is valid for 48 hours and exclusive to customers who requested a refund.

To accept, reply to this email with: "YES, I WANT TO TRY", and we'll send you all the materials right away.

🔑 Remember: you have nothing to lose. If it doesn't work, your refund remains guaranteed. But if it does work, you may achieve the active, clear mind you're looking for.

Best regards,
{{nomeAgente}}
Specialized Support Team`,
    },

    {
      id: "memoriaMedicoEsclarecimento",
      category: "memoria",
      label: "Médico não autorizou (esclarecimento sobre o produto)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora. Agradeço imensamente pelo seu retorno e por compartilhar essa informação conosco. A sua saúde e a orientação do seu médico especialista são as nossas prioridades absolutas.

Dito isso, antes de darmos início aos trâmites postais da devolução física, gostaríamos apenas de trazer um esclarecimento importante: o nosso produto não é um medicamento pesado ou sintético, mas sim um suplemento alimentar purificado. Desenvolvido com ingredientes naturais cuidadosamente selecionados, proporciona excelentes resultados quando usado com segurança. Compreendemos perfeitamente que, em determinadas situações de saúde, não utilizar o produto seja a decisão mais responsável.

Muitas vezes, os médicos vetam suplementos de forma preventiva por acreditarem que a fórmula possui estimulantes ou compostos aceleradores (como cafeína ou taurina) que agridem o coração. No entanto, o nosso composto é 100% livre de estimulantes e focado estritamente na nutrição celular sutil e no bem-estar cognitivo.

Por esse motivo, antes de enfrentar a burocracia das transportadoras, enfrentar filas e arcar com os custos de frete de retorno do próprio bolso, sugerimos uma alternativa simples: leve a lista de ingredientes naturais do produto ao seu médico na próxima consulta ou envie uma mensagem para ele. Quando os especialistas analisam a tabela nutricional limpa e vegetal do nosso suplemento, a enorme maioria percebe que a fórmula não interfere nos remédios de pressão e autoriza o uso.

🧠 Benefícios do suplemento para memória

Nosso suplemento foi desenvolvido para apoiar a saúde cerebral de forma natural e promover melhorias cognitivas importantes. Seus principais benefícios incluem:

✔️ Suporte à memória e retenção de informações — ajuda a lembrar compromissos, nomes e tarefas do dia a dia.
✔️ Aumento da concentração e foco mental — contribui para maior produtividade e atenção.
✔️ Estímulo à clareza cognitiva — mente mais alerta, rápida e eficiente.
✔️ Auxílio na circulação e oxigenação cerebral — favorece o fluxo sanguíneo para o cérebro, melhorando o desempenho cognitivo.
✔️ Promove uma mente ativa e saudável — contribui para o envelhecimento cerebral saudável e proteção cognitiva a longo prazo.

🔬 Qualidade do produto e satisfação do cliente

Embora o produto possa não ser adequado para a sua situação específica neste exato momento, gostaríamos de compartilhar, de forma transparente, a experiência geral de clientes que o utilizam com segurança:

📊 Satisfação do cliente em 30 dias:
🟢 Clientes altamente satisfeitos: 68%
🟡 Satisfação Moderada/Gradual: 27%
⚫ Sem resultados visíveis: 5%

95% dos clientes relatam satisfação, principalmente relacionada ao bem-estar geral, equilíbrio e apoio a um estilo de vida mais saudável, quando usado de forma responsável.

Como a sua garantia de satisfação continua 100% ativa e protegida em nosso sistema pelas próximas semanas, você não corre risco algum de perder os seus direitos. Vale muito a pena manter os frascos guardados em local seco e fresco por mais alguns dias e fazer essa dupla checagem com o seu médico, permitindo-se a chance de desfrutar dessa transformação com total segurança.

Se, após apresentar os ingredientes, o seu cardiologista mantiver a restrição, responda a este e-mail e nós forneceremos imediatamente todos os dados necessários para o envio seguro ao armazém.

Estamos torcendo pelo seu bem-estar!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on. Thank you so much for getting back to us and for sharing this information. Your health and your specialist's guidance are our absolute priorities.

That said, before we start the postal return process, we'd just like to bring up an important clarification: our product is not a heavy or synthetic medication, but rather a purified dietary supplement. Made with carefully selected natural ingredients, it delivers excellent results when used safely. We completely understand that, in certain health situations, not using the product may be the most responsible decision.

Doctors often restrict supplements as a precaution, believing the formula contains stimulants or accelerating compounds (like caffeine or taurine) that could strain the heart. However, our formula is 100% stimulant-free and focused strictly on gentle cellular nutrition and cognitive well-being.

For that reason, before dealing with carrier bureaucracy, lines, and paying for return shipping out of pocket, we suggest a simple alternative: bring the product's natural ingredient list to your doctor at your next appointment, or send them a message. When specialists review our supplement's clean, plant-based nutrition facts, the vast majority find that the formula doesn't interfere with blood pressure medication and approve its use.

🧠 Memory supplement benefits

Our supplement was developed to naturally support brain health and promote important cognitive improvements. Its main benefits include:

✔️ Support for memory and information retention — helps you remember appointments, names, and daily tasks.
✔️ Increased concentration and mental focus — supports greater productivity and attention.
✔️ Stimulates cognitive clarity — a more alert, quick, and efficient mind.
✔️ Supports brain circulation and oxygenation — helps blood flow to the brain, improving cognitive performance.
✔️ Promotes an active and healthy mind — supports healthy brain aging and long-term cognitive protection.

🔬 Product quality and customer satisfaction

While the product may not be right for your specific situation at this exact moment, we'd like to transparently share the overall experience of customers who use it safely:

📊 Customer satisfaction within 30 days:
🟢 Highly satisfied customers: 68%
🟡 Moderate/gradual satisfaction: 27%
⚫ No visible results: 5%

95% of customers report satisfaction, mainly related to overall well-being, balance, and support for a healthier lifestyle, when used responsibly.

Since your satisfaction guarantee remains 100% active and protected in our system for the next few weeks, you run no risk of losing your rights. It's well worth keeping the bottles stored in a cool, dry place for a few more days and double-checking with your doctor, giving yourself the chance to enjoy this transformation with total safety.

If, after presenting the ingredients, your cardiologist still maintains the restriction, just reply to this email and we'll immediately provide everything needed for a safe return to our warehouse.

We're rooting for your well-being!

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "memoriaMedicoReembolso",
      category: "memoria",
      label: "Médico não autorizou (doação ou reembolso 20%)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você hoje. Agradeço imensamente pelo seu retorno e por compartilhar suas informações conosco. A sua saúde e a orientação do seu médico especialista são as nossas prioridades absolutas.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendemos que, em determinadas condições de saúde, não utilizar o suplemento pode ser a decisão mais correta e responsável, e apoiamos totalmente essa escolha. Nosso objetivo é sempre garantir segurança, bem-estar e clareza para que você possa tomar a melhor decisão para si mesma.

🧠 Por que muitas pessoas buscam apoio cognitivo?

Recebemos diariamente relatos de clientes que enfrentam desafios como:

Esquecimentos frequentes no dia a dia
Dificuldade de concentração no trabalho ou estudos
Sensação de "mente cansada" ou lenta
Falhas ao lembrar nomes, compromissos ou tarefas simples
Diminuição do foco com o avanço da idade
Impactos do estresse e da rotina intensa na clareza mental

O suplemento foi desenvolvido justamente para apoiar essas necessidades, oferecendo:

✔️ Suporte à memória e retenção de informações
✔️ Auxílio na concentração e no foco mental
✔️ Estímulo à clareza cognitiva
✔️ Apoio à circulação e oxigenação cerebral
✔️ Contribuição para uma mente mais ativa e alerta
✔️ Suporte ao envelhecimento saudável do cérebro

Sempre reforçando: os melhores resultados são observados quando o uso é contínuo, responsável e com orientação adequada.

📊 Experiência Geral dos Clientes (até 30 dias)
🟢 Clientes Muito Satisfeitos – 68%

██████████████████████████░ 68%

🟡 Satisfação Moderada / Gradual – 27%

███████████████░░░░░░░░░░░ 27%

⚪ Sem Percepção de Resultados – 5%

██░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% relatam satisfação em até 30 dias, especialmente em relação à melhora da clareza mental, foco e sensação de bem-estar cognitivo.

🤝 Alternativas Pensadas com Empatia para Você

Sabendo que o uso não é possível neste momento, gostaríamos de apresentar opções justas e respeitosas:

1️⃣ Opção de Doação

Você pode optar por doar o suplemento a um familiar, amigo ou instituição, desde que não haja contraindicação médica para essa pessoa. Assim, o suplemento pode beneficiar alguém que esteja precisando.

2️⃣ Reembolso Simplificado de 20% (Sem Burocracia)

Também disponibilizamos a opção de reembolso imediato de 20% do valor pago, sem formulários extensos ou processos desgastantes.

Basta responder a este e-mail confirmando sua escolha, e nossa equipe cuidará de tudo com agilidade e clareza.

Nosso compromisso é agir com empatia, responsabilidade e total transparência, respeitando sua realidade e sua decisão.

Fico no aguardo da sua resposta para seguirmos com a alternativa que fizer mais sentido para você.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte Premium`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you today. Thank you so much for getting back to us and sharing your information. Your health and your specialist's guidance are our absolute priorities.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

We understand that, in certain health conditions, not using the supplement may be the correct and responsible decision, and we fully support that choice. Our goal is always to ensure safety, well-being, and clarity so you can make the best decision for yourself.

🧠 Why do many people seek cognitive support?

We hear from customers every day who face challenges such as:

Frequent forgetfulness in daily life
Difficulty concentrating at work or while studying
A feeling of a "tired" or slow mind
Trouble remembering names, appointments, or simple tasks
Decreased focus as they get older
The impact of stress and a busy routine on mental clarity

The supplement was developed precisely to support these needs, offering:

✔️ Support for memory and information retention
✔️ Help with concentration and mental focus
✔️ Support for cognitive clarity
✔️ Support for brain circulation and oxygenation
✔️ A more active and alert mind
✔️ Support for healthy brain aging

As always: the best results are seen with continued, responsible use and proper guidance.

📊 Overall Customer Experience (within 30 days)
🟢 Very Satisfied Customers – 68%

██████████████████████████░ 68%

🟡 Moderate / Gradual Satisfaction – 27%

███████████████░░░░░░░░░░░ 27%

⚪ No Perceived Results – 5%

██░░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% report satisfaction within 30 days, especially regarding improved mental clarity, focus, and a sense of cognitive well-being.

🤝 Alternatives Designed with Empathy for You

Knowing that using the product isn't possible right now, we'd like to offer fair and respectful options:

1️⃣ Donation Option

You can choose to donate the supplement to a family member, friend, or institution, as long as there's no medical contraindication for that person. This way, the supplement can still benefit someone who needs it.

2️⃣ Simplified 20% Refund (No Red Tape)

We also offer an immediate refund of 20% of the amount paid, with no lengthy forms or tiring processes.

Just reply to this email confirming your choice, and our team will take care of everything quickly and clearly.

Our commitment is to act with empathy, responsibility, and full transparency, respecting your situation and your decision.

I'll be looking forward to your reply so we can move forward with whichever option makes the most sense for you.

Best regards,
{{nomeAgente}}
Premium Support Team`,
    },
    {
      id: "memoriaMudouIdeiaEngano",
      category: "memoria",
      label: "Mudou de ideia / comprou por engano (teste de 30 dias)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Agradeço imensamente pelo seu contato e por compartilhar sua situação conosco. Seu bem-estar e a segurança do seu investimento são nossas prioridades absolutas.

Identificamos que você realizou a compra do {{produto}} recentemente e o produto já chegou até você. Antes de falarmos sobre devoluções ou burocracias, gostaria de entender melhor a sua situação: o que motivou a intenção de devolução? Houve algum imprevisto ou dúvida sobre o uso do produto?

Como o seu investimento já está em suas mãos, nosso objetivo é ajudá-lo(a) a tomar a decisão mais inteligente para sua saúde e para seu bolso. Por isso, sugerimos que você participe do nosso Desafio de Teste de 30 Dias, antes de qualquer decisão definitiva.

🚀 Por que iniciar o teste de 30 dias é o melhor caminho?

O {{produto}} é uma fórmula premium, desenvolvida com ativos purificados que atuam na renovação celular e energia diária. O uso contínuo no primeiro mês é essencial para que seu corpo se adapte, elimine toxinas e você sinta os benefícios reais de disposição, memória e clareza mental.

🎁 Protocolo de Aceleração Cognitiva — Cortesia Especial

Para potencializar ainda mais seus resultados, você receberá gratuitamente o Protocolo de Aceleração Cognitiva, baseado na análise de mais de 3.700 voluntários que obtiveram recuperação da memória ao seguir o protocolo corretamente.

O que você receberá gratuitamente antes de solicitar qualquer reembolso:

✅ Cronograma Estratégico de 21 Dias para uma Mente Blindada
✅ Guia "Neurônios a Todo Vapor" – 5 hábitos diários para proteger o cérebro e aumentar foco
✅ Lista de Alimentos Neuroprotetores
✅ Protocolo de Hidratação Cerebral

💰 Valor total: R$ 297
✨ Seu investimento hoje: R$ 0

⚠️ Condições

Use o material junto com o {{produto}} por 30 dias. Caso não perceba melhora na memória e clareza mental, seu reembolso integral será garantido sem questionamentos.

Esta oportunidade é válida por 48 horas, exclusiva para clientes que solicitaram reembolso.

🔑 Vantagens

Você testa o produto que já possui sem riscos.
Economia de tempo e dinheiro, evitando devoluções e fretes.
Seu pedido permanece coberto pela garantia de 60 dias.
Experimente os benefícios reais de forma segura e responsável.

Para aceitar, basta responder a este e-mail com:

"SIM, QUERO TENTAR"

Assim, enviaremos imediatamente todos os materiais para você e poderá começar seu teste com segurança.

Estamos aqui para apoiá-lo(a) em cada passo do processo e garantir que você tire o máximo proveito do seu investimento.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Thank you so much for reaching out and sharing your situation with us. Your well-being and the security of your investment are our absolute priorities.

We can see you recently purchased the {{produto}} and that it has already arrived. Before we talk about returns or paperwork, I'd like to better understand your situation: what led to the decision to return it? Was there an unexpected issue or a question about how to use the product?

Since your investment is already in your hands, our goal is to help you make the smartest decision for your health and your wallet. That's why we suggest you take part in our 30-Day Trial Challenge before making any final decision.

🚀 Why is starting the 30-day trial the best path forward?

The {{produto}} is a premium formula, developed with purified active ingredients that support cellular renewal and daily energy. Continued use during the first month is essential for your body to adapt, eliminate toxins, and for you to feel the real benefits in energy, memory, and mental clarity.

🎁 Cognitive Acceleration Protocol — Special Courtesy

To further boost your results, you'll receive the Cognitive Acceleration Protocol for free, based on the analysis of more than 3,700 volunteers who achieved memory recovery by correctly following the protocol.

What you'll receive for free before requesting any refund:

✅ 21-Day Strategic Schedule for a Sharper Mind
✅ "Neurons at Full Speed" Guide – 5 daily habits to protect the brain and boost focus
✅ Neuroprotective Foods List
✅ Brain Hydration Protocol

💰 Total value: $297
✨ Your investment today: $0

⚠️ Conditions

Use the materials together with the {{produto}} for 30 days. If you don't notice improvement in memory and mental clarity, your full refund will be guaranteed, no questions asked.

This opportunity is valid for 48 hours, exclusive to customers who requested a refund.

🔑 Advantages

You get to test the product you already own, risk-free.
You save time and money by avoiding returns and shipping costs.
Your order remains covered by our 60-day guarantee.
You get to experience the real benefits safely and responsibly.

To accept, just reply to this email with:

"YES, I WANT TO TRY"

We'll then immediately send you all the materials so you can start your trial safely.

We're here to support you at every step and make sure you get the most out of your investment.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "memoriaDarChance",
      category: "memoria",
      label: "Dar uma chance ao produto",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora. Espero que esteja bem.

Agradeço por sua mensagem e por compartilhar suas preocupações conosco. Entendo perfeitamente que você queira ter cautela antes de investir em um produto, especialmente quando ainda não teve a oportunidade de experimentá-lo. É natural ter dúvidas e querer ter certeza de que está fazendo uma boa escolha.

Gostaria de reforçar um ponto importante antes de qualquer decisão: o produto adquirido foi desenvolvido como um suplemento natural para apoio à memória, foco e clareza mental, com uma proposta gradual e não medicamentosa. Seu objetivo é oferecer suporte progressivo ao organismo, respeitando o tempo de adaptação de cada pessoa.

Muitos clientes também tiveram dúvidas no início, mas decidiram testar o produto com calma e relataram uma experiência positiva ao incluí-lo em sua rotina. Por isso, recomendamos fortemente que você dê uma chance ao produto antes de considerar a devolução.

📊 Experiência Geral dos Clientes (até 30 dias)
🟢 Clientes Muito Satisfeitos – 68%

██████████████████████████░ 68%

🟡 Satisfação Moderada / Gradual – 27%

███████████████░░░░░░░░░░░ 27%

⚪ Sem Resultados Perceptíveis – 5%

██░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% dos clientes relatam benefícios perceptíveis em até 30 dias, principalmente em relação à melhora da clareza mental, foco e bem-estar cognitivo geral.

Além disso, você conta com uma garantia de satisfação de 60 dias a partir da data da compra, garantindo tempo suficiente para testar o produto, observar sua adaptação e tomar uma decisão informada. Caso não se sinta satisfeito(a) dentro deste período, estaremos à disposição para orientá-lo(a) conforme as condições da garantia.

Nossa sugestão é que você dê uma oportunidade justa ao produto, siga as instruções de uso e observe sua experiência com tranquilidade. Dessa forma, sua decisão será baseada no uso real, e não apenas na primeira impressão.

Estamos aqui para apoiá-lo(a) durante todo esse processo e esclarecer qualquer dúvida para que se sinta seguro(a) em cada etapa.

Fique à vontade para nos contatar caso precise de mais informações ou esclarecimentos.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on. I hope you're doing well.

Thank you for your message and for sharing your concerns with us. I completely understand wanting to be cautious before investing in a product, especially when you haven't had the chance to try it yet. It's natural to have doubts and want to be sure you're making a good choice.

I'd like to highlight an important point before any decision: the product you purchased was developed as a natural supplement to support memory, focus, and mental clarity, with a gradual, non-medicinal approach. Its goal is to offer progressive support to the body, respecting each person's own adaptation time.

Many customers also had doubts at first, but decided to try the product calmly and reported a positive experience after adding it to their routine. That's why we strongly recommend giving the product a fair chance before considering a return.

📊 Overall Customer Experience (within 30 days)
🟢 Very Satisfied Customers – 68%

██████████████████████████░ 68%

🟡 Moderate / Gradual Satisfaction – 27%

███████████████░░░░░░░░░░░ 27%

⚪ No Noticeable Results – 5%

██░░░░░░░░░░░░░░░░░░░░░░░ 5%

📊 95% of customers report noticeable benefits within 30 days, mainly related to improved mental clarity, focus, and overall cognitive well-being.

In addition, you have a 60-day satisfaction guarantee from the purchase date, giving you enough time to try the product, observe how your body adapts, and make an informed decision. If you're not satisfied within this period, we'll be available to guide you according to the guarantee conditions.

Our suggestion is that you give the product a fair opportunity, follow the usage instructions, and observe your experience calmly. This way, your decision will be based on real use, not just a first impression.

We're here to support you throughout this whole process and answer any questions so you feel confident at every step.

Feel free to contact us if you need more information or clarification.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    /* ---- Produtos Emagrecimento ---- */
    {
      id: "emagrecimentoCancelarEngano",
      category: "emagrecimento",
      label: "Cancelar / comprou por engano (desafio 30 dias)",
      autoDetect: null,
      pt: `Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Agradeço imensamente pelo seu contato e por compartilhar sua situação conosco. Seu bem-estar e a segurança do seu investimento são nossas prioridades absolutas.

Identificamos que você realizou a compra do {{produto}} recentemente e o produto já chegou até você. Antes de falarmos sobre devoluções ou burocracias, gostaria de entender melhor a sua situação: o que motivou a intenção de devolução? Houve algum imprevisto ou dúvida sobre o uso do produto?

Como o seu investimento já está em suas mãos, nosso objetivo é ajudá-lo(a) a tomar a decisão mais inteligente para sua saúde e para seu bolso. Por isso, sugerimos que você participe do nosso Desafio de Teste de 30 Dias, antes de qualquer decisão definitiva.

🚀 Por que iniciar o teste de 30 dias é o melhor caminho?

O {{produto}} é uma fórmula premium, desenvolvida com ativos purificados que atuam na renovação celular e energia diária. O uso contínuo no primeiro mês é essencial para que seu corpo se adapte, elimine toxinas e você sinta os benefícios reais de disposição, memória e clareza mental.

Por isso, desenvolvemos um Programa Completo de Resgate, especificamente para pessoas na sua situação. Este não é um programa genérico — é um sistema personalizado baseado na análise de mais de 10.000 casos de clientes que inicialmente não tiveram resultados, mas depois alcançaram transformações incríveis.

🎁 O que você receberá GRATUITAMENTE antes do seu reembolso:
✅ Cronograma Estratégico de 28 Dias — Um plano diário detalhado para utilizar o produto de forma eficiente
✅ 10 Dicas Simples de Desintoxicação — Técnicas que preparam seu corpo para absorver melhor os componentes ativos
✅ Receita do Suco Milagroso Anti-Inchaço — Fórmula natural que reduz retenção de líquidos em 48 horas
✅ Pink Salt + Ice Hack 2.0 — Método atualizado que acelera o metabolismo em até 23%

Valor total destes materiais: $197
Seu investimento hoje: $0 (completamente gratuito)

📌 Nossa proposta

Dê uma última chance para si mesmo. Utilize estes materiais pelos próximos 30 dias junto com o produto que você já possui.

Se você conseguir os resultados desejados (como 94% dos nossos clientes que seguiram o programa), você terá economizado tempo e dinheiro, alcançando seus objetivos com segurança.

Para aceitar, basta responder a este e-mail com:

"SIM, QUERO TENTAR"

Assim, enviaremos imediatamente todos os materiais para você e você poderá iniciar seu teste com total segurança.

Estamos à disposição para apoiá-lo(a) em cada passo do processo e garantir que você tire o máximo proveito do seu investimento.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `My name is {{nomeAgente}} and I'll be assisting you from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Thank you so much for reaching out and sharing your situation with us. Your well-being and the security of your investment are our absolute priorities.

We can see you recently purchased the {{produto}} and that it has already arrived. Before we talk about returns or paperwork, I'd like to better understand your situation: what led to the decision to return it? Was there an unexpected issue or a question about how to use the product?

Since your investment is already in your hands, our goal is to help you make the smartest decision for your health and your wallet. That's why we suggest you take part in our 30-Day Trial Challenge before making any final decision.

🚀 Why is starting the 30-day trial the best path forward?

The {{produto}} is a premium formula, developed with purified active ingredients that support cellular renewal and daily energy. Continued use during the first month is essential for your body to adapt, eliminate toxins, and for you to feel the real benefits in energy, memory, and mental clarity.

That's why we developed a Complete Rescue Program, specifically for people in your situation. This isn't a generic program — it's a personalized system based on the analysis of more than 10,000 customer cases who initially had no results but later achieved incredible transformations.

🎁 What you'll receive FREE before your refund:
✅ 28-Day Strategic Schedule — A detailed daily plan to use the product efficiently
✅ 10 Simple Detox Tips — Techniques that prepare your body to better absorb the active ingredients
✅ Miracle Anti-Bloating Juice Recipe — A natural formula that reduces fluid retention in 48 hours
✅ Pink Salt + Ice Hack 2.0 — An updated method that boosts metabolism by up to 23%

Total value of these materials: $197
Your investment today: $0 (completely free)

📌 Our proposal

Give yourself one last chance. Use these materials for the next 30 days together with the product you already have.

If you achieve the results you wanted (like 94% of our customers who followed the program), you'll have saved time and money while reaching your goals safely.

To accept, just reply to this email with:

"YES, I WANT TO TRY"

We'll then immediately send you all the materials so you can start your trial with total safety.

We're here to support you at every step and make sure you get the most out of your investment.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "emagrecimentoSemResultados",
      category: "emagrecimento",
      label: "Sem resultados (programa de resgate)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Recebemos sua solicitação de reembolso e entendemos completamente sua frustração. Sabemos como é desapontante quando você investe tempo, dinheiro e esperança em algo que não entrega os resultados prometidos.

Mas antes de processarmos seu reembolso, nossa equipe de especialistas analisou seu caso específico e descobriu algo importante: você pode ter perdido componentes essenciais que fazem toda a diferença entre o sucesso e o fracasso na perda de peso.

A verdade é que nosso produto funciona excepcionalmente bem, mas apenas quando combinado com as estratégias corretas. E aqui está o que descobrimos analisando milhares de casos como o seu:

87% dos clientes que não obtiveram resultados iniciais estavam cometendo pelo menos 3 dos seguintes erros:

Não seguiam um cronograma estratégico adequado para maximizar a absorção
Não realizavam a desintoxicação prévia necessária para preparar o organismo
Não combinavam o produto com hábitos simples que potencializam os resultados
Não utilizavam técnicas complementares para acelerar o metabolismo

Por isso, desenvolvemos um Programa Completo de Resgate especificamente para pessoas na sua situação. Este não é um programa genérico — é um sistema personalizado baseado na análise de mais de 10.000 casos de clientes que inicialmente não tiveram resultados, mas depois alcançaram transformações incríveis.

O que você receberá GRATUITAMENTE antes do seu reembolso:
✅ Cronograma Estratégico de 28 Dias — Um plano dia a dia que mostra exatamente quando e como usar o produto para máxima eficácia
✅ 10 Dicas Simples de Desintoxicação — Técnicas que preparam seu corpo para absorver melhor os componentes ativos
✅ Receita do Suco Milagroso Anti-Inchaço — Uma fórmula natural que elimina retenção de líquidos em 48 horas
✅ Pink Salt + Ice Hack 2.0 — A versão atualizada do nosso método viral que acelera o metabolismo em até 23%

Valor total destes materiais: $197
Seu investimento hoje: $0 (completamente gratuito)

Aqui está nossa proposta: Dê uma última chance para si mesmo. Use estes materiais pelos próximos [COLOCAR OS DIAS] dias junto com o produto que você já possui.

Se você conseguir os resultados que sempre desejou (como 94% dos nossos clientes que usaram este programa), você terá economizado centenas de dólares e finalmente alcançado seus objetivos.

Esta oferta expira em 48 horas e só está disponível para clientes que solicitaram reembolso. Não podemos manter esta oferta aberta indefinidamente devido ao valor dos materiais envolvidos.

Para aceitar esta oportunidade, simplesmente responda este e-mail com:

"SIM, QUERO TENTAR"

E enviaremos todos os materiais imediatamente para seu e-mail.

Lembre-se: você não tem nada a perder. Se não funcionar, seu reembolso está garantido. Mas se funcionar, você terá a transformação que sempre sonhou.

A escolha é sua: desistir agora ou dar uma última chance científica e estratégica para alcançar seus objetivos?

Aguardamos sua resposta.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte Especializado`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

We received your refund request and completely understand your frustration. We know how disappointing it is when you invest time, money, and hope into something that doesn't deliver the promised results.

But before we process your refund, our team of specialists reviewed your specific case and found something important: you may have missed essential components that make all the difference between success and failure in weight loss.

The truth is our product works exceptionally well, but only when combined with the right strategies. Here's what we found by analyzing thousands of cases like yours:

87% of customers who didn't get initial results were making at least 3 of the following mistakes:

Not following a proper strategic schedule to maximize absorption
Not doing the necessary prior detox to prepare the body
Not combining the product with simple habits that boost results
Not using complementary techniques to speed up metabolism

That's why we developed a Complete Rescue Program specifically for people in your situation. This isn't a generic program — it's a personalized system based on the analysis of more than 10,000 customer cases who initially had no results but later achieved incredible transformations.

What you'll receive FREE before your refund:
✅ 28-Day Strategic Schedule — A day-by-day plan showing exactly when and how to use the product for maximum effectiveness
✅ 10 Simple Detox Tips — Techniques that prepare your body to better absorb the active ingredients
✅ Miracle Anti-Bloating Juice Recipe — A natural formula that eliminates fluid retention in 48 hours
✅ Pink Salt + Ice Hack 2.0 — The updated version of our viral method that boosts metabolism by up to 23%

Total value of these materials: $197
Your investment today: $0 (completely free)

Here's our proposal: Give yourself one last chance. Use these materials for the next [NUMBER OF DAYS] days together with the product you already have.

If you achieve the results you always wanted (like 94% of our customers who used this program), you'll have saved hundreds of dollars and finally reached your goals.

This offer expires in 48 hours and is only available to customers who requested a refund. We can't keep this offer open indefinitely given the value of the materials involved.

To accept this opportunity, simply reply to this email with:

"YES, I WANT TO TRY"

And we'll send all the materials to your email right away.

Remember: you have nothing to lose. If it doesn't work, your refund is guaranteed. But if it works, you'll get the transformation you've always dreamed of.

The choice is yours: give up now, or give yourself one last scientific, strategic chance to reach your goals?

We look forward to your reply.

Best regards,
{{nomeAgente}}
Specialized Support Team`,
    },
    {
      id: "emagrecimentoEfeitosAdversos",
      category: "emagrecimento",
      label: "Efeitos adversos (protocolo de monitoramento)",
      autoDetect: null,
      pt: `Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora. Agradeço por compartilhar sua experiência com {{produto}}.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Relatos de sintomas desagradáveis são tratados com atenção técnica, critério profissional e total responsabilidade, pois fazem parte do acompanhamento adequado dentro de protocolos metabólicos estruturados.

Nosso objetivo neste contato é fornecer clareza, segurança e direcionamento, para que você se sinta confiante em seguir corretamente o processo.

🔬 Como interpretamos os sintomas iniciais

Em protocolos metabólicos, especialmente nas fases iniciais, é comum que o organismo manifeste sensações perceptíveis durante a adaptação fisiológica natural.

Esses sintomas desagradáveis não indicam falha no protocolo, mas sim que o corpo está respondendo a ajustes internos, principalmente quando envolvem:

🟢 Mudanças no ritmo metabólico
🟢 Reorganização dos padrões de energia
🟢 Adaptação progressiva a uma nova rotina metabólica

👉 Em nosso acompanhamento técnico, observamos que a maioria desses sintomas tende a diminuir gradualmente quando o protocolo é seguido corretamente.

📊 O que os dados de acompanhamento demonstram

Com base no monitoramento contínuo de milhares de usuários, identificamos que:

✔️ Os sintomas desagradáveis costumam ser temporários
✔️ A aplicação correta das orientações aumenta significativamente o conforto
✔️ A continuidade orientada favorece a estabilização e uma melhor experiência geral

Portanto, avaliar o processo como um todo é essencial, e não apenas sensações isoladas dos primeiros dias.

📘 Importância do material complementar

Diante do seu relato, você foi autorizado a receber o Protocolo de Monitoramento e Otimização {{produto}} — um material técnico e operacional, desenvolvido especificamente para situações como a sua.

💼 Valor comercial do protocolo: US$ 147
🎯 Disponibilizado sem custo, com o objetivo exclusivo de:

Orientar o uso correto
Reduzir sintomas desagradáveis iniciais
Aumentar previsibilidade e conforto
Padronizar a experiência ao longo do uso

Este material não é promocional e existe exclusivamente para oferecer suporte técnico e segurança operacional durante a fase de adaptação.

▶️ Direcionamento profissional

Seguir rigorosamente as orientações do protocolo complementar proporciona mais estabilidade, confiança e tranquilidade ao longo do uso.

⏳ A liberação deste material é excepcional e ficará disponível por 48 horas.

Para receber as orientações completas, responda a este e-mail com:

👉 "SIM, QUERO RECEBER AS ORIENTAÇÕES"

Seguimos acompanhando seu caso com profissionalismo, seriedade e compromisso com sua experiência.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `My name is {{nomeAgente}} and I'll be assisting you from now on. Thank you for sharing your experience with {{produto}}.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

Reports of unpleasant symptoms are handled with technical attention, professional judgment, and full responsibility, as they're part of proper monitoring within structured metabolic protocols.

Our goal with this message is to provide clarity, safety, and guidance, so you feel confident about correctly following the process.

🔬 How we interpret initial symptoms

In metabolic protocols, especially in the early stages, it's common for the body to show noticeable sensations during the natural physiological adaptation.

These unpleasant symptoms don't indicate a failure of the protocol, but rather that the body is responding to internal adjustments, particularly involving:

🟢 Changes in metabolic rhythm
🟢 Reorganization of energy patterns
🟢 Gradual adaptation to a new metabolic routine

👉 Through our technical monitoring, we've observed that most of these symptoms tend to gradually decrease when the protocol is followed correctly.

📊 What the monitoring data shows

Based on continuous monitoring of thousands of users, we found that:

✔️ Unpleasant symptoms tend to be temporary
✔️ Correctly following the guidance significantly increases comfort
✔️ Guided continuity supports stabilization and a better overall experience

Therefore, it's essential to evaluate the process as a whole, not just isolated sensations from the first few days.

📘 Importance of the complementary material

Based on your report, you've been authorized to receive the {{produto}} Monitoring and Optimization Protocol — a technical, operational resource developed specifically for situations like yours.

💼 Commercial value of the protocol: $147
🎯 Provided at no cost, with the exclusive purpose of:

Guiding correct use
Reducing initial unpleasant symptoms
Increasing predictability and comfort
Standardizing the experience throughout use

This material isn't promotional — it exists exclusively to provide technical support and operational safety during the adaptation phase.

▶️ Professional guidance

Strictly following the complementary protocol's guidance provides more stability, confidence, and peace of mind throughout use.

⏳ The release of this material is exceptional and will be available for 48 hours.

To receive the complete guidance, reply to this email with:

👉 "YES, I WANT TO RECEIVE THE GUIDANCE"

We'll continue following up on your case with professionalism, seriousness, and commitment to your experience.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    /* ---- Marca FEG (placeholder inicial — substitua pelo texto real da marca) ---- */
    {
      id: "fegApresentacao",
      category: "feg",
      label: "Apresentação da marca FEG",
      autoDetect: null,
      pt:
        "Olá {{nomeCliente}},\n" +
        "Meu nome é {{nomeAgente}}, da equipe de suporte da FEG. Fico feliz em te ajudar!\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Nossos produtos são desenvolvidos com cuidado para entregar a melhor experiência possível, e nosso time está sempre à disposição para tirar dúvidas sobre o {{produto}} ou qualquer outro item da linha FEG.\n" +
        "Em que posso te ajudar agora?\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte FEG",
      en:
        "Hello {{nomeCliente}},\n" +
        "My name is {{nomeAgente}}, from the FEG support team. I'm happy to help!\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "Our products are carefully developed to deliver the best possible experience, and our team is always available to answer questions about the {{produto}} or any other item in the FEG line.\n" +
        "How can I help you right now?\n" +
        "Best regards, {{nomeAgente}}\n" +
        "FEG Support Team",
    },

    /* ---- Oferta de Reembolso ---- */
    {
      id: "reembolso15",
      category: "reembolso",
      label: "Reembolso 15% (Geral)",
      autoDetect: null,
      defaultPercentual: "15",
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Entendo seu pedido e quero te ajudar da melhor forma possível.\n" +
        "Como alternativa ao reembolso integral, posso oferecer agora mesmo um reembolso parcial de {{percentualOferta}}% do valor pago, sem precisar devolver o produto.\n" +
        "Assim você já fica com o reembolso garantido e ainda pode continuar usando o {{produto}}.\n" +
        "Posso seguir com esse reembolso de {{percentualOferta}}% para você agora?\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "I understand your request and want to help you in the best way possible.\n" +
        "As an alternative to a full refund, I can offer right now a partial refund of {{percentualOferta}}% of the amount paid, with no need to return the product.\n" +
        "This way you already have the refund guaranteed and can keep using the {{produto}}.\n" +
        "Shall I go ahead and process this {{percentualOferta}}% refund for you now?\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "reembolsoEmagrecimento15",
      category: "reembolso",
      label: "Reembolso 15% (Emagrecimento)",
      autoDetect: null,
      defaultPercentual: "15",
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.
Eu entendo perfeitamente por que você decidiu comprar o {{produto}}: cuidar de si mesma, recuperar energia, melhorar sua autoestima e voltar a se sentir bem no próprio corpo. 💚

Sabemos que o processo de emagrecimento nem sempre acontece da noite para o dia. Não se trata de uma mudança milagrosa ou imediata, mas sim de dar ao seu corpo uma oportunidade real de responder, se adaptar e começar a evoluir de forma natural e respeitosa.

Cada pequeno passo conta.

O {{produto}} foi desenvolvido justamente para apoiar sua rotina, seu bem-estar diário, sua vitalidade e sua confiança ao longo desse processo. Muitas vezes, interromper o uso cedo demais pode impedir que o corpo tenha tempo suficiente para se adaptar e mostrar os benefícios esperados.

Imagine poder olhar no espelho e sentir orgulho do esforço que você está fazendo. Recuperar a liberdade de usar roupas que gosta, sentir-se mais confiante e perceber que está cuidando de si mesma com constância. Esse é o verdadeiro objetivo: ajudar você a continuar avançando no seu projeto, sem pressão e sem soluções temporárias.

Queremos que você se sinta apoiada nessa decisão. Por isso, para tornar esse processo mais leve e mostrar nossa intenção de ajudar, conseguimos oferecer um reembolso administrativo de {{percentualOferta}}% do valor total dos seus produtos, sem necessidade de devolução.

Essa é uma forma de reduzir parte do seu investimento agora, enquanto você ainda mantém os produtos e pode continuar seu projeto com mais tranquilidade.

Pedimos apenas que pense com carinho antes de interromper sua jornada. Você comprou este produto por um motivo, e ele ainda pode fazer parte de uma nova rotina de cuidado, disciplina e atenção consigo mesma.

Caso aceite essa solução com {{percentualOferta}}% de reembolso e deseje continuar utilizando os produtos, basta responder a este e-mail confirmando, e seguiremos com o processamento.

Estou à disposição para ajudar no que for necessário.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.
I completely understand why you decided to buy the {{produto}}: to take care of yourself, regain energy, improve your self-esteem, and feel good in your own body again. 💚

We know that the weight-loss process doesn't always happen overnight. It's not about a miracle or instant change, but about giving your body a real chance to respond, adapt, and start evolving in a natural and respectful way.

Every small step counts.

The {{produto}} was developed precisely to support your routine, your daily well-being, your vitality, and your confidence throughout this process. Stopping use too early can often prevent your body from having enough time to adapt and show the expected benefits.

Imagine being able to look in the mirror and feel proud of the effort you're putting in. Regaining the freedom to wear the clothes you love, feeling more confident, and realizing you're taking care of yourself consistently. That's the real goal: helping you keep moving forward in your journey, with no pressure and no temporary fixes.

We want you to feel supported in this decision. That's why, to make this process lighter and show our intention to help, we were able to offer an administrative refund of {{percentualOferta}}% of the total value of your products, with no need to return them.

This is a way to reduce part of your investment now, while you still keep the products and can continue your journey with more peace of mind.

We just ask that you think carefully before stopping your journey. You bought this product for a reason, and it can still be part of a new routine of self-care, discipline, and attention to yourself.

If you accept this {{percentualOferta}}% refund solution and would like to continue using the products, just reply to this email confirming, and we'll proceed with the processing.

I'm here to help with whatever you need.

Best regards,
{{nomeAgente}}
Support Team`,
    },
    {
      id: "reembolsoEmagrecimento15Atestado",
      category: "reembolso",
      label: "Reembolso 15% (Troca de Atestado - Emagrecimento)",
      autoDetect: null,
      defaultPercentual: "15",
      pt: `Olá {{nomeCliente}}, espero que esteja bem.

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.
Nosso maior compromisso é com o bem-estar de cada pessoa que confia no suplemento. Por isso, quero explicar com calma e total transparência como funciona a nossa política de garantia, para que você se sinta seguro(a) durante todo esse processo. 💛

A nossa garantia é do tipo "satisfação garantida" ✨

Isso significa que o ideal é utilizar o suplemento por pelo menos 30 dias consecutivos, para que o organismo tenha tempo suficiente de adaptação e para que os resultados possam ser avaliados de forma justa.

Caso, após esse período de uso contínuo, você não perceba resultados visíveis, a garantia pode ser analisada conforme os critérios da nossa política.

No entanto, quando o uso é interrompido por uma questão de saúde, possível efeito colateral ou orientação médica, a garantia não pode ser aplicada automaticamente, pois ela foi criada com base na experiência de uso contínuo e na avaliação dos resultados ao longo do tempo.

Ainda assim, entendemos que cada caso precisa ser tratado com atenção e respeito.

✅ Pensando nisso, iremos abrir uma exceção para você.

Em vez de solicitar atestado médico, conseguimos oferecer um reembolso administrativo de {{percentualOferta}}% do valor total do seu pedido, sem necessidade de devolução dos produtos. Além disso, como o suplemento é 100% natural, você pode presentear alguém, aproveitando o investimento que já fez, sem desperdício. Ressaltamos que nosso suplemento possui total credibilidade e é distribuído por uma empresa confiável, dedicada à saúde e bem-estar de seus clientes.

Dessa forma, você evita:

✔️ Custos de envio
✔️ Burocracias desnecessárias
✔️ Possíveis atrasos
✔️ Processo de devolução física
✔️ Análise ou inspeção dos produtos

Essa solução torna o processo muito mais simples, rápido e seguro para você.

Caso concorde com essa alternativa de {{percentualOferta}}% de reembolso, basta responder a este e-mail confirmando, e seguiremos com o procedimento.

Fico à disposição para qualquer dúvida.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte`,
      en: `Hello {{nomeCliente}}, I hope you're doing well.

My name is {{nomeAgente}} and I'll be assisting you from now on.
Our biggest commitment is to the well-being of everyone who trusts this supplement. That's why I want to calmly and transparently explain how our guarantee policy works, so you feel safe throughout this whole process. 💛

Our guarantee is a "satisfaction guaranteed" type ✨

This means the ideal is to use the supplement for at least 30 consecutive days, so your body has enough time to adapt and the results can be fairly evaluated.

If, after this period of continuous use, you don't notice visible results, the guarantee can be reviewed according to our policy's criteria.

However, when use is interrupted due to a health issue, a possible side effect, or medical guidance, the guarantee can't be applied automatically, since it was created based on the experience of continuous use and the evaluation of results over time.

Even so, we understand that each case needs to be treated with care and respect.

✅ With that in mind, we'll make an exception for you.

Instead of requesting a medical certificate, we're able to offer an administrative refund of {{percentualOferta}}% of your order's total value, with no need to return the products. Also, since the supplement is 100% natural, you can gift it to someone, making use of the investment you've already made, with no waste. We'd like to reinforce that our supplement is fully credible and distributed by a trustworthy company, dedicated to the health and well-being of its customers.

This way, you avoid:

✔️ Shipping costs
✔️ Unnecessary paperwork
✔️ Possible delays
✔️ The physical return process
✔️ Product inspection or review

This solution makes the process much simpler, faster, and safer for you.

If you agree with this {{percentualOferta}}% refund alternative, just reply to this email confirming, and we'll proceed with the procedure.

I'm here for any questions.

Best regards,
{{nomeAgente}}
Support Team`,
    },
    {
      id: "reembolso3035",
      category: "reembolso",
      label: "Reembolso 30%/35% (Opção A)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Agradeço imensamente pelo seu retorno tão sincero e doloroso. Eu consigo, do fundo do meu coração, sentir a angústia da sua situação. [INSERIR A QUEIXA DO CLIENTE]

Minha intenção jamais será faltar com a compaixão ou criar barreiras para você. Somos uma empresa idônea e é justamente por termos total empatia pelo seu momento que preciso lhe apresentar a realidade do sistema para protegê-la de um prejuízo ainda maior.

Quero ser muito transparente sobre o motivo de insistirmos em um acordo digital em vez da devolução física tradicional. O processo convencional de envio para o armazém nunca resulta em um reembolso 100% integral e trará três grandes problemas para você agora:

1️⃣ Gasto imediato do seu bolso: Para devolver os 6 potes pesados, as transportadoras cobrarão uma taxa alta de frete. Esse dinheiro sairá diretamente da sua única renda de aposentadoria hoje e não é reembolsável.

2️⃣ A taxa obrigatória de 15%: A política padrão do nosso centro de distribuição deduz automaticamente uma taxa de reabastecimento de estoque de 15% sobre o valor de qualquer pacote físico que retorna. O sistema já cortaria parte dos seus US$ {{valorTotal}} logo na chegada.

3️⃣ O risco do transporte e da disputa: Se você abrir uma disputa no banco, o processo de análise de fraude pode congelar o seu cadastro e reter o seu dinheiro em auditoria por até 90 dias úteis. Além disso, se a caixa sofrer qualquer dano ou impacto no trajeto dos correios e um frasco quebrar, o armazém descontará o valor dele.

Não queremos que você gaste o dinheiro que não tem em filas de transportadoras, nem que passe meses esperando uma disputa bancária enquanto lida com suas dores. Pensando estritamente em aliviar o seu fardo financeiro hoje, conversei com a nossa diretoria e, em caráter de extrema exceção pela sua situação, conseguimos liberar a nossa proposta máxima de {{percentualOferta}}% de reembolso administrativo.

💎 Por que esta proposta de {{percentualOferta}}% é o caminho mais seguro e humano para você hoje?

Dinheiro garantido na sua conta HOJE: Nós processamos o estorno de US$ [VALOR DO REEMBOLSO] direto no mesmo modo de pagamento da compra do produto. Sem burocracia, sem formulários e sem espera de semanas. O dinheiro entra limpo para ajudar nas suas contas imediatas.
Você economiza 100% com frete e taxas: Não gasta um único centavo com correios e fica totalmente isenta da taxa de 15% do armazém. Todo o valor do acordo vai direto para o seu bolso.
Os potes continuam com você de graça: Você não precisa carregar caixas ou ir a lugar nenhum. Os produtos permanecem na sua casa.

Como os potes continuarão com você sem custo nenhum, sugerimos que, nos dias em que a dor estiver mais intensa, você utilize a fórmula misturada ao seu suco ou chá logo no café da manhã, conforme orientamos. Você terá o alívio físico que o seu corpo precisa tanto neste momento de estresse e, ao mesmo tempo, terá garantido um retorno financeiro imediato em seu cartão hoje, com risco zero.

{{nomeCliente}}, por favor, permita-nos ajudar a aliviar um pouco desse peso hoje da forma mais rápida possível.

Se você aceita receber o reembolso de {{percentualOferta}}% ([VALOR DO REEMBOLSO]) direto no seu cartão hoje e manter os produtos com você com total comodidade, basta responder com "Aceito" e eu farei o lançamento no sistema imediatamente.

Caso a sua decisão final seja estritamente arcar com os custos do frete, aceitar a perda da taxa de 15% e assumir o tempo de espera do armazém, informe-nos para que enviemos o endereço de destino.

Continuamos em oração pelo seu lar e pela sua saúde.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

Thank you so much for your such sincere and painful reply. I can, from the bottom of my heart, feel the distress of your situation. [INSERT THE CUSTOMER'S COMPLAINT]

My intention will never be to lack compassion or create obstacles for you. We are a trustworthy company, and it's precisely because we have complete empathy for your moment that I need to walk you through the reality of the system, to protect you from an even bigger loss.

I want to be very transparent about why we insist on a digital agreement instead of the traditional physical return. The conventional process of shipping back to the warehouse never results in a 100% full refund, and it will bring three major problems for you right now:

1️⃣ Immediate out-of-pocket expense: To return the 6 heavy bottles, the carriers will charge a high shipping fee. That money will come directly out of your only retirement income today, and it isn't refundable.

2️⃣ The mandatory 15% fee: Our distribution center's standard policy automatically deducts a 15% restocking fee from the value of any physical package that's returned. The system would already cut part of your US$ {{valorTotal}} as soon as it arrives.

3️⃣ The shipping and dispute risk: If you open a dispute with your bank, the fraud-review process can freeze your account and hold your money under audit for up to 90 business days. In addition, if the box is damaged or impacted along the way and a bottle breaks, the warehouse will deduct its value.

We don't want you spending money you don't have on carrier lines, nor spending months waiting on a bank dispute while dealing with your pain. Thinking strictly about easing your financial burden today, I spoke with our management and, as an extreme exception due to your situation, we were able to release our maximum offer of {{percentualOferta}}% in administrative refund.

💎 Why is this {{percentualOferta}}% offer the safest and most humane path for you today?

Guaranteed money in your account TODAY: We process the refund of US$ [REFUND AMOUNT] directly to the same payment method used for the purchase. No paperwork, no forms, and no weeks of waiting. The money arrives clean to help with your immediate bills.
You save 100% on shipping and fees: You don't spend a single cent on postage and you're fully exempt from the warehouse's 15% fee. The entire agreed amount goes straight into your pocket.
The bottles stay with you for free: You don't need to carry boxes or go anywhere. The products stay at your home.

Since the bottles will stay with you at no cost, we suggest that, on the days when the pain is more intense, you mix the formula into your juice or tea right at breakfast, as we've guided. You'll get the physical relief your body needs so much during this stressful time, and at the same time, you'll have guaranteed an immediate financial return on your card today, with zero risk.

{{nomeCliente}}, please allow us to help ease some of this burden today in the fastest way possible.

If you agree to receive the {{percentualOferta}}% refund ([REFUND AMOUNT]) directly on your card today and keep the products with you for total convenience, just reply with "I accept" and I'll process it in the system right away.

If your final decision is to strictly cover the shipping costs, accept the loss of the 15% fee, and take on the warehouse's waiting time, let us know so we can send you the return address.

We remain in prayer for your home and your health.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
    {
      id: "reembolso3035B",
      category: "reembolso",
      label: "Reembolso 30%/35% (Opção B)",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.

Gostaria de começar reforçando algo importante: entendo que você deseja resolver isso da maneira mais justa possível. Meu papel aqui não é criar obstáculos, mas sim garantir que você tenha total clareza antes de tomar uma decisão que possa gerar custos adicionais desnecessários.

Por esse motivo, preciso explicar com mais detalhes como funciona o processo padrão de devolução, conforme descrito em nossa política operacional.

📦 Se optar pela devolução física para obter um reembolso, o processo obrigatoriamente envolve:

O custo do frete de devolução é por conta do cliente:
O envio deve incluir rastreamento e embalagem adequada para evitar danos durante o transporte.
Taxa padrão de reabastecimento de 15%:
Aplicada automaticamente ao valor do reembolso elegível por apólice.
Tempo de trânsito:
Em média, de 10 a 15 dias para que o produto chegue ao nosso centro de devoluções.
Inspeção obrigatória:
Nenhum reembolso será liberado até que esta verificação seja concluída.

Agora, pontos muito importantes que muitas vezes são negligenciados:

Garrafas abertas não são elegíveis para reembolso:
Se alguma unidade tiver sido aberta, usada ou tiver o lacre rompido, o valor será automaticamente deduzido do montante final.
Garrafas danificadas durante o transporte também são deduzidas:
Se alguma garrafa quebrar, rachar, vazar ou chegar ao centro de devoluções com danos estruturais, o valor correspondente não poderá ser reembolsado.
Caso a embalagem externa chegue danificada:
E afete o estado interno dos produtos, poderão ser feitos ajustes adicionais na quantidade final aprovada.

Esses critérios são regras padronizadas para o controle logístico e sanitário. Minha responsabilidade é garantir que você entenda todos os detalhes antes de escolher esse caminho.

Na prática, isso significa:
✔️ Custo de envio imediato.
✔️ Dedução automática de 15%.
✔️ Risco de deduções adicionais por garrafas abertas ou danificadas.
✔️ Período de espera de várias semanas.
✔️ Reembolso somente após inspeção e aprovação.

Agora, compare isso com a alternativa que consegui aprovar especificamente para o seu caso:

👉 Reembolso administrativo imediato de {{percentualOferta}}%

Crédito direto para o seu método de pagamento original.
Não é necessário devolver nenhuma garrafa.
Sem taxa de reposição de 15%.
Sem custos de envio.
Sem inspeção ou risco de deduções.
Processamento imediato e caso encerrado hoje.

Não estou tentando impedi-lo de devolver o produto. Estou tentando evitar que você enfrente um processo mais longo, mais caro e que acarrete um risco financeiro real. Analisando objetivamente, a opção administrativa elimina incertezas e custos.

Caso deseje aceitar o ajuste administrativo de {{percentualOferta}}%, por favor, confirme por escrito e eu o processarei imediatamente.

Estou aqui para te ajudar a tomar a decisão mais segura possível.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente Premium`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you from now on.

I'd like to start by reinforcing something important: I understand you want to resolve this in the fairest way possible. My role here isn't to create obstacles, but to make sure you have full clarity before making a decision that could generate unnecessary additional costs.

For that reason, I need to explain in more detail how our standard return process works, as described in our operating policy.

📦 If you choose a physical return to get a refund, the process necessarily involves:

Return shipping cost is the customer's responsibility:
The shipment must include tracking and proper packaging to avoid damage during transport.
Standard 15% restocking fee:
Automatically applied to the refund amount eligible under policy.
Transit time:
On average, 10 to 15 days for the product to reach our returns center.
Mandatory inspection:
No refund will be released until this check is completed.

Now, some very important points that are often overlooked:

Opened bottles are not eligible for refund:
If any unit has been opened, used, or has a broken seal, its value will be automatically deducted from the final amount.
Bottles damaged during transport are also deducted:
If any bottle breaks, cracks, leaks, or arrives at the returns center with structural damage, the corresponding value cannot be refunded.
If the outer packaging arrives damaged:
And it affects the internal condition of the products, additional adjustments may be made to the final approved amount.

These criteria are standardized rules for logistics and sanitary control. My responsibility is to make sure you understand every detail before choosing this path.

In practice, this means:
✔️ Immediate shipping cost.
✔️ Automatic 15% deduction.
✔️ Risk of additional deductions for opened or damaged bottles.
✔️ A waiting period of several weeks.
✔️ Refund only after inspection and approval.

Now, compare this with the alternative I was able to approve specifically for your case:

👉 Immediate administrative refund of {{percentualOferta}}%

Direct credit to your original payment method.
No need to return any bottle.
No 15% restocking fee.
No shipping costs.
No inspection or risk of deductions.
Immediate processing, case closed today.

I'm not trying to stop you from returning the product. I'm trying to prevent you from facing a longer, more expensive process that carries a real financial risk. Looking at it objectively, the administrative option removes uncertainty and costs.

If you'd like to accept the {{percentualOferta}}% administrative adjustment, please confirm in writing and I'll process it right away.

I'm here to help you make the safest decision possible.

Best regards,
{{nomeAgente}}
Premium Customer Support Team`,
    },
    {
      id: "reembolso50",
      category: "reembolso",
      label: "Reembolso 50%",
      autoDetect: null,
      defaultPercentual: "50",
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Entendo a sua posição e quero reforçar que minha intenção é encontrar uma solução que seja justa, prática e vantajosa para você.\n" +
        "Conversei com minha gerente, expliquei todos os detalhes do seu caso e, considerando a situação, ela me autorizou a oferecer uma condição especial, fora do procedimento padrão.\n" +
        "Conseguimos liberar um reembolso administrativo de {{percentualOferta}}% do valor total do seu pedido, e você não precisará devolver nenhum produto.\n" +
        "Dessa forma, você evita o custo do frete de devolução, evita o processo de inspeção, não corre o risco de deduções adicionais e ainda pode continuar utilizando os produtos que já recebeu, tendo mais tempo para avaliar os benefícios com o uso contínuo.\n" +
        "O reembolso será processado assim que você responder este e-mail confirmando que aceita essa solução.\n" +
        "Essa é a melhor condição que consigo liberar para o seu caso neste momento, e acredito que seja uma alternativa bastante vantajosa para evitar custos, espera e todo o processo de devolução física.\n" +
        "Podemos seguir desta forma?\n" +
        "Atenciosamente, {{nomeAgente}}\n" +
        "Equipe de Suporte",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "I understand your position, and I want to reinforce that my intention is to find a solution that is fair, practical, and advantageous for you.\n" +
        "I spoke with my manager, explained every detail of your case, and given the situation, she authorized me to offer a special condition, outside our standard procedure.\n" +
        "We were able to release an administrative refund of {{percentualOferta}}% of your order's total amount, and you won't need to return any product.\n" +
        "This way, you avoid the return shipping cost, avoid the inspection process, don't risk any additional deductions, and can keep using the products you've already received, giving you more time to evaluate the benefits with continued use.\n" +
        "The refund will be processed as soon as you reply to this email confirming that you accept this solution.\n" +
        "This is the best condition I'm able to release for your case at this time, and I believe it's a very advantageous alternative to avoid costs, waiting time, and the entire physical return process.\n" +
        "Can we move forward this way?\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
    },
    {
      id: "reembolso60",
      category: "reembolso",
      label: "Reembolso 60%",
      autoDetect: null,
      defaultPercentual: "60",
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Gostaríamos de reafirmar nosso compromisso em tratar sua solicitação com clareza, respeito e foco na solução mais adequada para você.\n\n" +
        "Após análise cuidadosa e alinhamento interno, a seguinte opção excepcional foi autorizada:\n\n" +
        "Reembolso imediato de {{percentualOferta}}% do valor total do pedido\n" +
        "Sem necessidade de devolução dos produtos já recebidos\n\n" +
        "Essa opção proporciona uma solução simples, segura e eficiente, permitindo que você mantenha os produtos sem precisar lidar com etapas adicionais ou custos operacionais.\n\n" +
        "Para total transparência, destacamos como funcionaria o processo padrão de reembolso, caso fosse considerado:\n\n" +
        "Aplicação de taxa de reposição de 15% sobre o valor reembolsável;\n" +
        "Devolução obrigatória dos produtos;\n" +
        "Inspeção obrigatória ao receber os produtos devolvidos;\n" +
        "Garrafas abertas, violadas ou danificadas não são elegíveis para reembolso;\n" +
        "Possíveis deduções adicionais caso ocorra algum dano durante o transporte de devolução;\n" +
        "O processamento do reembolso começa apenas após a aprovação da inspeção.\n\n" +
        "Considerando essas condições, o reembolso imediato de {{percentualOferta}}% sem devolução oferece uma solução muito mais conveniente, previsível e prática.\n\n" +
        "Se desejar prosseguir, responda a este e-mail confirmando sua aceitação, e o reembolso será processado imediatamente para o mesmo método de pagamento utilizado na compra.\n\n" +
        "Permanecemos à disposição para quaisquer esclarecimentos adicionais e respeitaremos sua decisão com o mesmo nível de profissionalismo.\n\n" +
        "Atenciosamente,\n" +
        "{{nomeAgente}}\n" +
        "Equipe de Suporte ao Cliente",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "We'd like to reaffirm our commitment to handling your request with clarity, respect, and a focus on finding the best solution for you.\n\n" +
        "After careful review and internal alignment, the following exceptional option has been authorized:\n\n" +
        "Immediate refund of {{percentualOferta}}% of the order's total amount\n" +
        "No need to return the products you've already received\n\n" +
        "This option offers a simple, safe, and efficient solution, letting you keep the products without dealing with extra steps or operational costs.\n\n" +
        "For full transparency, here's how the standard refund process would work, if it were considered instead:\n\n" +
        "A 15% restocking fee applied to the refundable amount;\n" +
        "Mandatory return of the products;\n" +
        "Mandatory inspection upon receiving the returned products;\n" +
        "Opened, tampered, or damaged bottles are not eligible for refund;\n" +
        "Possible additional deductions if any damage occurs during return shipping;\n" +
        "Refund processing only begins after inspection approval.\n\n" +
        "Considering these conditions, the immediate {{percentualOferta}}% refund with no return offers a much more convenient, predictable, and practical solution.\n\n" +
        "If you'd like to proceed, reply to this email confirming your acceptance, and the refund will be processed immediately to the same payment method used for the purchase.\n\n" +
        "We remain available for any further clarification and will respect your decision with the same level of professionalism.\n\n" +
        "Best regards,\n" +
        "{{nomeAgente}}\n" +
        "Customer Support Team",
    },
    {
      id: "reembolso70",
      category: "reembolso",
      label: "Reembolso 70%",
      autoDetect: null,
      defaultPercentual: "70",
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n\n" +
        "Queremos garantir que você tenha a melhor experiência possível e resolver sua solicitação de forma prática, rápida e segura.\n\n" +
        "Após análise da sua situação, conseguimos aprovar uma opção especial de reembolso imediato de {{percentualOferta}}% do valor total do pedido, sem necessidade de devolução dos produtos.\n\n" +
        "💡 Por que esta é a melhor escolha para você:\n\n" +
        "Evita custos de envio: Devolver os produtos pelo método tradicional gera despesas com transportadora que saem do seu bolso.\n" +
        "Evita taxa de reposição de 15%: O processo padrão deduz automaticamente uma taxa sobre o valor do reembolso.\n" +
        "Evita riscos de danos durante o transporte: Caso algum frasco seja danificado no caminho, o valor correspondente não seria reembolsado.\n" +
        "Processo rápido e sem burocracia: O valor do reembolso é creditado diretamente na sua forma de pagamento original, sem precisar preencher formulários ou aguardar semanas.\n" +
        "Mantém os produtos com você: Você ainda poderá utilizar os produtos, presentear alguém ou guardá-los para uso futuro — 100% natural e seguro.\n\n" +
        "Em comparação, o processo tradicional de devolução exige:\n\n" +
        "Gasto imediato com frete;\n" +
        "Taxa de reposição de 15%;\n" +
        "Espera de 10 a 15 dias para o transporte e inspeção;\n" +
        "Risco de deduções adicionais se os produtos chegarem danificados.\n\n" +
        "✅ Com o reembolso imediato de {{percentualOferta}}%, você recebe o valor máximo disponível hoje, sem riscos, sem custos adicionais e sem precisar devolver nada.\n\n" +
        "Se desejar aproveitar essa solução e garantir {{percentualOferta}}% do valor de volta na sua conta imediatamente, basta responder a este e-mail com:\n\n" +
        '"Aceito o reembolso de {{percentualOferta}}%"\n\n' +
        "Assim que recebermos sua confirmação, processaremos o reembolso de forma instantânea.\n\n" +
        "Estamos à disposição para qualquer dúvida e queremos garantir que você tenha a solução mais conveniente e segura.\n\n" +
        "Atenciosamente,\n" +
        "{{nomeAgente}}\n" +
        "Equipe de Suporte ao Cliente Premium",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n\n" +
        "We want to make sure you have the best possible experience and resolve your request in a practical, fast, and safe way.\n\n" +
        "After reviewing your situation, we were able to approve a special option: an immediate refund of {{percentualOferta}}% of the order's total amount, with no need to return the products.\n\n" +
        "💡 Why this is the best choice for you:\n\n" +
        "Avoids shipping costs: Returning the products through the traditional method generates carrier expenses that come out of your own pocket.\n" +
        "Avoids the 15% restocking fee: The standard process automatically deducts a fee from the refund amount.\n" +
        "Avoids the risk of transport damage: If a bottle gets damaged along the way, its value wouldn't be refunded.\n" +
        "Fast process with no paperwork: The refund amount is credited directly to your original payment method, with no forms to fill out or weeks of waiting.\n" +
        "You keep the products: You can still use the products, gift them to someone, or save them for later — 100% natural and safe.\n\n" +
        "In comparison, the traditional return process requires:\n\n" +
        "Immediate shipping expense;\n" +
        "A 15% restocking fee;\n" +
        "A 10 to 15 day wait for transport and inspection;\n" +
        "The risk of additional deductions if the products arrive damaged.\n\n" +
        "✅ With the immediate {{percentualOferta}}% refund, you get the maximum amount available today, with no risk, no extra costs, and nothing to return.\n\n" +
        "If you'd like to take advantage of this solution and secure {{percentualOferta}}% of the amount back in your account right away, just reply to this email with:\n\n" +
        '"I accept the {{percentualOferta}}% refund"\n\n' +
        "As soon as we receive your confirmation, we'll process the refund instantly.\n\n" +
        "We're available for any questions and want to make sure you get the most convenient and secure solution.\n\n" +
        "Best regards,\n" +
        "{{nomeAgente}}\n" +
        "Premium Customer Support Team",
    },
    {
      id: "reembolso75",
      category: "reembolso",
      label: "Reembolso 75%",
      autoDetect: null,
      defaultPercentual: "75",
      pt:
        "Olá {{nomeCliente}},\n" +
        "Detalhes do Pedido\n" +
        "- Número do Pedido: {{numeroPedido}}\n" +
        "- Data da Compra: {{dataCompra}}\n" +
        "- Produto: {{produto}}\n" +
        "- Valor Total: ${{valorTotal}}\n" +
        "- Endereço de Entrega: {{endereco}}\n" +
        "- Status Atual: {{status}}\n\n" +
        "Meu nome é {{nomeAgente}} e estarei auxiliando você a partir de agora.\n\n" +
        "Conversei com a supervisora e conseguimos liberar um reembolso de {{percentualOferta}}% do valor total do seu pedido.\n\n" +
        "Dessa forma, você não precisa devolver os produtos, evita gastos com frete e ainda mantém os itens recebidos em casa.\n\n" +
        "Gostaria de saber o que você acha dessa proposta. Acredito que seja uma solução prática e vantajosa, que garante parte do seu investimento de volta de forma rápida, sem complicações.\n\n" +
        "Se concordar, basta responder a este e-mail que processaremos o reembolso imediatamente. Tenho certeza de que essa opção é a mais segura e conveniente para você.\n\n" +
        "Aguardamos seu retorno e estamos à disposição para qualquer dúvida.\n\n" +
        "Atenciosamente,\n" +
        "{{nomeAgente}}\n" +
        "Equipe de Suporte ao Cliente",
      en:
        "Hello {{nomeCliente}},\n" +
        "Order Details\n" +
        "- Order Number: {{numeroPedido}}\n" +
        "- Purchase Date: {{dataCompra}}\n" +
        "- Product: {{produto}}\n" +
        "- Total Amount: ${{valorTotal}}\n" +
        "- Shipping Address: {{endereco}}\n" +
        "- Current Status: {{status}}\n\n" +
        "My name is {{nomeAgente}} and I'll be assisting you from now on.\n\n" +
        "I spoke with my supervisor and we were able to release a {{percentualOferta}}% refund of your order's total amount.\n\n" +
        "This way, you don't need to return the products, you avoid shipping costs, and you still keep the items you received at home.\n\n" +
        "I'd like to know what you think of this proposal. I believe it's a practical and advantageous solution that guarantees part of your investment back quickly, with no complications.\n\n" +
        "If you agree, just reply to this email and we'll process the refund right away. I'm confident this is the safest and most convenient option for you.\n\n" +
        "We look forward to your reply and remain available for any questions.\n\n" +
        "Best regards,\n" +
        "{{nomeAgente}}\n" +
        "Customer Support Team",
    },
    {
      id: "reembolsoNaoAceitouOfertaFrascosFotos",
      category: "reembolso",
      label: "Não aceitou oferta 30% e quantos frascos usou e fotos",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Para darmos continuidade à sua solicitação, precisamos confirmar algumas informações importantes, conforme nossa política interna.

Por gentileza, poderia nos informar:

1. Quantos frascos já foram utilizados e quantos ainda permanecem lacrados;
2. Fotos claras dos produtos, incluindo:
   - a parte frontal de todos os frascos;
   - os lacres visíveis;
   - a quantidade total recebida (em uma ou mais imagens, desde que fique claro);
3. Uma confirmação por escrito de que você leu nossa política de devolução e compreende as taxas e custos aplicáveis ao processo;
4. A confirmação de que os produtos foram armazenados corretamente, em local adequado, conforme as orientações do fabricante.

Essas informações são necessárias para que possamos analisar o seu caso e dar andamento ao processo.

Assim que recebermos tudo, retornaremos com os próximos passos.

Ficamos no aguardo.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

To move forward with your request, we need to confirm some important information, in accordance with our internal policy.

Could you please provide us with:

1. How many bottles have already been used and how many remain sealed;
2. Clear photos of the products, including:
   - the front of all bottles;
   - the visible seals;
   - the total quantity received (in one or more images, as long as it's clear);
3. Written confirmation that you have read our return policy and understand the fees and costs that apply to the process;
4. Confirmation that the products have been stored correctly, in a suitable place, according to the manufacturer's guidelines.

This information is necessary so we can review your case and move forward with the process.

As soon as we receive everything, we'll get back to you with the next steps.

We look forward to hearing from you.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
  ];

  /* =========================================================
     Categorias da barra lateral. Cada categoria tem uma cor própria
     para facilitar a identificação visual. Para adicionar uma nova
     categoria, inclua um objeto aqui e use o mesmo "id" no campo
     "category" dos templates que pertencem a ela.
     ========================================================= */
  const CATEGORIES = [
    { id: "geral", label: "Templates Geral", color: "#2f6fed" },
    { id: "memoria", label: "Produtos Memória", color: "#8a4fd6" },
    { id: "emagrecimento", label: "Produtos Emagrecimento", color: "#e08a1e" },
    { id: "feg", label: "Marca FEG", color: "#1f9d55" },
    { id: "reembolso", label: "Oferta de Reembolso", color: "#d6334f" },
  ];

  /* =========================================================
     Renderização da barra lateral de templates
     ========================================================= */
  function renderTemplateSidebar() {
    templateCategoriesEl.innerHTML = "";

    CATEGORIES.forEach((category, index) => {
      const templatesInCategory = TEMPLATES
        .filter((t) => t.category === category.id)
        .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
      if (templatesInCategory.length === 0) return;

      const details = document.createElement("details");
      details.className = "template-category";
      details.style.setProperty("--cat-color", category.color);
      if (index === 0) details.open = true;

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
      templateCategoriesEl.appendChild(details);
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
    responseEn.value = fillPlaceholders(template.en, toEnglishOrderDataPreview(data), FALLBACKS_EN);

    window.clearTimeout(orderFieldTranslateDebounceTimer);
    const requestId = ++orderFieldTranslationRequestId;

    const runTranslation = async () => {
      const translatedData = await toEnglishOrderData(data);
      if (requestId !== orderFieldTranslationRequestId) return;
      responseEn.value = fillPlaceholders(template.en, translatedData, FALLBACKS_EN);
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
    responsePt.value = fillPlaceholders(template.pt, data, FALLBACKS_PT);
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
    responsePt.value = fillPlaceholders(template.pt, data, FALLBACKS_PT);
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

  /**
   * Detecta, por palavras-chave, qual template combina com a mensagem
   * do cliente. Templates com autoDetect: null (ex: "naoLocalizado",
   * "pedidoLocalizado") não entram nessa busca automática, pois dependem
   * de uma decisão do atendente, não do conteúdo da mensagem do cliente.
   * @param {string} text
   * @returns {string} id do template (cai em "geral" se nada combinar)
   */
  function detectTemplateId(text) {
    const normalized = text.toLowerCase();

    for (const template of TEMPLATES) {
      if (!template.autoDetect) continue;
      if (template.autoDetect.some((word) => normalized.includes(word))) {
        return template.id;
      }
    }
    return "geral";
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
     Pré-visualização da mensagem de boas-vindas
     ========================================================= */
  function updateWelcomePreview() {
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
    orderFields.nomeCliente.value = "Maria Silva";
    orderFields.nomeAgente.value = "João Souza";
    orderFields.numeroPedido.value = "#10234";
    orderFields.dataCompra.value = "10/06/2026";
    orderFields.produto.value = "Óleo Essencial 30ml";
    orderFields.valorTotal.value = "49.90";
    orderFields.endereco.value = "São Paulo, SP";
    orderFields.status.value = "Em trânsito";
    orderFields.codigoRastreio.value = "BR123456789";
    orderFields.linkRastreio.value = "https://rastreio.exemplo.com/BR123456789";
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

  /* =========================================================
     Eventos
     ========================================================= */
  renderTemplateSidebar();

  generateBtn.addEventListener("click", handleGenerateClick);
  loadSampleBtn.addEventListener("click", loadSampleOrder);

  Object.values(orderFields).forEach((input) => {
    input.addEventListener("input", () => {
      updateWelcomePreview();
      refreshActiveTemplate();
    });
  });

  responsePt.addEventListener("input", () => {
    window.clearTimeout(translateDebounceTimer);
    setTranslationStatus("⌛ Aguardando você terminar de digitar...");
    translateDebounceTimer = window.setTimeout(translatePtToEn, TRANSLATE_DEBOUNCE_MS);
  });

  document.querySelectorAll(".btn-copy").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      copyResponseToClipboard(targetId);
    });
  });
})();
