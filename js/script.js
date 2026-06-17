/**
 * Assistente de Respostas ao Cliente
 * Script principal: captura a mensagem, gera sugestões de resposta
 * (placeholder local) e permite copiar o resultado.
 */

(function () {
  "use strict";

  /* =========================================================
     Referências dos elementos do DOM
     ========================================================= */
  const messageInput = document.getElementById("customer-message");
  const generateBtn = document.getElementById("generate-btn");
  const responsePt = document.getElementById("response-pt");
  const responseEn = document.getElementById("response-en");
  const copyFeedback = document.getElementById("copy-feedback");
  const copyButtons = document.querySelectorAll(".btn-copy");

  /* =========================================================
     Palavras-chave usadas para escolher o tom da resposta
     simulada. Isso é só um placeholder; numa versão futura
     essa lógica será substituída por uma chamada de IA real.
     ========================================================= */
  const KEYWORDS = {
    cancelamento: ["cancelar", "cancelamento", "cancel"],
    reembolso: ["reembolso", "reembolsar", "refund", "dinheiro de volta"],
    insatisfacao: ["insatisfeito", "péssimo", "ruim", "decepcionado", "frustrado"],
  };

  /**
   * Detecta a intenção principal da mensagem do cliente
   * com base em palavras-chave simples.
   * @param {string} text
   * @returns {"cancelamento"|"reembolso"|"insatisfacao"|"geral"}
   */
  function detectIntent(text) {
    const normalized = text.toLowerCase();

    for (const [intent, words] of Object.entries(KEYWORDS)) {
      if (words.some((word) => normalized.includes(word))) {
        return intent;
      }
    }
    return "geral";
  }

  /**
   * Gera a sugestão de resposta (PT e EN) com base na intenção detectada.
   * ESTE É UM PLACEHOLDER. Para conectar a uma IA real (ex: Claude),
   * substitua o corpo desta função por uma chamada assíncrona à API
   * e use o texto retornado no lugar dos templates fixos abaixo.
   *
   * Exemplo de integração futura:
   *   const result = await fetch("https://sua-api.com/gerar-resposta", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     body: JSON.stringify({ message: text }),
   *   }).then((res) => res.json());
   *   return { pt: result.pt, en: result.en };
   *
   * @param {string} text - mensagem original do cliente
   * @returns {{pt: string, en: string}}
   */
  function generateSuggestedResponse(text) {
    const intent = detectIntent(text);

    const templates = {
      cancelamento: {
        pt:
          "Entendo que você está pensando em cancelar, e lamento pelo transtorno. " +
          "Antes de seguirmos com o cancelamento, gostaria de entender melhor o que aconteceu " +
          "para vermos se há uma solução que atenda sua necessidade. Podemos conversar sobre isso?",
        en:
          "I understand you're considering cancelling, and I'm sorry for the inconvenience. " +
          "Before we proceed with the cancellation, I'd like to understand what happened " +
          "to see if there's a solution that works for you. Can we talk about it?",
      },
      reembolso: {
        pt:
          "Sinto muito pela experiência. Antes de processarmos o reembolso, gostaria de entender " +
          "melhor o problema para tentar resolvê-lo da melhor forma possível. Você poderia me dar mais detalhes?",
        en:
          "I'm sorry about the experience. Before we process the refund, I'd like to understand " +
          "the issue better so we can try to resolve it in the best way possible. Could you share more details?",
      },
      insatisfacao: {
        pt:
          "Lamento muito que sua experiência não tenha sido a esperada. Sua opinião é muito importante " +
          "para nós e gostaria de ajudar a resolver isso da melhor forma. Pode me contar mais sobre o que aconteceu?",
        en:
          "I'm really sorry your experience wasn't what you expected. Your feedback matters a lot " +
          "to us and I'd like to help resolve this in the best way possible. Could you tell me more about what happened?",
      },
      geral: {
        pt:
          "Obrigado por entrar em contato! Recebi sua mensagem e vou te ajudar com isso o mais rápido possível. " +
          "Pode me dar mais detalhes para que eu possa te auxiliar melhor?",
        en:
          "Thank you for reaching out! I've received your message and will help you with this as quickly as possible. " +
          "Could you share more details so I can assist you better?",
      },
    };

    return templates[intent];
  }

  /**
   * Exibe uma mensagem de feedback temporária para o usuário.
   * @param {string} message
   */
  function showFeedback(message) {
    copyFeedback.textContent = message;
    window.clearTimeout(showFeedback._timeoutId);
    showFeedback._timeoutId = window.setTimeout(() => {
      copyFeedback.textContent = "";
    }, 2500);
  }

  /**
   * Lida com o clique no botão "Gerar Resposta".
   */
  function handleGenerateClick() {
    const text = messageInput.value.trim();

    if (!text) {
      showFeedback("Cole a mensagem do cliente antes de gerar a resposta.");
      messageInput.focus();
      return;
    }

    const { pt, en } = generateSuggestedResponse(text);
    responsePt.value = pt;
    responseEn.value = en;
  }

  /**
   * Copia o conteúdo de um textarea de resposta para a área de transferência.
   * @param {string} targetId - id do textarea a ser copiado
   */
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
  generateBtn.addEventListener("click", handleGenerateClick);

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      copyResponseToClipboard(targetId);
    });
  });
})();
