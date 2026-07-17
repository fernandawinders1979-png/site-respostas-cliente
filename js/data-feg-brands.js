/**
 * Dados de templates: FEG BRANDS
 * Painel dedicado à marca FEG Brands (clientes wellness).
 * Carregue este arquivo ANTES de js/core.js.
 */
(function () {
  "use strict";

  const TEMPLATES = [
    {
      id: "fegClienteNaoLocalizado",
      category: "geral",
      label: "Não localizado",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      category: "geral",
      label: "Como posso te ajudar",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      category: "geral",
      label: "Detalhes do Pedido",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      id: "fegDetalhesDoPedidoComRastreio",
      category: "geral",
      label: "Detalhes do Pedido – Com código de rastreio",
      autoDetect: null,
      pt: `Olá!
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

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Se esses detalhes não corresponderem ao que você esperava, ou se tiver qualquer dúvida sobre o produto, o status da entrega ou qualquer outra informação, é só me avisar — terei todo o prazer em esclarecer tudo para você.

Estou à disposição para o que precisar!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
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

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

If these details don't match what you expected, or if you have any questions about the product, the delivery status, or anything else, just let me know — I'll be glad to clarify everything for you.

I'm here for whatever you need!

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDetalhesEntregaSemRastreio",
      category: "logistica",
      label: "Detalhes da entrega – Quando não tem código de rastreio",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      category: "logistica",
      label: "Não recebeu o pedido – Endereço insuficiente",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      category: "logistica",
      label: "Relata que não recebeu pedido e quer reembolso – Consta como entregue",
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "quero reembolso", "quero meu dinheiro de volta", "quero o dinheiro de volta",
        "quero cancelar e reembolso", "exijo reembolso",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "logistica",
      label: "Relata que não recebeu pedido – Consta como entregue (sem falar de reembolso)",
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "não chegou nada",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "logistica",
      label: "Detalhes da entrega",
      autoDetect: [
        "quando vai chegar", "previsão de chegada", "qual é o status da entrega",
        "quero rastrear meu pedido", "como acompanho meu pedido", "código de rastreio",
        "rastreamento do pedido", "link de rastreio", "rastreio sumiu", "não aparece rastreio",
        "sem informação de rastreio", "rastreio não encontrado",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "logistica",
      label: "Novo código de rastreio – Reenvio",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      category: "assinatura",
      label: "Pedindo para cancelar assinatura recorrente – Sem falar motivo",
      autoDetect: [
        "cancelar assinatura", "quero cancelar minha assinatura", "cancelar minha assinatura",
        "não quero mais receber", "parar de receber", "cancelar o plano",
        "quero parar a assinatura", "cancelar a recorrência", "quero sair da assinatura",
        "encerrar assinatura", "finalizar assinatura", "cancelar a assinatura",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "garantiaVencida",
      label: "Garantia vencida, mas tem assinatura ativa",
      autoDetect: null,
      pt: `Olá!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente da FEG, e vou acompanhar seu caso pessoalmente.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo como é frustrante esbarrar em uma limitação de prazo ao pedir um reembolso. Verifiquei com cuidado: sua compra foi feita em {{dataCompra}}, coberta por uma garantia de satisfação de [X] dias, que terminou em [DATA LIMITE]. Como o pedido já está fora desse período, infelizmente não consigo processar o reembolso desta compra, e lamento não poder oferecer uma solução diferente.

Por outro lado, identifiquei uma assinatura ativa vinculada a esse produto. Se você não deseja mais receber envios ou cobranças automáticas, posso cancelá-la agora — é só confirmar por este e-mail.

Estou à disposição para qualquer dúvida sobre o pedido, a garantia ou a assinatura.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!

My name is {{nomeAgente}}, from the FEG Customer Support team, and I'll be personally following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I understand how frustrating it can be to run into a time limitation when requesting a refund. I checked carefully: your purchase was made on {{dataCompra}}, covered by a [X]-day satisfaction guarantee, which ended on [DEADLINE DATE]. Since the order is already outside that period, I'm unfortunately unable to process a refund for this purchase, and I'm sorry I can't offer a different solution.

On the other hand, I found an active subscription linked to this product. If you no longer wish to receive automatic shipments or charges, I can cancel it now — just confirm by replying to this email.

I'm at your disposal for any questions about the order, the warranty, or the subscription.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegCancelarAssinaturaCompraUnica",
      category: "assinatura",
      label: "Quer cancelar assinatura, mas foi compra única",
      autoDetect: null,
      pt: `Olá!
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
      en: `Hello!
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
      id: "fegCancelarAssinaturaSegundoPedidoCaminho",
      category: "assinatura",
      label: "Cancelar a assinatura, mas o segundo pedido está a caminho",
      autoDetect: null,
      pt: `Olá!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente da FEG, e vou acompanhar seu caso pessoalmente.

Obrigado por entrar em contato e explicar o ocorrido. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo sua situação e sinto muito pelo transtorno. Verifiquei que o primeiro pedido já foi entregue, e o segundo ainda está em trânsito.

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Como o segundo pedido ainda não foi entregue, pedimos que você recuse a entrega ao receber a encomenda. Assim que recusar, nos avise — a transportadora pode levar algumas horas para atualizar o status. Assim que a atualização aparecer no sistema, seguimos com o reembolso integral. Sua assinatura já foi cancelada, então não haverá novos envios automáticos.

Estou à disposição para o que precisar e vou acompanhar seu caso até a resolução completa.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!

My name is {{nomeAgente}}, from the FEG Customer Support team, and I'll be personally following your case.

Thank you for reaching out and explaining what happened. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I understand your situation and I'm sorry for the inconvenience. I checked and the first order has already been delivered, and the second one is still in transit.

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

Since the second order hasn't been delivered yet, please refuse the delivery when it arrives. As soon as you refuse it, let us know — the carrier may take a few hours to update the status. Once the update appears in the system, we'll proceed with the full refund. Your subscription has already been canceled, so there will be no further automatic shipments.

I'm here for whatever you need and will follow your case through to full resolution.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDevolverSemResultadoSemRetencao",
      category: "reembolso",
      label: "Sem resultados",
      autoDetect: [
        "não fez efeito", "não funcionou", "sem resultado", "não teve resultado",
        "não vi resultado", "não notei diferença", "não senti diferença", "não deu resultado",
        "quero devolver", "quero devolução", "quero reembolso", "quero meu dinheiro de volta",
        "quero o dinheiro de volta", "quero cancelar e reembolso",
      ],
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Lamento saber que o produto não atendeu às suas expectativas.

Como seu pedido está dentro do período da nossa Garantia de Satisfação, podemos prosseguir com a devolução para realização do reembolso integral.

Número da Autorização de Devolução (RMA): [Número do RMA]

📍 Endereço de Devolução:
11870 62nd St. N
Largo, FL 33773

Após realizar o envio, por favor, responda a este e-mail anexando:
• Uma foto dos produtos que estão sendo devolvidos; e
• O comprovante de envio, com o número de rastreamento visível e legível.

Assim que recebermos essas informações, processaremos imediatamente o seu reembolso integral para o mesmo método de pagamento utilizado na compra.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I'm sorry to hear the product didn't meet your expectations.

Since your order is within our Satisfaction Guarantee period, we can proceed with the return to process a full refund.

Return Merchandise Authorization Number (RMA): [RMA Number]

📍 Return Address:
11870 62nd St. N
Largo, FL 33773

After shipping the return, please reply to this email attaching:
• A photo of the products being returned; and
• Proof of shipment, with the tracking number clearly visible and legible.

As soon as we receive this information, we'll immediately process your full refund to the same payment method used for the purchase.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegDevolverComProdutoSemMotivoSemRetencao",
      category: "reembolso",
      label: "Quer devolver, com o produto e não fala o motivo",
      autoDetect: [
        "quero cancelar e devolver o produto", "cancelar assinatura e devolver",
        "tenho o produto e quero cancelar", "quero devolver o produto e cancelar",
        "já estou com o produto", "estou com o produto em mãos", "recebi o produto e quero devolver",
        "como faço para devolver o produto que já recebi",
      ],
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua solicitação. Vou analisar cuidadosamente seu pedido para que possamos dar andamento da melhor forma possível.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Verifiquei que seu pedido está dentro do período da nossa Garantia de Satisfação, portanto podemos prosseguir com a devolução e o reembolso.

Antes de enviarmos as instruções, gostaria apenas de entender o motivo da devolução. Seu feedback é muito importante para nos ajudar a aprimorar nossos produtos e atendimento.

Assim que receber sua resposta, enviarei a autorização de devolução (RMA), o endereço para envio e as demais orientações para que possamos dar continuidade ao seu reembolso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing your request. I'll carefully review your order so we can move forward in the best possible way.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I checked and your order is within our Satisfaction Guarantee period, so we can proceed with the return and refund.

Before sending the instructions, I'd just like to understand the reason for the return. Your feedback is very important to help us improve our products and service.

As soon as I hear back from you, I'll send the return authorization (RMA), the shipping address, and the remaining instructions so we can proceed with your refund.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegEtiquetaCriada",
      category: "logistica",
      label: "Relata que a etiqueta ainda aparece somente como criada",
      autoDetect: [
        "etiqueta criada", "só aparece etiqueta criada", "rastreio não atualiza",
        "rastreio parado", "rastreamento parado", "status não muda",
        "ainda está como etiqueta criada",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "medoReacaoAdversa",
      label: "Relata reação adversa ao produto",
      autoDetect: [
        "tive uma reação", "tive reação alérgica", "me deu alergia", "passei mal",
        "tive enjoo", "tive náusea", "tive dor de cabeça depois de tomar",
        "fiquei mal depois de usar", "tive efeito colateral", "me fez mal",
      ],
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Lamento saber que você apresentou esses sintomas após utilizar o produto. Sua saúde e seu bem-estar são muito importantes para nós.

Como medida de precaução, orientamos que interrompa imediatamente o uso do produto e, caso os sintomas persistam ou causem preocupação, procure um profissional de saúde para uma avaliação adequada.

Para nos ajudar na análise do ocorrido, pedimos, por gentileza, que responda a este e-mail informando:
• Quais sintomas você apresentou; e
• Uma foto do produto.

Assim que recebermos essas informações, enviaremos as instruções para a devolução do produto e daremos continuidade ao processo de reembolso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Desejamos uma rápida recuperação e esperamos que você se sinta melhor em breve.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

I'm sorry to hear you experienced these symptoms after using the product. Your health and wellbeing are very important to us.

As a precaution, we recommend that you stop using the product immediately and, if the symptoms persist or cause concern, seek a healthcare professional for a proper evaluation.

To help us look into what happened, could you please reply to this email letting us know:
• Which symptoms you experienced; and
• A photo of the product.

As soon as we receive this information, we'll send you instructions for returning the product and proceed with the refund process.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

We wish you a speedy recovery and hope you feel better soon.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNaoReconheceCompraSemRastreio",
      category: "naoReconhece",
      label: "Não reconhece a compra – Sem o código de rastreio",
      autoDetect: [
        "não reconheço essa compra", "não fiz essa compra", "cobrança que não reconheço",
        "não autorizei essa compra", "fraude no meu cartão", "compra que eu não fiz",
        "alguém usou meu cartão", "cobrança suspeita", "não fui eu que comprei",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      id: "fegNaoReconheceCompraComProduto",
      category: "naoReconhece",
      label: "Não reconhece a compra – Está com o produto",
      autoDetect: null,
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Lamentamos saber que você não reconhece essa compra. Levamos situações como essa muito a sério e faremos o possível para ajudá-lo(a) da forma mais rápida e segura.

Para prosseguirmos com o reembolso, siga as instruções abaixo:

Número da Autorização de Devolução (RMA): [Número do RMA]

📍 Endereço de Devolução:
11870 62nd St. N
Largo, FL 33773

Após realizar o envio, por favor, responda a este e-mail anexando:
• Uma foto dos produtos que estão sendo devolvidos; e
• O comprovante de envio, com o número de rastreamento visível e legível.

Assim que recebermos essas informações, processaremos o reembolso integral para o mesmo método de pagamento utilizado na compra.

Como medida de segurança, recomendamos também que entre em contato com a administradora do seu cartão ou com seu banco, caso acredite que seus dados possam ter sido utilizados sem sua autorização.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

We're sorry to hear you don't recognize this purchase. We take situations like this very seriously and will do everything we can to help you as quickly and safely as possible.

To proceed with the refund, please follow the instructions below:

Return Merchandise Authorization Number (RMA): [RMA Number]

📍 Return Address:
11870 62nd St. N
Largo, FL 33773

After shipping the return, please reply to this email attaching:
• A photo of the products being returned; and
• Proof of shipment, with the tracking number clearly visible and legible.

As soon as we receive this information, we'll process the full refund to the same payment method used for the purchase.

As a security measure, we also recommend contacting your card issuer or bank, in case you believe your information may have been used without your authorization.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNaoReconheceCompraEmTransito",
      category: "naoReconhece",
      label: "Não reconhece a compra – Produto em trânsito",
      autoDetect: null,
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: Em trânsito

Lamentamos saber que você não reconhece essa compra. Levamos situações como essa muito a sério e faremos o possível para ajudá-lo(a) da forma mais rápida e segura.

Como o pedido já está em trânsito, infelizmente não é mais possível interromper o envio.

Quando a entrega for realizada, pedimos, por gentileza, que recuse o recebimento do pacote. Dessa forma, ele retornará automaticamente para nossa empresa.

Assim que a recusa for concluída, basta responder a este e-mail para que possamos acompanhar o retorno do pedido e dar continuidade ao seu reembolso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: In transit

We're sorry to hear you don't recognize this purchase. We take situations like this very seriously and will do everything we can to help you as quickly and safely as possible.

Since the order is already in transit, it's unfortunately no longer possible to stop the shipment.

When the delivery is attempted, please kindly refuse the package. This will cause it to be automatically returned to our company.

Once the refusal is completed, just reply to this email so we can track the order's return and proceed with your refund.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegReembolsoRealizado",
      category: "reembolso",
      label: "Reembolso realizado",
      autoDetect: [
        "já caiu meu reembolso", "quando recebo o reembolso", "meu reembolso ainda não caiu",
        "status do meu reembolso", "cadê meu reembolso",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      id: "fegReembolsoProcessadoEvidencias",
      category: "reembolso",
      label: "Reembolso processado após envio das evidências",
      autoDetect: null,
      pt: `Agradeço por enviar as fotos. Recebemos todas as informações necessárias e está tudo em ordem.

Conforme nossa política de garantia, o seu reembolso foi processado com sucesso.

Detalhes do Reembolso
• Valor Reembolsado: \${{valorReembolso}}
• Data: {{dataReembolso}}
• Horário: [Horário]

O valor foi enviado para o mesmo método de pagamento utilizado na compra. Dependendo da administradora do seu cartão ou da instituição financeira, o crédito poderá levar alguns dias para aparecer.

Lamentamos que o produto não tenha atendido às suas expectativas. Ainda assim, agradecemos pela confiança em nossa empresa e esperamos ter a oportunidade de atendê-lo(a) novamente no futuro. Sempre que precisar, nossa equipe estará à disposição para ajudar.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em responder.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Thank you for sending the photos. We've received all the necessary information and everything is in order.

In accordance with our warranty policy, your refund has been successfully processed.

Refund Details
• Refunded Amount: \${{valorReembolso}}
• Date: {{dataReembolso}}
• Time: [Time]

The amount was sent to the same payment method used for the purchase. Depending on your card issuer or financial institution, the credit may take a few days to appear.

We're sorry the product didn't meet your expectations. Even so, we appreciate your trust in our company and hope to have the opportunity to serve you again in the future. Whenever you need us, our team will be here to help.

I'll continue following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegCancelarPedidoAntesEnvio",
      category: "reembolso",
      label: "Cancelar o pedido antes do envio",
      autoDetect: null,
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua solicitação. Analisei seu pedido e tenho uma boa notícia.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: Cancelado

Consegui cancelar seu pedido antes do envio e o reembolso integral já foi processado para o mesmo método de pagamento utilizado na compra.

Em anexo, segue o comprovante do reembolso para sua conferência.

Dependendo da administradora do seu cartão ou da instituição financeira, o crédito poderá levar alguns dias para aparecer em sua conta ou fatura.

Se não se importar em compartilhar, gostaria apenas de saber o motivo do cancelamento. Seu feedback é muito importante para nos ajudar a aprimorar nossos produtos e atendimento.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing your request. I reviewed your order and have good news.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: Canceled

I was able to cancel your order before it shipped, and the full refund has already been processed to the same payment method used for the purchase.

Attached, please find the refund receipt for your records.

Depending on your card issuer or financial institution, the credit may take a few days to appear on your account or statement.

If you don't mind sharing, I'd just like to know the reason for the cancellation. Your feedback is very important to help us improve our products and service.

I'll continue following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegNaoGostouSabor",
      category: "reembolso",
      label: "Não gostou do sabor",
      autoDetect: [
        "não gostei do sabor", "gosto ruim", "sabor horrível", "não gostei do gosto",
        "o gosto é muito ruim", "sabor desagradável", "gosto muito forte",
      ],
      pt: `Olá!
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
      en: `Hello!
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
      category: "medoReacaoAdversa",
      label: "Médico não autorizou e está com os produtos",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Vou analisar cuidadosamente seu pedido para que possamos dar andamento da melhor forma possível.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendemos perfeitamente a sua decisão. Quando se trata da saúde, a orientação do seu médico deve sempre ser priorizada, e respeitamos totalmente essa recomendação.

Como seu pedido está dentro do período da nossa Garantia de Satisfação, podemos prosseguir com a devolução para realização do reembolso integral.

Número da Autorização de Devolução (RMA): [Número do RMA]

📍 Endereço de Devolução:
11870 62nd St. N
Largo, FL 33773

Após realizar o envio, por favor, responda a este e-mail anexando:
• Uma foto dos produtos que estão sendo devolvidos; e
• O comprovante de envio, com o número de rastreamento visível e legível.

Assim que recebermos essas informações, processaremos o reembolso integral para o mesmo método de pagamento utilizado na compra.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing this information. I'll carefully review your order so we can move forward in the best possible way.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

We completely understand your decision. When it comes to your health, your doctor's guidance should always be prioritized, and we fully respect that recommendation.

Since your order is within our Satisfaction Guarantee period, we can proceed with the return to process a full refund.

Return Merchandise Authorization Number (RMA): [RMA Number]

📍 Return Address:
11870 62nd St. N
Largo, FL 33773

After shipping the return, please reply to this email attaching:
• A photo of the products being returned; and
• Proof of shipment, with the tracking number clearly visible and legible.

As soon as we receive this information, we'll process the full refund to the same payment method used for the purchase.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },

    {
      id: "fegMedicoNaoAutorizouReembolsoRecusarEntrega",
      category: "medoReacaoAdversa",
      label: "Médico não autorizou o uso do produto – Produto em trânsito – Recusar entrega",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente da FEG e, a partir de agora, serei responsável por acompanhar seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Analisei seu pedido para encontrar a melhor forma de prosseguir.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendemos perfeitamente a sua decisão. Quando se trata da saúde, a orientação do seu médico deve sempre ser priorizada, e respeitamos totalmente essa recomendação.

Seu pedido está dentro do período da nossa Garantia de Satisfação, então podemos prosseguir com o reembolso integral. Porém, o pacote já está em trânsito e não conseguimos interromper ou cancelar o envio neste momento.

Por isso, pedimos que você recuse a entrega quando o pacote chegar — basta não aceitá-lo do entregador. Após fazer isso, por favor responda a este e-mail confirmando, e daremos andamento ao reembolso integral no mesmo método de pagamento utilizado na compra assim que o pacote retornar para nós.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente — FEG`,
      en: `Hello!
My name is {{nomeAgente}}, part of the FEG Customer Support team, and from now on I'll be personally responsible for following your case.

Thank you for reaching out to us and sharing this information. I reviewed your order to find the best way to proceed.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

We completely understand your decision. When it comes to your health, your doctor's guidance should always be prioritized, and we fully respect that recommendation.

Your order is within our Satisfaction Guarantee period, so we can proceed with a full refund. However, the package is already in transit and we're unable to stop or cancel the shipment at this time.

Because of that, we kindly ask that you refuse the delivery when the package arrives — simply don't accept it from the carrier. After doing so, please reply to this email confirming it, and we'll proceed with the full refund to the same payment method used for the purchase as soon as the package returns to us.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team — FEG`,
    },
  ];

  const CATEGORIES = [
    { id: "geral", label: "Geral", color: "#39ff14", featured: true },
    { id: "logistica", label: "Logística", color: "#14c8ff" },
    { id: "naoReconhece", label: "Cliente não reconhece a compra", color: "#ff5050" },
    { id: "assinatura", label: "Assinatura", color: "#b56bff" },
    { id: "reembolso", label: "Reembolso", color: "#ffc814" },
    { id: "medoReacaoAdversa", label: "Médico e Reação Adversa", color: "#ff8c1a" },
    { id: "garantiaVencida", label: "Garantia vencida", color: "#ff2e88" },
  ];

  const CATEGORY_GROUPS = [];

  window.TEMPLATES = TEMPLATES;
  window.CATEGORIES = CATEGORIES;
  window.CATEGORY_GROUPS = CATEGORY_GROUPS;
})();
