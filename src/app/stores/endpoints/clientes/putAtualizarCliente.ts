import { buildApiUrl } from "@/lib/api";

export type PutAtualizarClientePayload = {
  nome: string;
  cpf: string;
  telefone: string;
};

export async function putAtualizarCliente(clienteId: number, payload: PutAtualizarClientePayload): Promise<Response> {
  return fetch(buildApiUrl(`/clientes/atualizarCliente/${clienteId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
