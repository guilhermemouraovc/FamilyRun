# Family Run — Inscrição

Implementação em produção do protótipo `project/Family Run Inscricao.dc.html`
(exportado do Claude Design). HTML/CSS/JS puro, sem build — abra
`index.html` direto no navegador ou publique a pasta inteira em qualquer
host estático (GitHub Pages, Netlify, Vercel, etc.).

## Arquivos

- `index.html` — estrutura da página (dados do evento + formulário +
  tela de confirmação).
- `styles.css` — todo o visual, fiel ao protótipo (cores, tipografia,
  espaçamento).
- `app.js` — lógica do formulário: máscara de telefone, seleção de
  distância/tamanho por chips, validação e envio.
- `config.js` — onde você cola a URL do Google Apps Script depois de
  publicá-lo (veja abaixo).
- `assets/family-run-logo.jpeg` — logo do evento.
- `apps-script/Code.gs` + `apps-script/README.md` — o back-end (Google
  Apps Script) que recebe cada inscrição e grava numa aba de uma Google
  Sheet, e o passo a passo para publicá-lo.

## Como as inscrições caem na planilha

O formulário envia os dados por `fetch` para uma URL de "App da Web" do
Google Apps Script, que grava uma linha na planilha com:
`Data/hora, Nome completo, Data de nascimento, Distância, Telefone,
E-mail, Tamanho da camisa`.

**Antes de divulgar o link para os convidados**, siga
[`apps-script/README.md`](./apps-script/README.md) para publicar o script
na sua própria conta Google e colar a URL gerada em `config.js`. Enquanto
`config.js` estiver com `appsScriptUrl` vazio, o formulário continua
funcionando na tela, mas nenhuma inscrição é gravada em planilha nenhuma.
