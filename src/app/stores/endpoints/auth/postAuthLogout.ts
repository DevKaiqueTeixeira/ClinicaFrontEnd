import { buildApiUrl } from "@/lib/api";

export async function postAuthLogout(): Promise<Response> {
  return fetch(buildApiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
}
