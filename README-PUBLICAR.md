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
                       │  (usa o token guardado em /www/.github_token)
                       ▼
                   GitHub Actions: constrói o site (npm run build)
                       │
                       ▼
                   Envia por SSH para o servidor: /www/out  (site novo)
                   A versão anterior fica em /www/out_old  (backup)
```

A barra de progresso lê o estado real no GitHub através de
`/api/deploy-status.php`.

## Reverter o site (botão de emergência)

Se uma publicação correr mal, a versão anterior está guardada no servidor.
Para voltar atrás, corre no PC (Git Bash):

```bash
ssh -i ~/.ssh/id_ed25519 evaplace@km31109.keymachine.de \
  "cd /www && mv out out_broken && mv out_old out && mv out_broken out_old"
```

Isto troca o site atual pelo backup (e guarda o "mau" como out_old,
por isso correr 2x volta tudo ao que estava).

## Se o botão Publicar falhar (planos B)

1. **GitHub manual:** github.com/donatowoo-web/teste → Actions →
   "Deploy to Server" → Run workflow. Faz exatamente o mesmo que o botão.
2. **A partir do PC:** `./deploy.sh` na pasta do projeto (constrói e envia por SSH).
3. **FileZilla** (último recurso): enviar o conteúdo da pasta `out/` para `/www/out`.

## Peças do sistema

| Peça | Onde | Função |
|---|---|---|
| `public/api/trigger-deploy.php` | servidor, `/www/out/api/` | recebe o clique e acorda o GitHub |
| `public/api/deploy-status.php` | servidor, `/www/out/api/` | diz à barra de progresso como vai a construção |
| `/www/.github_token` | servidor (fora da pasta pública) | token fine-grained do GitHub (Actions: read/write, só o repo `teste`) |
| `.github/workflows/deploy.yml` | repo | o robô: build + envio por SSH |
| Secrets do repo no GitHub | github.com → Settings → Secrets | SSH_PRIVATE_KEY, SSH_HOST, SSH_USER, SANITY_WRITE_TOKEN, … |

## Se o token do GitHub expirar

O botão passa a dar "GitHub respondeu 401". Criar token novo em
github.com → Settings → Developer settings → Fine-grained tokens
(Repository access: só `donatowoo-web/teste`; Permissions: Actions = Read and write)
e substituir o conteúdo de `/www/.github_token` no servidor.
