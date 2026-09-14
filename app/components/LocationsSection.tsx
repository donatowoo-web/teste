import { client } from "@/sanity/lib/client";
import { PAGINAS_RETIRADAS } from "../lib/paginasRetiradas";

type LocationPage = {
  title: string;
  slug: string;
};

// Extrai o nome da cidade a partir do título da página
// ("Construção de casas em aço leve em Amarante" -> "Amarante")
function cityFromTitle(title: string): string {
  const markers = [" em ", " no ", " na "];
  let idx = -1;
  for (const m of markers) {
    const i = title.toLowerCase().lastIndexOf(m);
    if (i > idx) idx = i + m.length;
  }
  const city = idx > 0 ? title.slice(idx) : title;
  // Title-case leve (mantém "de/do/da/e" minúsculos)
  return city
    .split(" ")
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && ["de", "do", "da", "e"].includes(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

export default async function LocationsSection() {
  const pages = await client.fetch<LocationPage[]>(`
    *[
      _type == "page" &&
      published == true &&
      defined(slug.current) &&
      slug.current match "*aco-leve*" &&
      !(slug.current in $retiradas) &&
      !(_id in path("drafts.**"))
    ] | order(title asc){
      title,
      "slug": slug.current
    }
  `, { retiradas: PAGINAS_RETIRADAS });

  if (!pages || pages.length === 0) return null;

  return (
    <section
      style={{
        background: "#0a0a0a",
        padding: "80px 24px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2
          style={{
            color: "#fff",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            margin: "0 0 12px",
          }}
        >
          Construção em aço leve na sua zona
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(15px, 2vw, 18px)",
            margin: "0 0 36px",
            maxWidth: 680,
            lineHeight: 1.6,
          }}
        >
          Construímos em aço leve no distrito do Porto, no eixo de Braga e no
          norte de Aveiro. Veja a nossa construção de casas em aço leve (LSF)
          perto de si.
        </p>

        <div className="locGrid">
          {pages.map((p) => (
            <a key={p.slug} href={`/paginas/${p.slug}/`} className="locCard">
              <span className="locKicker">Construção em aço leve</span>
              <span className="locCity">{cityFromTitle(p.title)}</span>
              <span className="locArrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .locGrid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        /* A lista vem do Sanity e o número de concelhos muda. Quando a última
           linha fica incompleta, os cartões dessa linha esticam para a
           preencher — a grelha nunca fica com um buraco. */
        @media (min-width: 600px) and (max-width: 959px) {
          .locGrid { grid-template-columns: repeat(2, 1fr); }
          .locCard:nth-child(odd):last-child { grid-column: span 2; }
        }
        @media (min-width: 960px) {
          .locGrid { grid-template-columns: repeat(6, 1fr); }
          .locCard { grid-column: span 2; }
          .locCard:nth-child(3n+1):nth-last-child(2),
          .locCard:nth-child(3n+1):nth-last-child(2) + .locCard { grid-column: span 3; }
          .locCard:nth-child(3n+1):last-child { grid-column: span 6; }
        }
        .locCard {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 24px 22px;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .locCard:hover {
          background: #1c1c1c;
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
        .locKicker {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .locCity {
          font-size: 21px;
          font-weight: 400;
          color: #fff;
          line-height: 1.25;
        }
        .locArrow {
          margin-top: 8px;
          font-size: 20px;
          color: #b4d429;
        }
      `}</style>
    </section>
  );
}
