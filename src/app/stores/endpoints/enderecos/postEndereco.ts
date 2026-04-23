import { buildApiUrl } from "@/lib/api";

export type EnderecoApiResponse = {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  pontoReferencia: string;
  tipoEndereco: string;
  clienteId: number;
};

export type PostEnderecoPayload = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  pontoReferencia: string;
  tipoEndereco: string;
  clienteId: number;
};

export async function postEndereco(payload: PostEnderecoPayload): Promise<Response> {
  return fetch(buildApiUrl("/enderecos"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
