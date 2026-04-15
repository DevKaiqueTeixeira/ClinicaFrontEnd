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
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition",
        active ? "bg-white text-teal-800" : "text-teal-50 hover:bg-white/10",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">{icon}</div>
      <p className="text-2xl text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: ConsultaStatus }) {
  if (status === "confirmado") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
        <CheckCircle size={12} /> Confirmado
      </span>
    );
  }

  if (status === "pendente") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">
        <AlertCircle size={12} /> Pendente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-slate-900">{title}</h3>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
