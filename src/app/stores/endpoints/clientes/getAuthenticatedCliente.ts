import { buildApiUrl } from "@/lib/api";

export type AuthenticatedClienteResponse = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};

function buildAuthenticatedClienteUrl(): string {
  return buildApiUrl(`/clientes/user?t=${Date.now()}`);
}

export async function getAuthenticatedClienteClient(): Promise<Response> {
  return fetch(buildAuthenticatedClienteUrl(), {
    credentials: "include",
    cache: "no-store",
  });
}

export async function getAuthenticatedClienteServer(cookieHeader: string): Promise<Response> {
  return fetch(buildAuthenticatedClienteUrl(), {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
}
