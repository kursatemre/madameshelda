import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni — Madame Shelda Design Art" };

export default async function KvkkPage() {
  const { legal_kvkk } = await getSiteContent(["legal_kvkk"]);
  return <LegalPage content={legal_kvkk} />;
}
