"use client";
import { useState } from "react";
import { buildApiUrl } from "@/lib/api";

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

            const res = await fetch(buildApiUrl("/clientes"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

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
