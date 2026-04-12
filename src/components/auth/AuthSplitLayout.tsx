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
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-300/45 blur-3xl" />

      <main className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white/75 shadow-2xl shadow-slate-900/10 backdrop-blur-lg lg:grid-cols-[1.15fr_1fr]">
        <section className="relative hidden min-h-[640px] p-8 lg:flex">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-900/70 to-amber-700/45" />

          <div className="relative z-10 flex max-w-md flex-col justify-between text-white">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs tracking-wide">
                {badge}
              </div>
              <h1 className="text-4xl leading-tight">{leftTitle}</h1>
              <p className="text-sm text-white/85">{leftDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/25 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="mb-2">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-5 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-md"
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl text-slate-900">{rightTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{rightDescription}</p>
            </div>

            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
