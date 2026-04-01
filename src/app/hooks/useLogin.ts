"use client";

import { useState } from "react";

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
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
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

        } catch (err: any) {
            setError(err.message || "Erro");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}