/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, LucideIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useLogin as useLoginApi } from "../hooks/useLogin";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// ============================================
// COMPONENTE FORM INPUT
// ============================================
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: LucideIcon;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, icon: Icon, className = "", ...props }, ref) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
            >
                <label className="block text-xs font-medium text-white/90 ml-1">
                    {label}
                </label>
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                            <Icon color="black" size={16} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full px-3 py-2.5 rounded-lg text-sm
              ${Icon ? "pl-9" : ""}
              bg-white/50 backdrop-blur-sm
              text-gray-800 placeholder-gray-500
              border-2 border-white/30
              focus:outline-none
              focus:border-orange-400
              focus:bg-white/70
              transition-all duration-200
              shadow-sm
              ${error ? "border-red-400" : ""}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-1 ml-1 mt-1"
                    >
                        <AlertCircle className=" flex text-red-500 w-4 h-4 shrink-0" />
                        <p className="text-white text-sm font-bold">{error}</p>
                    </motion.div>
                )}


            </motion.div>
        );
    }
);

FormInput.displayName = "FormInput";

// ============================================
// COMPONENTE PASSWORD INPUT
// ============================================
interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
            >
                <label className="block text-xs font-medium text-white/90 ml-1">
                    {label}
                </label>
                <div className="relative">
                    <div className=" absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock color="black" size={16} />
                    </div>
                    <input
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        className={`
              w-full px-3 py-2.5 rounded-lg text-sm pl-9 pr-10
              bg-white/50 backdrop-blur-sm
              text-gray-800 placeholder-gray-500
              border-2 border-white/30
              focus:outline-none
              focus:border-orange-400
              focus:bg-white/70
              transition-all duration-200
              shadow-sm
              ${error ? "border-red-400" : ""}
              ${className}
            `}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-1 ml-1 mt-1"
                    >
                        <AlertCircle className=" flex text-red-500 w-4 h-4 shrink-0" />
                        <p className="text-white text-sm font-bold">{error}</p>
                    </motion.div>
                )}
            </motion.div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

// ============================================
// COMPONENTE LOADING BUTTON
// ============================================
import { HTMLMotionProps } from "framer-motion";
import React from "react";
import Link from "next/link";


interface LoadingButtonProps extends HTMLMotionProps<"button"> {
    loading?: boolean;
    children: React.ReactNode;
}

export function LoadingButton({
    loading,
    children,
    className = "",
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
            whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
            disabled={loading || disabled}
            className={`
        w-full py-2.5 rounded-lg text-sm
        bg-linear-to-r from-orange-500 to-orange-600
        text-white font-semibold
        hover:from-orange-600 hover:to-orange-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        shadow-lg shadow-orange-500/30
        flex items-center justify-center gap-2
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {children}
        </motion.button>
    );
}



// ============================================
// SCHEMA DE VALIDAÇÃO
// ============================================
const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

// ============================================
// COMPONENTE PRINCIPAL - LOGIN
// ============================================
export default function LoginCliente() {

    useEffect(() => {
        async function buscarUsuario() {
            const res = await fetch("http://localhost:8080/clientes/user", {
                credentials: "include"
            });

            if (!res.ok) return;

            const data = await res.json();
            console.log("USUÁRIO:", data);
        }

        buscarUsuario();
    }, []);
    const { login: fazerLogin, loading } = useLoginApi();
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            senha: "",
        },
    });
    const onSubmit = async (data: LoginForm) => {

        try {
            const cliente = await fazerLogin(data);

            if (!cliente) {
                toast.error("Email ou senha incorretos.");
                return;
            }

            toast.success("Login realizado com sucesso!", {
                description: `Bem-vindo de volta, ${cliente.nome}!`,
            });

            reset();

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (err: any) {
            toast.error("Erro ao fazer login", {
                description: err.message || "Tente novamente.",
            });
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-linear-to-br from-orange-400 via-orange-500 to-orange-600">
            <Toaster position="top-center" richColors />

            {/* LADO ESQUERDO - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden"
            >
                {/* Background Image com overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1621371236495-1520d8dc72a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2xpbmljJTIwZG9nJTIwY2F0fGVufDF8fHx8MTc3NDY0MjMyMnww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Veterinary Clinic"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-orange-900/80 via-orange-800/70 to-orange-900/80 backdrop-blur-sm"></div>
                </div>

                {/* Conteúdo */}
                <div className="relative z-10 flex flex-col items-center text-center text-white px-8 max-w-md">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6"
                    >
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-12 h-12 text-white"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M12 6v12m-3-9a3 3 0 106 0 3 3 0 00-6 0zm0 9a3 3 0 106 0 3 3 0 00-6 0z" />
                                <circle cx="12" cy="9" r="8" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Clínica Veterinária</h1>
                        <div className="h-0.5 w-20 bg-white/50 rounded-full mx-auto"></div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <p className="text-lg text-orange-50 mb-4 leading-relaxed">
                            Bem-vindo de volta!
                        </p>
                        <p className="text-orange-100 text-sm mb-8">
                            Acesse sua conta e continue cuidando do seu pet com carinho.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="grid grid-cols-3 gap-4 w-full"
                    >
                        {[
                            { number: "2.5k+", text: "Clientes" },
                            { number: "98%", text: "Satisfação" },
                            { number: "24/7", text: "Suporte" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
                            >
                                <div className="text-2xl font-bold text-white mb-1">{item.number}</div>
                                <div className="text-[10px] text-orange-100">{item.text}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* LADO DIREITO - Formulário de Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-3"
                            >
                                <Lock className="text-white" size={24} />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Fazer Login
                            </h2>
                            <p className="text-orange-100 text-xs">
                                Entre com suas credenciais
                            </p>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <FormInput
                                        {...field}
                                        label="Email"
                                        type="email"
                                        placeholder="joao@exemplo.com"
                                        icon={Mail}
                                        error={errors.email?.message}
                                        autoComplete="email"
                                    />
                                )}
                            />

                            <Controller
                                name="senha"
                                control={control}
                                render={({ field }) => (
                                    <PasswordInput
                                        {...field}
                                        label="Senha"
                                        placeholder="••••••••"
                                        error={errors.senha?.message}
                                        autoComplete="current-password"
                                    />
                                )}
                            />

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 cursor-pointer text-white/90">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/30 bg-white/20 text-orange-500 focus:ring-orange-400 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span>Lembrar-me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toast.info("Funcionalidade em breve!")}
                                    className="text-white/90 hover:text-white underline transition-colors"
                                >
                                    Esqueci a senha
                                </button>
                            </div>

                            <div className="pt-2">
                                <LoadingButton loading={loading} type="submit">
                                    {loading ? "Entrando..." : "Entrar"}
                                    {!loading && <ArrowRight size={18} />}
                                </LoadingButton>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white/10 text-white/60 rounded-full">
                                    ou
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => {
                                    window.location.href = "http://localhost:8080/oauth2/authorization/google";
                                }}
                                className=" w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-all duration-200 border border-white/30"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </motion.button>

                        </div>

                        {/* Signup Link */}
                        <div className="text-center">
                            <p className="text-white/90 text-xs">
                                Não tem uma conta?{" "}
                                <Link href={"/"}>
                                    <button
                                        type="button"
                                        className="font-semibold text-white underline hover:text-orange-200 transition-colors"
                                    >
                                        Criar Conta
                                    </button>
                                </Link>
                            </p>
                        </div>

                        {/* Footer Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 pt-4 border-t border-white/20"
                        >
                            <p className="text-white/60 text-[10px] text-center">
                                Protegido por reCAPTCHA •{" "}
                                <button
                                    type="button"
                                    className="underline hover:text-white/80"
                                    onClick={() => toast.info("Política de privacidade")}
                                >
                                    Privacidade
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}