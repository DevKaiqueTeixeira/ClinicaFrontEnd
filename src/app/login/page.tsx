"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, PawPrint, ShieldCheck, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { getGoogleAuthorizationUrl } from "@/app/stores/endpoints/auth/getGoogleAuthorizationUrl";
import { getAuthenticatedClienteClient } from "@/app/stores/endpoints/clientes/getAuthenticatedCliente";
import { useLogin as useLoginApi } from "@/app/stores/useLogin";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import FormField from "@/components/auth/FormField";
import PasswordField from "@/components/auth/PasswordField";
import SubmitButton from "@/components/auth/SubmitButton";

const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginCliente() {
  const router = useRouter();
  const { login: fazerLogin, loading } = useLoginApi();
  const [rememberMe, setRememberMe] = useState(false);

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

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await getAuthenticatedClienteClient();

        if (response.ok) {
          router.replace("/dashboard");
        }
      } catch {
        return;
      }
    };

    void validateSession();
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const cliente = await fazerLogin(data);

      if (!cliente) {
        toast.error("Email ou senha invalidos.");
        return;
      }

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo de volta, ${cliente.nome}.`,
      });

      reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Tente novamente em alguns segundos.";
      toast.error("Erro ao fazer login", { description: message });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <AuthSplitLayout
        badge="Portal do cliente"
        leftTitle="Acompanhe cada etapa do cuidado do seu pet."
        leftDescription="Acesse consultas, atualize dados e gerencie agendamentos em uma experiencia simples e segura."
        imageAlt="Tutor com seu pet em consulta"
        imageSrc="https://images.unsplash.com/photo-1621371236495-1520d8dc72a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2xpbmljJTIwZG9nJTIwY2F0fGVufDF8fHx8MTc3NDY0MjMyMnww&ixlib=rb-4.1.0&q=80&w=1080"
        rightTitle="Entrar na conta"
        rightDescription="Use seu email e senha para abrir seu painel."
        highlights={[
          { icon: <Stethoscope size={16} />, label: "Historico de atendimentos" },
          { icon: <ShieldCheck size={16} />, label: "Acesso seguro" },
          { icon: <PawPrint size={16} />, label: "Multiplos pets" },
          { icon: <Mail size={16} />, label: "Alertas por notificacao" },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                label="Email"
                type="email"
                placeholder="ana@email.com"
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
              <PasswordField
                {...field}
                label="Senha"
                placeholder="Digite sua senha"
                error={errors.senha?.message}
                autoComplete="current-password"
              />
            )}
          />

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-700"
              />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              onClick={() => toast.info("Funcionalidade em breve")}
              className="font-medium text-teal-700 hover:text-teal-800"
            >
              Esqueci a senha
            </button>
          </div>

          <div className="pt-2">
            <SubmitButton loading={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
              {!loading ? <ArrowRight size={16} /> : null}
            </SubmitButton>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full bg-white px-3 text-xs text-slate-400">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = getGoogleAuthorizationUrl();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
        >
          <GoogleIcon />
          Continuar com Google
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Ainda nao tem conta?{" "}
          <Link href="/" className="font-semibold text-teal-700 hover:text-teal-800">
            Criar cadastro
          </Link>
        </p>
      </AuthSplitLayout>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.95h5.5c-.24 1.26-.95 2.33-2 3.05l3.23 2.5c1.88-1.73 2.97-4.27 2.97-7.3 0-.67-.06-1.31-.17-1.93H12Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.61 0-4.83-1.76-5.62-4.12H3.04v2.58A10 10 0 0 0 12 22Z" />
      <path fill="#4A90E2" d="M6.38 13.91A6 6 0 0 1 6.05 12c0-.66.11-1.29.33-1.91V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.34-2.58Z" />
      <path fill="#FBBC05" d="M12 5.97c1.47 0 2.8.51 3.84 1.52l2.88-2.88C16.95 2.97 14.7 2 12 2a10 10 0 0 0-8.96 5.51l3.34 2.58c.79-2.36 3.01-4.12 5.62-4.12Z" />
    </svg>
  );
}
