import { buildApiUrl } from "@/lib/api";
import type { AgendamentoApiResponse } from "@/app/stores/endpoints/agendamentos/getAgendamentosByCliente";

export type PostEnviarReceitaEmailPayload = {
  agendamentoId: number;
  texto: string;
};

export type ReceitaApiResponse = {
  id: number;
  agendamentoId: number;
  petId: number;
  clienteId: number;
  texto: string;
  emailDestino: string;
  criadaEm: string;
};

export type EnviarReceitaEmailResponse = {
  receita: ReceitaApiResponse;
  agendamento: AgendamentoApiResponse;
};

export async function postEnviarReceitaEmail(payload: PostEnviarReceitaEmailPayload): Promise<Response> {
  return fetch(buildApiUrl("/receitas/enviar-email"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
