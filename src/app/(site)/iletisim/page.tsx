import { Phone, Mail, MapPin } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";
import { IletisimForm } from "@/components/contact/IletisimForm";

function InstagramIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function IletisimPage() {
  const { general, contact_page } = await getSiteContent(["general", "contact_page"]);

  const infoItems = [
    { icon: Phone, label: "Telefon", value: general.phone, href: `tel:${general.phone.replace(/\s+/g, "")}` },
    { icon: Mail, label: "E-posta", value: general.email, href: `mailto:${general.email}` },
    { icon: MapPin, label: "Konum", value: general.address, href: "#" },
    { icon: InstagramIcon, label: "Instagram", value: general.instagram_handle, href: general.instagram_url },
  ];

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-sand">
        <div className="max-w-7xl mx-auto">
          <p className="font-label text-gold text-[0.65rem] mb-4">{contact_page.eyebrow}</p>
          <h1
            className="font-serif text-brown leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontStyle: "italic" }}
          >
            {contact_page.title_line1}
            <br />
            <span className="text-gold">{contact_page.title_line2}</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Info */}
          <div>
            <p className="text-brown/60 font-light text-sm leading-relaxed mb-12 max-w-sm">
              {contact_page.intro}
            </p>

            <div className="space-y-8">
              {infoItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-sand flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-label text-gold/70 text-[0.55rem] mb-1">
                      {label}
                    </p>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-brown font-light text-sm hover:text-gold transition-colors duration-300"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <IletisimForm />
          </div>
        </div>
      </section>
    </>
  );
}
