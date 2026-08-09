import type { LegalDocContent } from "@/lib/site-content-defaults";

export function LegalPage({ content }: { content: LegalDocContent }) {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <h1
          className="font-serif text-brown leading-tight mb-10"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontStyle: "italic" }}
        >
          {content.title}
        </h1>
        <div
          className="text-brown/70 font-light text-sm leading-relaxed"
          style={{ whiteSpace: "pre-line" }}
        >
          {content.content}
        </div>
      </div>
    </section>
  );
}
