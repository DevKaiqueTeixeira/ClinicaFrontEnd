import { buildApiUrl } from "@/lib/api";

export async function deletePet(petId: number, clienteId: number): Promise<Response> {
  return fetch(buildApiUrl(`/pets/${petId}?clienteId=${clienteId}`), {
    method: "DELETE",
    credentials: "include",
  });
}
