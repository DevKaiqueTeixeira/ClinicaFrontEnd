import { buildApiUrl } from "@/lib/api";

export async function deleteAgendamento(agendamentoId: number, clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/agendamentos/${agendamentoId}?clienteId=${clienteId}`), {
    method: "DELETE",
    credentials: "include",
  });
}
