import { buildApiUrl } from "@/lib/api";

export async function getEnderecosByCliente(clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/enderecos/cliente/${clienteId}?t=${Date.now()}`), {
    credentials: "include",
    cache: "no-store",
  });
}
