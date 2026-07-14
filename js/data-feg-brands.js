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

    {
      id: "fegNaoRecebeuQuerReembolsoEntregue",
      category: "feg",
      label: "Cliente relata que não recebeu pedido e quer reembolso – Consta como entregue",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente da FEG.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: Entregue (conforme rastreio)

Sei que é frustrante esperar por um produto e não recebê-lo — entendo sua preocupação. Verifiquei aqui e a plataforma de rastreio indica que o pedido foi entregue em [data/hora], conforme o código de rastreio {{codigoRastreio}} ({{linkRastreio}}). Às vezes isso acontece por detalhes simples — como o pacote ter sido deixado com um vizinho, na portaria, ou em um endereço próximo. Vale a pena conferir, caso ainda não tenha feito isso.

Para resolver isso rapidamente, posso:
1. Reenviar o pedido com prioridade, sem custo adicional; ou
2. Processar o reembolso diretamente.

É só me confirmar qual opção prefere. Se optar pelo reenvio, preciso que confirme seu endereço completo (rua, número, complemento, bairro, cidade, estado e CEP).

Fico no aguardo do seu retorno!

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
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: Delivered (per tracking)

I know it's frustrating to wait for a product and not receive it — I understand your concern. I checked here and the tracking platform shows the order was delivered on [date/time], under tracking code {{codigoRastreio}} ({{linkRastreio}}). Sometimes this happens for simple reasons — like the package being left with a neighbor, at the front desk, or at a nearby address. It's worth double-checking, in case you haven't already.

To resolve this quickly, I can:
1. Reship your order as a priority, at no additional cost; or
2. Process a refund directly.

Just let me know which option you prefer. If you choose reshipment, I'll need you to confirm your full address (street, number, apartment/unit, neighborhood, city, state, and ZIP code).

I'll be looking forward to your reply!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNaoRecebeuEntregueSemReembolso",
      category: "feg",
      label: "Cliente relata que não recebeu pedido – Consta como entregue (sem falar de reembolso)",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente da FEG.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: Entregue (conforme rastreio)

Sei que é frustrante esperar por um produto e não recebê-lo — entendo sua preocupação, e vamos resolver isso juntos(as).

Verifiquei aqui e a plataforma de rastreio indica que o pedido foi entregue em [data/hora], conforme o código de rastreio {{codigoRastreio}} ({{linkRastreio}}). Às vezes isso acontece por detalhes simples — como o pacote ter sido deixado com um vizinho, na portaria, ou em um endereço próximo. Vale a pena conferir, caso ainda não tenha feito isso.

Para resolver isso rapidamente, vou solicitar o reenvio do seu pedido com prioridade, sem custo adicional. Para garantir que chegue corretamente dessa vez, você poderia confirmar seu endereço completo (rua, número, complemento, bairro, cidade, estado e CEP)?

Assim que eu receber essa confirmação, já dou andamento imediatamente.

Fico no aguardo do seu retorno!

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
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: Delivered (per tracking)

I know it's frustrating to wait for a product and not receive it — I understand your concern, and we'll sort this out together.

I checked here and the tracking platform shows the order was delivered on [date/time], under tracking code {{codigoRastreio}} ({{linkRastreio}}). Sometimes this happens for simple reasons — like the package being left with a neighbor, at the front desk, or at a nearby address. It's worth double-checking, in case you haven't already.

To resolve this quickly, I'll request a priority reshipment of your order at no additional cost. To make sure it arrives correctly this time, could you confirm your full address (street, number, apartment/unit, neighborhood, city, state, and ZIP code)?

As soon as I receive that confirmation, I'll move forward right away.

I'll be looking forward to your reply!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDetalhesDaEntrega",
      category: "feg",
      label: "Detalhes da entrega",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco. Sei o quanto é bom acompanhar de perto a chegada de um produto que faz parte da sua rotina de bem-estar, então vou te trazer todas as informações com precisão.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Verifiquei aqui e posso confirmar que seu pedido está dentro do prazo estimado de entrega e atualmente a caminho do seu endereço. Você pode acompanhar cada etapa através das informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Fico à disposição para acompanhar isso com você. Se por algum motivo a entrega não chegar dentro do prazo estimado, ou se surgir qualquer outra dúvida, é só me responder este e-mail — estarei aqui para te ajudar.

Fico no aguardo, e desejo que o {{produto}} chegue rapidinho até você!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us. I know how nice it is to closely track the arrival of a product that's part of your wellness routine, so I'll bring you all the details with precision.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I checked here and can confirm your order is within the estimated delivery window and currently on its way to your address. You can follow each step using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

I'm here to follow up on this with you. If for any reason the delivery doesn't arrive within the estimated window, or if any other question comes up, just reply to this email — I'll be here to help.

I'll be looking forward to it, and I hope your {{produto}} reaches you soon!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNovoCodigoRastreioReenvio",
      category: "feg",
      label: "Novo código de rastreio – Reenvio",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Como prometido, estou entrando em contato para fornecer as informações de rastreamento atualizadas do seu reenvio, para que você possa acompanhar o andamento da entrega diretamente com a UPS.

Informações de Rastreamento
• Número de rastreamento da UPS: {{codigoRastreio}}
• Link de rastreamento: {{linkRastreio}}

Você pode usar esse número para acompanhar as últimas atualizações e a previsão de entrega do seu pacote.

Vale lembrar que as informações de rastreamento podem levar um pouco de tempo para serem atualizadas assim que a encomenda entra no sistema da transportadora — isso é normal e não indica nenhum problema.

Vou continuar acompanhando esse envio de perto para garantir que dessa vez tudo corra bem. Caso tenha qualquer dúvida ou precise de ajuda adicional em relação à sua entrega, não hesite em responder a este e-mail — terei o maior prazer em ajudar.

Agradeço muito a sua paciência e compreensão durante esse processo.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
As promised, I'm reaching out to share the updated tracking information for your reshipment, so you can follow the delivery progress directly with UPS.

Tracking Information
• UPS Tracking Number: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

You can use this number to check the latest updates and estimated delivery date for your package.

Please keep in mind that tracking information can take a little while to update once the package enters the carrier's system — this is normal and doesn't indicate any issue.

I'll keep a close eye on this shipment to make sure everything goes smoothly this time. If you have any questions or need additional help with your delivery, don't hesitate to reply to this email — I'll be more than happy to help.

Thank you so much for your patience and understanding throughout this process.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegCancelarAssinaturaSemMotivo",
      category: "feg",
      label: "Cliente pedindo para cancelar assinatura recorrente – Sem falar motivo",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco. Localizei sua assinatura em nosso sistema:

Detalhes da Assinatura
• Número da Assinatura: {{numeroPedido}}
• Plano Atual: {{produto}}
• Data da Última Cobrança: [Data]
• Próxima Cobrança Prevista: [Data]
• Status Atual: Ativa

Obrigado(a) por nos avisar sobre o cancelamento. Entendo perfeitamente — às vezes a rotina muda, as prioridades mudam, e isso é totalmente normal. Fique à vontade para seguir com o cancelamento; a decisão é sua.

Antes de finalizar, se você se sentir à vontade, poderia nos contar brevemente o motivo do cancelamento? Pode ser algo relacionado ao produto, aos resultados, ao valor, à frequência das entregas, ou simplesmente uma mudança na sua rotina. Essa informação é totalmente opcional, e serve apenas para nos ajudar a melhorar cada vez mais a experiência dos nossos clientes.

Se, após compartilhar (ou mesmo sem compartilhar), você continuar preferindo não seguir com o tratamento, sem problema algum — o cancelamento será processado imediatamente, sem nenhuma taxa e sem burocracia, e você não será cobrado(a) novamente a partir de [data].

De qualquer forma, agradecemos sinceramente por ter feito parte da sua jornada de bem-estar até aqui. Se um dia sentir vontade de retomar o tratamento conosco, suas informações ficam guardadas, e o processo de reativação é simples e rápido.

Fico no aguardo do seu retorno para seguirmos com o que fizer mais sentido para você.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us. I located your subscription in our system:

Subscription Details
• Subscription Number: {{numeroPedido}}
• Current Plan: {{produto}}
• Last Billing Date: [Date]
• Next Expected Billing Date: [Date]
• Current Status: Active

Thank you for letting us know about the cancellation. I completely understand — routines change, priorities change, and that's totally normal. Feel free to go ahead with the cancellation; it's entirely your decision.

Before we finalize it, if you're comfortable sharing, could you briefly tell us the reason for the cancellation? It could be related to the product, the results, the price, the delivery frequency, or simply a change in your routine. This information is completely optional and only helps us keep improving the experience for our customers.

If, after sharing (or even without sharing), you'd still prefer not to continue, no problem at all — the cancellation will be processed immediately, with no fees and no hassle, and you won't be charged again starting on [date].

Either way, we sincerely thank you for being part of your wellness journey with us so far. If you ever feel like resuming treatment with us, your information stays on file, and the reactivation process is quick and simple.

I'll be looking forward to your reply so we can move forward with whatever makes the most sense for you.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegGarantiaVencidaAssinaturaAtiva",
      category: "feg",
      label: "Garantia vencida, mas tem assinatura ativa",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Consegui localizar o seguinte pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo perfeitamente como pode ser frustrante solicitar um reembolso e descobrir que existe uma limitação relacionada ao prazo da garantia. Por isso, fiz questão de verificar cuidadosamente o seu pedido em nossa plataforma para te trazer uma resposta clara e correta.

De acordo com nossos registros, sua compra foi realizada no dia {{dataCompra}}. O pedido é coberto por uma garantia de satisfação de [X] dias, o que significa que o prazo terminou em [data limite].

Como o pedido já se encontra fora desse período, infelizmente não consigo processar o reembolso desta compra. Compreendo sinceramente que essa talvez não seja a resposta que você esperava, e lamento não poder oferecer uma solução diferente em relação ao reembolso.

No entanto, ao analisar sua conta, também identifiquei que existe uma assinatura ativa vinculada a esse produto. Caso você não deseje mais receber futuros envios automáticos ou cobranças recorrentes, posso ajudar com o cancelamento agora mesmo.

Para tornar esse próximo passo o mais simples possível, basta responder a este e-mail confirmando que deseja cancelar a assinatura, e cuidarei dessa solicitação para você.

Quero que saiba que estou aqui para tornar todo o processo o mais claro e tranquilo possível. Caso tenha qualquer dúvida sobre o pedido, o prazo da garantia ou a assinatura, é só me responder este e-mail — ficarei feliz em continuar ajudando pessoalmente.

Agradeço novamente pela sua paciência e compreensão.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I was able to locate the following order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I completely understand how frustrating it can be to request a refund and find out there's a limitation related to the warranty period. That's why I made sure to carefully check your order in our system to give you a clear and accurate answer.

According to our records, your purchase was made on {{dataCompra}}. This order is covered by a [X]-day satisfaction guarantee, which means the window ended on [deadline date].

Since the order is already outside that period, I'm unfortunately unable to process a refund for this purchase. I sincerely understand this may not be the answer you were hoping for, and I'm sorry I can't offer a different solution regarding the refund.

However, while reviewing your account, I also noticed there's an active subscription linked to this product. If you no longer wish to receive future automatic shipments or recurring charges, I can help you cancel it right away.

To make this next step as simple as possible, just reply to this email confirming you'd like to cancel the subscription, and I'll take care of that request for you.

Please know that I'm here to make this whole process as clear and smooth as possible. If you have any questions about the order, the warranty period, or the subscription, just reply to this email — I'll be happy to keep helping you personally.

Thank you again for your patience and understanding.

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
