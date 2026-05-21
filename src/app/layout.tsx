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

export const metadata: Metadata = {
  title: "Madame Shelda Design Art — El Yapımı Çiçek Tasarımları",
  description:
    "Soma, Manisa'da el yapımı dev çiçek tasarımları, özel sipariş ve workshop. Madame Shelda Design Art.",
  keywords: "çiçek tasarımı, el yapımı, workshop, Soma, Manisa, özel sipariş",
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
