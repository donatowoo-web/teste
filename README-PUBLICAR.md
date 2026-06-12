# Como publicar artigos no evaplace.pt

## O fluxo normal (dia-a-dia)

1. Abre `https://www.evaplace.pt/backoffice/` e entra.
2. Escreve/edita o artigo e **Guarda** (fica no Sanity).
3. Carrega em **Publicar**.
4. Aguarda ~2-4 minutos — a barra mostra "Na fila → A construir → Publicado com sucesso!".
5. O artigo está em evaplace.pt. Fim.

Não precisas de FileZilla nem de ter o PC ligado: quem constrói e envia o site
é o GitHub (workflow "Deploy to Server"), avisado pelo botão.

## Como funciona por trás

```
Botão Publicar ──> /api/trigger-deploy.php (no teu servidor)
                       │  (usa o token guardado em .github_token na RAIZ do FTP)
                       ▼
                   GitHub Actions: constrói o site (npm run build)
                       │
                       ▼
                   Envia por FTP (FTPS, porta 21) para a pasta out/ do servidor
                   Incremental: só sobe ficheiros que mudaram.
```

A barra de progresso lê o estado real no GitHub através de
`/api/deploy-status.php`.

## Estrutura real do servidor (FTP)

- Ligação: `km31109.keymachine.de:21`, utilizador `evaplaceftp`, **FTPS** (TLS).
- O site evaplace.pt é servido a partir da pasta **`out/`** (na raiz do FTP).
- O **token do GitHub** está em **`.github_token`** na raiz do FTP
  (um nível ACIMA de `out/`), por isso a web nunca lhe chega.
- A raiz tem muitos backups antigos (`out_old`, `out_bk`, `out_*.zip`, etc.) —
  não são usados pelo site; podem ser limpos um dia.

## Reverter o site (botão de emergência)

Antes de cada publicação **não** há swap de pastas (o FTP atualiza ficheiro a
ficheiro). Por isso o "reverter" rápido é repor um backup. Tens vários no
servidor (ex.: `out_06_05_bk`, `out_bk`, e os `.zip`). Em último recurso,
o FileZilla continua a funcionar: enviar uma versão antiga para `out/`.

Para uma reversão limpa, o mais simples é abrir o GitHub → Actions, encontrar
um deploy anterior que estava bom e... (como o build vem do código, basta
voltar o código atrás com `git revert` e carregar Publicar outra vez).

## Se o botão Publicar falhar (planos B)

1. **GitHub manual:** github.com/donatowoo-web/teste → Actions →
   "Deploy to Server" → Run workflow. Faz exatamente o mesmo que o botão.
2. **A partir do PC:** `./deploy.sh` na pasta do projeto (constrói e envia por SSH).
3. **FileZilla** (último recurso): enviar o conteúdo da pasta `out/` para `/www/out`.

## Peças do sistema

| Peça | Onde | Função |
|---|---|---|
| `public/api/trigger-deploy.php` | servidor, `out/api/` | recebe o clique e acorda o GitHub |
| `public/api/deploy-status.php` | servidor, `out/api/` | diz à barra de progresso como vai a construção |
| `.github_token` | servidor, **raiz do FTP** (fora de `out/`) | token do GitHub (Actions). PHP procura-o em vários caminhos |
| `.github/workflows/deploy.yml` | repo | o robô: build + envio por **FTP** |
| Secrets do repo no GitHub | github.com → repo → Settings → Secrets and variables → Actions | FTP_HOST, FTP_USER, FTP_PASSWORD, SANITY_WRITE_TOKEN, … |

## Se o token do GitHub expirar / mudar a password do FTP

- Botão dá **"GitHub respondeu 401"** → token do GitHub mudou: gerar novo e
  substituir o ficheiro `.github_token` na raiz do FTP (via FileZilla).
- Deploy falha no passo **FTP** → password do FTP mudou: atualizar o secret
  `FTP_PASSWORD` em github.com → repo → Settings → Secrets and variables → Actions.
