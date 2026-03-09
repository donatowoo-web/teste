"use client";

export default function BackofficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#f5f5f5",
          overflowY: "auto",
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}
