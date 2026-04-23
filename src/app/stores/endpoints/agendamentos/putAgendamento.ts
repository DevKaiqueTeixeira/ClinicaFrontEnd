import { buildApiUrl } from "@/lib/api";

export type PutAgendamentoPayload = {
  petId: number;
  clienteId: number;
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
  veterinario: string;
  status: string;
};

export async function putAgendamento(agendamentoId: number, payload: PutAgendamentoPayload): Promise<Response> {
  return fetch(buildApiUrl(`/agendamentos/${agendamentoId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
