/* eslint-disable @next/next/no-img-element */
"use client";

import { AlertCircle } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Shield, ArrowRight, Loader2, LucideIcon } from "lucide-react";
import { toast, Toaster } from "sonner";
import { HTMLMotionProps } from "framer-motion";
import { useCliente } from "@/app/hooks/useGetName";
import Link from "next/link";

// ============================================
// FUNÇÕES DE MÁSCARA
// ============================================
const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const removeMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

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
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 rounded-lg text-sm
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
// COMPONENTE LOADING BUTTON
// ============================================
interface LoadingButtonProps extends HTMLMotionProps<"button"> {
  loading?: boolean;
  children: React.ReactNode;
}

function LoadingButton({
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
const clienteSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  cpf: z
    .string()
    .min(14, "CPF inválido")
    .refine((val) => removeMask(val).length === 11, "CPF deve ter 11 dígitos"),
  email: z.string().email("Email inválido"),
  celular: z
    .string()
    .min(14, "Celular inválido")
    .refine(
      (val) => removeMask(val).length >= 10,
      "Celular deve ter pelo menos 10 dígitos"
    ),
  senha: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha muito longa"),
});

type ClienteForm = z.infer<typeof clienteSchema>;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function CadastroCliente() {

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
      const formData = {
        nome: data.nome,
        cpf: removeMask(data.cpf),
        email: data.email,
        senha: data.senha,
        celular: removeMask(data.celular), // 👈 conversão aqui
      };

      const response = await enviarCliente(formData);

      toast.success("Conta criada com sucesso!", {
        description: `Bem vindo(a), ${response.nome}!`,
      });

      reset();
    } catch (err: unknown) {
      let message = "Erro ao criar conta";

      if (err instanceof Error) {
        message = err.message;
      }

      toast.error("Erro ao criar conta", {
        description: message,
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
              Tecnologia e cuidado para o seu pet.
            </p>
            <p className="text-orange-100 text-xs">
              Agendamentos rápidos • Atendimento humanizado • Equipe especializada
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-3 w-full"
          >
            {[
              { icon: "🏥", text: "Consultas" },
              { icon: "💉", text: "Vacinas" },
              { icon: "🔬", text: "Exames" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-[10px] text-orange-100">{item.text}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* LADO DIREITO - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3"
              >
                <User className="text-white" size={22} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Criar Conta
              </h2>
              <p className="text-orange-100 text-xs">
                Junte-se a nós em segundos
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Nome Completo"
                    placeholder="João Silva"
                    icon={User}
                    error={errors.nome?.message}
                    autoComplete="name"
                  />
                )}
              />

              <Controller
                name="cpf"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormInput
                    {...field}
                    value={value}
                    onChange={(e) => onChange(maskCPF(e.target.value))}
                    label="CPF"
                    placeholder="000.000.000-00"
                    icon={Shield}
                    error={errors.cpf?.message}
                    autoComplete="off"
                  />
                )}
              />

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
                name="celular"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormInput
                    {...field}
                    value={value}
                    onChange={(e) => onChange(maskPhone(e.target.value))}
                    label="Celular"
                    placeholder="(00) 00000-0000"
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
                  <FormInput
                    {...field}
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.senha?.message}
                    autoComplete="new-password"
                  />
                )}
              />

              <div className="pt-1">
                <LoadingButton loading={loading} type="submit">
                  {loading ? "Criando conta..." : "Criar Conta"}
                  {!loading && <ArrowRight size={18} />}
                </LoadingButton>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <p className="text-white/90 text-xs">
                Já tem uma conta?{" "}
                <Link
                  href={"/login"}>
                  <button
                    type="button"
                    //  onClick={() => toast.info("Funcionalidade de login em breve!")}
                    className="font-semibold text-white underline hover:text-orange-200 transition-colors"

                  >
                    Fazer Login
                  </button>
                </Link>

              </p>
            </div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              <p className="text-white/60 text-[10px] text-center">
                Ao criar uma conta, você concorda com nossos{" "}
                <button
                  type="button"
                  className="underline hover:text-white/80"
                  onClick={() => toast.info("Termos de uso")}
                >
                  Termos de Uso
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}