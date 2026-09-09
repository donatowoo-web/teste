// Remate das páginas de sistema construtivo: encaminha para a lista de
// concelhos em /zonas-de-atuacao/. Usado em /construcao-em-lsf/ e
// /construcao-em-madeira/.

export default function ZonasCta({
  texto = "Construímos no Norte do país e as zonas variam consoante o sistema construtivo.",
}: {
  texto?: string;
}) {
  return (
    <section
      style={{
        background: "#0a0a0a",
        padding: "64px 24px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "clamp(17px, 2.4vw, 22px)",
            fontWeight: 300,
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 640,
          }}
        >
          {texto}
        </p>
        <a
          href="/zonas-de-atuacao/"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#b4d429",
            color: "#000",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Ver zonas de atuação
        </a>
      </div>
    </section>
  );
}
