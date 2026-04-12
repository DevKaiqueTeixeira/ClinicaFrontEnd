"use client";

import { useState } from "react";
import { buildApiUrl } from "@/lib/api";

type LoginData = {
    email: string;
    senha: string;
};

type Cliente = {
    nome: string;
    cpf: string;
    email: string;
};

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginData): Promise<Cliente | null> => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(buildApiUrl("/auth/login"), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

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
