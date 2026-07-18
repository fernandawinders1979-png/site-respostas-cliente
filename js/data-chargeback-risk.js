/**
 * Lista de frases de alerta usadas para estimar o risco de chargeback
 * a partir da mensagem do cliente. Cada frase tem um peso: frases que
 * indicam apenas insatisfação valem menos pontos; frases que já citam
 * banco, disputa, fraude ou advogado valem mais pontos.
 *
 * IMPORTANTE: isso é uma estimativa por palavras-chave, não uma IA
 * "entendendo" o contexto. Serve para dar um alerta rápido ao atendente,
 * não para ser 100% preciso. Ajuste as listas conforme casos reais que
 * aparecerem no Freshdesk.
 */
(function () {
  "use strict";

  // Peso 3: cliente já mencionou diretamente chargeback, disputa, banco,
  // fraude, advogado ou orgão de defesa do consumidor.
  const HIGH_WEIGHT_PHRASES = [
    // Português
    "chargeback", "vou contestar", "contestar a compra", "contestar no cartão",
    "contestar essa cobrança", "acionar meu banco", "vou acionar o banco",
    "falar com meu banco", "reclame aqui", "procon", "vou no procon",
    "meu advogado", "vou processar", "ação judicial", "isso é fraude",
    "cobrança indevida", "não autorizei essa cobrança", "nunca autorizei",
    "cobrança não reconhecida", "vou denunciar", "boletim de ocorrência",

    // English
    "chargeback", "file a dispute", "dispute this charge", "dispute the charge",
    "contact my bank", "calling my bank", "call my bank", "my bank",
    "unauthorized charge", "unauthorized transaction", "i never authorized",
    "this is fraud", "fraudulent charge", "my lawyer", "legal action",
    "sue you", "report this to", "better business bureau", "bbb complaint",
    "bbb", "report you to bbb", "report you to the bbb", "reporting you to the bbb",
    "file a bbb complaint", "filing a bbb complaint", "complaint with the bbb",
    "bbb.org",
    "credit card company", "paypal dispute", "report to paypal",

    // Produto diferente do que foi anunciado/mostrado no vídeo, ou sem os
    // ingredientes prometidos — motivo clássico de chargeback por "produto
    // não corresponde à descrição" (o banco/cartão reconhece isso como
    // motivo válido de disputa).
    "não corresponde ao vídeo", "não corresponde ao produto", "mostrado no vídeo",
    "diferente do vídeo", "não é o mesmo do vídeo", "não é o produto do vídeo",
    "diferente do anunciado", "não é o que foi anunciado", "não é o que foi prometido",
    "não contém os ingredientes", "não tem os ingredientes", "ingredientes diferentes",
    "ingredientes mencionados no vídeo", "não é o produto original", "produto não é original",
    "propaganda enganosa", "publicidade enganosa", "quero devolver o produto",
    "precisa ser devolvido", "reembolso integral",

    "not what was shown in the video", "shown in the video", "doesn't match the video",
    "different from the video", "not as advertised", "not as described",
    "item not as described", "doesn't contain the ingredients", "missing ingredients",
    "ingredients don't match", "false advertising", "misleading advertising",
    "want to return this product", "needs to be returned", "full refund",

    // Pedido urgente/incisivo de reembolso ou cancelamento (ex: "reembolse
    // imediatamente", "cancele já"). Mesmo sem citar banco/advogado/fraude,
    // esse tom de urgência sozinho já é tratado como Risco Alto.
    "quero meu dinheiro de volta", "quero o dinheiro de volta", "quero meu dinheiro",
    "quero reembolso", "exijo reembolso", "quero o reembolso agora",
    "reembolso agora", "reembolse imediatamente", "reembolse já", "reembolse agora",
    "cancelem imediatamente", "cancele imediatamente",
    "cancelem já", "cancele já", "cancelem agora", "cancele agora",
    "isso é golpe",

    // Pedido de cancelamento do pedido, mesmo sem palavra de urgência
    // (ex: "cancelar pedido", "pedido por engano, cancelar pedido") —
    // cliente já decidiu que não quer mais o produto, tratado como
    // Risco Alto mesmo em tom neutro.
    "cancelar pedido", "cancelar o pedido", "cancelar meu pedido",
    "cancele pedido", "cancele o pedido", "cancele meu pedido",
    "quero cancelar", "gostaria de cancelar", "cancelar minha compra",
    "cancelar a compra", "cancelar assinatura", "cancelar minha assinatura",

    "i want my money back", "i want a refund", "i want my refund",
    "give me a refund", "refund me now", "refund now", "refund immediately",
    "cancel my order immediately", "cancel immediately",
    "cancel my order", "cancel the order", "cancel order",
    "want to cancel", "i'd like to cancel", "cancel my subscription",
    "cancel subscription",
  ];

  // Peso 2: cliente já demonstra forte insatisfação (reclamação incisiva,
  // ameaça de avaliação negativa, sensação de ter sido enganado) mas ainda
  // sem pedir reembolso/cancelamento de forma urgente nem citar banco,
  // fraude ou advogado.
  const MEDIUM_WEIGHT_PHRASES = [
    // Português
    "isso é um absurdo", "péssimo atendimento", "nunca mais compro",
    "produto não chegou e ninguém resolve", "estou muito insatisfeito",
    "estou muito insatisfeita", "vou deixar uma avaliação negativa",
    "vou avisar todo mundo", "sinto que fui enganado", "sinto que fui enganada",

    // English
    "this is ridiculous", "terrible service", "never buying again",
    "worst experience", "i feel scammed", "this feels like a scam",
    "leave a bad review", "one star", "i'm very unhappy", "i am very unhappy",
    "not acceptable",
  ];

  // Peso 1: sinais leves de frustração ou reclamação comum, ainda sem
  // ameaça concreta.
  const LOW_WEIGHT_PHRASES = [
    // Português
    "estou insatisfeito", "estou insatisfeita", "não gostei", "demorou muito",
    "isso não é normal", "estou decepcionado", "estou decepcionada",
    "esperava mais", "não é o que eu esperava", "quero uma solução",
    "preciso de uma resposta", "isso é frustrante",

    // English
    "i'm not happy", "i am not happy", "i don't like this", "took too long",
    "this isn't normal", "i'm disappointed", "i am disappointed",
    "expected better", "not what i expected", "i need a solution",
    "i need an answer", "this is frustrating",
  ];

  window.CHARGEBACK_RISK_PHRASES = {
    high: HIGH_WEIGHT_PHRASES,
    medium: MEDIUM_WEIGHT_PHRASES,
    low: LOW_WEIGHT_PHRASES,
  };
})();
