import { buildApiUrl } from "@/lib/api";

export type PostClientePayload = {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
};

export async function postCliente(payload: PostClientePayload): Promise<Response> {
  return fetch(buildApiUrl("/clientes"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
