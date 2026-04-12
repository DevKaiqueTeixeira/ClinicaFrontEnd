import { AnimatePresence } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Endereco, PerfilForm } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

export default function PerfilModal({
  open,
  formPerfil,
  setFormPerfil,
  enderecos,
  onOpenEndereco,
  onRemoveEndereco,
  onClose,
  onSubmit,
}: {
  open: boolean;
  formPerfil: PerfilForm;
  setFormPerfil: Dispatch<SetStateAction<PerfilForm>>;
  enderecos: [Endereco | null, Endereco | null];
  onOpenEndereco: (slot: 0 | 1) => void;
  onRemoveEndereco: (slot: 0 | 1) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalShell title="Meu perfil" onClose={onClose}>
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="perfil-nome">
              Nome
            </label>
            <input
              id="perfil-nome"
              value={formPerfil.nome}
              onChange={(event) => setFormPerfil((current) => ({ ...current, nome: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="perfil-email">
              Email
            </label>
            <input
              id="perfil-email"
              type="email"
              value={formPerfil.email}
              onChange={(event) => setFormPerfil((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="perfil-cpf">
              CPF
            </label>
            <input
              id="perfil-cpf"
              value={formPerfil.cpf}
              onChange={(event) => setFormPerfil((current) => ({ ...current, cpf: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="000.000.000-00"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="perfil-telefone">
              Telefone
            </label>
            <input
              id="perfil-telefone"
              value={formPerfil.telefone}
              onChange={(event) => setFormPerfil((current) => ({ ...current, telefone: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="(11) 90000-0000"
            />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} />
              Enderecos
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {([0, 1] as const).map((slot) => {
                const endereco = enderecos[slot];

                return (
                  <div
                    key={slot}
                    className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-600"
                  >
                    {endereco ? (
                      <>
                        <p className="font-semibold text-slate-700">Endereco {slot + 1}</p>
                        <p>
                          {endereco.rua}, {endereco.numero}
                        </p>
                        <p>
                          {endereco.cidade} - {endereco.cep || "sem CEP"}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEndereco(slot)}
                            className="rounded bg-slate-200 px-2 py-1 font-medium text-slate-700"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveEndereco(slot)}
                            className="rounded bg-red-100 px-2 py-1 font-medium text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenEndereco(slot)}
                        className="flex w-full items-center justify-center gap-1 rounded-md border border-slate-200 px-2 py-2 font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                      >
                        <Plus size={13} />
                        Adicionar endereco {slot + 1}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
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
              Salvar perfil
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
