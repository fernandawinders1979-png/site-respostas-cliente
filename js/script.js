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
   * Monta os dados do pedido prontos para o template em inglês,
   * convertendo os campos de data para o formato em inglês.
   * @param {Object} data
   * @returns {Object}
   */
  function toEnglishOrderData(data) {
    return {
      ...data,
      dataCompra: formatDateToEnglish(data.dataCompra),
    };
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
        "If you have any questions or need more information, I'm here to help.\n" +
        "Best regards, {{nomeAgente}}\n" +
        "Support Team",
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

Meu nome é {{nomeAgente}} e estarei auxiliando você hoje. Agradeço imensamente pelo seu retorno e por compartilhar essa informação conosco. A sua saúde e a orientação do seu médico especialista são as nossas prioridades absolutas. Com o coração e a circulação não se brinca, e seguir as recomendações do seu cardiologista é, sem dúvida, a atitude mais responsável e prudente a ser tomada.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Dito isso, antes de darmos início aos trâmites postais da devolução física, gostaríamos apenas de trazer um esclarecimento importante: o nosso produto não é um medicamento pesado ou sintético, mas sim um suplemento alimentar purificado. Nosso produto é desenvolvido com ingredientes naturais cuidadosamente selecionados e proporciona excelentes resultados quando usado com segurança. Dito isso, compreendemos perfeitamente que, em determinadas situações de saúde, não utilizar o produto seja a decisão mais responsável.

Muitas vezes, os médicos vetam suplementos de forma preventiva por acreditarem que a fórmula possui estimulantes ou compostos aceleradores (como cafeína ou taurina) que agridem o coração. No entanto, o nosso composto é 100% livre de estimulantes e focado estritamente na nutrição celular sutil e no bem-estar cognitivo.

Por esse motivo, antes de enfrentar a burocracia das transportadoras, enfrentar filas e arcar com os custos de frete de retorno do próprio bolso, sugerimos uma alternativa simples: leve a lista de ingredientes naturais do produto ao seu médico na próxima consulta ou envie uma mensagem para ele. Quando os especialistas analisam a tabela nutricional limpa e vegetal do nosso suplemento, a enorme maioria deles percebe que a fórmula não interfere nos remédios de pressão e autoriza o uso.

🧠 Benefícios do suplemento para memória

Nosso suplemento foi desenvolvido para apoiar a saúde cerebral de forma natural e promover melhorias cognitivas importantes. Seus principais benefícios incluem:

Suporte à memória e retenção de informações — ajuda a lembrar compromissos, nomes e tarefas do dia a dia.
Aumento da concentração e foco mental — contribui para maior produtividade e atenção.
Estimula a clareza cognitiva — mente mais alerta, rápida e eficiente.
Auxílio na circulação e oxigenação cerebral — favorece o fluxo sanguíneo para o cérebro, melhorando o desempenho cognitivo.
Promove uma mente ativa e saudável — contribui para o envelhecimento cerebral saudável e proteção cognitiva a longo prazo.

🔬 Qualidade do produto e satisfação do cliente

Embora o produto possa não ser adequado para a sua situação específica neste exato momento, gostaríamos de compartilhar, de forma transparente, a experiência geral de clientes que o utilizam com segurança:

📊 Satisfação do cliente em 30 dias:

🟢 Clientes altamente satisfeitos: 68%
🟡 Satisfação Moderada/Gradual: 27%
⚫ Sem resultados visíveis: 5%

95% dos clientes relatam satisfação, principalmente relacionada ao bem-estar geral, equilíbrio e apoio a um estilo de vida mais saudável, quando usado de forma responsável.

Como a sua garantia de satisfação continua 100% ativa e protegida em nosso sistema pelas próximas semanas, você não corre risco nenhum de perder os seus direitos. Vale muito a pena manter os frascos guardados em local seco e fresco por mais alguns dias e fazer essa dupla checagem com o seu médico, permitindo-se a chance de desfrutar dessa transformação com total segurança.

Se, após apresentar os ingredientes, o seu cardiologista mantiver a restrição, responda a este e-mail e nós forneceremos imediatamente todos os dados necessários para o envio seguro ao armazém.

Estamos torcendo pelo seu bem-estar!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you today. Thank you so much for getting back to us and sharing this information. Your health and your specialist's guidance are our absolute priorities. The heart and circulation are nothing to take lightly, and following your cardiologist's recommendations is, without a doubt, the most responsible and prudent thing to do.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

That said, before we start the postal return process, we'd just like to clarify something important: our product is not a heavy or synthetic medication, but rather a purified dietary supplement. It's made with carefully selected natural ingredients and delivers excellent results when used safely. With that said, we completely understand that, in certain health situations, not using the product may be the most responsible decision.

Doctors often restrict supplements as a precaution, believing the formula contains stimulants or accelerating compounds (like caffeine or taurine) that could strain the heart. However, our formula is 100% stimulant-free and focused strictly on gentle cellular nutrition and cognitive well-being.

For that reason, before dealing with carrier bureaucracy, lines, and paying for return shipping out of pocket, we suggest a simple alternative: bring the product's natural ingredient list to your doctor at your next appointment, or send them a message. When specialists review our supplement's clean, plant-based nutrition facts, the vast majority find that the formula doesn't interfere with blood pressure medication and approve its use.

🧠 Memory supplement benefits

Our supplement was developed to naturally support brain health and promote important cognitive improvements. Its main benefits include:

Support for memory and information retention — helps you remember appointments, names, and daily tasks.
Increased concentration and mental focus — supports greater productivity and attention.
Stimulates cognitive clarity — a more alert, quick, and efficient mind.
Supports brain circulation and oxygenation — helps blood flow to the brain, improving cognitive performance.
Promotes an active and healthy mind — supports healthy brain aging and long-term cognitive protection.

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
  ];

  /* =========================================================
     Renderização da barra lateral de templates
     ========================================================= */
  function renderTemplateSidebar() {
    templateCategoriesEl.innerHTML = "";

    CATEGORIES.forEach((category, index) => {
      const templatesInCategory = TEMPLATES.filter((t) => t.category === category.id);
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

  /**
   * Preenche as caixas de resposta (PT/EN) com o texto de um template,
   * substituindo os placeholders pelos dados atuais do pedido.
   * @param {string} templateId
   */
  function applyTemplate(templateId) {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    const data = getOrderData();
    responsePt.value = fillPlaceholders(template.pt, data, FALLBACKS_PT);
    responseEn.value = fillPlaceholders(template.en, toEnglishOrderData(data), FALLBACKS_EN);
    activeTemplateId = templateId;
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

    const data = getOrderData();
    responsePt.value = fillPlaceholders(template.pt, data, FALLBACKS_PT);
    responseEn.value = fillPlaceholders(template.en, toEnglishOrderData(data), FALLBACKS_EN);
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

  document.querySelectorAll(".btn-copy").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      copyResponseToClipboard(targetId);
    });
  });
})();
