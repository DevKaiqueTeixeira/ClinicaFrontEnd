import { buildApiUrl } from "@/lib/api";

export type PostPetPayload = {
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

export async function postPet(payload: PostPetPayload): Promise<Response> {
  return fetch(buildApiUrl("/pets"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
