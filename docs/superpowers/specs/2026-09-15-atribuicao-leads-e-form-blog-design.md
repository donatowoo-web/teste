# Atribuição de leads (UTMs/gclid) + formulário no blog — desenho

**Data:** 2026-09-15
**Projeto:** evaplace.pt (`meu-site`) — Next.js `output: "export"` + Sanity, deploy por FTPS
**Estado:** aprovado (falta revisão do spec escrito)
**Origem:** briefing "Captura de UTMs e gclid nos formulários" + pedido "o formulário tem de aparecer logo ao adicionar no blog"

---

## Objetivo

1. Saber no Pipedrive de onde vem cada lead (Google Ads, Meta, orgânico), guardando
   os parâmetros de campanha quando a pessoa aterra no site e juntando-os a **todos**
   os envios de leads para o Make, mesmo que a pessoa navegue antes de preencher.
2. Desbloquear na CSP os scripts que o GTM já tenta carregar.
3. Pôr a funcionar o botão «Form» do editor de artigos: o formulário tem de aparecer
   no editor assim que é inserido e no artigo publicado.

---

## Decisões tomadas

| Decisão | Escolha | Porquê |
|---|---|---|
| Formato do envio | Manter `x-www-form-urlencoded` e os campos atuais (`Nome`, `Email`, `Contacto`, …) exatamente como estão | O cenário do Make depende deles. O exemplo JSON do briefing (`nome`/`telefone`) não corresponde ao que o site envia. |
| Nomes dos campos de atribuição | Os da tabela do briefing, todos | Hoje o formulário não envia UTMs nenhuns (confirmado no JS publicado e no histórico do git), por isso a regra "manter os nomes dos UTMs atuais" não se aplica. |
| Campos vazios | Sempre presentes, `""` quando não há valor | Pedido do briefing; o Make vê sempre a mesma estrutura. |
| Arquitetura | Módulo `app/lib/attribution.ts` + componente `AttributionCapture` no layout | Uma só lista de chaves; mesmo padrão do `GTMPageView` que já existe. Script inline no `<head>` não traz ganho: os redirects do servidor preservam a query string (verificado: apex→www, http→https, barra final). |
| `CandidaturaPopup` | Fora | É recrutamento, outro webhook; não é lead. |
| Clarity e Ahrefs na CSP | Autorizar | Estão configurados no GTM e a CSP bloqueia-os (consola). Continuam dependentes do consentimento gerido pelo GTM. |
| Google Translate | Autorizar | O seletor de idioma do rodapé (`LanguageSwitcher`) usa-o. |
| Formulário no blog | Cartão não editável no editor + marcador limpo no Sanity | O site já troca o marcador por `<MultiStepFormBlog />`; o que falhava era o backoffice. |
| Artigos já estragados | Corrigidos por mim no Sanity, só os 2 blocos afetados, com a alteração mostrada antes de gravar | Decisão do utilizador. |

---

## Parte 1 — Captura de atribuição

### Chaves

Lidas do URL: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`matchtype`, `gclid`, `gbraid`, `wbraid`, `fbclid`.
Calculadas: `landing_page`, `referrer`.

### Captura (`AttributionCapture`, montado no `layout.tsx` junto ao `GTMPageView`)

Em cada carregamento e em cada navegação interna (`usePathname` + `useSearchParams`,
dentro de `<Suspense>`):

```
nenhuma das 10 chaves com valor não vazio no URL -> não faz nada (mantém o que está guardado)
pelo menos uma chave com valor                   -> substitui TUDO em sessionStorage["attr"] por
                                                    { ...chaves encontradas, landing_page: pathname }
```

- `?utm_source=` (valor vazio) conta como ausente.
- `landing_page` é o `pathname` tal como o Next o dá (`/`, `/contactos/`).
- Substituir tudo (não fundir) cumpre "novo clique num anúncio substitui os anteriores".
- Qualquer erro de `sessionStorage` (bloqueado, modo privado) é engolido: nunca parte a página.

### Envio (`MultiStepForm` e `MultiStepFormBlog`)

Depois do campo `Date`, acrescentar sempre, por esta ordem, os 12 campos:

| Campo | Valor |
|---|---|
| 10 chaves do URL | valor guardado em `attr`, ou `""` |
| `gclid` | guardado em `attr`; se vazio, cookie `_gcl_aw` (formato `GCL.<timestamp>.<gclid>` → tudo depois do 2.º ponto); senão `""` |
| `landing_page` | guardado em `attr`, ou `""` |
| `referrer` | `document.referrer` no momento do envio |

Nada mais muda no envio (URL do webhook, cabeçalhos, redirecionamento para `/obrigado`).
Se ler a atribuição falhar, o envio segue com os 12 campos vazios.

### Onde fica aplicado

`MultiStepForm` — homepage, `/contactos/`, `/inicie-o-seu-projeto/`, `/sobre-nos/`,
`/zonas-de-atuacao/`, `/projetos/[slug]/`, páginas do page builder (`/paginas/[slug]/`),
popup do header, popup `BotaoDesenvolverProjeto`.
`MultiStepFormBlog` — artigos do blog (`/[slug]/`).

### Estrutura de código

- `app/lib/attribution.ts` — funções puras testáveis (`parseAttribution`,
  `gclidFromGclAw`, `buildAttributionFields`) + invólucros de browser
  (`captureAttribution`, `appendAttribution(params: URLSearchParams)`).
- `app/components/AttributionCapture.tsx` — só liga o router ao `captureAttribution`.

---

## Parte 2 — CSP (`public/.htaccess`)

Só acrescentar origens; não remover nenhuma.

| Diretiva | Acrescentar |
|---|---|
| `script-src` | `https://capi-automation.s3.us-east-2.amazonaws.com`, Clarity (`https://www.clarity.ms`, `https://*.clarity.ms`), `https://analytics.ahrefs.com` |
| `connect-src` | `https://translate-pa.googleapis.com`, `https://*.clarity.ms`, `https://analytics.ahrefs.com` |
| `img-src` | `https://fonts.gstatic.com`, `https://*.clarity.ms`, `https://c.bing.com` |

A lista final é a que a consola confirmar (build local servido com o mesmo cabeçalho,
com consentimento aceite para os tags dispararem), e volta a ser confirmada no site
publicado. Se a consola mostrar outra origem destes mesmos serviços, entra; origens de
outros serviços não entram sem perguntar.

---

## Parte 3 — Formulário no blog

### Causa (confirmada)

1. `htmlToPortableText` (em `app/backoffice/page.tsx`) trata qualquer `<div>` como
   invólucro e guarda só o texto de dentro → o atributo `data-multistep-form` perde-se
   sempre. Dos 28 artigos no Sanity, 0 têm o marcador.
2. O botão insere com `execCommand("insertHTML")` no ponto do cursor; reproduzido no
   Chrome: dentro de um título, parágrafo ou item de lista, parte do texto provisório
   entra nesse bloco e o `div` pode ficar dentro do `li`.

O renderer do site (`app/[slug]/page.tsx`) já troca um bloco `style: "html"` com
`data-multistep-form` por `<MultiStepFormBlog />` — não muda.

### Formato guardado no Sanity (marcador canónico)

```json
{ "_type": "block", "_key": "<rand>", "style": "html", "markDefs": [],
  "children": [{ "_type": "span", "_key": "<rand>", "marks": [],
                 "text": "<div data-multistep-form=\"true\"></div>" }] }
```

### Editor

- **Inserir (modo visual):** o cartão entra como bloco de topo do editor, **nunca dentro**
  de título, parágrafo ou lista:
  - bloco de topo onde está o cursor é um parágrafo vazio → é substituído pelo cartão;
  - caso contrário → o cartão entra logo a seguir a esse bloco;
  - cursor fora do editor → o cartão entra no fim.
  - Depois do cartão fica um `<p><br></p>` com o cursor lá, para continuar a escrever.
- **Inserir (modo HTML):** acrescenta o cartão no fim, como hoje.
- **Cartão:** `div` com `data-multistep-form="true"` e `contenteditable="false"`, com o
  aspeto do `MultiStepFormBlog` (título "Interessado? Fale connosco!", barras de progresso
  com a primeira a verde `#86a941`, "Possui Terreno? *" com Sim/Não, botão "Seguinte") e uma
  legenda pequena: "Pré-visualização — o formulário real aparece no artigo publicado."
  Apaga-se como um bloco inteiro; não há texto lá dentro para editar.
- **Guardar (`htmlToPortableText`):**
  - elemento que é `[data-multistep-form]` → marcador canónico (o conteúdo do cartão nunca é guardado);
  - elemento que **contém** um `[data-multistep-form]` (casos antigos: dentro de `li`, `p`,
    `h2`, lista) → o cartão é retirado do elemento, o resto do elemento é processado
    normalmente e o marcador canónico entra logo a seguir.
- **Abrir para editar (`portableTextToHtml`):** bloco `html` com `data-multistep-form` →
  cartão (em vez do HTML cru), para que guardar outra vez mantenha o formulário.

### Estrutura de código

`portableTextToHtml`, `htmlToPortableText` e o HTML do cartão saem de
`app/backoffice/page.tsx` (3147 linhas) para `app/backoffice/portableTextHtml.ts`,
sem outras alterações de comportamento, para poderem ser testados isoladamente.

### Reparação dos 2 artigos (Sanity, produção)

Só depois de o código estar verificado, e com o patch exato mostrado ao utilizador antes de gravar:

| Artigo | Bloco | Alteração |
|---|---|---|
| `a-tua-casa-em-aco-leve-vai-ter-bom-isolamento-a-lei-ja-responde-a-isso-desde-2006` | `_key: vbpqnopa` (h2 só com o texto provisório) | Substituir pelo marcador canónico (mesma posição) |
| `arranha-ceus-madeira-europa-construcao-sustentavel` | índice 26 (item de lista com 10 spans) | Remover os 2 últimos spans ("Formulário de Contacto", "Este bloco será substituído…") e inserir o marcador canónico logo a seguir |

---

## Verificação

1. **Testes automáticos** (`node --test`, Node 24 com TS nativo; `jsdom` como devDependency
   explícita):
   - atribuição: captura com/sem parâmetros, valor vazio, substituição (teste 4 do briefing),
     `gclid` pelo cookie `_gcl_aw`, 12 campos sempre presentes;
   - conversores: cartão → marcador; marcador → cartão; ida e volta estável; cartão dentro
     de `li`/`h2` sai como bloco próprio sem texto provisório; nenhum outro tipo de bloco muda
     (comparação com a saída atual para HTML de artigos reais);
   - inserção do cartão nos contextos: parágrafo vazio, parágrafo com texto, título, item de lista.
2. **Site local** (`npm run build` + servir `out/` com o cabeçalho CSP do `.htaccess`), com o
   `fetch` ao webhook intercetado para ler o payload **sem criar leads no Pipedrive**:
   testes 1–4 do briefing; consola sem erros de CSP depois de aceitar cookies; artigo com
   marcador mostra o formulário real.
3. **Publicar** (push para `origin/master` + botão Publicar) só com OK explícito.
4. **Depois de publicado:** consola do site sem bloqueios CSP; os 2 artigos reparados
   mostram o formulário.
5. **Do lado da Evaplace:** teste 5 (iPhone/Safari real); um envio real para ver o payload
   no Make; no webhook do Make, «Redetermine data structure» para mapear os 12 campos novos
   no Pipedrive; teste visual do botão «Form» no backoffice.

---

## Entrega (secção 8 do briefing)

- Confirmação da implementação e da publicação.
- Lista de pontos de captura (secção "Onde fica aplicado").
- Exemplo de payload capturado no teste local; o payload real no Make fica confirmado pela Evaplace.

---

## Fora de âmbito

- Token Sanity com escrita exposto no JS público do `/backoffice/` (tarefa separada).
- Secção "Formulário Multi-Step" do page builder (`/paginas/`) — é outro mecanismo.
- O item de lista 26 do artigo `arranha-ceus…` já tinha título e parágrafos colados antes do
  formulário; só é retirado o texto provisório.
- Unificar `MultiStepForm` e `MultiStepFormBlog`.
- GTM, Consent Mode v2 e eventos de conversão (briefing: não mexer).
