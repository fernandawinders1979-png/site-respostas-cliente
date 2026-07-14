/**
 * Dados de templates: FEG BRANDS
 * Painel dedicado à marca FEG Brands (clientes wellness).
 * Carregue este arquivo ANTES de js/core.js.
 */
(function () {
  "use strict";

  const TEMPLATES = [
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

    {
      id: "fegAtrasoEntrega",
      category: "feg",
      label: "Atraso na entrega do produto",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Obrigado por avisar sobre o atraso no seu pedido — entendo que isso é frustrante, ainda mais quando você está esperando para começar a usar o produto.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Verifiquei aqui e houve um atraso no processamento do seu pedido. Vou acompanhar pessoalmente e te aviso assim que houver qualquer atualização.

Se o pedido não chegar em breve, é só responder este e-mail que resolvemos juntos, incluindo possibilidade de reembolso ou reenvio.

Conte comigo,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

Thank you for letting us know about the delay in your order — I understand this is frustrating, especially when you're eager to start using the product.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I checked here and there has been a delay in processing your order. I'll personally follow up and let you know as soon as there's any update.

If the order doesn't arrive soon, just reply to this email and we'll sort it out together, including the possibility of a refund or reshipment.

Count on me,
{{nomeAgente}} | FEG Support`,
    },

    {
      id: "fegSemResultado",
      category: "feg",
      label: "Cliente sem resultado esperado com o produto",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Muito obrigado por compartilhar isso comigo — sei que não é fácil escrever quando a expectativa não foi atendida, e quero te ajudar a entender o que pode estar acontecendo.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Antes de mais nada, pode me confirmar há quanto tempo você está usando o produto e com que frequência? Isso me ajuda a te dar uma orientação mais precisa.

Quero deixar claro que resultados podem variar de pessoa para pessoa, e não posso garantir um resultado específico — mas posso te ajudar a usar o produto da melhor forma possível e, se fizer sentido, avaliar outras opções com você.

Fico no aguardo da sua resposta,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

Thank you so much for sharing this with me — I know it's not easy to write when your expectations haven't been met, and I want to help you understand what might be happening.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

First of all, could you confirm how long you've been using the product and how often? This will help me give you more accurate guidance.

I want to be clear that results can vary from person to person, and I can't guarantee a specific outcome — but I can help you use the product in the best possible way and, if it makes sense, explore other options with you.

Looking forward to your reply,
{{nomeAgente}} | FEG Support`,
    },

    {
      id: "fegDuvidaUso",
      category: "feg",
      label: "Dúvida sobre uso correto do produto",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Ótima pergunta! Aqui está o passo a passo de como usar o {{produto}} corretamente:

1. [Passo 1 — descreva o modo de uso aqui]
2. [Passo 2]
3. [Passo 3]

Uma dica extra: para melhores resultados, mantenha o uso regular conforme indicado na embalagem.

Qualquer dúvida durante o uso, é só me chamar.

Abraço,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

Great question! Here is the step-by-step guide on how to use {{produto}} correctly:

1. [Step 1 — describe the usage instructions here]
2. [Step 2]
3. [Step 3]

A helpful tip: for best results, maintain regular use as indicated on the packaging.

If you have any questions while using it, just reach out.

Best,
{{nomeAgente}} | FEG Support`,
    },

    {
      id: "fegEfeitosSaude",
      category: "feg",
      label: "Cliente ansioso sobre efeitos na saúde",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Entendo sua preocupação, e é importante que você se sinta seguro(a) usando qualquer produto de saúde.

Não sou profissional de saúde, então não posso te orientar clinicamente sobre sintomas específicos. O que posso te dizer é que o {{produto}} é formulado com ingredientes naturais e passou por controle de qualidade rigoroso.

Para qualquer dúvida sobre como o produto pode estar afetando você especificamente, recomendo fortemente conversar com seu médico ou profissional de saúde, que pode avaliar seu caso com mais segurança.

Se precisar de mais alguma informação sobre o produto em si, estou aqui para ajudar.

Estou à disposição,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

I understand your concern, and it's important that you feel safe using any health product.

I'm not a healthcare professional, so I can't give you clinical guidance about specific symptoms. What I can tell you is that {{produto}} is formulated with natural ingredients and has gone through rigorous quality control.

For any questions about how the product might be affecting you specifically, I strongly recommend speaking with your doctor or healthcare professional, who can assess your case with greater confidence.

If you need any more information about the product itself, I'm here to help.

I'm at your disposal,
{{nomeAgente}} | FEG Support`,
    },

    {
      id: "fegErroCobranca",
      category: "feg",
      label: "Reclamação de cobrança / erro de fatura",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Obrigado por trazer isso à nossa atenção. Já estou verificando os detalhes da sua conta.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

[Se for erro da empresa: Identifiquei a divergência e já corrigi o valor. O reembolso da diferença deve aparecer em até 5 dias úteis na sua forma de pagamento original.]

[Se não for erro: Aqui está o detalhamento da cobrança para você conferir — [explique o valor]. Se ainda achar que há algo errado, me conta que a gente resolve juntos.]

Qualquer coisa, estou à disposição,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

Thank you for bringing this to our attention. I'm already reviewing your account details.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

[If it's a company error: I identified the discrepancy and have already corrected the amount. The refund of the difference should appear within 5 business days to your original payment method.]

[If there's no error: Here is a breakdown of the charge for you to review — [explain the amount]. If you still believe something is wrong, let me know and we'll sort it out together.]

I'm at your disposal,
{{nomeAgente}} | FEG Support`,
    },

    {
      id: "fegFollowUp",
      category: "feg",
      label: "Follow-up após resolução",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Passando rapidinho para confirmar que tudo ficou resolvido com o seu pedido {{numeroPedido}}.

Se ainda tiver qualquer dúvida ou algo não estiver como esperado, é só responder este e-mail — vou continuar acompanhando até você ficar satisfeito(a).

Um abraço,
{{nomeAgente}} | Suporte FEG`,
      en: `Hello {{nomeCliente}},

Just checking in to confirm that everything was resolved with your order {{numeroPedido}}.

If you still have any questions or anything isn't as expected, just reply to this email — I'll keep following up until you're fully satisfied.

Best,
{{nomeAgente}} | FEG Support`,
    },
  ];

  const CATEGORIES = [
    { id: "feg", label: "FEG BRANDS", color: "#39ff14", featured: true },
  ];

  const CATEGORY_GROUPS = [];

  window.TEMPLATES = TEMPLATES;
  window.CATEGORIES = CATEGORIES;
  window.CATEGORY_GROUPS = CATEGORY_GROUPS;
})();
