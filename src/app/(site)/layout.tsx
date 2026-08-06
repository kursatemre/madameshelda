import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { getSiteContent } from "@/lib/site-content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { general } = await getSiteContent(["general"]);

  return (
    <ClientProviders>
      <Header general={general} />
      <main className="flex-1">{children}</main>
      <Footer general={general} />
    </ClientProviders>
  );
}
