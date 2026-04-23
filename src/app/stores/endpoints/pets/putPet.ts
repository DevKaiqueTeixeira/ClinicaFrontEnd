import { buildApiUrl } from "@/lib/api";

export type PutPetPayload = {
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  dataNascimento: string;
  peso: number;
  cor: string;
  porte: string;
  observacoes: string;
  clienteId: number;
};

export async function putPet(petId: number, payload: PutPetPayload): Promise<Response> {
  return fetch(buildApiUrl(`/pets/${petId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
