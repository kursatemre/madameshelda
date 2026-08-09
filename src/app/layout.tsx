import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://madameshelda.com";
const SITE_NAME = "Madame Shelda Design Art";
const SITE_TITLE = `${SITE_NAME} — El Yapımı Çiçek Tasarımları`;
const SITE_DESCRIPTION =
  "Soma, Manisa'da el yapımı dev çiçek tasarımları, özel sipariş ve workshop. Madame Shelda Design Art.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: "çiçek tasarımı, el yapımı, workshop, Soma, Manisa, özel sipariş",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-brown">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2c1f14",
              color: "#fdf8f3",
              border: "1px solid #5a3e2b",
              borderRadius: "0",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.85rem",
              letterSpacing: "0.03em",
            },
          }}
        />
      </body>
    </html>
  );
}
