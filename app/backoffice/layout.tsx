import { Metadata } from "next";
import BackofficeShell from "./BackofficeShell";

export const metadata: Metadata = {
  title: "Backoffice | EVAPLACE",
  robots: "noindex, nofollow",
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BackofficeShell>{children}</BackofficeShell>;
}
