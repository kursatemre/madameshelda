import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ClientProviders>
  );
}
