import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backoffice | EVAPLACE",
  robots: "noindex, nofollow",
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}
