import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi — Madame Shelda Design Art" };

export default async function MesafeliSatisSozlesmesiPage() {
  const { legal_distance_sales } = await getSiteContent(["legal_distance_sales"]);
  return <LegalPage content={legal_distance_sales} />;
}
