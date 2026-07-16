/**
 * Dados de templates: FEG BRANDS
 * Painel dedicado à marca FEG Brands (clientes wellness).
 * Carregue este arquivo ANTES de js/core.js.
 */
(function () {
  "use strict";

  const TEMPLATES = [
    {
      id: "fegAtrasoEntrega",
      category: "feg",
      label: "Atraso na entrega do produto",
      autoDetect: [
        "atraso", "atrasado", "demorando", "demora pra chegar", "demora para chegar",
        "ainda não chegou", "não chegou ainda", "cadê meu pedido", "cadê o pedido",
        "onde está meu pedido", "passou do prazo", "meu pedido não chegou",
        "pedido perdido", "perdi meu pedido", "sumiu meu pedido", "pedido sumiu",
        "pedido extraviado", "extraviado", "extraviou",
      ],
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
      autoDetect: [
        "não fez efeito", "não funcionou", "sem resultado", "não teve resultado",
        "não vi resultado", "não notei diferença", "não senti diferença", "não deu resultado",
      ],
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
      autoDetect: [
        "como uso", "como usar", "como tomar", "como tomo", "modo de uso",
        "como aplicar", "quantas vezes por dia", "como devo usar", "instruções de uso",
      ],
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
      autoDetect: [
        "é seguro", "tem contraindicação", "pode fazer mal", "é perigoso",
        "estou grávida", "amamentando", "interage com remédio", "tomo remédio controlado",
        "tenho pressão alta", "tenho receio de tomar", "tenho medo de tomar",
      ],
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
      id: "fegDetalhesEntregaSemRastreio",
      category: "feg",
      label: "Detalhes da entrega – Quando não tem código de rastreio",
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

Verifiquei aqui e posso confirmar que seu pedido está dentro do prazo estimado de entrega — logo você receberá o código de rastreio.

Fico à disposição para acompanhar isso com você. Se por algum motivo a entrega não chegar dentro do prazo estimado, ou se surgir qualquer outra dúvida, é só me responder este e-mail — estarei aqui para te ajudar.

Fico no aguardo, e desejo que o {{produto}} chegue rapidinho até você!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us. I know how good it feels to closely follow the arrival of a product that's part of your wellness routine, so I'll bring you all the information accurately.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I checked here and can confirm your order is within the estimated delivery window — you'll receive the tracking code soon.

I'm here to follow up on this with you. If for any reason the delivery doesn't arrive within the estimated window, or if any other question comes up, just reply to this email — I'll be here to help.

I'll be looking forward to it, and I hope your {{produto}} arrives super soon!

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
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "quero reembolso", "quero meu dinheiro de volta", "quero o dinheiro de volta",
        "quero cancelar e reembolso", "exijo reembolso",
      ],
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
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "não chegou nada",
      ],
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
      autoDetect: [
        "quando vai chegar", "previsão de chegada", "qual é o status da entrega",
        "quero rastrear meu pedido", "como acompanho meu pedido", "código de rastreio",
        "rastreamento do pedido", "link de rastreio", "rastreio sumiu", "não aparece rastreio",
        "sem informação de rastreio", "rastreio não encontrado",
      ],
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
      autoDetect: [
        "cancelar assinatura", "quero cancelar minha assinatura", "cancelar minha assinatura",
        "não quero mais receber", "parar de receber", "cancelar o plano",
        "quero parar a assinatura", "cancelar a recorrência", "quero sair da assinatura",
        "encerrar assinatura", "finalizar assinatura", "cancelar a assinatura",
      ],
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

    {
      id: "fegCancelarAssinaturaCompraUnica",
      category: "feg",
      label: "Cliente quer cancelar assinatura, mas foi compra única",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Consegui localizar o seguinte pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo perfeitamente a importância de ter clareza e tranquilidade quando se trata de compras relacionadas ao bem-estar e do receio de cobranças inesperadas. Por isso, quis confirmar essa informação pessoalmente para você.

Gostaria de tranquilizá-lo(a) informando que esta foi uma compra única. Não existe nenhuma assinatura ativa associada a este pedido, o que significa que você não será cobrado(a) automaticamente no futuro, nem receberá envios recorrentes relacionados a esta compra.

Fique tranquilo(a): não é necessário realizar nenhuma ação em relação a assinaturas, pois, como confirmei, não existe nenhuma vinculada a este pedido.

Caso tenha qualquer outra dúvida ou precise de ajuda com qualquer assunto relacionado ao seu pedido, por favor, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

I was able to locate the following order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I completely understand how important it is to have clarity and peace of mind when it comes to wellness purchases, and the concern about unexpected charges. That's why I wanted to confirm this information personally for you.

I'd like to reassure you that this was a one-time purchase. There is no active subscription associated with this order, which means you won't be charged automatically in the future, nor will you receive recurring shipments related to this purchase.

Rest assured: there's no action needed regarding subscriptions, since, as I confirmed, there is none linked to this order.

If you have any other questions or need help with anything related to your order, please don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDevolverSemResultadoSemRetencao",
      category: "feg",
      label: "Cliente quer devolver – Sem resultado – Sem retenção e não precisa devolver os produtos",
      autoDetect: [
        "não fez efeito", "não funcionou", "sem resultado", "não teve resultado",
        "não vi resultado", "não notei diferença", "não senti diferença", "não deu resultado",
        "quero devolver", "quero devolução", "quero reembolso", "quero meu dinheiro de volta",
        "quero o dinheiro de volta", "quero cancelar e reembolso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Obrigado(a) por compartilhar isso comigo. Entendo perfeitamente a sua frustração — quando investimos tempo e expectativa em algo para o nosso bem-estar e não vemos o resultado esperado, é natural sentir que o produto simplesmente não é para você. Isso é totalmente válido.

Fique tranquilo(a): você está dentro do prazo da nossa garantia de satisfação de [X] dias, então já processei o reembolso integral do valor pago com sucesso em nosso sistema.

Você não precisa se preocupar em nos devolver o produto — pode ficar com ele como um presente da nossa empresa, sem nenhum custo ou compromisso adicional.

O reembolso será direcionado à mesma forma de pagamento utilizada na compra, e o valor deve aparecer em até 7 dias úteis. Dependendo da data de fechamento da sua fatura, o crédito poderá aparecer no ciclo atual ou no seguinte, com um prazo adicional que pode variar conforme as políticas do seu banco ou operadora de cartão.

Estou aqui para o que você precisar. Se tiver qualquer dúvida sobre o reembolso, não hesite em responder a este e-mail — ficarei feliz em continuar ajudando.

Agradecemos muito, de coração, a sua confiança em nós, e lamentamos sinceramente que o {{produto}} não tenha atendido às suas expectativas dessa vez. Esperamos ter a oportunidade de recebê-lo(a) novamente em uma próxima compra — nossas portas estarão sempre abertas, sem nenhuma pressa, quando for o momento certo para você.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Com carinho,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us and sharing what happened. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

Thank you for sharing this with me. I completely understand your frustration — when we invest time and hope into something for our wellness and don't see the results we expected, it's natural to feel the product simply isn't for you. That's completely valid.

Rest assured: you're within our [X]-day satisfaction guarantee window, so I've already processed a full refund of the amount paid successfully in our system.

You don't need to worry about returning the product to us — you can keep it as a gift from our company, at no additional cost or obligation.

The refund will be issued to the same payment method used for the purchase, and the amount should appear within 7 business days. Depending on your statement closing date, the credit may appear in the current or the following billing cycle, with an additional timeframe that can vary according to your bank's or card issuer's policies.

I'm here for whatever you need. If you have any questions about the refund, don't hesitate to reply to this email — I'll be happy to keep helping.

We sincerely thank you for trusting us, and we're truly sorry that {{produto}} didn't meet your expectations this time. We hope to have the chance to welcome you back for a future purchase — our doors will always be open, with no rush, whenever the right time comes for you.

I'll keep following your case until it's fully resolved.

Warmly,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDevolverComProdutoSemMotivoSemRetencao",
      category: "feg",
      label: "Cliente quer devolver, está com o produto, mas não fala o motivo (Sem retenção)",
      autoDetect: [
        "quero cancelar e devolver o produto", "cancelar assinatura e devolver",
        "tenho o produto e quero cancelar", "quero devolver o produto e cancelar",
        "já estou com o produto", "estou com o produto em mãos", "recebi o produto e quero devolver",
        "como faço para devolver o produto que já recebi",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}} e estarei cuidando dessa solicitação para você.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Plano de Assinatura: [Nome do Plano]
• Status Atual: {{status}}

Obrigado(a) por entrar em contato. Recebi sua solicitação de cancelamento do pedido e da assinatura, e quero que saiba que vou cuidar pessoalmente disso para você — sem burocracia e sem complicação.

Fique tranquilo(a): posso confirmar que tanto o pedido quanto a assinatura serão cancelados, e você não será cobrado(a) novamente a partir de agora.

Antes de concluirmos, você poderia me contar rapidamente o motivo do cancelamento? Pode ser algo relacionado ao produto, à frequência de entrega, ao valor, ou qualquer outro ponto. Essa informação não é obrigatória para seguirmos com o cancelamento — é só para eu entender se existe algo simples que possamos ajustar, e também para repassar esse feedback à nossa equipe, que está sempre buscando melhorar a experiência dos nossos clientes.

Se, ao compartilhar o motivo, você achar que ainda vale a pena continuar experimentando o produto por mais um tempo antes de decidir definitivamente, terei o maior prazer em te dar algumas orientações rápidas para aproveitar melhor o {{produto}}. Mas se sua decisão já estiver tomada, sem problema algum: é só me confirmar e eu finalizo o cancelamento imediatamente.

Estou à disposição para o que for mais conveniente para você. Assim que eu receber sua resposta (com ou sem o motivo), já dou andamento ao cancelamento.

Agradecemos muito por ter feito parte da nossa comunidade, e esperamos que, se um dia quiser voltar, nossas portas estejam sempre abertas.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}} and I'll be taking care of this request for you.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Subscription Plan: [Plan Name]
• Current Status: {{status}}

Thank you for reaching out. I've received your request to cancel the order and the subscription, and I want you to know I'll take care of this personally for you — no red tape, no hassle.

Rest assured: I can confirm that both the order and the subscription will be canceled, and you won't be charged again going forward.

Before we wrap this up, could you quickly tell me the reason for the cancellation? It could be related to the product, the delivery frequency, the price, or anything else. This information isn't required for us to proceed with the cancellation — it just helps me understand if there's something simple we could adjust, and it also helps us pass this feedback along to our team, who's always working to improve the experience for our customers.

If, after sharing the reason, you feel it might still be worth giving the product a bit more time before deciding for good, I'd be more than happy to give you a few quick tips to get the most out of your {{produto}}. But if your decision is already made, no problem at all — just confirm it and I'll finalize the cancellation right away.

I'm here for whatever works best for you. As soon as I hear back from you (with or without the reason), I'll move forward with the cancellation.

We're truly grateful you were part of our community, and we hope that if you ever want to come back, our doors will always be open.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegEtiquetaCriada",
      category: "feg",
      label: "Cliente relata que a etiqueta ainda aparece somente como criada",
      autoDetect: [
        "etiqueta criada", "só aparece etiqueta criada", "rastreio não atualiza",
        "rastreio parado", "rastreamento parado", "status não muda",
        "ainda está como etiqueta criada",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Endereço de Entrega: {{endereco}}
• Status Atual: Etiqueta criada

Obrigado(a) por entrar em contato! Entendo perfeitamente a sua ansiedade em acompanhar cada passo da entrega — principalmente quando estamos animados para começar a usar um novo produto na nossa rotina de bem-estar.

Verifiquei aqui e posso te explicar exatamente o que está acontecendo: nessa etapa, o rastreamento mostra apenas "Etiqueta criada", o que significa simplesmente que o pacote já está no processo de envio pela transportadora e aguarda a próxima leitura. Isso não indica nenhum problema — é uma etapa normal do processo logístico.

As informações de rastreamento devem ser atualizadas em breve, assim que a UPS receber e escanear o pacote em uma de suas instalações. A partir daí, você já conseguirá acompanhar o andamento da entrega até o seu endereço em tempo real, por aqui: {{linkRastreio}}.

Fico à disposição para acompanhar isso com você. Se em alguns dias o status ainda não tiver mudado, é só me avisar que já investigo diretamente com a transportadora.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Agradecemos muito a sua paciência! Qualquer outra dúvida, não hesite em entrar em contato.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Shipping Address: {{endereco}}
• Current Status: Label created

Thank you for reaching out! I completely understand your eagerness to track every step of the delivery — especially when we're excited to start using a new product in our wellness routine.

I checked here and I can explain exactly what's happening: at this stage, tracking only shows "Label created," which simply means the package is already in the carrier's shipping process and awaiting its next scan. This doesn't indicate any problem — it's a normal step in the logistics process.

The tracking information should update soon, as soon as UPS receives and scans the package at one of its facilities. From there, you'll be able to follow the delivery progress to your address in real time, right here: {{linkRastreio}}.

I'm here to follow up on this with you. If the status hasn't changed in a few days, just let me know and I'll look into it directly with the carrier.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Thank you so much for your patience! If you have any other questions, please don't hesitate to reach out.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegEfeitosAdversosSintomas",
      category: "feg",
      label: "Cliente apresentou efeitos adversos – Sintomas",
      autoDetect: [
        "tive uma reação", "tive reação alérgica", "me deu alergia", "passei mal",
        "tive enjoo", "tive náusea", "tive dor de cabeça depois de tomar",
        "fiquei mal depois de usar", "tive efeito colateral", "me fez mal",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Muito obrigado(a) por entrar em contato e compartilhar isso com a gente. Lamento muito saber que você teve uma reação adversa após utilizar nosso {{produto}}. Sua saúde, segurança e bem-estar são nossa maior prioridade, e ficamos genuinamente preocupados ao saber disso.

Por favor, interrompa imediatamente o uso do produto. Como a química do corpo é única para cada pessoa, recomendamos fortemente que você consulte um profissional de saúde ou médico sobre os sintomas apresentados — eles são quem melhor conhece seu histórico de saúde e podem te orientar com segurança.

Para sua total tranquilidade, já processei o reembolso integral do seu pedido. Você não precisa se preocupar em nos devolver o produto.

Para ajudar nossa equipe de Qualidade e Segurança a investigar esse lote específico e manter os mais altos padrões para toda a nossa comunidade, você poderia nos ajudar, quando se sentir à vontade, com as seguintes informações?
• Número do lote (geralmente localizado na parte inferior ou traseira da embalagem)
• Quais sintomas específicos você apresentou

Não há nenhuma pressa — pode nos responder no seu tempo.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Por favor, cuide-se bem hoje, e me avise se precisar de mais alguma coisa. Estou à disposição.

Com carinho e cuidado,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

Thank you so much for reaching out and sharing this with us. I'm truly sorry to hear you experienced an adverse reaction after using our {{produto}}. Your health, safety, and wellbeing are our top priority, and we're genuinely concerned to hear about this.

Please stop using the product immediately. Since everyone's body chemistry is unique, we strongly recommend consulting a healthcare professional or doctor about the symptoms you've experienced — they know your health history best and can safely guide you.

For your complete peace of mind, I've already processed a full refund for your order. You don't need to worry about returning the product to us.

To help our Quality and Safety team investigate this specific batch and maintain the highest standards for our whole community, would you be able to help us with the following information, whenever you feel comfortable?
• The batch/lot number (usually located on the bottom or back of the packaging)
• Which specific symptoms you experienced

There's no rush at all — you can reply whenever it's convenient for you.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Please take good care of yourself today, and let me know if you need anything else. I'm here for you.

With care,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNaoReconheceCompraSemRastreio",
      category: "feg",
      label: "Cliente não reconhece a compra – Sem o código de rastreio",
      autoDetect: [
        "não reconheço essa compra", "não fiz essa compra", "cobrança que não reconheço",
        "não autorizei essa compra", "fraude no meu cartão", "compra que eu não fiz",
        "alguém usou meu cartão", "cobrança suspeita", "não fui eu que comprei",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: Cancelado

Agradecemos por nos alertar imediatamente sobre isso. Levamos a segurança financeira e as cobranças não autorizadas muito a sério, e entendemos perfeitamente o quanto pode ser estressante ver uma cobrança desconhecida em seu extrato. Fique tranquilo(a): estou aqui para te ajudar a resolver essa situação o mais rápido possível.

Cancelei imediatamente o pedido, suspendi a conta vinculada a ele e processei o reembolso integral. Os fundos serão devolvidos com segurança à sua instituição financeira em até 3 dias úteis.

Se posteriormente você identificar que se tratava de um familiar ou de uma assinatura esquecida, e desejar retornar com segurança, nossas portas estarão sempre abertas para você.

Desejando-lhe segurança e tranquilidade,

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: Canceled

Thank you for alerting us right away about this. We take financial security and unauthorized charges very seriously, and we completely understand how stressful it can be to see an unfamiliar charge on your statement. Rest assured: I'm here to help you resolve this as quickly as possible.

I immediately canceled the order, suspended the account linked to it, and processed a full refund. The funds will be safely returned to your financial institution within 3 business days.

If you later find out this was a family member's purchase or a forgotten subscription, and you'd like to come back safely, our doors will always be open to you.

Wishing you safety and peace of mind,

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegReembolsoRealizado",
      category: "feg",
      label: "Reembolso realizado",
      autoDetect: [
        "já caiu meu reembolso", "quando recebo o reembolso", "meu reembolso ainda não caiu",
        "status do meu reembolso", "cadê meu reembolso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Reembolsado: \${{valorReembolso}}

Tenho uma ótima notícia: sua solicitação de estorno foi processada com sucesso em nosso sistema no dia {{dataReembolso}}.

Dependendo da data de fechamento da sua fatura, o crédito poderá aparecer na fatura atual ou na do mês seguinte (prazo médio de 30 a 60 dias, conforme definido pela sua operadora/banco).

Se precisar de qualquer confirmação adicional para acompanhar esse processo junto ao seu banco, ou tiver qualquer outra dúvida, é só me responder este e-mail — estarei à disposição.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Agradecemos muito pela sua confiança, e esperamos ter a oportunidade de atendê-lo(a) novamente em breve.

Abraços,
{{nomeAgente}}
Central de Suporte — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Refunded Amount: \${{valorReembolso}}

I have great news: your refund request was successfully processed in our system on {{dataReembolso}}.

Depending on your statement closing date, the credit may appear on your current statement or the following month's (typical timeframe of 30 to 60 days, as set by your card issuer/bank).

If you need any additional confirmation to follow up on this with your bank, or have any other questions, just reply to this email — I'll be at your disposal.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Thank you so much for your trust, and we hope to have the opportunity to serve you again soon.

Warm regards,
{{nomeAgente}}
Support Center — FEG`,
    },

    {
      id: "fegNaoGostouSabor",
      category: "feg",
      label: "Não gostou do sabor",
      autoDetect: [
        "não gostei do sabor", "gosto ruim", "sabor horrível", "não gostei do gosto",
        "o gosto é muito ruim", "sabor desagradável", "gosto muito forte",
      ],
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Antes de mais nada, obrigado(a) por compartilhar sua experiência com a gente — isso é muito importante para continuarmos melhorando. Sinto muito que o sabor do produto não tenha agradado; entendo que isso pode ser bem incômodo, especialmente quando o objetivo é incorporar o suplemento na sua rotina diária.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Sabemos que sabor é algo bem pessoal, e por isso oferecemos garantia de reembolso de 30 dias na sua primeira compra — sem burocracia.

Para dar andamento ao seu reembolso, basta responder este e-mail confirmando que deseja seguir com a solicitação. Assim que recebermos sua confirmação, nossa equipe processa tudo rapidamente e te mantém informado(a) em cada etapa.

Se por acaso você quiser tentar outra opção antes — como um sabor diferente da linha ou dicas de como consumir o produto de um jeito mais agradável (por exemplo, misturado com suco ou iogurte) — também posso te ajudar com isso. Sem compromisso, é só me avisar o que preferir.

Estou à disposição para o que você precisar. Nosso objetivo é que sua experiência com a gente seja sempre positiva, do início ao fim. Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Fico no aguardo do seu retorno!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente – FEG`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

First of all, thank you for sharing your experience with us — this is really important for us to keep improving. I'm sorry the taste of the product didn't work for you; I understand that can be quite frustrating, especially when the goal is to make the supplement part of your daily routine.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

We know taste is very personal, which is why we offer a 30-day refund guarantee on your first purchase — no red tape.

To move forward with your refund, just reply to this email confirming you'd like to proceed with the request. As soon as we receive your confirmation, our team will process everything quickly and keep you informed every step of the way.

If you'd like to try another option first — such as a different flavor from our line, or tips on how to make the product more enjoyable to take (for example, mixed with juice or yogurt) — I can help with that too. No obligation, just let me know what you'd prefer.

I'm here for whatever you need. Our goal is for your experience with us to always be positive, from start to finish. I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

I'll be looking forward to your reply!

Best regards,
{{nomeAgente}}
Customer Support Team – FEG`,
    },

    {
      id: "fegMedicoNaoAutorizouReembolsoSemDevolucao",
      category: "feg",
      label: "Médico não autorizou – Realiza reembolso e não solicita devolução",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendo perfeitamente — quando se trata da sua saúde, a orientação do seu médico deve sempre vir em primeiro lugar, e apoiamos totalmente essa decisão.

Fique tranquilo(a): você está dentro do prazo da nossa garantia de satisfação de 30 dias, então já processei o reembolso integral do valor pago. Você não precisa se preocupar em nos devolver o produto — pode ficar com ele, como preferir, sem nenhum custo ou compromisso adicional.

O reembolso será direcionado ao seu método de pagamento original, e o valor deve aparecer em até 10 dias úteis. Dependendo da data de fechamento da sua fatura, o crédito poderá aparecer no ciclo atual ou no seguinte, conforme os prazos definidos pelo seu banco ou operadora de cartão.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Qualquer dúvida sobre o reembolso, é só me responder este e-mail.

Agradecemos muito por ter feito parte da nossa comunidade. Se um dia sua saúde permitir e você quiser voltar a experimentar nossos produtos, será um verdadeiro prazer atendê-la novamente.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us and sharing this information. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I completely understand — when it comes to your health, your doctor's guidance should always come first, and we fully support that decision.

Rest assured: you're within our 30-day satisfaction guarantee window, so I've already processed a full refund of the amount paid. You don't need to worry about returning the product to us — you're welcome to keep it, at no additional cost or obligation.

The refund will be issued to your original payment method, and the amount should appear within 10 business days. Depending on your statement closing date, the credit may appear in the current or the following billing cycle, according to the timeframes set by your bank or card issuer.

I'll keep following your case until it's fully resolved. If you have any questions about the refund, just reply to this email.

We're truly grateful you were part of our community. If your health allows and you'd like to try our products again someday, it would be a genuine pleasure to serve you again.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegMedicoNaoAutorizouReembolsoRecusarEntrega",
      category: "feg",
      label: "Médico não autorizou cliente com o produto – Realiza reembolso e solicita para recusar a entrega",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendo perfeitamente — quando se trata da sua saúde, a orientação do seu médico deve sempre vir em primeiro lugar, e apoiamos totalmente essa decisão.

Fique tranquilo(a): você está dentro do prazo da nossa garantia de satisfação de 30 dias, então já processei o reembolso integral do valor pago.

Verifiquei também que o produto já havia sido processado e está atualmente em trânsito, então, infelizmente, não conseguimos interromper o envio neste momento.

Para resolver isso da forma mais simples possível, quando o pacote chegar até você, pedimos que recuse o recebimento diretamente com o entregador. Dessa forma, o pedido retorna automaticamente para a nossa empresa, sem que você precise se preocupar com nenhuma outra ação, custo ou postagem adicional.

O reembolso será direcionado ao seu método de pagamento original, e o valor deve aparecer em até 10 dias úteis. Dependendo da data de fechamento da sua fatura, o crédito poderá aparecer no ciclo atual ou no seguinte, conforme os prazos definidos pelo seu banco ou operadora de cartão.

Agradecemos muito por ter feito parte da nossa comunidade. Se um dia sua saúde permitir e você quiser voltar a experimentar nossos produtos, será um verdadeiro prazer atendê-la novamente.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us and sharing this information. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I completely understand — when it comes to your health, your doctor's guidance should always come first, and we fully support that decision.

Rest assured: you're within our 30-day satisfaction guarantee window, so I've already processed a full refund of the amount paid.

I also checked and the product has already been processed and is currently in transit, so unfortunately we're unable to stop the shipment at this time.

To resolve this in the simplest way possible, when the package arrives, please refuse the delivery directly with the carrier. This way, the order will automatically be returned to our company, and you won't need to worry about any other action, cost, or additional shipping.

The refund will be issued to your original payment method, and the amount should appear within 10 business days. Depending on your statement closing date, the credit may appear in the current or the following billing cycle, according to the timeframes set by your bank or card issuer.

We're truly grateful you were part of our community. If your health allows and you'd like to try our products again someday, it would be a genuine pleasure to serve you again.

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
