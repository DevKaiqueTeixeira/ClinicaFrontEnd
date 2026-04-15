"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Heart, Lock, Mail, PawPrint, Phone, Shield, Stethoscope, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useCliente } from "@/app/stores/useGetName";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";

const maskCPF = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");

const maskPhone = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

const removeMask = (value: string): string => value.replace(/\D/g, "");

const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  cpf: z
    .string()
    .min(14, "CPF invalido")
    .refine((value) => removeMask(value).length === 11, "CPF deve ter 11 digitos"),
  email: z.string().email("Email invalido"),
  celular: z
    .string()
    .min(14, "Celular invalido")
    .refine((value) => removeMask(value).length >= 10, "Celular deve ter pelo menos 10 digitos"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(50, "Senha muito longa"),
});

type ClienteForm = z.infer<typeof clienteSchema>;
type CadastroResponse = { nome?: string };

export default function CadastroCliente() {
  const router = useRouter();
  const { enviarCliente, loading } = useCliente();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      celular: "",
      senha: "",
    },
  });

  const onSubmit = async (data: ClienteForm) => {
    try {
      const response = (await enviarCliente({
        nome: data.nome,
        cpf: removeMask(data.cpf),
        email: data.email,
        senha: data.senha,
        celular: removeMask(data.celular),
      })) as CadastroResponse;

      toast.success("Conta criada com sucesso!", {
        description: `Bem-vindo(a), ${response.nome ?? data.nome}.`,
      });

      reset();
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Tente novamente em alguns segundos.";
      toast.error("Nao foi possivel criar sua conta", { description: message });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <AuthSplitLayout
        badge="Plataforma PetCare"
        leftTitle="Sua clinica digital para um cuidado mais humano."
        leftDescription="Crie seu acesso para agendar consultas, registrar historico e acompanhar a saude do seu pet em um unico lugar."
        imageAlt="Recepcao da clinica veterinaria"
        imageSrc="https://images.unsplash.com/photo-1621371236495-1520d8dc72a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2xpbmljJTIwZG9nJTIwY2F0fGVufDF8fHx8MTc3NDY0MjMyMnww&ixlib=rb-4.1.0&q=80&w=1080"
        rightTitle="Criar conta"
        rightDescription="Preencha os dados para acessar seu painel."
        highlights={[
          { icon: <PawPrint size={16} />, label: "Cadastro rapido" },
          { icon: <Stethoscope size={16} />, label: "Consultas" },
          { icon: <Shield size={16} />, label: "Dados seguros" },
          { icon: <Heart size={16} />, label: "Atencao continua" },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <FormField {...field} label="Nome completo" placeholder="Ana Silva" icon={User} error={errors.nome?.message} autoComplete="name" />
            )}
          />

          <Controller
            name="cpf"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormField
                {...field}
                value={value}
                onChange={(event) => onChange(maskCPF(event.target.value))}
                label="CPF"
                placeholder="000.000.000-00"
                icon={Shield}
                error={errors.cpf?.message}
              />
            )}
          />

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
            name="celular"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormField
                {...field}
                value={value}
                onChange={(event) => onChange(maskPhone(event.target.value))}
                label="Celular"
                placeholder="(11) 91234-5678"
                icon={Phone}
                error={errors.celular?.message}
                autoComplete="tel"
              />
            )}
          />

          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                label="Senha"
                type="password"
                placeholder="Minimo de 6 caracteres"
                icon={Lock}
                error={errors.senha?.message}
                autoComplete="new-password"
              />
            )}
          />

          <div className="pt-2">
            <SubmitButton loading={loading} type="submit">
              {loading ? "Criando conta..." : "Criar conta"}
              {!loading ? <ArrowRight size={16} /> : null}
            </SubmitButton>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Ja tem acesso?{" "}
          <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Fazer login
          </Link>
        </p>
      </AuthSplitLayout>
    </>
  );
}
