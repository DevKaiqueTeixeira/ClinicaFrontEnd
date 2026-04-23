import { buildApiUrl } from "@/lib/api";

export type PostAgendamentoPayload = {
  petId: number;
  clienteId: number;
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
  veterinario: string;
  status: string;
};

export async function postAgendamento(payload: PostAgendamentoPayload): Promise<Response> {
  return fetch(buildApiUrl("/agendamentos"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
