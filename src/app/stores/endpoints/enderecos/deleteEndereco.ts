import { buildApiUrl } from "@/lib/api";

export async function deleteEndereco(enderecoId: number, clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/enderecos/${enderecoId}?clienteId=${clienteId}`), {
    method: "DELETE",
    credentials: "include",
  });
}
