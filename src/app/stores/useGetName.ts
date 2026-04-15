"use client";

import { useState } from "react";
import { postCliente } from "@/app/stores/endpoints/clientes/postCliente";

type ClientePayload = {
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  senha: string;
};

export function useCliente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarCliente = async (cliente: ClientePayload) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nome: cliente.nome,
        cpf: cliente.cpf,
        email: cliente.email,
        senha: cliente.senha,
        telefone: cliente.celular,
      };

      const res = await postCliente(payload);

      if (!res.ok) {
        const mensagem = await res.text();
        throw new Error(mensagem);
      }

      const data = await res.json();
      return data;

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar cliente";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enviarCliente, loading, error };
}
