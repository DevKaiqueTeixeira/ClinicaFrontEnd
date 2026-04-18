import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

type HighlightItem = {
  label: string;
  icon: ReactNode;
};

type AuthSplitLayoutProps = {
  badge: string;
  leftTitle: string;
  leftDescription: string;
  highlights: HighlightItem[];
  imageAlt: string;
  imageSrc: string;
  rightTitle: string;
  rightDescription: string;
  children: ReactNode;
};

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1621371236495-1520d8dc72a5?auto=format&fit=crop&w=900&q=80",
    label: "Atendimento humanizado",
  },
  {
    src: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80",
    label: "Equipe especializada",
  },
];

export default function AuthSplitLayout({
  badge,
  leftTitle,
  leftDescription,
  highlights,
  imageAlt,
  imageSrc,
  rightTitle,
  rightDescription,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-4 py-6 md:px-8 md:py-8">

      <main className="relative mx-auto grid w-full max-w-7xl overflow-hidden rounded-[28px] border border-zinc-300/80 bg-white/95 shadow-[0_30px_80px_rgba(0,0,0,0.16)] backdrop-blur lg:grid-cols-[1.2fr_1fr]">
        <section className="relative hidden min-h-[720px] p-8 lg:flex">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-br from-black/90 via-zinc-900/80 to-orange-700/65" />

          <div className="relative z-10 flex h-full max-w-lg flex-col justify-between text-white">
            <div className="space-y-5 text-white">
              <div className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs tracking-[0.18em] uppercase">
                {badge}
              </div>
              <h1 className="text-4xl leading-tight text-white drop-shadow-md">{leftTitle}</h1>
              <p className="max-w-md text-sm leading-relaxed text-white/85">{leftDescription}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs text-white/95">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/25 bg-white/10 p-3 backdrop-blur-sm"
                  >
                    <div className="mb-2 text-orange-100">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((item) => (
                  <div
                    key={item.src}
                    className="group overflow-hidden rounded-2xl border border-white/25 bg-black/20"
                  >
                    <div className="relative h-24 overflow-hidden">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="px-3 py-2 text-[11px] text-white/90">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-linear-to-b from-white via-zinc-50/60 to-zinc-100/60 p-5 sm:p-8 lg:p-10">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mx-auto max-w-md"
          >
            <div className="mb-7 text-center">
              <p className="mx-auto mb-3 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-700">
                Portal PetCare
              </p>
              <h2 className="text-3xl text-zinc-950">{rightTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{rightDescription}</p>
            </div>

            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
