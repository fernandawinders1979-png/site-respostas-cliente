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

    {
      id: "fegClienteNaoLocalizado",
      category: "feg",
      label: "Cliente não localizado",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Antes de tudo, muito obrigado(a) por entrar em contato conosco. Sei que ter que buscar essas informações pode ser um pouco chato, então quero deixar esse processo o mais rápido e simples possível para você.

Para conseguir localizar seu pedido com precisão e já te ajudar da melhor forma possível, você poderia me confirmar as seguintes informações?
• Qual produto foi encomendado?
• Número do pedido (se tiver em mãos)
• Nome utilizado na compra
• E-mail utilizado para realizar a compra

Não se preocupe se não tiver todas essas informações agora — qualquer uma delas já me ajuda a começar a busca.

Assim que eu localizar seu pedido, você terá toda a minha atenção para resolvermos isso juntos(as), da forma mais tranquila possível.

Fico no aguardo do seu retorno!

Atenciosamente,
{{nomeAgente}} 🤝
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

First of all, thank you so much for reaching out to us. I know having to look up this information can be a bit of a hassle, so I want to make this process as quick and simple as possible for you.

To locate your order accurately and help you in the best way possible, could you please confirm the following information?
• Which product did you order?
• Order number (if you have it on hand)
• Name used on the purchase
• Email used to make the purchase

Don't worry if you don't have all of this information right now — any single one of them already helps me start the search.

As soon as I locate your order, you'll have my full attention so we can resolve this together, in the smoothest way possible.

I'll be looking forward to your reply!

Best regards,
{{nomeAgente}} 🤝
Customer Support Team — FEG`,
    },

    {
      id: "fegComoPossoAjudar",
      category: "feg",
      label: "Como posso te ajudar",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Agradeço muito por entrar em contato conosco. Quero que você se sinta à vontade para compartilhar exatamente o que precisa — estou aqui para te ouvir e ajudar da melhor forma possível.

Poderia me contar um pouco mais sobre sua dúvida ou necessidade em relação a esse pedido? Assim que eu entender melhor a sua situação, terei todo o cuidado necessário para te ajudar a encontrar a solução ideal, com toda a atenção que você merece.

Fico no aguardo do seu retorno e permaneço à disposição para qualquer esclarecimento!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

Thank you so much for reaching out to us. I want you to feel comfortable sharing exactly what you need — I'm here to listen and help in the best way possible.

Could you tell me a bit more about your question or need regarding this order? Once I better understand your situation, I'll take all the care needed to help you find the ideal solution, with all the attention you deserve.

I'll be looking forward to your reply and remain available for any clarification!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDetalhesDoPedido",
      category: "feg",
      label: "Detalhes do Pedido",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Obrigado(a) por entrar em contato! Fico feliz em te ajudar a esclarecer exatamente o que você pediu conosco.

Consegui localizar o seu pedido em nosso sistema, e aqui estão todos os detalhes:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Se esses detalhes não corresponderem ao que você esperava, ou se tiver qualquer dúvida sobre o produto, o status da entrega ou qualquer outra informação, é só me avisar — terei todo o prazer em esclarecer tudo para você.

Estou à disposição para o que precisar!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out! I'm happy to help clarify exactly what you asked us about.

I was able to locate your order in our system, and here are all the details:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

If these details don't match what you expected, or if you have any questions about the product, the delivery status, or anything else, just let me know — I'll be glad to clarify everything for you.

I'm here for whatever you need!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegEnderecoInsuficiente",
      category: "feg",
      label: "Cliente não recebeu o pedido – Endereço insuficiente",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente da FEG.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Sinto muito pelo transtorno — entendo como é frustrante esperar por um produto e não recebê-lo. Verifiquei aqui e o pedido retornou ao nosso centro de distribuição por uma informação insuficiente no endereço.

Para reenviar imediatamente, com prioridade e sem custo adicional, você poderia confirmar seu endereço completo (rua, número, complemento, bairro, cidade, estado e CEP)?

Assim que eu receber, já dou andamento ao reenvio.

Qualquer dúvida, estou à disposição.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, from the FEG Customer Support team.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I'm so sorry for the inconvenience — I understand how frustrating it is to wait for a product and not receive it. I checked here and the order was returned to our distribution center due to insufficient address information.

To ship it out again right away, as a priority and at no additional cost, could you please confirm your full address (street, number, apartment/unit, neighborhood, city, state, and ZIP code)?

As soon as I receive it, I'll move forward with the reshipment immediately.

If you have any questions, I'm here to help.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
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
