## App FEG BRANDS — barra lateral do Freshdesk

Este app aparece do lado de um chamado no Freshdesk (barra lateral). Ele:

1. Lê automaticamente o nome do contato (cliente) do chamado aberto.
2. Mostra um botão "Abrir no Dashboard FEG BRANDS".
3. Ao clicar, abre o [dashboard FEG BRANDS](https://fernandawinders1979-png.github.io/site-respostas-cliente/index.html) em uma nova aba, já com o campo "Nome do Cliente" preenchido.

Os demais dados do pedido (número, produto, valor, endereço, status) continuam sendo digitados manualmente no painel, pois não existem de forma confiável e estruturada no Freshdesk hoje.

### Arquivos e pastas

    .
    ├── app
    │   ├── index.html            Página exibida na barra lateral
    │   ├── scripts/app.js        Lógica: pega o nome do cliente e monta o link
    │   └── styles/style.css      Visual do botão (cores da marca FEG)
    ├── config/iparams.json       Configurações da instalação (não usado por enquanto)
    ├── manifest.json             Descreve o app para a plataforma Freshworks
    └── tests/app.test.js         Testes automatizados (100% de cobertura)

### Pré-requisito importante

Esta ferramenta (FDK, da Freshworks) só funciona com **Node.js 18.x**. Este computador tem
uma versão mais nova instalada normalmente — por isso foi baixada uma cópia isolada do
Node 18 em `C:\Users\Usuario\dev-tools\node18`, usada apenas para os comandos abaixo (não
afeta o Node.js que você já usa para mais nada).

### Como testar no seu Freshdesk de verdade

1. Abra um terminal (PowerShell) nesta pasta (`freshdesk-app`).
2. Rode o servidor de testes local:
   ```
   C:\Users\Usuario\dev-tools\node18\node.exe C:\Users\Usuario\dev-tools\node18\node_modules\fdk\index.js run
   ```
3. Deixe essa janela aberta (ela precisa continuar rodando).
4. No navegador, entre no seu Freshdesk normalmente e abra qualquer chamado existente.
5. Na barra de endereço, adicione `?dev=true` no final do link e aperte Enter.
   Exemplo: `https://suaempresa.freshdesk.com/a/tickets/123?dev=true`
6. O app deve aparecer na barra lateral do chamado, com o botão "Abrir no Dashboard FEG BRANDS".

### Como instalar de verdade (depois de testar)

1. Com o servidor de testes ainda rodando, gere o pacote final:
   ```
   C:\Users\Usuario\dev-tools\node18\node.exe C:\Users\Usuario\dev-tools\node18\node_modules\fdk\index.js pack --skip-coverage
   ```
   Isso cria o arquivo `dist\freshdesk-app.zip`.
2. No Freshdesk, vá em **Admin → Apps → Get More Apps → Custom Apps** (ou "Aplicativos personalizados").
3. Clique em "New App" / "Novo App" e envie o arquivo `dist\freshdesk-app.zip`.
4. Dê um nome ao app (ex: "FEG Brands Dashboard") e siga as telas até "Save and Test".
5. Instale o app na sua conta e teste em um chamado real.
6. Quando estiver tudo certo, promova a versão para "Live" (ativa).

A partir daí, o botão aparece em todos os chamados automaticamente.
