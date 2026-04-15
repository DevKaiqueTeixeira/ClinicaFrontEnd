"use client";

import { useState } from "react";
import { postAuthLogin, type AuthLoginPayload } from "@/app/stores/endpoints/auth/postAuthLogin";

type Cliente = {
  nome: string;
  cpf: string;
  email: string;
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: AuthLoginPayload): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await postAuthLogin(data);

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erro ao fazer login");
      }

      const result: Cliente = await res.json();
      return result;

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
