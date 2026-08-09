import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "İptal ve İade Koşulları — Madame Shelda Design Art" };

export default async function IptalIadePage() {
  const { legal_return_policy } = await getSiteContent(["legal_return_policy"]);
  return <LegalPage content={legal_return_policy} />;
}
