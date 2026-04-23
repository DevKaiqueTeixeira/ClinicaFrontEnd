import { buildApiUrl } from "@/lib/api";
import type { PostEnderecoPayload } from "./postEndereco";

export async function putEndereco(enderecoId: number, payload: PostEnderecoPayload): Promise<Response> {
  return fetch(buildApiUrl(`/enderecos/${enderecoId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}
