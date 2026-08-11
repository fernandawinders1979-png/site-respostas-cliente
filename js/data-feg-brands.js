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
      code: "G-05",
      label: "Não localizado",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

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
Customer Support Team`,
    },

    {
      id: "fegComoPossoAjudar",
      category: "geral",
      code: "G-01",
      label: "Como posso te ajudar",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

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
Customer Support Team`,
    },

    {
      id: "fegDetalhesDoPedido",
      category: "geral",
      code: "G-02",
      label: "Detalhes do Pedido",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

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
Customer Support Team`,
    },

    {
      id: "fegDetalhesDoPedidoComRastreio",
      category: "geral",
      code: "G-03",
      label: "Detalhes do Pedido – Com código de rastreio",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Tudo bem? Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
How are you? My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

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
Customer Support Team`,
    },

    {
      id: "fegEnvioDoRMA",
      category: "geral",
      code: "G-04",
      label: "Envio do RMA",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}},

Meu nome é {{nomeAgente}} e estarei auxiliando você com o processo de devolução.

Conforme informado anteriormente, o seu RMA (Return Merchandise Authorization) está disponível no arquivo PDF anexado a este e-mail.

Por gentileza, imprima o documento RMA anexado e inclua-o junto ao envio do produto, seguindo as instruções fornecidas.

Após realizar o envio do produto, pedimos que responda a este mesmo e-mail enviando uma foto ou cópia do comprovante de envio contendo o código de rastreamento.

Essa informação será necessária para acompanharmos a devolução e darmos continuidade ao processo de reembolso conforme nossa política.

Assim que recebermos o comprovante de envio, poderemos prosseguir com a próxima etapa do seu atendimento.

Agradecemos pela sua colaboração e permanecemos à disposição caso tenha qualquer dúvida ou precise de auxílio durante o processo.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}},

My name is {{nomeAgente}} and I'll be assisting you with the return process.

As previously informed, your RMA (Return Merchandise Authorization) is available in the PDF file attached to this email.

Please print the attached RMA document and include it with the product shipment, following the instructions provided.

After shipping the product, please reply to this same email with a photo or copy of the shipping receipt showing the tracking code.

This information will be necessary for us to track the return and proceed with the refund process according to our policy.

As soon as we receive the shipping receipt, we'll be able to move forward with the next step of your case.

We appreciate your cooperation and remain available should you have any questions or need assistance during the process.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegEnviandoRMA",
      category: "geral",
      code: "G-06",
      label: "Enviando o RMA",
      autoDetect: null,
      pt: `Informamos que a RMA aguardada foi liberada e segue em anexo neste e-mail.

Solicitamos, por gentileza, que realizem o envio dos produtos conforme as instruções constantes na RMA anexa.

Assim que o envio for efetuado, pedimos que nos encaminhem, em resposta a este e-mail, o comprovante de envio (print ou foto do recibo da postagem), para que possamos dar andamento ao processo de reembolso.

Ficamos no aguardo do seu retorno e permanecemos à disposição para quaisquer dúvidas.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `We inform you that the RMA you were waiting for has been released and is attached to this email.

We kindly ask that you ship the products according to the instructions included in the attached RMA.

Once the shipment has been made, please reply to this email with proof of shipment (a screenshot or photo of the shipping receipt) so we can proceed with the refund process.

We look forward to your reply and remain available for any questions.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegDetalhesEntregaSemRastreio",
      category: "logistica",
      code: "LG-04",
      label: "Detalhes da entrega – Quando não tem código de rastreio",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

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
Customer Support Team`,
    },

    {
      id: "fegEnderecoInsuficiente",
      category: "logistica",
      code: "LG-05",
      label: "Não recebeu o pedido – Endereço insuficiente",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, from the Customer Support team.

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
Customer Support Team`,
    },

    {
      id: "fegNaoRecebeuQuerReembolsoEntregue",
      category: "logistica",
      code: "LG-09",
      label: "Relata que não recebeu pedido e quer reembolso – Consta como entregue",
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "quero reembolso", "quero meu dinheiro de volta", "quero o dinheiro de volta",
        "quero cancelar e reembolso", "exijo reembolso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, from the Customer Support team.

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
Customer Support Team`,
    },

    {
      id: "fegNaoRecebeuEntregueSemReembolso",
      category: "logistica",
      code: "LG-08",
      label: "Relata que não recebeu pedido – Consta como entregue (sem falar de reembolso)",
      autoDetect: [
        "não recebi meu pedido", "não recebi o pedido", "meu pedido não chegou",
        "aparece como entregue mas não recebi", "diz que foi entregue mas não recebi",
        "não chegou nada",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, from the Customer Support team.

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
Customer Support Team`,
    },

    {
      id: "fegDetalhesDaEntrega",
      category: "logistica",
      code: "LG-03",
      label: "Detalhes da entrega",
      autoDetect: [
        "quando vai chegar", "previsão de chegada", "qual é o status da entrega",
        "quero rastrear meu pedido", "como acompanho meu pedido", "código de rastreio",
        "rastreamento do pedido", "link de rastreio", "rastreio sumiu", "não aparece rastreio",
        "sem informação de rastreio", "rastreio não encontrado",
      ],
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

Agradeço por entrar em contato conosco. Sei o quanto é bom acompanhar de perto a chegada de um produto que faz parte da sua rotina de bem-estar.

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

Fico no aguardo, e desejo que o produto chegue rapidinho até você!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

Thank you for reaching out to us. I know how nice it is to closely track the arrival of a product that's part of your wellness routine.

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

I'll be looking forward to it, and I hope your product reaches you soon!

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegNovoCodigoRastreioReenvio",
      category: "logistica",
      code: "LG-06",
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
Equipe de Suporte ao Cliente`,
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
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCanceladaSucesso",
      category: "assinatura",
      code: "AS-01",
      label: "Assinatura cancelada - cliente respondeu falando o motivo",
      autoDetect: null,
      pt: `Obrigado por compartilhar o motivo do cancelamento — sua opinião é muito importante para nós.

Confirmo que sua assinatura foi cancelada com sucesso. Você não receberá novos envios ou cobranças automáticas a partir de agora.

Esperamos ter a oportunidade de atendê-lo(a) novamente em breve — será um prazer recebê-lo(a) de volta sempre que for o momento certo para você.

Se tiver qualquer dúvida ou precisar de algo mais, estou à disposição — basta responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Thank you for sharing the reason for the cancellation — your feedback is very important to us.

I confirm that your subscription has been successfully canceled. You won't receive any further shipments or automatic charges from now on.

We hope to have the opportunity to serve you again soon — it will be a pleasure to have you back whenever the time feels right for you.

If you have any questions or need anything else, I'm at your disposal — just reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCanceladaPrimeiroContato",
      category: "assinatura",
      code: "AS-02",
      label: "Cancelar assinatura - fale da flexibilidade da assinatura",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

Antes de prosseguirmos, quero lembrar que você tem total flexibilidade com a sua assinatura: caso prefira, é possível pausar temporariamente ou pular uma entrega, sem custo algum — assim você não perde seu histórico e pode retomar quando o momento estiver mais favorável.

🌿 E temos um cuidado especial para quem opta pela pausa: ao decidir retomar sua assinatura, você garante 15% de desconto no seu retorno. É a nossa forma de manter sua jornada de bem-estar acessível e de mostrar o quanto valorizamos ter você conosco — sem pressão e no seu tempo.

Mas, claro, a decisão é totalmente sua, e o cancelamento também está disponível a qualquer momento.

Se preferir seguir com o cancelamento, sem problema algum: ele será processado imediatamente, sem taxas e sem burocracia, e você não será cobrado(a) novamente. Importante: o cancelamento sempre vale para a próxima renovação, ou seja, envios já processados no ciclo atual não são afetados.

De qualquer forma, agradecemos sinceramente por ter feito parte da sua jornada de bem-estar até aqui. 💚

Fico no aguardo do seu retorno para seguirmos com o que fizer mais sentido para você.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

Before we move forward, I want to remind you that you have full flexibility with your subscription: if you prefer, you can temporarily pause it or skip a delivery, at no cost — that way you don't lose your history and can resume whenever it's a better time for you.

🌿 And we have something special for anyone who chooses to pause: when you decide to resume your subscription, you get a 15% discount on your return. It's our way of keeping your wellness journey accessible and showing how much we value having you with us — no pressure, on your own time.

But of course, the decision is entirely yours, and cancellation is also available at any time.

If you'd still prefer to go ahead with the cancellation, no problem at all: it will be processed immediately, with no fees and no hassle, and you won't be charged again. Important: the cancellation always applies to the next renewal, meaning shipments already processed in the current cycle aren't affected.

Either way, we sincerely thank you for being part of your wellness journey with us so far. 💚

I'll be looking forward to your reply so we can move forward with whatever makes the most sense for you.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCanceladaMotivoSemResultados",
      category: "assinatura",
      code: "AS-03",
      label: "Assinatura já foi cancelada - motivo sem resultados",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Espero que esteja bem.

Confirmo que sua assinatura foi cancelada com sucesso no dia [DATA]. A partir de agora, você não receberá mais nenhum produto nem cobrança automática.

Apenas uma informação importante: cada organismo é único, e o tempo para perceber resultados varia de pessoa para pessoa. A consistência no uso, conforme as orientações, é fundamental — os resultados costumam aparecer progressivamente com o uso contínuo. 🌿

Foi um prazer tê-lo(a) em nossa comunidade de bem-estar. Nossas portas estarão sempre abertas: quando sentir que é o momento de retomar sua jornada, basta nos enviar um e-mail. 💚

Qualquer dúvida, é só responder esta mensagem.

Com carinho,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. I hope you're doing well.

I confirm that your subscription was successfully canceled on [DATE]. From now on, you won't receive any further products or automatic charges.

Just an important note: every body is unique, and the time to notice results varies from person to person. Consistent use, as directed, is essential — results usually appear progressively with continued use. 🌿

It was a pleasure having you in our wellness community. Our doors will always be open: whenever you feel it's the right time to resume your journey, just send us an email. 💚

If you have any questions, just reply to this message.

Warmly,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCanceladaSemMotivo",
      category: "assinatura",
      code: "AS-04",
      label: "Cancelada, cliente respondeu e não quis falar o motivo",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Confirmo que sua assinatura foi cancelada com sucesso. Você não receberá novos envios ou cobranças automáticas a partir de agora.

Esperamos ter a oportunidade de atendê-lo(a) novamente em breve — estaremos sempre à disposição para quando desejar adquirir os produtos da nossa empresa, e será um prazer recebê-lo(a) de volta sempre que for o momento certo para você. 💚

Se tiver qualquer dúvida ou precisar de algo mais, estou à disposição — basta responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

I confirm that your subscription has been successfully canceled. You won't receive any further shipments or automatic charges from now on.

We hope to have the opportunity to serve you again soon — we'll always be available whenever you wish to purchase our products again, and it will be a pleasure to have you back whenever the time feels right for you. 💚

If you have any questions or need anything else, I'm at your disposal — just reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegCancelarAssinaturaCompraUnica",
      category: "assinatura",
      code: "AS-05",
      label: "Cancelar assinatura mas foi compra única",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Estarei acompanhando seu caso pessoalmente.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}
• Assinatura: NÃO

Entendo seu receio de cobranças inesperadas, então quis confirmar pessoalmente: esta foi uma compra única. Não há nenhuma assinatura ativa vinculada a este pedido — você não será cobrado(a) automaticamente no futuro nem receberá envios recorrentes. Nenhuma ação é necessária da sua parte.

Qualquer dúvida, é só responder este e-mail. Ficarei feliz em ajudar.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. I'll be personally following your case.

I've located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}
• Subscription: NO

I understand your concern about unexpected charges, so I wanted to confirm this personally: this was a one-time purchase. There's no active subscription linked to this order — you won't be charged automatically in the future, nor will you receive recurring shipments. No action is needed on your part.

If you have any questions, just reply to this email. I'll be happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCancelarSemMotivo",
      category: "assinatura",
      code: "AS-06",
      label: "Cancelar sem falar motivo - Pergunte o motivo",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Recebemos sua solicitação de cancelamento e estarei acompanhando seu caso pessoalmente.

Antes de finalizarmos, poderia nos contar o motivo do cancelamento? Para facilitar, basta responder com o número da opção que mais se encaixa na sua situação:

1. Dificuldade financeira / momento financeiro
2. Produto não funcionou / não vi resultados
3. Efeito colateral ou orientação médica (médico não autorizou)
4. Não sabia que era assinatura recorrente
5. Pedido feito por engano ou mudei de ideia
6. Produto diferente do anunciado
7. Não recebi o produto
8. Apenas quero cancelar, sem motivo específico
9. Outro motivo (se puder, conte brevemente)

Sua resposta nos ajuda muito a melhorar a experiência de bem-estar que oferecemos.

Obrigado(a) por ter feito parte da sua jornada de bem-estar conosco. 💚

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. We received your cancellation request and I'll be personally following your case.

Before we finalize it, could you tell us the reason for the cancellation? To make it easier, just reply with the number of the option that best fits your situation:

1. Financial difficulty / financial situation
2. Product didn't work / didn't see results
3. Side effect or medical advice (doctor didn't approve)
4. Didn't know it was a recurring subscription
5. Order placed by mistake or changed my mind
6. Product different from what was advertised
7. Didn't receive the product
8. Just want to cancel, no specific reason
9. Other reason (please briefly explain if you can)

Your answer helps us a lot to improve the wellness experience we offer.

Thank you for being part of your wellness journey with us. 💚

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegGarantiaVencidaAssinaturaAtiva",
      category: "garantiaVencida",
      code: "GV-02",
      label: "Garantia vencida, mas tem assinatura ativa",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente, e vou acompanhar seu caso pessoalmente.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, from the Customer Support team, and I'll be personally following your case.

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
Customer Support Team`,
    },

    {
      id: "fegGarantiaVencida",
      category: "garantiaVencida",
      code: "GV-01",
      label: "Garantia vencida",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente, e vou acompanhar seu caso pessoalmente.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo como é frustrante esbarrar em uma limitação de prazo ao pedir um reembolso. Verifiquei com cuidado: sua compra foi feita em {{dataCompra}}, coberta por uma garantia de satisfação de [X] dias, que terminou em [DATA LIMITE]. Como o pedido já está fora desse período, infelizmente não consigo processar o reembolso desta compra, e lamento não poder oferecer uma solução diferente neste caso.

Estou à disposição para qualquer dúvida sobre o pedido ou a garantia.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, from the Customer Support team, and I'll be personally following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I understand how frustrating it can be to run into a time limitation when requesting a refund. I checked carefully: your purchase was made on {{dataCompra}}, covered by a [X]-day satisfaction guarantee, which ended on [DEADLINE DATE]. Since the order is already outside that period, I'm unfortunately unable to process a refund for this purchase, and I'm sorry I can't offer a different solution in this case.

I'm at your disposal for any questions about the order or the warranty.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegDevolverSemResultadoSemRetencao",
      category: "reembolso",
      code: "RE-10",
      label: "Sem resultados",
      autoDetect: [
        "não fez efeito", "não funcionou", "sem resultado", "não teve resultado",
        "não vi resultado", "não notei diferença", "não senti diferença", "não deu resultado",
        "quero devolver", "quero devolução", "quero reembolso", "quero meu dinheiro de volta",
        "quero o dinheiro de volta", "quero cancelar e reembolso",
      ],
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Lamento saber que o produto não atendeu às suas expectativas.

Como seu pedido está dentro do período da nossa Garantia de Satisfação, podemos prosseguir com a devolução para realização do reembolso integral. Já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que eu tiver o retorno, enviarei todas as informações necessárias para a devolução.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I'm sorry to hear the product didn't meet your expectations.

Since your order is within our Satisfaction Guarantee period, we can proceed with the return to process a full refund. I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as I have it, I'll send you all the information needed for the return.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegDevolverComProdutoSemMotivoSemRetencao",
      category: "reembolso",
      code: "RE-03",
      label: "Devolver e está com o produto, não fala o motivo",
      autoDetect: [
        "quero cancelar e devolver o produto", "cancelar assinatura e devolver",
        "tenho o produto e quero cancelar", "quero devolver o produto e cancelar",
        "já estou com o produto", "estou com o produto em mãos", "recebi o produto e quero devolver",
        "como faço para devolver o produto que já recebi",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

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
Customer Support Team`,
    },

    {
      id: "fegEtiquetaCriada",
      category: "logistica",
      code: "LG-07",
      label: "Relata que a etiqueta ainda aparece somente como criada",
      autoDetect: [
        "etiqueta criada", "só aparece etiqueta criada", "rastreio não atualiza",
        "rastreio parado", "rastreamento parado", "status não muda",
        "ainda está como etiqueta criada",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua dúvida. Analisei seu pedido e posso esclarecer o que está acontecendo.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Endereço de Entrega: {{endereco}}
• Status Atual: Etiqueta criada

Verifiquei que o rastreamento ainda exibe o status "Etiqueta criada". Isso significa que a etiqueta de envio já foi gerada e o pacote está aguardando a próxima atualização da transportadora. Essa é uma etapa normal do processo de envio e não indica qualquer problema com o seu pedido.

Assim que a transportadora realizar a próxima leitura do pacote, o rastreamento será atualizado automaticamente. Você poderá acompanhar todas as movimentações pelo link abaixo:
{{linkRastreio}}

Sabemos que a expectativa para receber o pedido é grande, e esperamos que ele chegue até você muito em breve para que possa iniciar sua experiência com o produto.

Caso o status permaneça inalterado pelos próximos dias, basta responder a este e-mail. Terei prazer em verificar a situação diretamente com a transportadora.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing your question. I reviewed your order and can clarify what's happening.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Shipping Address: {{endereco}}
• Current Status: Label created

I checked and the tracking still shows the status "Label created." This means the shipping label has already been generated and the package is awaiting the carrier's next update. This is a normal step in the shipping process and doesn't indicate any problem with your order.

As soon as the carrier scans the package again, the tracking will update automatically. You'll be able to follow all the movements through the link below:
{{linkRastreio}}

We know how eager you are to receive your order, and we hope it arrives very soon so you can start your experience with the product.

If the status remains unchanged over the next few days, just reply to this email. I'll be happy to check the situation directly with the carrier.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAtrasoAtualizacaoRastreio",
      category: "logistica",
      code: "LG-02",
      label: "Atraso na atualização do rastreio na transportadora",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente, e serei responsável por acompanhar seu caso pessoalmente. Obrigado por entrar em contato e compartilhar o ocorrido.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Verifiquei que a atualização do rastreamento está pausada há alguns dias. Para garantir que sua entrega siga normalmente, já abrimos uma solicitação junto à transportadora, que tem até 5 dias úteis para nos dar um posicionamento.

Enquanto isso, fique tranquilo(a): seguirei acompanhando seu pedido de perto e te manterei informado(a) sobre qualquer novidade. Esperamos que o pacote siga viagem o quanto antes — mas, caso a transportadora confirme que ele não foi localizado ou que houve algum problema na entrega, entraremos em contato com a melhor solução para você.

Se tiver qualquer dúvida, é só responder a este e-mail. Ficarei feliz em ajudar.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, from the Customer Support team, and I'll be personally responsible for following your case. Thank you for reaching out and sharing what happened.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I checked and the tracking update has been paused for a few days. To make sure your delivery proceeds normally, we've already opened a request with the carrier, who has up to 5 business days to give us a response.

In the meantime, please don't worry: I'll keep closely monitoring your order and will keep you informed of any updates. We hope the package continues on its way as soon as possible — but if the carrier confirms it couldn't be located or that there was a delivery issue, we'll reach out with the best solution for you.

If you have any questions, just reply to this email. I'll be happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegEfeitosAdversosSintomas",
      category: "medoReacaoAdversa",
      code: "MA-04",
      label: "Reação adversa, Pergunte quantos frascos ainda tem",
      autoDetect: [
        "tive uma reação", "tive reação alérgica", "me deu alergia", "passei mal",
        "tive enjoo", "tive náusea", "tive dor de cabeça depois de tomar",
        "fiquei mal depois de usar", "tive efeito colateral", "me fez mal",
      ],
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Verifiquei que o seu pedido está dentro do período de garantia.

Lamento saber que você apresentou esses sintomas após utilizar o produto. Sua saúde e seu bem-estar são muito importantes para nós.

Como medida de precaução, orientamos que interrompa imediatamente o uso do produto e, caso os sintomas persistam ou causem preocupação, procure um profissional de saúde para uma avaliação adequada.

Para nos ajudar na análise do ocorrido, pedimos, por gentileza, que responda a este e-mail informando:

• Quais sintomas você apresentou;
• Quantos frascos ainda lacrados você possui em mãos.

Essa última informação nos ajudará a organizar corretamente o processo de devolução.

Assim que recebermos essas informações, enviaremos as instruções para a devolução do produto e daremos continuidade ao processo de reembolso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Desejamos uma rápida recuperação e esperamos que você se sinta melhor em breve. 💚

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

I've checked and your order is within the warranty period.

I'm sorry to hear you experienced these symptoms after using the product. Your health and wellbeing are very important to us.

As a precaution, we recommend that you stop using the product immediately and, if the symptoms persist or cause concern, seek a healthcare professional for a proper evaluation.

To help us look into what happened, could you please reply to this email letting us know:

• Which symptoms you experienced;
• How many still-sealed bottles you have on hand.

This last piece of information will help us organize the return process correctly.

As soon as we receive this information, we'll send you instructions for returning the product and proceed with the refund process.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

We wish you a speedy recovery and hope you feel better soon. 💚

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegReacaoAdversaSolicitarRMA",
      category: "medoReacaoAdversa",
      code: "MA-03",
      label: "Reação adversa - Solicitar RMA para devolução do produto",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato e por compartilhar as informações sobre a reação adversa que você apresentou. Lamento sinceramente pelo ocorrido — sua saúde e seu bem-estar são muito importantes para nós.

Como medida de precaução, reforçamos a orientação de manter o uso do produto interrompido e, caso os sintomas persistam ou causem preocupação, procurar um profissional de saúde para uma avaliação adequada.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

✅ Confirmação do Reembolso

Informo que o seu reembolso será processado. Já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que estiver disponível, enviarei o número do RMA junto com todas as instruções necessárias para a devolução dos frascos.

📦 Próximos Passos

Quando realizar o envio dos produtos, por favor, responda a este e-mail anexando a foto do comprovante de envio, com o número de rastreamento visível e legível, para darmos prosseguimento ao seu reembolso.

Assim que recebermos essa confirmação, daremos continuidade ao processo de reembolso para o mesmo método de pagamento utilizado na compra.

Permanecerei acompanhando seu caso pessoalmente até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Desejamos uma rápida recuperação e esperamos que você se sinta melhor em breve. 💚

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out and sharing the information about the adverse reaction you experienced. I'm truly sorry to hear about this — your health and wellbeing are very important to us.

As a precaution, we reinforce the recommendation to keep the product use discontinued and, if symptoms persist or cause concern, to seek a healthcare professional for a proper evaluation.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

✅ Refund Confirmation

I confirm that your refund will be processed. I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as it's available, I'll send you the RMA number along with all the instructions needed to return the bottles.

📦 Next Steps

Once you ship the products, please reply to this email attaching a photo of the shipping receipt, with the tracking number clearly visible and legible, so we can proceed with your refund.

As soon as we receive this confirmation, we'll move forward with the refund process to the same payment method used for the purchase.

I'll keep personally following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

We wish you a speedy recovery and hope you feel better soon. 💚

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAceitouReenvio",
      category: "logistica",
      code: "LG-01",
      label: "Aceitou o reenvio",
      autoDetect: null,
      pt: `Obrigado por confirmar o endereço para o reenvio. Vou providenciar o envio de um novo produto para o endereço informado.

Assim que o pedido for despachado, enviarei o código de rastreamento para que você possa acompanhar a entrega.

Se tiver qualquer dúvida ou precisar de algo mais, estou à disposição — basta responder a este e-mail.

Agradeço pela sua paciência e confiança.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Thank you for confirming the address for the reshipment. I'll arrange for a new product to be sent to the address provided.

As soon as the order ships, I'll send you the tracking code so you can follow the delivery.

If you have any questions or need anything else, I'm at your disposal — just reply to this email.

Thank you for your patience and trust.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegNaoReconheceCompraSemRastreio",
      category: "naoReconhece",
      code: "NR-03",
      label: "Não reconhece a compra – Sem o código de rastreio",
      autoDetect: [
        "não reconheço essa compra", "não fiz essa compra", "cobrança que não reconheço",
        "não autorizei essa compra", "fraude no meu cartão", "compra que eu não fiz",
        "alguém usou meu cartão", "cobrança suspeita", "não fui eu que comprei",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

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
Customer Support Team`,
    },

    {
      id: "fegNaoReconheceCompraComProduto",
      category: "naoReconhece",
      code: "NR-01",
      label: "Não reconheço a compra, está com o produto. Solicita o RMA",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Lamentamos saber que você não reconhece essa compra. Vou analisar cuidadosamente seu pedido e todas as informações compartilhadas para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Para prosseguirmos com o reembolso, já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que for liberada, enviarei o número do RMA junto com todas as instruções necessárias para a devolução.

Após realizar o envio, por favor, responda a este e-mail anexando:

• O comprovante de envio, com o número de rastreamento visível e legível.

Assim que recebermos essas informações, processaremos o reembolso integral para o mesmo método de pagamento utilizado na compra.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. We're sorry to hear you don't recognize this purchase. I'll carefully review your order and all the information you've shared so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

To proceed with the refund, I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as it's released, I'll send you the RMA number along with all the instructions needed for the return.

After shipping the return, please reply to this email attaching:

• Proof of shipment, with the tracking number clearly visible and legible.

As soon as we receive this information, we'll process the full refund to the same payment method used for the purchase.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegNaoReconheceCompraEmTransito",
      category: "naoReconhece",
      code: "NR-02",
      label: "Não reconheço a compra - Pedido em trânsito - Pede pra recusar a entrega",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar o que aconteceu. Lamentamos saber que você não reconhece essa compra. Vou analisar cuidadosamente seu pedido para que possamos encontrar a solução mais adequada para o seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: Em trânsito

Como o pedido já está em trânsito, infelizmente não é mais possível interromper o envio.

Você pode acompanhar a entrega do seu pedido utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Quando a entrega for realizada, pedimos, por gentileza, que recuse o recebimento do pacote. Dessa forma, ele retornará automaticamente para nossa empresa.

Assim que a recusa for concluída, basta responder a este e-mail para que possamos acompanhar o retorno do pedido e dar continuidade ao seu reembolso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing what happened. We're sorry to hear you don't recognize this purchase. I'll carefully review your order so we can find the best solution for your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: In transit

Since the order is already in transit, it's unfortunately no longer possible to stop the shipment.

You can track your order's delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

When the delivery is attempted, please kindly refuse the package. This will cause it to be automatically returned to our company.

Once the refusal is completed, just reply to this email so we can track the order's return and proceed with your refund.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegReembolsoRealizado",
      category: "reembolso",
      code: "RE-07",
      label: "Reembolso realizado",
      autoDetect: [
        "já caiu meu reembolso", "quando recebo o reembolso", "meu reembolso ainda não caiu",
        "status do meu reembolso", "cadê meu reembolso",
      ],
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e continuarei acompanhando seu caso.

Tenho uma ótima notícia: o seu reembolso já foi processado com sucesso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Reembolsado: \${{valorReembolso}}

Em anexo, segue o comprovante do reembolso para sua conferência.

Como o pagamento foi realizado por cartão de crédito, o valor será creditado no mesmo método de pagamento utilizado na compra. Dependendo da administradora do seu cartão ou da instituição financeira, o crédito poderá aparecer na fatura atual ou na próxima.

Lamentamos que sua experiência com o produto não tenha sido a esperada. Ainda assim, agradecemos pela confiança depositada em nossa empresa e esperamos ter a oportunidade de atendê-lo(a) novamente no futuro.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and I'll keep following your case.

I have great news: your refund has already been successfully processed.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Refunded Amount: \${{valorReembolso}}

Attached, please find the refund receipt for your records.

Since the payment was made by credit card, the amount will be credited to the same payment method used for the purchase. Depending on your card issuer or financial institution, the credit may appear on your current statement or the next one.

We're sorry your experience with the product wasn't what you expected. Even so, we appreciate your trust in our company and hope to have the opportunity to serve you again in the future.

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegProdutoChegouDanificado",
      category: "reembolso",
      code: "RE-05",
      label: "Não gostou do sabor - pergunte se tem garrafas lacradas?",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Obrigado(a) por entrar em contato — estarei acompanhando seu caso pessoalmente até a conclusão.

Localizei seu pedido:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Lamento que o sabor não tenha agradado ao seu paladar — sabemos que essa é uma preferência muito pessoal. Uma dica que ajuda muitos clientes: experimente misturar o produto com sucos cítricos bem gelados, vitaminas ou chás gelados.

Caso prefira seguir com o reembolso, poderia nos informar quantas garrafas lacradas você possui em mãos? Essa informação nos ajuda a organizar corretamente o processo de devolução.

Obrigado(a) pelo seu feedback — ele é muito importante para continuarmos melhorando. Qualquer dúvida, é só responder este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. Thank you for reaching out — I'll be personally following your case through to its conclusion.

I've located your order:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I'm sorry the taste wasn't to your liking — we know this is a very personal preference. A tip that helps many customers: try mixing the product with well-chilled citrus juices, smoothies, or iced teas.

If you'd prefer to proceed with the refund, could you let us know how many sealed bottles you have on hand? This information helps us organize the return process correctly.

Thank you for your feedback — it's very important for us to keep improving. If you have any questions, just reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegReembolsoProcessadoEvidencias",
      category: "reembolso",
      code: "RE-06",
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
Equipe de Suporte ao Cliente`,
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
Customer Support Team`,
    },

    {
      id: "fegCancelarPedidoEmTransito",
      category: "reembolso",
      code: "RE-02",
      label: "Cancelar pedido – Pedido em trânsito",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Entendo que você decidiu não prosseguir com a compra, e isso não é um problema. Gostaria apenas de pedir, se possível, que compartilhe o motivo do cancelamento. Seu feedback é muito importante para nos ajudar a melhorar nossos produtos e atendimento.

Verifiquei que seu pedido já está em trânsito e, por esse motivo, não é mais possível interromper o envio.

Você pode acompanhar a entrega do seu pedido utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Quando o produto chegar, pedimos, por gentileza, que recuse a entrega. Assim que a recusa for concluída, basta responder a este e-mail para que possamos dar continuidade ao processo de reembolso.

Esperamos que todo esse processo ocorra da forma mais rápida possível e continuaremos acompanhando seu caso até a sua conclusão.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I understand you've decided not to proceed with the purchase, and that's not a problem at all. I'd just like to ask, if possible, that you share the reason for the cancellation. Your feedback is very important to help us improve our products and service.

I checked and your order is already in transit, so it's no longer possible to stop the shipment.

You can track your order's delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

When the product arrives, please kindly refuse the delivery. Once the refusal is completed, just reply to this email so we can move forward with the refund process.

We hope this whole process happens as quickly as possible, and we'll keep following your case through to its conclusion.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegCancelarPedidoAntesEnvio",
      category: "reembolso",
      code: "RE-01",
      label: "Cancelar o pedido antes do envio",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

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
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

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
Customer Support Team`,
    },

    {
      id: "fegNaoGostouSabor",
      category: "reembolso",
      code: "RE-04",
      label: "Não gostou do sabor",
      autoDetect: [
        "não gostei do sabor", "gosto ruim", "sabor horrível", "não gostei do gosto",
        "o gosto é muito ruim", "sabor desagradável", "gosto muito forte",
      ],
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Estarei acompanhando seu caso pessoalmente.

Localizei seu pedido:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}

Lamento que o sabor não tenha agradado ao seu paladar — sabemos que essa é uma preferência muito pessoal. Antes de prosseguirmos, uma dica rápida que ajuda muitos clientes: experimente misturar o produto com sucos cítricos bem gelados, vitaminas ou chás gelados, o que pode tornar o sabor mais agradável.

Caso ainda prefira a devolução, sem problema algum, iremos seguir com o processo de devolução.

Obrigado(a) pelo seu feedback — ele nos ajuda a melhorar cada vez mais. Aguardo seu retorno.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. I'll be personally following your case.

I've located your order:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}

I'm sorry the taste wasn't to your liking — we know this is a very personal preference. Before we move forward, here's a quick tip that helps many customers: try mixing the product with well-chilled citrus juices, smoothies, or iced teas, which can make the taste more pleasant.

If you'd still prefer the return, no problem at all — we'll go ahead with the return process.

Thank you for your feedback — it helps us keep improving. I'll be waiting to hear back from you.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegMedicoNaoAutorizouReembolsoSemDevolucao",
      category: "medoReacaoAdversa",
      code: "MA-02",
      label: "Medico não autorizou, Solicitar RMA para devolução do produto",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

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

Já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que tiver o retorno, enviarei o número do RMA e todas as informações necessárias para a devolução.

Após realizar o envio, por favor, responda a este e-mail anexando:

• O comprovante de envio, com o número de rastreamento visível e legível.

Assim que recebermos essas informações, processaremos o reembolso integral para o mesmo método de pagamento utilizado na compra.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação. 💚

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

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

I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as I have it, I'll send you the RMA number and all the information needed for the return.

After shipping the return, please reply to this email attaching:

• Proof of shipment, with the tracking number clearly visible and legible.

As soon as we receive this information, we'll process the full refund to the same payment method used for the purchase.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery. 💚

I'll keep following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegMedicoNaoAutorizouReembolsoRecusarEntrega",
      category: "medoReacaoAdversa",
      code: "MA-01",
      label: "Médico não autorizou o uso do produto – Produto em trânsito – Recusar entrega",
      autoDetect: [
        "meu médico não autorizou", "médico não recomendou", "médico não liberou",
        "meu médico disse para não tomar", "médico não aprovou o uso",
      ],
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Analisei seu pedido para encontrar a melhor forma de prosseguir.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendemos perfeitamente a sua decisão. Quando se trata da saúde, a orientação do seu médico deve sempre ser priorizada, e respeitamos totalmente essa recomendação.

Seu pedido está dentro do período da nossa Garantia de Satisfação, então podemos prosseguir com o reembolso integral. Porém, o pacote já está em trânsito e não conseguimos interromper ou cancelar o envio neste momento.

Você pode acompanhar a entrega do seu pedido utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Por isso, pedimos que você recuse a entrega quando o pacote chegar — basta não aceitá-lo do entregador. Após fazer isso, por favor responda a este e-mail confirmando, e daremos andamento ao reembolso integral no mesmo método de pagamento utilizado na compra assim que o pacote retornar para nós.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be personally responsible for following your case.

Thank you for reaching out to us and sharing this information. I reviewed your order to find the best way to proceed.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

We completely understand your decision. When it comes to your health, your doctor's guidance should always be prioritized, and we fully respect that recommendation.

Your order is within our Satisfaction Guarantee period, so we can proceed with a full refund. However, the package is already in transit and we're unable to stop or cancel the shipment at this time.

You can track your order's delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

Because of that, we kindly ask that you refuse the delivery when the package arrives — simply don't accept it from the carrier. After doing so, please reply to this email confirming it, and we'll proceed with the full refund to the same payment method used for the purchase as soon as the package returns to us.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegMedicoNaoAutorizouEstaComProdutoAssinaturaCancelada",
      category: "medoReacaoAdversaPedidoAssinatura",
      code: "MP-01",
      label: "Médico não autorizou - tem garrafas lacradas - Solicitar RMA para devolução",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente, e vou acompanhar seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Entendemos perfeitamente a sua decisão. Quando se trata da saúde, a orientação do seu médico deve sempre ser priorizada, e respeitamos totalmente essa recomendação.

Como seu pedido está dentro do período da nossa Garantia de Satisfação, podemos prosseguir com a devolução para realização do reembolso integral.

Já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que tiver o retorno, enviarei o número do RMA e todas as informações necessárias para a devolução.

Após realizar o envio, por favor, responda a este e-mail anexando a foto do comprovante de envio, com o número de rastreamento visível e legível. Assim que recebermos essas informações, processaremos o reembolso integral para o mesmo método de pagamento utilizado na compra.

Também confirmo que sua assinatura ativa foi cancelada com sucesso. Você não receberá novos envios ou cobranças automáticas a partir de agora.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação. 💚

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case.

Thank you for reaching out to us and sharing this information. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

We completely understand your decision. When it comes to your health, your doctor's guidance should always be prioritized, and we fully respect that recommendation.

Since your order is within our Satisfaction Guarantee period, we can proceed with the return to process a full refund.

I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as I have it, I'll send you the RMA number and all the information needed for the return.

After shipping the return, please reply to this email attaching a photo of the shipping receipt, with the tracking number clearly visible and legible. As soon as we receive this information, we'll process the full refund to the same payment method used for the purchase.

I also confirm that your active subscription has been successfully canceled. You will not receive any further shipments or automatic charges from now on.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery. 💚

I'll keep following your case until it's fully resolved. If you have any questions, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegMedicoNaoAutorizouProdutoTransitoAssinaturaCancelada",
      category: "medoReacaoAdversaPedidoAssinatura",
      code: "MP-02",
      label: "Médico não autorizou o uso do produto – Produto em trânsito – Recusar entrega",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso pessoalmente.

Agradeço por entrar em contato conosco e por compartilhar essa informação. Analisei seu pedido para encontrar a melhor forma de prosseguir.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}
• Assinatura: Cancelada

Entendemos perfeitamente a sua decisão. Quando se trata da saúde, a orientação do seu médico deve sempre ser priorizada, e respeitamos totalmente essa recomendação.

Seu pedido está dentro do período da nossa Garantia de Satisfação, então podemos prosseguir com o reembolso integral. Porém, o pacote já está em trânsito e não conseguimos interromper ou cancelar o envio neste momento.

Você pode acompanhar a entrega utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Pedimos que você recuse a entrega quando o pacote chegar — basta não aceitá-lo do entregador. Após fazer isso, por favor responda a este e-mail confirmando, e daremos andamento ao reembolso integral no mesmo método de pagamento utilizado na compra assim que o pacote retornar para nós.

Também confirmo que sua assinatura ativa foi cancelada com sucesso.

Não é necessário compartilhar detalhes sobre sua condição de saúde. Respeitamos totalmente sua privacidade e desejamos que você tenha uma excelente recuperação.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be personally responsible for following your case.

Thank you for reaching out to us and sharing this information. I reviewed your order to find the best way to proceed.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}
• Subscription: Canceled

We completely understand your decision. When it comes to your health, your doctor's guidance should always be prioritized, and we fully respect that recommendation.

Your order is within our Satisfaction Guarantee period, so we can proceed with a full refund. However, the package is already in transit and we're unable to stop or cancel the shipment at this time.

You can track the delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

We kindly ask that you refuse the delivery when the package arrives — simply don't accept it from the carrier. After doing so, please reply to this email confirming it, and we'll proceed with the full refund to the same payment method used for the purchase as soon as the package returns to us.

I also confirm that your active subscription has been successfully canceled.

There's no need to share any details about your health condition. We fully respect your privacy and wish you a full and speedy recovery.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegModoDeUsoSistemaDuplo",
      category: "modoDeUso",
      code: "MU-01",
      label: "Modo de uso – Sistema duplo (Unlock + Rebuild)",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco. Fico feliz em ajudá-lo(a) a utilizar corretamente o seu produto para aproveitar ao máximo essa experiência.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

O modo de uso recomendado é o seguinte:
• Tome 1 cápsula de Unlock e 1 cápsula de Rebuild por dia, com um copo de água.
• Dê preferência ao consumo pela manhã, junto com o café da manhã.
• O uso deve ser contínuo, sem pausas ou ciclos, para obter os melhores resultados.

A consistência é um dos fatores mais importantes para que o organismo possa aproveitar os benefícios do produto ao longo do tempo. Sempre utilize conforme as orientações e mantenha uma rotina diária de uso.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído.

Se tiver qualquer dúvida durante o uso ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em continuar ajudando.

Desejo que você tenha uma excelente experiência com o produto e que sua jornada de bem-estar seja muito positiva.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us. I'm happy to help you use your product correctly so you can get the most out of this experience.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

The recommended usage is as follows:
• Take 1 Unlock capsule and 1 Rebuild capsule per day, with a glass of water.
• Preferably take it in the morning, together with breakfast.
• Use should be continuous, without breaks or cycles, to get the best results.

Consistency is one of the most important factors for your body to take full advantage of the product's benefits over time. Always use it according to the guidelines and keep a daily routine.

I'll keep following your case until it's fully resolved.

If you have any questions during use or need any additional information, don't hesitate to reply to this email. I'll be happy to keep helping.

I hope you have an excellent experience with the product and that your wellness journey is very positive.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegCancelarPedidoAssinaturaAntesEnvio",
      category: "reembolsoCancelarAssinatura",
      code: "RC-01",
      label: "Cancelar o pedido e a assinatura antes do envio do pedido",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua solicitação. Analisei seu pedido e tenho uma boa notícia.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: Cancelado
• Assinatura: Cancelada

Consegui cancelar tanto o seu pedido quanto a sua assinatura, conforme solicitado. Como o pedido foi cancelado antes do envio, o reembolso integral já foi processado para o mesmo método de pagamento utilizado na compra, e você não receberá novos envios ou cobranças automáticas.

Em anexo, segue o comprovante do reembolso para sua conferência. Dependendo da administradora do seu cartão ou da instituição financeira, o crédito poderá levar alguns dias para aparecer em sua conta ou fatura.

Se não se importar em compartilhar, gostaria apenas de saber o motivo do cancelamento. Seu feedback é muito importante para nos ajudar a aprimorar nossos produtos e atendimento.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing your request. I reviewed your order and have good news.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: Canceled
• Subscription: Canceled

I was able to cancel both your order and your subscription, as requested. Since the order was canceled before shipping, the full refund has already been processed to the same payment method used for the purchase, and you won't receive any further shipments or automatic charges.

Attached, please find the refund receipt for your records. Depending on your card issuer or financial institution, the credit may take a few days to appear on your account or statement.

If you don't mind sharing, I'd just like to know the reason for the cancellation. Your feedback is very important to help us improve our products and service.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegCancelarPedidoAssinaturaEmTransito",
      category: "reembolsoCancelarAssinatura",
      code: "RC-02",
      label: "Cancelar o pedido e a assinatura, o pedido em trânsito",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.
Agradeço por entrar em contato conosco e por compartilhar sua solicitação de cancelamento do pedido e da assinatura. Localizei seu pedido em nosso sistema:
Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}
• Assinatura: Ativa

Entendo sua decisão e isso não é problema algum. Verifiquei que seu pedido já está em trânsito e, por esse motivo, não é mais possível interromper o envio. Quando o produto chegar, pedimos, por gentileza, que recuse a entrega. Assim que a recusa for concluída, basta nos avisar para que possamos dar continuidade ao reembolso integral.

Você pode acompanhar a entrega do seu pedido utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Quanto à assinatura, antes de prosseguirmos com o cancelamento, gostaria de pedir, se possível, que compartilhe o motivo da sua decisão. Seu feedback é muito importante para nos ajudar a melhorar nossos produtos e atendimento, e assim que recebermos sua resposta, faremos o cancelamento imediatamente.
Continuaremos acompanhando seu caso até a conclusão. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.
Thank you for reaching out to us and sharing your request to cancel the order and the subscription. I located your order in our system:
Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}
• Subscription: Active

I understand your decision, and that's not a problem at all. I checked and your order is already in transit, so it's no longer possible to stop the shipment. When the product arrives, please kindly refuse the delivery. Once the refusal is completed, just let us know so we can move forward with the full refund.

You can track your order's delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

As for the subscription, before we proceed with the cancellation, I'd like to ask, if possible, that you share the reason for your decision. Your feedback is very important to help us improve our products and service, and as soon as we receive your reply, we'll cancel it right away.
We'll keep following your case through to its conclusion. If you have any questions or need any additional information, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegRecusouPedidoReembolsoCancelamento",
      category: "recusouEntrega",
      code: "REN-01",
      label: "Recusou pedido, solicita reembolso e cancelamento da assinatura",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}} e faço parte da Equipe de Atendimento ao Cliente.

Muito obrigado por entrar em contato, e obrigado por ter recusado a entrega — foi exatamente a atitude certa, e isso tornou todo o processamento aqui do nosso lado rápido e simples.

Gostaria de explicar o que aconteceu: este envio fazia parte da assinatura que foi ativada na sua compra anterior. Entendo perfeitamente que não era o que você esperava, e peço sinceras desculpas por qualquer confusão que isso possa ter causado.

Detalhes da Compra
• Número do Pedido: {{numeroPedido}}
• Produto: {{produto}}
• Data do Pedido: {{dataCompra}}
• Valor da Compra: \${{valorTotal}}

Não se preocupe — veja o que já resolvemos para você:
✅ Sua assinatura foi totalmente cancelada — não haverá novos envios.
✅ Seu reembolso integral já foi processado para a mesma forma de pagamento original.

Dependendo do seu banco ou operadora do cartão, o reembolso pode levar de 5 a 10 dias úteis para aparecer no seu extrato. Se você não visualizar o valor após esse prazo, é só responder este e-mail que verificarei pessoalmente para você.

Valorizamos muito ter você em nossa comunidade de bem-estar, e sempre que quiser comprar conosco novamente, será um prazer recebê-la de volta — nossas portas estarão sempre abertas para você.

Atenciosamente,
{{nomeAgente}}
Equipe de Atendimento ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}} and I'm part of the Customer Support Team.

Thank you so much for reaching out, and thank you for refusing the delivery — that was exactly the right move, and it made the whole process on our end quick and simple.

I'd like to explain what happened: this shipment was part of the subscription that was activated with your previous purchase. I completely understand this wasn't what you expected, and I sincerely apologize for any confusion this may have caused.

Order Details
• Order Number: {{numeroPedido}}
• Product: {{produto}}
• Order Date: {{dataCompra}}
• Purchase Amount: \${{valorTotal}}

Don't worry — here's what we've already taken care of for you:
✅ Your subscription has been fully canceled — there will be no further shipments.
✅ Your full refund has already been processed to the original payment method.

Depending on your bank or card issuer, the refund may take 5 to 10 business days to appear on your statement. If you don't see it after that time, just reply to this email and I'll personally check on it for you.

We truly value having you in our wellness community, and whenever you'd like to shop with us again, we'll be delighted to welcome you back — our doors are always open for you.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegDevolverCancelarAssinaturaComProdutoSemMotivo",
      category: "reembolsoCancelarAssinatura",
      code: "RC-06",
      label: "Reembolse o pedido e cancela a assinatura - está com o produto e não fala o motivo",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua solicitação. Vou analisar cuidadosamente seu pedido para que possamos dar andamento da melhor forma possível.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}
• Assinatura: Ativa

Verifiquei que seu pedido está dentro do período da nossa Garantia de Satisfação, portanto podemos prosseguir com a devolução e o reembolso.

Antes de enviarmos as instruções, gostaria de entender o motivo tanto da devolução quanto do cancelamento da assinatura. Seu feedback é muito importante para nos ajudar a aprimorar nossos produtos e atendimento.

Assim que recebermos sua resposta, enviaremos a autorização de devolução (RMA), o endereço para envio e as demais orientações para dar continuidade ao reembolso, e também faremos o cancelamento da assinatura.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be responsible for following your case.

Thank you for reaching out to us and sharing your request. I'll carefully review your order so we can move forward in the best way possible.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}
• Subscription: Active

I checked and your order is within our Satisfaction Guarantee period, so we can proceed with the return and the refund.

Before sending the instructions, I'd like to understand the reason for both the return and the subscription cancellation. Your feedback is very important to help us improve our products and service.

As soon as we receive your reply, we'll send the return authorization (RMA), the shipping address, and the remaining instructions to move forward with the refund, and we'll also cancel the subscription.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegJustificativaCanceladaProdutoTransito",
      category: "reembolsoCancelarAssinatura",
      code: "RC-03",
      label: "Justificativa enviada, Recusa entrega e Assinatura cancelada - Pedido em transito",
      autoDetect: null,
      pt: `Obrigado por compartilhar as justificativas — seu feedback é muito importante para nós e vai nos ajudar a melhorar nossos produtos e atendimento.

Confirmo que sua assinatura foi cancelada com sucesso. Você não receberá novos envios ou cobranças automáticas a partir de agora.

Quanto ao pedido, como ele já está em trânsito, pedimos, por gentileza, que recuse a entrega quando o produto chegar, para que ele retorne para nós. Assim que a recusa for concluída, basta responder a este e-mail nos avisando, e daremos continuidade ao reembolso integral do pedido.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Thank you for sharing your reasons — your feedback is very important to us and will help us improve our products and service.

I confirm that your subscription has been successfully canceled. You won't receive any further shipments or automatic charges from now on.

As for the order, since it's already in transit, please kindly refuse the delivery when the product arrives so it can be returned to us. Once the refusal is completed, just reply to this email letting us know, and we'll move forward with the full refund for the order.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegJustificativaCanceladaComProduto",
      category: "reembolsoCancelarAssinatura",
      code: "RC-04",
      label: "Justificativo enviada - Processo de reembolos (solicitar RMA) e assinatura cancelada - está com o produto",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Obrigado por compartilhar as justificativas — seu feedback é muito importante para nós e vai nos ajudar a melhorar nossos produtos e atendimento.

Confirmo que sua assinatura foi cancelada com sucesso. Você não receberá novos envios ou cobranças automáticas a partir de agora.

Quanto ao pedido, para prosseguirmos com o reembolso, já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, assim que tiver o retorno, enviarei todas as informações necessárias para a devolução dos produtos.

Assim que você postar o pacote, por favor, responda a este e-mail anexando a foto do comprovante de envio, com o número de rastreamento visível. Ao recebermos essa confirmação, daremos continuidade ao reembolso integral do pedido.

Permanecerei acompanhando seu caso pessoalmente até que ele seja totalmente concluído.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em ajudar.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

Thank you for sharing your reasons — your feedback is very important to us and will help us improve our products and service.

I confirm that your subscription has been successfully canceled. You won't receive any further shipments or automatic charges from now on.

As for the order, to move forward with the refund, I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and as soon as I have it, I'll send you all the information needed to return the products.

Once you ship the package, please reply to this email attaching a photo of the shipping receipt, with the tracking number clearly visible. Once we receive that confirmation, we'll move forward with the full refund for the order.

I'll keep personally following your case until it's fully resolved.

If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegMotivoCriseFinanceiraAguardandoRMA",
      category: "reembolsoCancelarAssinatura",
      code: "RC-05",
      label: "Motivo crise financeira e aguardando o RMA",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

Primeiramente, quero agradecer por compartilhar sua situação conosco. Sabemos que momentos de reorganização financeira exigem decisões importantes, e estamos aqui para tornar esse processo o mais simples e tranquilo possível para você. Seu bem-estar continua sendo nossa prioridade. 💚

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}
• Assinatura: Cancelada

✅ Confirmação de Cancelamento

Informo que sua assinatura foi cancelada com sucesso na data de hoje. Você não receberá novas cobranças a partir de agora.

📦 Próximos passos — Devolução e Reembolso

Já solicitei internamente a Autorização de Devolução (RMA) referente ao seu pedido. Assim que o número do RMA for liberado, entrarei em contato imediatamente com o endereço de devolução e todas as instruções necessárias para a devolução dos frascos.

Após realizar o envio dos produtos, peço gentilmente que me encaminhe uma foto do comprovante de envio, para que possamos dar seguimento ao seu reembolso o quanto antes.

Agradeço muito pela sua paciência e compreensão enquanto resolvemos isso juntos. Seu caso continua sendo acompanhado de perto por mim.

E saiba que as portas estarão sempre abertas para você! 🌿 Quando sentir que é o momento certo de retomar sua jornada de bem-estar, será uma alegria enorme recebê-lo(a) de volta. Estaremos sempre à disposição para quando quiser adquirir nossos produtos novamente — você faz parte da nossa história.

Qualquer dúvida, fico à disposição.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

First of all, thank you for sharing your situation with us. We know that times of financial reorganization call for important decisions, and we're here to make this process as simple and smooth as possible for you. Your well-being remains our priority. 💚

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}
• Subscription: Canceled

✅ Cancellation Confirmation

I confirm that your subscription has been successfully canceled as of today. You won't receive any further charges from now on.

📦 Next steps — Return and Refund

I've already requested the Return Merchandise Authorization (RMA) for your order internally. As soon as the RMA number is released, I'll reach out immediately with the return address and all the instructions needed to return the bottles.

After shipping the products, please kindly send me a photo of the shipping receipt so we can move forward with your refund as soon as possible.

Thank you so much for your patience and understanding while we work this out together. I'm keeping a close eye on your case.

And know that our doors will always be open for you! 🌿 Whenever you feel it's the right time to resume your wellness journey, it will be a true joy to welcome you back. We're always here whenever you'd like to purchase our products again — you're part of our story.

If you have any questions, I'm here to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegPrimeiroContatoAssinaturaCanceladaReembolsoPrimeiroPedido",
      category: "reembolsoCancelarAssinatura",
      code: "RC-07",
      label: "Quer cancelar, primeiro contato - Assinatura cancelada e Reembolse apenas o primeiro pedido",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Aqui é {{nomeAgente}}, do Suporte ao Cliente. Serei responsável pelo seu caso até a conclusão.

Localizei seu pedido:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Assinatura: Ativa

Lamento que o produto não tenha atendido às suas expectativas. Como seu pedido está dentro do período da nossa Garantia de Satisfação, já solicitei a Autorização de Devolução (RMA) ao departamento responsável e, em breve, enviarei as instruções de envio. Após postar o produto, basta responder este e-mail com o comprovante de envio e o número de rastreamento legível — assim que recebermos, processaremos o reembolso integral do seu primeiro pedido no mesmo método de pagamento utilizado na compra.

✅ Confirmação de Cancelamento

Confirmo que sua assinatura foi cancelada com sucesso, sem taxas e sem burocracia, e você não será cobrado(a) novamente. O cancelamento vale a partir da próxima renovação — envios já processados no ciclo atual não são afetados, mas o reembolso solicitado se aplica apenas a este primeiro pedido.

Permanecerei acompanhando seu caso até que ele seja totalmente concluído. Se tiver qualquer dúvida ou precisar de qualquer informação adicional, não hesite em responder a este e-mail. Ficarei feliz em ajudar.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

This is {{nomeAgente}}, from Customer Support. I'll be responsible for your case until it's resolved.

I've located your order:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Subscription: Active

I'm sorry the product didn't meet your expectations. Since your order is within our Satisfaction Guarantee period, I've already requested the Return Merchandise Authorization (RMA) from the responsible department, and I'll send the shipping instructions shortly. After you ship the product, just reply to this email with the shipping receipt and a legible tracking number — once we receive it, we'll process the full refund for your first order using the same payment method used for the purchase.

✅ Cancellation Confirmation

I confirm that your subscription has been successfully canceled, with no fees and no hassle, and you won't be charged again. The cancellation takes effect from the next renewal onward — shipments already processed in the current cycle aren't affected, but the requested refund applies only to this first order.

I'll keep following your case until it's fully resolved. If you have any questions or need any additional information, don't hesitate to reply to this email. I'll be happy to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegCancelarCompreiPorEnganoProdutoTransito",
      category: "cancelarCompreiPorEngano",
      code: "CE-01",
      label: "Cancelar pedido - Comprou por engano – Produto em trânsito - Informe da assinatura",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, da equipe de Suporte ao Cliente, e vou acompanhar seu caso pessoalmente.
Agradeço por informar que o pedido foi feito por engano. Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Endereço de Entrega: {{endereco}}
• Status Atual: {{status}}
• Assinatura: Ativa

Entendo perfeitamente, esse tipo de engano pode acontecer. Seu pedido já está em trânsito e não é mais possível interromper o envio. Quando o produto chegar, pedimos, por gentileza, que recuse a entrega; assim que a recusa for concluída, basta nos avisar por este e-mail para darmos continuidade ao reembolso integral.

Você pode acompanhar a entrega do seu pedido utilizando as informações abaixo:

Informações de Rastreamento
• Código de Rastreamento: {{codigoRastreio}}
• Link de Rastreamento: {{linkRastreio}}

Além do pedido, você também possui uma assinatura ativa. Sugerimos mantê-la por enquanto, para que você tenha esse período para decidir com calma se deseja experimentar o produto. Caso prefira não seguir, basta nos enviar um e-mail a qualquer momento confirmando o cancelamento.

Continuaremos acompanhando seu caso até a conclusão. Se tiver qualquer dúvida, estou à disposição.

Quando decidir adquirir nosso produto novamente, esperamos tê-lo(a) de volta em breve.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, from the Customer Support team, and I'll be personally following your case.
Thank you for letting us know the order was placed by mistake. I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Shipping Address: {{endereco}}
• Current Status: {{status}}
• Subscription: Active

I completely understand, this kind of mistake can happen. Your order is already in transit, so it's no longer possible to stop the shipment. When the product arrives, please kindly refuse the delivery; once the refusal is completed, just let us know by replying to this email so we can move forward with the full refund.

You can track your order's delivery using the information below:

Tracking Information
• Tracking Code: {{codigoRastreio}}
• Tracking Link: {{linkRastreio}}

In addition to the order, you also have an active subscription. We suggest keeping it active for now, so you have this period to calmly decide whether you'd like to try the product. If you'd rather not continue, just send us an email at any time confirming the cancellation.

We'll keep following your case through to its conclusion. If you have any questions, I'm at your disposal.

Whenever you decide to purchase our product again, we hope to have you back soon.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegChargeback",
      category: "chargeback",
      code: "CB-01",
      label: "Chargeback",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!

Meu nome é {{nomeAgente}}, faço parte da Equipe de Suporte ao Cliente e, a partir de agora, serei responsável por acompanhar pessoalmente o seu caso.

Agradeço por entrar em contato conosco e por compartilhar sua solicitação. Localizei as seguintes informações em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto(s): {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Ao analisar seu caso, verifiquei que a operadora do seu cartão já iniciou um processo de chargeback (contestação da cobrança) para esta compra.

Como essa disputa já está em andamento junto à instituição financeira, não podemos processar o cancelamento ou emitir um reembolso diretamente por nossa empresa, pois isso poderia resultar em um reembolso duplicado.

A partir deste momento, o caso será tratado por meio do processo de chargeback iniciado junto ao seu banco ou administradora do cartão. Recomendamos que acompanhe a disputa diretamente com a instituição financeira, que será responsável por analisar o caso e informar a decisão final.

Se tiver qualquer dúvida ou precisar de qualquer informação adicional, basta responder a este e-mail. Ficarei feliz em continuar ajudando.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!

My name is {{nomeAgente}}, part of the Customer Support team, and from now on I'll be personally responsible for following up on your case.

Thank you for contacting us and for sharing your request. I found the following information in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product(s): {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

While reviewing your case, I found that your card issuer has already opened a chargeback (payment dispute) process for this purchase.

Since this dispute is already underway with your financial institution, we're unable to process a cancellation or issue a refund directly through our company, as this could result in a duplicate refund.

From this point forward, your case will be handled through the chargeback process opened with your bank or card issuer. We recommend following up on the dispute directly with your financial institution, which will be responsible for reviewing the case and providing the final decision.

If you have any questions or need any additional information, just reply to this email. I'll be happy to keep helping.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegReembolsoCancelarAssinaturaAmeacaDisputa",
      category: "clienteAmeacandoDisputa",
      code: "CD-02",
      label: "Reembolso de pedido e cancelamento de assinatura",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e faço parte da Equipe de Suporte ao Cliente.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Produto: {{produto}}
• Data da Assinatura: {{dataCompra}}

Antes de tudo, peço desculpas pela frustração causada e agradeço por ter entrado em contato novamente para que pudéssemos resolver isso da melhor forma possível.

Entendo completamente sua preocupação, e quero deixar tudo resolvido agora mesmo, sem que você precise abrir uma disputa com a operadora do seu cartão.

Já realizamos o seguinte, sem necessidade de nenhuma ação adicional da sua parte:

✅ Sua assinatura foi cancelada com sucesso — não haverá novos envios ou cobranças automáticas.

✅ Seu reembolso integral foi processado para a mesma forma de pagamento original.

O valor pode levar de 5 a 10 dias úteis para aparecer no seu extrato, dependendo do seu banco ou operadora do cartão.

Lamentamos sinceramente que sua experiência não tenha sido a que esperávamos oferecer, e agradecemos a oportunidade de corrigir isso diretamente com você.

E saiba que, sempre que você sentir vontade de nos dar uma nova oportunidade, as portas estarão sempre abertas — será um verdadeiro prazer recebê-la de volta em nossa comunidade, quando for o momento certo para você.

Estamos sempre à disposição para o que você precisar — é só responder este e-mail, com todo carinho, que teremos o maior prazer em ajudar.

Com atenção e cuidado,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'm part of the Customer Support Team.

Order Details
• Order Number: {{numeroPedido}}
• Product: {{produto}}
• Subscription Date: {{dataCompra}}

First of all, I apologize for the frustration caused and thank you for reaching out to us again so we could resolve this in the best possible way.

I completely understand your concern, and I want to get everything resolved right now, without you needing to open a dispute with your card issuer.

We've already taken care of the following, with no further action needed on your part:

✅ Your subscription has been successfully canceled — there will be no further shipments or automatic charges.

✅ Your full refund has been processed to your original payment method.

The amount may take 5 to 10 business days to appear on your statement, depending on your bank or card issuer.

We sincerely regret that your experience wasn't what we aimed to provide, and we appreciate the opportunity to make this right directly with you.

And please know that whenever you feel like giving us another chance, our doors will always be open — it would be a true pleasure to welcome you back to our community, whenever the time feels right for you.

We're always here for whatever you need — just reply to this email, and we'll be glad to help.

With care and attention,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegAssinaturaCanceladaComSucessoAmeacaDisputa",
      category: "clienteAmeacandoDisputa",
      code: "CD-01",
      label: "Assinatura cancelada com sucesso",
      autoDetect: null,
      pt: `Olá {{nomeCliente}},

Meu nome é {{nomeAgente}} e faço parte da Equipe de Suporte ao Cliente.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Produto: {{produto}}
• Data do Cancelamento da Assinatura: [Data do Cancelamento]

Antes de tudo, peço desculpas pela frustração causada e agradeço por ter entrado em contato para que pudéssemos resolver isso da melhor forma possível.

Gostaria de confirmar que sua assinatura foi cancelada com sucesso na data acima — não haverá novos envios ou cobranças automáticas, sem necessidade de nenhuma ação adicional da sua parte, e sem que você precise abrir uma disputa com a operadora do seu cartão.

Lamentamos sinceramente que sua experiência não tenha sido a que esperávamos oferecer, e agradecemos a oportunidade de corrigir isso diretamente com você.

E saiba que, sempre que você sentir vontade de nos dar uma nova oportunidade, as portas estarão sempre abertas — será um verdadeiro prazer recebê-la de volta em nossa comunidade, quando for o momento certo para você.

Estamos sempre à disposição para o que você precisar — é só responder este e-mail, com todo carinho, que teremos o maior prazer em ajudar.

Com atenção e cuidado,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello {{nomeCliente}},

My name is {{nomeAgente}} and I'm part of the Customer Support Team.

Order Details
• Order Number: {{numeroPedido}}
• Product: {{produto}}
• Subscription Cancellation Date: [Cancellation Date]

First of all, I apologize for the frustration caused and thank you for reaching out to us so we could resolve this in the best possible way.

I'd like to confirm that your subscription was successfully canceled on the date above — there will be no further shipments or automatic charges, with no further action needed on your part, and without you needing to open a dispute with your card issuer.

We sincerely regret that your experience wasn't what we aimed to provide, and we appreciate the opportunity to make this right directly with you.

And please know that whenever you feel like giving us another chance, our doors will always be open — it would be a true pleasure to welcome you back to our community, whenever the time feels right for you.

We're always here for whatever you need — just reply to this email, and we'll be glad to help.

With care and attention,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegReembolsoSemResultadoAguardandoRMA",
      category: "reembolso",
      code: "RE-09",
      label: "Sem resultado, aguardando o RMA",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}}, faço parte da equipe de Suporte ao Cliente, e a partir de agora estarei acompanhando seu caso pessoalmente.

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}
• Status Atual: {{status}}

Passando para te atualizar sobre o andamento do seu caso: já solicitamos internamente a Autorização de Devolução (RMA) referente ao seu pedido, e no momento estamos aguardando essa informação para poder te enviar o número do RMA, o endereço de devolução e as demais instruções necessárias para darmos continuidade ao seu reembolso.

Agradeço muito pela sua paciência e compreensão enquanto resolvemos isso juntos.

Qualquer dúvida, fico à disposição.

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}}, part of the Customer Support team, and I'll be personally following your case from now on.

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}
• Current Status: {{status}}

I'm reaching out to update you on your case: we've already requested the Return Merchandise Authorization (RMA) for your order internally, and we're currently waiting to receive that information so we can send you the RMA number, the return address, and the remaining instructions to move forward with your refund.

Thank you so much for your patience and understanding while we work this out together.

If you have any questions, I'm here to help.

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },

    {
      id: "fegTenhoUsadoMasNaoSintoEfeito",
      category: "reembolso",
      code: "RE-11",
      label: "Tenho usado o seu produto, mas não sinto nenhum efeito",
      autoDetect: null,
      pt: `Olá, {{nomeCliente}}!
Meu nome é {{nomeAgente}} e irei te ajudar a partir de agora. Recebi sua mensagem e fico feliz em poder te auxiliar a tirar o máximo proveito do produto.

Localizei seu pedido em nosso sistema:

Detalhes do Pedido
• Número do Pedido: {{numeroPedido}}
• Data da Compra: {{dataCompra}}
• Produto: {{produto}}
• Valor Total: \${{valorTotal}}

Lamento saber que o produto não atendeu às suas expectativas até o momento.

Para que eu possa te dar orientações realmente direcionadas ao seu caso, gostaria de entender um pouco melhor sua experiência de uso:

Há quanto tempo você está utilizando o produto?
Como tem sido o seu uso no dia a dia (frequência, horário, quantidade, etc.)?
Você notou alguma mudança, mesmo que pequena, desde que começou a usar?
Existe algo específico que você esperava sentir e ainda não sentiu?

Os resultados costumam depender bastante da constância e de pequenos ajustes na forma de uso — e com essas informações, consigo te dar dicas bem direcionadas para o seu momento.

Assim que você me responder, volto com algumas sugestões práticas para você aproveitar ainda mais os benefícios. 😊

Fico no aguardo do seu retorno!

Atenciosamente,
{{nomeAgente}}
Equipe de Suporte ao Cliente`,
      en: `Hello, {{nomeCliente}}!
My name is {{nomeAgente}} and I'll be helping you from now on. I received your message and I'm happy to help you get the most out of the product.

I located your order in our system:

Order Details
• Order Number: {{numeroPedido}}
• Purchase Date: {{dataCompra}}
• Product: {{produto}}
• Total Amount: \${{valorTotal}}

I'm sorry to hear the product hasn't met your expectations so far.

So I can give you guidance that's truly tailored to your case, I'd like to understand your experience with the product a bit better:

How long have you been using the product?
What has your day-to-day use been like (frequency, time of day, amount, etc.)?
Have you noticed any change, even a small one, since you started using it?
Is there something specific you expected to feel that you haven't felt yet?

Results tend to depend a lot on consistency and small adjustments to how the product is used — and with this information, I can give you tips that are truly tailored to your situation.

As soon as you reply, I'll come back with some practical suggestions to help you get even more out of the benefits. 😊

I'll be looking forward to your reply!

Best regards,
{{nomeAgente}}
Customer Support Team`,
    },
  ];

  /**
   * Prefixo do código de cada categoria (campo "code" dos templates, ex:
   * "AS-03"). Ao criar um template novo, use o prefixo da categoria dele
   * e o próximo número livre nessa categoria (maior número existente + 1).
   * G=Geral, LG=Logística, NR=Não reconhece a compra, CD=Cliente ameaçando
   * disputa, AS=Assinatura, RE=Reembolso do Pedido, RC=Reembolso+Cancelar
   * Assinatura, REN=Recusou entrega, CE=Comprei por engano,
   * MA=Médico/Reação adversa (apenas pedido), MP=Médico/Reação adversa
   * (pedido+assinatura), GV=Garantia vencida, MU=Modo de uso, CB=Chargeback.
   */
  const CATEGORIES = [
    { id: "geral", label: "Geral", color: "#39ff14", featured: true },
    { id: "logistica", label: "Logística", color: "#14c8ff" },
    { id: "naoReconhece", label: "Cliente não reconhece a compra", color: "#ff5050" },
    { id: "clienteAmeacandoDisputa", label: "Cliente Ameaçando disputa ou denunciar", color: "#ef476f" },
    { id: "assinatura", label: "Assinatura", color: "#b56bff" },
    { id: "reembolso", label: "Reembolso do Pedido", color: "#ffc814" },
    { id: "reembolsoCancelarAssinatura", label: "Reembolso do Pedido e Cancelar Assinatura", color: "#4d7cff" },
    { id: "recusouEntrega", label: "Recusou o pedido no ato da entrega", color: "#2ec4b6" },
    { id: "cancelarCompreiPorEngano", label: "Cancelar - Comprei por Engano", color: "#ffb700" },
    { id: "medoReacaoAdversa", label: "Médico e Reação Adversa - Apenas o Pedido", color: "#ff8c1a" },
    { id: "medoReacaoAdversaPedidoAssinatura", label: "Médico e Reação Adversa - Pedido e Assinatura", color: "#ffa64d" },
    { id: "garantiaVencida", label: "Garantia vencida", color: "#ff2e88" },
    { id: "modoDeUso", label: "Modo de Uso", color: "#00e0c6" },
    { id: "chargeback", label: "Chargeback", color: "#e100ff" },
  ];

  const CATEGORY_GROUPS = [];

  window.TEMPLATES = TEMPLATES;
  window.CATEGORIES = CATEGORIES;
  window.CATEGORY_GROUPS = CATEGORY_GROUPS;
})();
