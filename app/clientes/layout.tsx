import HideShell from "./HideShell";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HideShell />
      {children}
    </>
  );
}
