"use client";
import { useState } from "react";

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

            const res = await fetch("http://localhost:8080/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const mensagem = await res.text(); // 🔥 AQUI ESTÁ O SEGREDO
                throw new Error(mensagem);
            }

            const data = await res.json();
            return data;

        } catch (err: any) {
            setError(err.message); // 👈 agora pega a mensagem real
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { enviarCliente, loading, error };
}