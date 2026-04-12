import { AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { ConsultaForm, Pet } from "../../dashboard.types";
import { ModalShell } from "../DashboardUI";

export default function AgendarConsultaModal({
  open,
  editingConsultaId,
  formConsulta,
  pets,
  setFormConsulta,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editingConsultaId: number | null;
  formConsulta: ConsultaForm;
  pets: Pet[];
  setFormConsulta: Dispatch<SetStateAction<ConsultaForm>>;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalShell title={editingConsultaId ? "Editar consulta" : "Agendar consulta"} onClose={onClose}>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="consulta-pet">
              Pet *
            </label>
            <select
              id="consulta-pet"
              value={formConsulta.petId}
              onChange={(event) => setFormConsulta((current) => ({ ...current, petId: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome} ({pet.tipo})
                </option>
              ))}
            </select>

            <label className="block text-xs font-semibold text-slate-700" htmlFor="consulta-tipo">
              Tipo de consulta *
            </label>
            <select
              id="consulta-tipo"
              value={formConsulta.tipo}
              onChange={(event) => setFormConsulta((current) => ({ ...current, tipo: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Selecione o tipo</option>
              <option value="Consulta de Rotina">Consulta de Rotina</option>
              <option value="Vacinacao">Vacinacao</option>
              <option value="Exame">Exame</option>
              <option value="Emergencia">Emergencia</option>
              <option value="Cirurgia">Cirurgia</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="consulta-data">
                  Data *
                </label>
                <input
                  id="consulta-data"
                  type="date"
                  value={formConsulta.data}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) => setFormConsulta((current) => ({ ...current, data: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="consulta-hora">
                  Horario *
                </label>
                <input
                  id="consulta-hora"
                  type="time"
                  value={formConsulta.hora}
                  onChange={(event) => setFormConsulta((current) => ({ ...current, hora: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <label className="block text-xs font-semibold text-slate-700" htmlFor="consulta-observacoes">
              Observacoes
            </label>
            <textarea
              id="consulta-observacoes"
              rows={3}
              value={formConsulta.observacoes}
              onChange={(event) => setFormConsulta((current) => ({ ...current, observacoes: event.target.value }))}
              placeholder="Informe sintomas, comportamento ou observacoes relevantes"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
              {editingConsultaId ? "Salvar" : "Agendar"}
            </button>
          </div>
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
