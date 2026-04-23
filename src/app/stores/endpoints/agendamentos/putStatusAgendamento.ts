import { buildApiUrl } from "@/lib/api";

export type PutStatusAgendamentoPayload = {
  status: string;
};

export async function putStatusAgendamento(
  agendamentoId: number,
  payload: PutStatusAgendamentoPayload
): Promise<Response> {
  return fetch(buildApiUrl(`/agendamentos/${agendamentoId}/status`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
