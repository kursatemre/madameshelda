import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { getSiteContent } from "@/lib/site-content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { general, newsletter } = await getSiteContent(["general", "newsletter"]);

  return (
    <>
      {general.search_console_verification && (
        <meta name="google-site-verification" content={general.search_console_verification} />
      )}

      {general.ga4_measurement_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${general.ga4_measurement_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${general.ga4_measurement_id}');`}
          </Script>
        </>
      )}

      {general.meta_pixel_id && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${general.meta_pixel_id}');
            fbq('track', 'PageView');`}
        </Script>
      )}

      <ClientProviders>
        <Header general={general} />
        <main className="flex-1">{children}</main>
        <Footer general={general} newsletter={newsletter} />
      </ClientProviders>
    </>
  );
}
