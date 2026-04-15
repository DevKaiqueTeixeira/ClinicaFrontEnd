import { buildApiUrl } from "@/lib/api";

export type AuthLoginPayload = {
  email: string;
  senha: string;
};

export async function postAuthLogin(payload: AuthLoginPayload): Promise<Response> {
  return fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
