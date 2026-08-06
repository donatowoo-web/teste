# Popup de aviso de férias — desenho

**Data:** 2026-08-06
**Projeto:** evaplace.pt (`meu-site`) — Next.js `output: "export"` + Sanity
**Estado:** aprovado

---

## Objetivo

Avisar quem visita evaplace.pt de que a empresa está de férias entre 17 e 31 de
agosto de 2026, através de um popup que aparece assim que a pessoa entra no site
e que cada visitante vê apenas uma vez.

---

## Decisões tomadas

| Decisão | Escolha | Porquê |
|---|---|---|
| Ordem face ao banner de cookies | Cookies primeiro, férias depois | O banner de cookies também é um modal e também dispara na primeira visita. Sobrepostos, ficam ilegíveis. Tratar o consentimento primeiro também é o correto do ponto de vista de RGPD. |
| Tempo verbal do texto | Futuro, uma versão só | O popup começa a 14 de agosto, três dias antes das férias. "Estamos de férias" seria falso nesses dias. Como cada pessoa só vê o popup uma vez, duas versões de texto não trariam ganho real. |
| Ações no popup | Só fechar | Decisão do cliente. Sem CTA para contactos ou orçamento. |
| Configuração | Constantes no código | Um aviso configurável no backoffice exigiria schema no Sanity e continuaria a precisar de rebuild a cada publicação — não poupa o passo mais caro. |

---

## Comportamento

### Quando abre

As três condições têm de ser verdade:

1. A data do dispositivo está entre **14/08/2026** (inclusive) e **01/09/2026** (exclusive)
2. Não existe o cookie `avisoFerias2026`
3. O visitante já respondeu ao banner de cookies (existe o cookie `cookieConsent`)

### Sequência ao montar o componente

```
fora da janela de datas       -> nunca abre, não faz mais nada
cookie avisoFerias2026 existe -> nunca abre, não faz mais nada
cookieConsent já existe       -> abre 600 ms depois
cookieConsent ainda não existe -> verifica de 500 em 500 ms;
                                  assim que aparecer, abre 600 ms depois;
                                  desiste ao fim de 90 s
```

Os 600 ms dão tempo ao banner de cookies para desaparecer antes de o popup
surgir. A desistência aos 90 s evita que o popup salte à cara de alguém que
ignorou o banner de cookies e já está a ler uma página.

O componente **observa** o cookie `cookieConsent`, mas **não altera nada** no
`CookieBanner.tsx`. O componente do RGPD fica intacto.

### Quando fecha

Botão "Compreendi", ✕, tecla Escape ou clique no fundo. **Todas as formas contam
como visto** e gravam o cookie — o popup não volta a aparecer nessa sessão nem
em visitas seguintes.

### Memória

Cookie `avisoFerias2026`, valor `"1"`, a expirar a 01/09/2026, `sameSite: Lax`,
`secure` quando em https. Mesmo padrão do `CookieBanner`.

"Uma vez por utilizador" significa **uma vez por browser**. Quem limpar os
cookies, usar janela anónima ou outro dispositivo volta a ver. Não há forma de
melhorar isto sem obrigar a autenticação.

### Onde aparece

Em qualquer página, porque é montado no `layout.tsx`. Cobre as 84 páginas do
site — incluindo quem entra diretamente num artigo do blog vindo do Google, que
é a maior fatia do tráfego de entrada.

### Fim de vida

A 1 de setembro de 2026 deixa de aparecer sozinho, pela condição de data. **Não
é preciso publicar nada para o desligar.** O componente pode ficar no código
para reutilizar noutro período, ou ser removido numa limpeza futura.

---

## Ficheiros

| Ficheiro | Ação |
|---|---|
| `app/components/AvisoFerias.tsx` | novo |
| `app/components/AvisoFerias.module.css` | novo |
| `app/layout.tsx` | uma linha de import e uma de montagem, a seguir a `<CookieBanner />` |

Reaproveita `app/components/Modal.tsx`, que já resolve portal, tecla Escape,
bloqueio de scroll do body e clique no fundo.

### Bloco de configuração

No topo de `AvisoFerias.tsx`, isolado e comentado, para que reutilizar noutro
período seja editar duas linhas:

```ts
const INICIO = "2026-08-14"; // primeiro dia em que aparece
const FIM    = "2026-09-01"; // deixa de aparecer neste dia
const COOKIE = "avisoFerias2026";
```

---

## Conteúdo

- **Título:** Vamos estar de férias
- **Texto:** De 17 a 31 de agosto. Regressamos a 1 de setembro.
- **Botão:** Compreendi

Sem links, sem formulário, sem imagem.

---

## Estilo

CSS Modules, como o resto do projeto. Segue o `Modal.module.css` e a linguagem
visual do `CookieBanner`: tipografia Poppins/Playfair já carregadas no layout.
Legível em telemóvel — o popup não deve ultrapassar a largura do ecrã nem exigir
scroll para chegar ao botão.

---

## Acessibilidade

O `Modal.tsx` já traz `role="dialog"` e `aria-modal="true"`. Acrescenta-se
`aria-labelledby` a apontar para o id do título, para que um leitor de ecrã
anuncie o popup corretamente ao abrir.

---

## Não faz parte (YAGNI)

- Configuração no backoffice ou no Sanity
- Segunda versão do texto durante as férias
- Botões de contacto, orçamento ou WhatsApp
- Contagem decrescente para o regresso
- Registo em analytics de quantas pessoas viram ou fecharam

---

## Limitações conhecidas

**A data vem do relógio do dispositivo do visitante.** O site é estático e não
há servidor para decidir isto. Alguém com o relógio errado vê o popup fora do
período. É raro e inofensivo, mas fica registado.

---

## Como testar

1. `npm run dev` (usar uma porta diferente da 3000, que colide com o outro projeto)
2. Apagar os cookies `cookieConsent` e `avisoFerias2026` nas ferramentas do browser
3. Recarregar: deve aparecer o banner de cookies **e mais nada**
4. Responder aos cookies: o popup de férias aparece pouco depois
5. Fechar e recarregar: **não** volta a aparecer
6. Apagar só `avisoFerias2026` e recarregar: volta a aparecer
7. Alterar `INICIO` para uma data futura e recarregar: **não** aparece
8. Confirmar em ecrã de telemóvel que o botão é alcançável sem scroll

---

## Deploy

Ao contrário de uma alteração ao `.htaccess`, isto é código e obriga a rebuild
do site:

```
commit -> push para github.com/donatowoo-web/teste (master) -> botão Publicar
```

**Risco conhecido a 2026-08-06:** o push está bloqueado por autenticação — o
remote é HTTPS e o Git Credential Manager exige uma janela interativa. Sem
resolver isso, o código fica escrito mas não chega ao ar. É pré-requisito da
implementação, não parte dela.
