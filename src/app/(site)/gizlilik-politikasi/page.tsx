import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Gizlilik Politikası — Madame Shelda Design Art" };

export default async function GizlilikPolitikasiPage() {
  const { legal_privacy } = await getSiteContent(["legal_privacy"]);
  return <LegalPage content={legal_privacy} />;
}
