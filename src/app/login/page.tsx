"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, PawPrint, ShieldCheck, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
        leftTitle="Acesse seu painel com uma experiencia mais profissional."
        leftDescription="Consulte historico, agendamentos e dados cadastrais do seu pet em um ambiente claro e organizado."
        imageAlt="Cachorro em atendimento clinico"
        imageSrc="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=80"
        rightTitle="Entrar na conta"
        rightDescription="Use seu email e senha para acessar seu portal personalizado."
        highlights={[
          { icon: <Stethoscope size={16} />, label: "Historico completo" },
          { icon: <ShieldCheck size={16} />, label: "Sessao segura" },
          { icon: <PawPrint size={16} />, label: "Gestao de varios pets" },
          { icon: <Mail size={16} />, label: "Lembretes importantes" },
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

          <div className="flex justify-end text-xs text-zinc-600">
            <button
              type="button"
              onClick={() => toast.info("Funcionalidade em breve")}
              className="font-medium text-orange-600 hover:text-orange-700"
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
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full bg-white px-3 text-xs text-zinc-400">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = getGoogleAuthorizationUrl();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-orange-200 hover:bg-orange-50"
        >
          <GoogleIcon />
          Continuar com Google
        </button>

        <p className="mt-5 text-center text-sm text-zinc-600">
          Ainda nao tem conta?{" "}
          <Link href="/" className="font-semibold text-orange-600 hover:text-orange-700">
            Criar cadastro
          </Link>
        </p>
      </AuthSplitLayout>

      <Link
        href="/medico"
        aria-label="Acessar tela do medico"
        title="Acessar tela do medico"
        className="fixed right-4 bottom-16 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300/85 bg-white/90 text-zinc-700 shadow-[0_10px_22px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 sm:right-6 sm:bottom-20"
      >
        <Stethoscope size={18} />
      </Link>
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
