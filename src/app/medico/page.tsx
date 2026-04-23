"use client";

import { ArrowLeft, Mail, Send, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import {
  getAgendamentos,
  type AgendamentoApiResponse,
} from "@/app/stores/endpoints/agendamentos/getAgendamentosByCliente";
import { putStatusAgendamento } from "@/app/stores/endpoints/agendamentos/putStatusAgendamento";

type ConsultaStatus = "pendente" | "confirmado" | "concluido" | "cancelado";

const STATUS_OPTIONS: ConsultaStatus[] = ["pendente", "confirmado", "concluido", "cancelado"];

function normalizeStatus(status: unknown): ConsultaStatus {
  if (typeof status !== "string") {
    return "pendente";
  }

  const normalized = status.trim().toLowerCase();
  if (STATUS_OPTIONS.includes(normalized as ConsultaStatus)) {
    return normalized as ConsultaStatus;
  }

  return "pendente";
}

function normalizeHora(hora: unknown): string {
  if (typeof hora !== "string" || !hora.trim()) {
    return "--:--";
  }

  const value = hora.trim();
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function statusLabel(status: ConsultaStatus): string {
  if (status === "confirmado") {
    return "Confirmado";
  }

  if (status === "concluido") {
    return "Concluido";
  }

  if (status === "cancelado") {
    return "Cancelado";
  }

  return "Pendente";
}

function statusPillClass(status: ConsultaStatus): string {
  if (status === "confirmado") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "concluido") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "cancelado") {
    return "bg-red-100 text-red-700";
  }

  return "bg-zinc-200 text-zinc-700";
}

export default function MedicoPage() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoApiResponse[]>([]);
  const [statusDraft, setStatusDraft] = useState<Record<number, ConsultaStatus>>({});
  const [receitaDraft, setReceitaDraft] = useState<Record<number, string>>({});
  const [savingStatus, setSavingStatus] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const carregarAgendamentos = async () => {
      try {
        const response = await getAgendamentos();

        if (!response.ok) {
          const message = (await response.text()).trim();
          throw new Error(message || "Nao foi possivel carregar os agendamentos.");
        }

        const data = (await response.json()) as AgendamentoApiResponse[];

        if (!active) {
          return;
        }

        setAgendamentos(data);
        setStatusDraft(
          data.reduce<Record<number, ConsultaStatus>>((acc, agendamento) => {
            acc[agendamento.id] = normalizeStatus(agendamento.status);
            return acc;
          }, {})
        );
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Nao foi possivel carregar os agendamentos.";
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void carregarAgendamentos();

    return () => {
      active = false;
    };
  }, []);

  const handleAtualizarStatus = async (agendamentoId: number) => {
    if (savingStatus[agendamentoId]) {
      return;
    }

    const status = statusDraft[agendamentoId] ?? "pendente";

    setSavingStatus((current) => ({ ...current, [agendamentoId]: true }));

    try {
      const response = await putStatusAgendamento(agendamentoId, { status });

      if (!response.ok) {
        const message = (await response.text()).trim();
        throw new Error(message || "Nao foi possivel atualizar o status.");
      }

      const atualizado = (await response.json()) as AgendamentoApiResponse;
      const statusAtualizado = normalizeStatus(atualizado.status);

      setAgendamentos((current) =>
        current.map((agendamento) =>
          agendamento.id === agendamentoId ? { ...agendamento, status: statusAtualizado } : agendamento
        )
      );
      setStatusDraft((current) => ({ ...current, [agendamentoId]: statusAtualizado }));

      toast.success(`Status atualizado para ${statusLabel(statusAtualizado).toLowerCase()}.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o status.";
      toast.error(message);
    } finally {
      setSavingStatus((current) => ({ ...current, [agendamentoId]: false }));
    }
  };

  const handleEnviarEmailPlaceholder = (agendamentoId: number) => {
    const texto = (receitaDraft[agendamentoId] ?? "").trim();

    if (!texto) {
      toast.warning("Preencha a receita antes de enviar.");
      return;
    }

    toast.info("Botao pronto. O envio por email sera implementado na proxima etapa.");
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-6 sm:px-6">
      <Toaster position="top-center" richColors />

      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Painel Medico</p>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Gestao de consultas</h1>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-orange-300 hover:text-orange-700"
            >
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>
          </div>
        </header>

        {loading ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-[0_12px_30px_rgba(0,0,0,0.07)]">
            Carregando consultas...
          </section>
        ) : agendamentos.length === 0 ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-[0_12px_30px_rgba(0,0,0,0.07)]">
            Nenhuma consulta encontrada.
          </section>
        ) : (
          <section className="space-y-4">
            {agendamentos.map((agendamento) => {
              const currentStatus = statusDraft[agendamento.id] ?? normalizeStatus(agendamento.status);
              const isSaving = savingStatus[agendamento.id] ?? false;

              return (
                <article
                  key={agendamento.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.07)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Consulta #{agendamento.id}</p>
                      <p className="text-xs text-zinc-500">
                        Cliente #{agendamento.clienteId} - Pet #{agendamento.petId}
                      </p>
                    </div>

                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusPillClass(currentStatus),
                      ].join(" ")}
                    >
                      {statusLabel(currentStatus)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-4">
                    <p>
                      <span className="font-semibold text-zinc-900">Tipo:</span> {agendamento.tipo}
                    </p>
                    <p>
                      <span className="font-semibold text-zinc-900">Data:</span> {formatDate(agendamento.data)}
                    </p>
                    <p>
                      <span className="font-semibold text-zinc-900">Hora:</span> {normalizeHora(agendamento.hora)}
                    </p>
                    <p>
                      <span className="font-semibold text-zinc-900">Veterinario:</span> {agendamento.veterinario || "A definir"}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[220px_auto] md:items-end">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600" htmlFor={`status-${agendamento.id}`}>
                        Alterar status
                      </label>
                      <select
                        id={`status-${agendamento.id}`}
                        value={currentStatus}
                        onChange={(event) =>
                          setStatusDraft((current) => ({
                            ...current,
                            [agendamento.id]: normalizeStatus(event.target.value),
                          }))
                        }
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAtualizarStatus(agendamento.id)}
                      disabled={isSaving}
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
                        isSaving
                          ? "cursor-not-allowed bg-zinc-400"
                          : "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                      ].join(" ")}
                    >
                      {isSaving ? "Salvando..." : "Atualizar status"}
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <label
                      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600"
                      htmlFor={`receita-${agendamento.id}`}
                    >
                      Receita medica (pronto para envio)
                    </label>
                    <textarea
                      id={`receita-${agendamento.id}`}
                      rows={4}
                      value={receitaDraft[agendamento.id] ?? ""}
                      onChange={(event) =>
                        setReceitaDraft((current) => ({
                          ...current,
                          [agendamento.id]: event.target.value,
                        }))
                      }
                      placeholder="Digite a receita medica para este atendimento..."
                      className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleEnviarEmailPlaceholder(agendamento.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-orange-300 hover:text-orange-700"
                      >
                        <Mail size={15} />
                        Enviar via email
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
