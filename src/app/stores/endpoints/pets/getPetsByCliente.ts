import { buildApiUrl } from "@/lib/api";

export async function getPetsByCliente(clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/pets/cliente/${clienteId}?t=${Date.now()}`), {
    credentials: "include",
    cache: "no-store",
  });
}
