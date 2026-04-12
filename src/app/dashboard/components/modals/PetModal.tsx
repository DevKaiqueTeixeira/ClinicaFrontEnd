import { AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { PetForm } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

export default function PetModal({
  open,
  formPet,
  setFormPet,
  onClose,
  onSubmit,
}: {
  open: boolean;
  formPet: PetForm;
  setFormPet: Dispatch<SetStateAction<PetForm>>;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalShell title="Cadastrar pet" onClose={onClose}>
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="pet-nome">
              Nome *
            </label>
            <input
              id="pet-nome"
              value={formPet.nome}
              onChange={(event) => setFormPet((current) => ({ ...current, nome: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ex: Thor"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="pet-tipo">
              Tipo *
            </label>
            <select
              id="pet-tipo"
              value={formPet.tipo}
              onChange={(event) => setFormPet((current) => ({ ...current, tipo: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Selecione o tipo</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Coelho">Coelho</option>
              <option value="Passaro">Passaro</option>
              <option value="Hamster">Hamster</option>
            </select>

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="pet-raca">
              Raca
            </label>
            <input
              id="pet-raca"
              value={formPet.raca}
              onChange={(event) => setFormPet((current) => ({ ...current, raca: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ex: Golden Retriever"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="pet-idade">
              Idade
            </label>
            <input
              id="pet-idade"
              value={formPet.idade}
              onChange={(event) => setFormPet((current) => ({ ...current, idade: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ex: 4 anos"
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
              Cadastrar
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
