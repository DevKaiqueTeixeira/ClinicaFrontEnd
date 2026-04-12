import { AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { Endereco } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

export default function EnderecoModal({
  open,
  enderecoSlotAtual,
  enderecoDraft,
  setEnderecoDraft,
  onClose,
  onSubmit,
}: {
  open: boolean;
  enderecoSlotAtual: 0 | 1;
  enderecoDraft: Endereco;
  setEnderecoDraft: Dispatch<SetStateAction<Endereco>>;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalShell title={`Endereco ${enderecoSlotAtual + 1}`} onClose={onClose}>
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-rua">
              Rua
            </label>
            <input
              id="endereco-rua"
              value={enderecoDraft.rua}
              onChange={(event) => setEnderecoDraft((current) => ({ ...current, rua: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-numero">
              Numero
            </label>
            <input
              id="endereco-numero"
              value={enderecoDraft.numero}
              onChange={(event) => setEnderecoDraft((current) => ({ ...current, numero: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-cep">
              CEP
            </label>
            <input
              id="endereco-cep"
              value={enderecoDraft.cep}
              onChange={(event) => setEnderecoDraft((current) => ({ ...current, cep: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-cidade">
              Cidade
            </label>
            <input
              id="endereco-cidade"
              value={enderecoDraft.cidade}
              onChange={(event) => setEnderecoDraft((current) => ({ ...current, cidade: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="w-full rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Salvar
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
