import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { ConsultaStatus } from "../dashboard.types";

export function SidebarButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: ReactNode;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition",
        active
          ? "bg-orange-100 text-orange-800 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.25)]"
          : "text-zinc-700 hover:bg-orange-50 hover:text-orange-700",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_12px_28px_rgba(16,16,16,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-orange-500 to-orange-800" />
      <div className="mb-2 inline-flex rounded-xl bg-orange-100 p-2 text-orange-700">{icon}</div>
      <p className="text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: ConsultaStatus }) {
  if (status === "confirmado") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700">
        <CheckCircle size={12} /> Confirmado
      </span>
    );
  }

  if (status === "pendente") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2 py-1 text-[11px] font-semibold text-zinc-700">
        <AlertCircle size={12} /> Pendente
      </span>
    );
  }

  if (status === "cancelado") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700">
        <XCircle size={12} /> Cancelado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-700 px-2 py-1 text-[11px] font-semibold text-white">
      <XCircle size={12} /> Concluido
    </span>
  );
}

export function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-orange-950/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-zinc-300 bg-white/98 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-zinc-950">{title}</h3>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
