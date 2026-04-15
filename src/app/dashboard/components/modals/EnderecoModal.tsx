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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-cep">
                CEP *
              </label>
              <input
                id="endereco-cep"
                value={enderecoDraft.cep}
                onChange={(event) => setEnderecoDraft((current) => ({ ...current, cep: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="00000-000"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-logradouro">
                Logradouro *
              </label>
              <input
                id="endereco-logradouro"
                value={enderecoDraft.logradouro}
                onChange={(event) => setEnderecoDraft((current) => ({ ...current, logradouro: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Rua, avenida, travessa..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-numero">
                  Numero *
                </label>
                <input
                  id="endereco-numero"
                  value={enderecoDraft.numero}
                  onChange={(event) => setEnderecoDraft((current) => ({ ...current, numero: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Ex: 123"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-complemento">
                  Complemento
                </label>
                <input
                  id="endereco-complemento"
                  value={enderecoDraft.complemento}
                  onChange={(event) => setEnderecoDraft((current) => ({ ...current, complemento: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Apto, bloco, casa..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-bairro">
                Bairro *
              </label>
              <input
                id="endereco-bairro"
                value={enderecoDraft.bairro}
                onChange={(event) => setEnderecoDraft((current) => ({ ...current, bairro: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-cidade">
                  Cidade *
                </label>
                <input
                  id="endereco-cidade"
                  value={enderecoDraft.cidade}
                  onChange={(event) => setEnderecoDraft((current) => ({ ...current, cidade: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-estado">
                  Estado (UF) *
                </label>
                <input
                  id="endereco-estado"
                  value={enderecoDraft.estado}
                  onChange={(event) =>
                    setEnderecoDraft((current) => ({ ...current, estado: event.target.value.toUpperCase() }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-pais">
                Pais *
              </label>
              <input
                id="endereco-pais"
                value={enderecoDraft.pais}
                onChange={(event) => setEnderecoDraft((current) => ({ ...current, pais: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Brasil"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-referencia">
                Ponto de referencia
              </label>
              <input
                id="endereco-referencia"
                value={enderecoDraft.pontoReferencia}
                onChange={(event) =>
                  setEnderecoDraft((current) => ({ ...current, pontoReferencia: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Proximo a..."
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="endereco-tipo">
                Tipo de endereco *
              </label>
              <select
                id="endereco-tipo"
                value={enderecoDraft.tipo}
                onChange={(event) => setEnderecoDraft((current) => ({ ...current, tipo: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Selecione o tipo</option>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Entrega">Entrega</option>
              </select>
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
              Salvar
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
