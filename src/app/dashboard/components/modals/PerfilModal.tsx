import { AnimatePresence } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Endereco, PerfilForm } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

const maskPhone = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

export default function PerfilModal({
  open,
  formPerfil,
  setFormPerfil,
  enderecos,
  isEnderecoBusy,
  onOpenEndereco,
  onRemoveEndereco,
  onClose,
  onSubmit,
}: {
  open: boolean;
  formPerfil: PerfilForm;
  setFormPerfil: Dispatch<SetStateAction<PerfilForm>>;
  enderecos: [Endereco | null, Endereco | null];
  isEnderecoBusy: boolean;
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
            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="perfil-nome">
              Nome
            </label>
            <input
              id="perfil-nome"
              value={formPerfil.nome}
              onChange={(event) => setFormPerfil((current) => ({ ...current, nome: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
            />

            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="perfil-cpf">
              CPF
            </label>
            <input
              id="perfil-cpf"
              value={formPerfil.cpf}
              onChange={(event) => setFormPerfil((current) => ({ ...current, cpf: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              placeholder="000.000.000-00"
            />

            <label className="mb-1 block text-xs font-semibold text-zinc-700" htmlFor="perfil-telefone">
              Telefone
            </label>
            <input
              id="perfil-telefone"
              value={formPerfil.telefone}
              onChange={(event) =>
                setFormPerfil((current) => ({ ...current, telefone: maskPhone(event.target.value) }))
              }
              inputMode="numeric"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
              placeholder="(11) 90000-0000"
            />
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <MapPin size={16} />
              Enderecos
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {([0, 1] as const).map((slot) => {
                const endereco = enderecos[slot];

                return (
                  <div
                    key={slot}
                    className="rounded-lg border border-dashed border-zinc-300 bg-white p-3 text-xs text-zinc-600"
                  >
                    {endereco ? (
                      <>
                        <p className="font-semibold text-zinc-700">Endereco {slot + 1}</p>
                        <p className="mt-1 inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                          {endereco.tipo || "Tipo nao informado"}
                        </p>
                        <p>
                          {endereco.logradouro}, {endereco.numero}
                          {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                        </p>
                        <p>
                          {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                        </p>
                        <p>
                          CEP: {endereco.cep || "sem CEP"} - {endereco.pais || "pais nao informado"}
                        </p>
                        {endereco.pontoReferencia ? <p>Ref.: {endereco.pontoReferencia}</p> : null}
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEndereco(slot)}
                            disabled={isEnderecoBusy}
                            className="rounded-md bg-zinc-200 px-2 py-1 font-medium text-zinc-700 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveEndereco(slot)}
                            disabled={isEnderecoBusy}
                            className="rounded-md bg-orange-100 px-2 py-1 font-medium text-orange-700 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remover
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenEndereco(slot)}
                        disabled={isEnderecoBusy}
                        className="flex w-full items-center justify-center gap-1 rounded-md border border-zinc-200 px-2 py-2 font-medium text-zinc-600 transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="w-full rounded-xl bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="w-full rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-orange-700"
            >
              Salvar perfil
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
