import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Workshoplar — Madame Shelda Design Art",
  description: "Soma, Manisa'da el yapımı çiçek sanatı workshopları. Kendi eserinizi yaratın.",
};

const bgByLevel: Record<string, string> = {
  "Başlangıç": "linear-gradient(135deg, #fdf8f3 0%, #f0dde4 60%, #d4b0be 100%)",
  "Orta":      "linear-gradient(135deg, #faf0f3 0%, #e8c99a 50%, #a07850 100%)",
  "İleri":     "linear-gradient(135deg, #f5eef0 0%, #c9a070 50%, #5c1a2e 100%)",
};

const mockWorkshops: { id: string; slug: string; title: string; description: string | null; level: string; duration_hours: number }[] = [
  { id: "1", slug: "baslangic-cicek-sanati", title: "Başlangıç Çiçek Sanatı", description: "Hiçbir deneyim gerekmez. Renk, form ve dokunuşla tanışın.", level: "Başlangıç", duration_hours: 3 },
  { id: "2", slug: "dev-cicek-duzenlemeleri", title: "Dev Çiçek Düzenlemeleri", description: "Mekânı dönüştüren büyük ölçekli tasarımların sırları.", level: "Orta", duration_hours: 4 },
  { id: "3", slug: "dogal-boyama-teknikleri", title: "Doğal Boyama", description: "Bitkisel pigmentlerle rengin diliyle konuşun.", level: "İleri", duration_hours: 5 },
];

export default async function WorkshoplarPage() {
  let workshops = mockWorkshops;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workshops")
      .select("id, slug, title, description, level, duration_hours")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (data && data.length > 0) workshops = data;
  } catch {}

  return (
    <>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 px-6 lg:px-12 bg-brown overflow-hidden relative">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]"
          viewBox="0 0 600 700"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse key={angle} cx="400" cy="350" rx="70" ry="220" fill="#ffffff" transform={`rotate(${angle} 400 350)`} />
          ))}
          <circle cx="400" cy="350" r="60" fill="#ffffff" />
        </svg>
        <div className="max-w-7xl mx-auto relative">
          <p className="font-label text-gold text-[0.65rem] mb-6">— Workshoplar</p>
          <h1 className="font-serif text-cream leading-[0.9] mb-8" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontStyle: "italic" }}>
            Ellerinizle<br /><span className="text-gold">yaratın.</span>
          </h1>
          <p className="text-cream/50 font-light text-sm lg:text-base leading-relaxed max-w-md">
            Soma, Manisa'daki atölyemizde; çiçek, form ve rengin diliyle buluşuyoruz.
            Her seviyeye açık, küçük gruplarla çalışıyoruz.
          </p>
        </div>
      </section>

      {/* Workshop Kartları */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">
            {workshops.map((ws, i) => (
              <Link
                key={ws.id}
                href={`/workshop/${ws.slug}`}
                className="group flex flex-col overflow-hidden border border-sand hover:border-gold/40 transition-all duration-500"
              >
                <div
                  className="h-52 relative overflow-hidden"
                  style={{ background: bgByLevel[ws.level] ?? bgByLevel["Başlangıç"] }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 300" fill="none" preserveAspectRatio="xMidYMid slice">
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <ellipse key={angle} cx="200" cy="150" rx="35" ry="110" fill="#5c1a2e" transform={`rotate(${angle} 200 150)`} />
                    ))}
                    <circle cx="200" cy="150" r="30" fill="#5c1a2e" />
                  </svg>
                  <div className="absolute top-4 left-4">
                    <span className="font-label text-[0.5rem] bg-cream/90 text-brown px-2.5 py-1">{ws.level}</span>
                  </div>
                  <div className="absolute top-4 right-4 font-label text-cream/40 text-[0.55rem]">0{i + 1}</div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <h2 className="font-serif text-[#1a1a1a] text-xl mb-3 group-hover:text-brown transition-colors duration-300" style={{ fontStyle: "italic" }}>
                    {ws.title}
                  </h2>
                  <p className="text-[#888480] font-light text-sm leading-relaxed flex-1">{ws.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-sand">
                    <span className="font-label text-[#888480] text-[0.6rem]">{ws.duration_hours} saat</span>
                    <span className="font-label text-gold text-[0.6rem] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                      Keşfet <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Alt bilgi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-sand pt-14">
            <div>
              <p className="font-label text-gold text-[0.6rem] mb-4">— Atölye Hakkında</p>
              <p className="text-[#888480] font-light text-sm leading-relaxed max-w-md">
                Workshoplarımız küçük gruplarla, kişisel ilgi odaklı yürütülür.
                Her katılımcı günün sonunda evine götürebileceği, tamamen kendine
                özgü bir eser yaratır.
              </p>
            </div>
            <div>
              <p className="font-label text-gold text-[0.6rem] mb-4">— Yer & Bilgi</p>
              <p className="text-[#888480] font-light text-sm leading-relaxed mb-6">
                Soma, Manisa · Özel atölye mekânımızda.
                <br />
                Program ve tarihler için iletişime geçin.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 bg-brown text-cream font-label text-[0.6rem] px-6 py-3 hover:bg-brown-light transition-colors duration-300 group"
              >
                Bilgi Al
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
