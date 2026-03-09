import React from "react";

export default function PoliticaCookies() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.title}>Política de Cookies</h1>
          <p style={styles.subtitle}>
            Esta Política de Cookies explica como utilizamos cookies e tecnologias semelhantes no nosso website.
          </p>

          <p style={{ ...styles.subtitle, marginTop: 16 }}>
            <a href="/politica-de-cookies" style={styles.headerLink}>
              /politica-de-cookies
            </a>
          </p>
        </div>
      </header>

      <section style={styles.section}>
        <div style={styles.container}>
          <article style={styles.card}>
            <h2 style={styles.h2}>Definição de Cookies</h2>

            <p style={styles.p}>
              Cookies são ficheiros de dados enviados de um website que se está a visitar para o computador onde se
              está a fazê-lo. Este aglomerado de dados inclui informação que permite memorizar dados importantes, que
              tornarão a sua navegação mais eficiente e eficaz.
            </p>

            <p style={styles.p}>
              O website da Evaplace utiliza cookies para variadas finalidades, nomeadamente para obter dados de
              carácter não pessoal dos seus utilizadores.
            </p>

            <hr style={styles.hr} />

            <h2 style={styles.h2}>Forma de Utilização dos Cookies</h2>

            <p style={styles.p}>
              De forma a tornar as suas visitas ao nosso website o mais simples possíveis, é guardado automaticamente
              um registo do tipo de browser utilizado (como Google Chrome, Safari, Firefox, Internet Explorer) e do
              sistema operativo (como Windows ou macOS), bem como o nome do domínio do seu fornecedor de Internet.
            </p>

            <hr style={styles.hr} />

            <h2 style={styles.h2}>Finalidade dos Cookies</h2>

            <p style={styles.p}>
              Os cookies servem para ajudar a determinar a utilidade, interesse e número de utilizações do nosso
              website, permitindo uma navegação mais rápida e eficiente, eliminando a necessidade de introduzir
              repetidamente as mesmas informações.
            </p>

            <hr style={styles.hr} />

            <h2 style={styles.h2}>Tipos de Cookies Utilizados</h2>

            <ul style={styles.ul}>
              <li style={styles.li}>
                <strong>Cookies Permanentes:</strong> ficam armazenados ao nível do browser nos seus equipamentos de
                acesso (computador, telemóvel ou tablet) e são utilizados sempre que faz uma nova visita ao nosso
                website. Normalmente, são utilizados para direcionar a navegação em função dos seus interesses,
                permitindo-nos prestar um serviço mais personalizado.
              </li>

              <li style={styles.li}>
                <strong>Cookies de Sessão:</strong> são cookies temporários que permanecem no arquivo de cookies do
                seu browser até sair do website. A informação obtida permite a análise de padrões de tráfego na web,
                ajudando-nos a identificar problemas e a melhorar a experiência de navegação.
              </li>
            </ul>

            <hr style={styles.hr} />

            <h2 style={styles.h2}>Finalidade da Utilização de Cookies</h2>

            <ul style={styles.ul}>
              <li style={styles.li}>
                <strong>Cookies Estritamente Necessários:</strong> permitem que navegue no nosso website e utilize as
                respetivas funcionalidades, bem como aceder a áreas seguras do mesmo. Sem estes cookies, os serviços
                solicitados não podem ser prestados.
              </li>

              <li style={styles.li}>
                <strong>Cookies Analíticos:</strong> são utilizados anonimamente para fins de análises estatísticas,
                com vista a melhorar o funcionamento do nosso website.
              </li>

              <li style={styles.li}>
                <strong>Cookies de Funcionalidade:</strong> guardam as suas preferências relativamente à utilização do
                nosso website, evitando que tenha de o configurar novamente a cada visita.
              </li>

              <li style={styles.li}>
                <strong>Cookies de Terceiros:</strong> medem o sucesso de aplicações e a eficácia da publicidade de
                terceiros, podendo ainda ser utilizados para personalização de widgets com base nos seus dados.
              </li>

              <li style={styles.li}>
                <strong>Cookies de Publicidade:</strong> direcionam a publicidade em função dos seus interesses,
                limitando o número de vezes que o anúncio é exibido, ajudando a medir a eficácia da publicidade e da
                organização do website.
              </li>
            </ul>

            <hr style={styles.hr} />

            <h2 style={styles.h2}>Como Pode Gerir os Cookies</h2>

            <p style={styles.p}>
              Todos os browsers permitem aceitar, recusar ou apagar cookies através da seleção das definições
              apropriadas. Pode ainda configurar os cookies no menu “Opções” ou “Preferências” do browser que utilizar.
            </p>

            <p style={styles.p}>
              Ao desativar cookies, alguns serviços poderão não funcionar corretamente, afetando a experiência de
              navegação no nosso website.
            </p>

            <p style={styles.p}>
              Para informações adicionais sobre cookies e como impedir a sua instalação ou apagar cookies existentes,
              visite:{" "}
              <a
                href="http://www.allaboutcookies.org"
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                http://www.allaboutcookies.org
              </a>
            </p>

            <h3 style={styles.h3}>Gestão de Cookies por Navegador</h3>

            <ul style={styles.ul}>
              <li style={styles.li}>
                Internet Explorer:{" "}
                <a href="http://support.microsoft.com/kb/278835" target="_blank" rel="noreferrer" style={styles.link}>
                  http://support.microsoft.com/kb/278835
                </a>
              </li>
              <li style={styles.li}>
                Google Chrome:{" "}
                <a
                  href="https://www.google.com/chrome/intl/en-GB/more/privacy.html"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  https://www.google.com/chrome/intl/en-GB/more/privacy.html
                </a>
              </li>
              <li style={styles.li}>
                Firefox:{" "}
                <a
                  href="https://support.mozilla.org/en-US/kb/Clear%20Recent%20History"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  https://support.mozilla.org
                </a>
              </li>
              <li style={styles.li}>
                Safari:{" "}
                <a href="http://support.apple.com/kb/PH5042" target="_blank" rel="noreferrer" style={styles.link}>
                  http://support.apple.com/kb/PH5042
                </a>
              </li>
              <li style={styles.li}>
                Opera:{" "}
                <a href="http://www.opera.com/browser/tutorials/security/privacy/" target="_blank" rel="noreferrer" style={styles.link}>
                  http://www.opera.com/browser/tutorials/security/privacy/
                </a>
              </li>
            </ul>
          </article>

          <footer style={styles.footer}>
            <p style={styles.footerText}>© {new Date().getFullYear()} Evaplace. Todos os direitos reservados.</p>
          </footer>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    color: "#ffffff",
    background: "#000000",
    minHeight: "100vh",
  },
  header: {
    padding: "96px 0 64px",
    background: "#000000",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  container: {
    width: "min(960px, 92vw)",
    margin: "0 auto",
  },
  title: {
    fontSize: 40,
    fontWeight: 900,
    margin: 0,
  },
  subtitle: {
    marginTop: 14,
    opacity: 0.85,
    lineHeight: 1.7,
  },
  headerLink: {
    color: "#fff",
    textDecoration: "underline",
  },
  section: {
    padding: "40px 0 72px",
  },
  card: {
    background: "#0b0b0b",
    borderRadius: 18,
    padding: "28px 22px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  h2: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: 900,
  },
  h3: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: 800,
  },
  p: {
    margin: "12px 0",
    lineHeight: 1.8,
    opacity: 0.9,
  },
  ul: {
    margin: "12px 0 12px 18px",
  },
  li: {
    margin: "8px 0",
    lineHeight: 1.7,
  },
  link: {
    color: "#ffffff",
    textDecoration: "underline",
  },
  hr: {
    border: 0,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    margin: "22px 0",
  },
  footer: {
    paddingTop: 18,
  },
  footerText: {
    fontSize: 13,
    opacity: 0.6,
  },
};
