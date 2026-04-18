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
            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-nome">
              Nome *
            </label>
            <input
              id="pet-nome"
              value={formPet.nome}
              onChange={(event) => setFormPet((current) => ({ ...current, nome: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              placeholder="Ex: Thor"
            />

            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-tipo">
              Tipo *
            </label>
            <select
              id="pet-tipo"
              value={formPet.tipo}
              onChange={(event) => setFormPet((current) => ({ ...current, tipo: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
            >
              <option value="">Selecione o tipo</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Coelho">Coelho</option>
              <option value="Passaro">Passaro</option>
              <option value="Hamster">Hamster</option>
            </select>

            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-raca">
              Raca
            </label>
            <input
              id="pet-raca"
              value={formPet.raca}
              onChange={(event) => setFormPet((current) => ({ ...current, raca: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              placeholder="Ex: Golden Retriever"
            />

            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-idade">
              Idade
            </label>
            <input
              id="pet-idade"
              value={formPet.idade}
              onChange={(event) => setFormPet((current) => ({ ...current, idade: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              placeholder="Ex: 4 anos"
            />
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="w-full rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-orange-700"
            >
              Cadastrar
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
