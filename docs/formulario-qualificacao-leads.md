# Formulário geral: qualificação de leads (2026-11-10)

O formulário geral do site (popup "Desenvolver Projeto", Contactos, Início, Sobre Nós, Zonas de
Atuação, Inicie o seu Projeto, projetos, páginas do construtor e o cartão inserido nos artigos do
blog) passou a qualificar as leads com a mesma lógica do formulário do Meta.
O formulário de **recrutamento** (`CandidaturaPopup`) não foi alterado.

## Onde está

| Ficheiro | O quê |
|---|---|
| `app/lib/leadQualificacao.ts` | **Configuração** (concelhos por zona, mínimos por tipologia, intervalos de orçamento, textos) e a lógica pura |
| `app/components/LeadForm.tsx` | O formulário em etapas, envio ao Make e push no dataLayer |
| `app/components/MultiStepForm.tsx` / `MultiStepFormBlog.tsx` | Visual escuro (site) e claro (blog); só chamam o `LeadForm` |
| `app/lib/attribution.ts` + `AttributionCapture.tsx` | gclid/UTMs, agora a respeitar o consentimento de marketing |
| `tests/leadQualificacao.test.ts` | Os 9 casos pedidos + regras extra (`npm test`) |

Para mudar concelhos, orçamentos ou textos basta editar `LEAD_CONFIG` em `leadQualificacao.ts`.

## Perguntas

1. Onde vai construir? (lista de 58 concelhos com pesquisa + "Outro concelho"; com "Outro" pode escrever qual, opcional)
   - Zona 2: "Nesta zona só construímos em madeira. Tem interesse em madeira?" Sim → estrutura = madeira e salta a 2.
2. Que tipo de estrutura pretende? (Aço leve / Madeira)
3. Tem terreno? (Não → salta a 4)
4. Tem viabilidade confirmada? (Sim / Não / Não sei; informativo)
5. Que tipologia pretende? (T1 / T2 / T3 / T4 ou superior)
6. Que orçamento tem previsto? (sem IVA; intervalos conforme a estrutura)
7. Contactos: nome, telefone, email, RGPD (todos obrigatórios)

Todas as pessoas fazem todos os passos; a classificação nunca é mostrada.
Depois do envio vão para `/obrigado/` (texto já não promete contacto em 24 h).

## `lead_status`

| Valor | Quando |
|---|---|
| `qualificada` | Zona válida para a estrutura + terreno Sim + orçamento ≥ mínimo da tipologia |
| `fora_zona` | Outro concelho, ou Zona 2 sem interesse em madeira |
| `nao_qualificada_terreno` | Terreno Não |
| `nao_qualificada_orcamento` | Terreno Sim, orçamento abaixo do mínimo |

Se falharem vários: zona → terreno → orçamento.

## Envio para o Make (mesmo webhook de sempre, `application/x-www-form-urlencoded`)

Chaves antigas (mantidas com o mesmo nome, o cenário atual continua a funcionar):

| Chave | Exemplo | Nota |
|---|---|---|
| `Possuí Terreno?` | `Sim` | |
| `Concelho do terreno` | `Maia` / `Outro concelho: Lisboa` | agora é sempre preenchido |
| `Área de construção` | *(vazio)* | já não é perguntado |
| `Tipologia` | `T3` / `T4+` | |
| `Tipo de projeto` | *(vazio)* | já não é perguntado |
| `Nome`, `Email`, `Contacto`, `Privacidade`, `Date` | | iguais |

Chaves novas:

| Chave | Valores |
|---|---|
| `lead_status` | `qualificada`, `nao_qualificada_terreno`, `nao_qualificada_orcamento`, `fora_zona` |
| `lead_id` | id único da lead (igual ao do dataLayer; serve para cruzar conversões) |
| `form_id` | `lead_geral` (site) ou `lead_blog` (cartão nos artigos) |
| `concelho` | nome do concelho ou `Outro concelho` |
| `concelho_outro` | o que a pessoa escreveu em "Outro concelho" (pode vir vazio) |
| `zona` | `zona_1`, `zona_2`, `fora` |
| `interesse_madeira` | `sim`, `nao` ou vazio (só Zona 2) |
| `estrutura` | `aco_leve`, `madeira` |
| `estrutura_label` | `Aço leve (LSF)`, `Madeira` |
| `terreno` | `sim`, `nao` |
| `viabilidade` | `sim`, `nao`, `nao_sei` ou vazio (sem terreno) |
| `tipologia` | `T1`, `T2`, `T3`, `T4+` |
| `orcamento_intervalo` | ex. `139000_162000`, `0_75000`, `220000_mais` |
| `orcamento_label` | ex. `139.000 a 162.000 €` |
| `page_url` | URL da página onde o formulário foi enviado |

Campos de origem (já existiam, sempre presentes, vazios quando não há valor):
`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `matchtype`, `gclid`,
`gbraid`, `wbraid`, `fbclid`, `landing_page`, `referrer`.

Consentimento: só com consentimento de **marketing** no banner é que os valores ficam guardados
(sessionStorage) ao mudar de página. Sem ele, só seguem se a pessoa enviar na mesma página em que
aterrou (navegação interna sem recarregar).

## dataLayer

Um único push, só depois de o Make responder OK, antes de ir para `/obrigado/`:

```js
{
  event: 'evaplace_lead',
  lead_status: 'qualificada',      // ou nao_qualificada_terreno, nao_qualificada_orcamento, fora_zona
  zona: 'zona_1',                  // zona_1, zona_2, fora
  estrutura: 'aco_leve',           // aco_leve, madeira
  tipologia: 'T3',                 // T1, T2, T3, T4+
  orcamento_intervalo: '139000_162000',
  terreno: 'sim',                  // sim, nao
  viabilidade: 'sim',              // sim, nao, nao_sei, ou vazio
  form_id: 'lead_geral',           // lead_geral, lead_blog
  lead_id: '…'                     // útil como transaction_id na conversão do Google Ads
}
```

Sem nome, email nem telefone. O push usa `eventCallback` (espera até 1,5 s pelo GTM) para a
etiqueta disparar antes da mudança de página.

Nota para o GTM: a página `/obrigado/` continua a existir, por isso o que hoje dispara nela
continua a disparar para **todas** as leads até ser trocado pelo evento `evaplace_lead`.
