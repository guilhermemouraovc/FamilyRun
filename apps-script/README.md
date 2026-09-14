# Conectar o formulário a uma planilha Google Sheets

Isso cria um "App da Web" gratuito (Google Apps Script) que recebe cada
inscrição enviada pelo formulário e adiciona uma linha numa planilha sua.
Leva uns 5 minutos e não precisa de servidor nenhum.

## Passo a passo

1. **Abra a planilha de inscrições** já criada:
   https://docs.google.com/spreadsheets/d/1a1-9gHbacpHPM1sbC2Yiw8mTqttUg1V2NQzyubQ5OCo/edit
   (precisa estar logado na conta Google dona dessa planilha, ou ter
   acesso de edição a ela).

2. Nessa planilha, vá em **Extensões → Apps Script**. Isso cria um
   projeto de script já "amarrado" a essa planilha específica — é por
   isso que o passo 1 tem que ser feito nela, e não numa planilha em
   branco qualquer.

3. Apague todo o código de exemplo que aparecer no editor e cole o
   conteúdo do arquivo [`Code.gs`](./Code.gs) deste projeto.

4. Salve o projeto (ícone de disquete ou `Ctrl+S`). Dê um nome a ele,
   ex.: "Family Run – recebimento de inscrições".

5. Clique em **Implantar → Nova implantação**.
   - Clique no ícone de engrenagem ao lado de "Selecionar tipo" e escolha
     **App da Web**.
   - Em **Executar como**, deixe **Eu (seu e-mail)**.
   - Em **Quem pode acessar**, escolha **Qualquer pessoa**.
   - Clique em **Implantar**.

6. O Google vai pedir para **autorizar as permissões** (é o seu próprio
   script acessando a sua própria planilha). Clique em **Autorizar acesso**,
   escolha sua conta e, se aparecer o aviso de "app não verificado", clique
   em **Configurações avançadas → Acessar Family Run (não seguro)** — é
   esperado para scripts pessoais que você mesmo escreveu/colou.

7. Copie a **URL do app da Web** que aparece (algo como
   `https://script.google.com/macros/s/AKfycb.../exec`).

8. Abra `site/config.js` neste projeto e cole a URL:

   ```js
   window.FAMILY_RUN_CONFIG = {
     appsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec"
   };
   ```

9. Abra `site/index.html` (ou publique a pasta `site/` no seu host
   preferido — GitHub Pages, Netlify, Vercel etc.), preencha o formulário
   de teste e confirme que uma linha nova apareceu na aba **Inscrições**
   da planilha, com as colunas:

   `Data/hora | Nome completo | Data de nascimento | Distância | Telefone | E-mail | Tamanho da camisa | Profissão`

   Colunas novas sempre entram **no fim** dessa lista, e o script
   escreve o título que estiver faltando na primeira vez que rodar —
   assim as linhas já gravadas continuam alinhadas com os títulos.

## Atualizando o script depois

Se você editar `Code.gs` de novo mais tarde, volte em **Implantar →
Gerenciar implantações**, clique no ícone de lápis da implantação
existente e escolha **Nova versão** antes de salvar — só editar o código
no editor não atualiza a URL já publicada.

## Por que a resposta do fetch não é lida?

O formulário envia com `mode: "no-cors"`, então o navegador não consegue
ler a resposta do Apps Script (é uma limitação de CORS do próprio Apps
Script). Isso é normal: o envio ainda acontece e a linha é gravada; o
formulário só não consegue confirmar programaticamente que deu certo, por
isso o passo 9 acima (testar e olhar a planilha) é importante.
