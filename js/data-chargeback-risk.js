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
  ];

  // Peso 2: cliente já demonstra forte insatisfação e pede reembolso/cancelamento
  // de forma incisiva, mas ainda não citou banco/advogado/fraude.
  const MEDIUM_WEIGHT_PHRASES = [
    // Português
    "quero meu dinheiro de volta", "quero o dinheiro de volta", "quero meu dinheiro",
    "quero reembolso", "exijo reembolso", "quero o reembolso agora",
    "reembolso agora", "cancelem imediatamente", "cancele imediatamente",
    "cancelem já", "cancele já", "cancelem agora", "cancele agora",
    "isso é um absurdo", "péssimo atendimento", "nunca mais compro",
    "produto não chegou e ninguém resolve", "estou muito insatisfeito",
    "estou muito insatisfeita", "vou deixar uma avaliação negativa",
    "vou avisar todo mundo", "isso é golpe", "sinto que fui enganado",
    "sinto que fui enganada",

    // English
    "i want my money back", "i want a refund", "i want my refund",
    "give me a refund", "refund me now", "refund now",
    "cancel my order immediately", "cancel immediately", "this is ridiculous",
    "terrible service", "never buying again", "worst experience",
    "i feel scammed", "this feels like a scam", "leave a bad review",
    "one star", "i'm very unhappy", "i am very unhappy", "not acceptable",
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
