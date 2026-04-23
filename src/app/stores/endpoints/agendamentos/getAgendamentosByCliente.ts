import { buildApiUrl } from "@/lib/api";

export type AgendamentoApiResponse = {
  id: number;
  petId: number;
  clienteId: number;
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
  veterinario: string;
  status: string;
};

export async function getAgendamentosByCliente(clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/agendamentos/cliente/${clienteId}?t=${Date.now()}`), {
    credentials: "include",
    cache: "no-store",
  });
}

export async function getAgendamentos(): Promise<Response> {
  return fetch(buildApiUrl(`/agendamentos?t=${Date.now()}`), {
    credentials: "include",
    cache: "no-store",
  });
}
