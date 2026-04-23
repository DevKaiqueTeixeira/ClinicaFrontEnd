import { AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { PetForm } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

export default function PetModal({
  open,
  isEditing,
  isSubmitting,
  formPet,
  setFormPet,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  formPet: PetForm;
  setFormPet: Dispatch<SetStateAction<PetForm>>;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalShell title={isEditing ? "Atualizar pet" : "Cadastrar pet"} onClose={onClose}>
          <div className="space-y-3">
            <div>
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
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-especie">
                  Especie *
                </label>
                <select
                  id="pet-especie"
                  value={formPet.especie}
                  onChange={(event) => setFormPet((current) => ({ ...current, especie: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Selecione a especie</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Coelho">Coelho</option>
                  <option value="Passaro">Passaro</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-sexo">
                  Sexo *
                </label>
                <select
                  id="pet-sexo"
                  value={formPet.sexo}
                  onChange={(event) => setFormPet((current) => ({ ...current, sexo: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Selecione o sexo</option>
                  <option value="Macho">Macho</option>
                  <option value="Femea">Femea</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-raca">
                  Raca *
                </label>
                <input
                  id="pet-raca"
                  value={formPet.raca}
                  onChange={(event) => setFormPet((current) => ({ ...current, raca: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: Golden Retriever"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-data-nascimento">
                  Data de nascimento *
                </label>
                <input
                  id="pet-data-nascimento"
                  type="date"
                  value={formPet.dataNascimento}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(event) => setFormPet((current) => ({ ...current, dataNascimento: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-peso">
                  Peso (kg) *
                </label>
                <input
                  id="pet-peso"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formPet.peso}
                  onChange={(event) => setFormPet((current) => ({ ...current, peso: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: 12.40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-cor">
                  Cor *
                </label>
                <input
                  id="pet-cor"
                  value={formPet.cor}
                  onChange={(event) => setFormPet((current) => ({ ...current, cor: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: Caramelo"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-porte">
                Porte *
              </label>
              <select
                id="pet-porte"
                value={formPet.porte}
                onChange={(event) => setFormPet((current) => ({ ...current, porte: event.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              >
                <option value="">Selecione o porte</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Medio">Medio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="pet-observacoes">
                Observacoes
              </label>
              <textarea
                id="pet-observacoes"
                rows={3}
                value={formPet.observacoes}
                onChange={(event) => setFormPet((current) => ({ ...current, observacoes: event.target.value }))}
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                placeholder="Alergias, comportamento, cuidados especiais..."
              />
            </div>
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
              disabled={isSubmitting}
              className={[
                "w-full rounded-xl px-3 py-2 text-sm font-semibold text-white transition",
                isSubmitting
                  ? "cursor-not-allowed bg-zinc-400"
                  : "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
              ].join(" ")}
            >
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
