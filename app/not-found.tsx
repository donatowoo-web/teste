export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Poppins, system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: "clamp(80px, 15vw, 180px)",
          fontWeight: 700,
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        style={{
          color: "#fff",
          fontSize: "clamp(18px, 3vw, 28px)",
          fontWeight: 300,
          marginTop: "20px",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        Página não encontrada
      </p>
      <a
        href="/"
        style={{
          marginTop: "40px",
          padding: "14px 32px",
          backgroundColor: "#fff",
          color: "#000",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: 500,
          borderRadius: "0",
          transition: "opacity 0.2s",
        }}
      >
        Voltar ao início
      </a>
    </main>
  );
}
