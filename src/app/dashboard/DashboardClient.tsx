"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { postAuthLogout } from "@/app/stores/endpoints/auth/postAuthLogout";
import { postEndereco } from "@/app/stores/endpoints/enderecos/postEndereco";
import { putAtualizarCliente } from "@/app/stores/endpoints/clientes/putAtualizarCliente";
import {
  EMPTY_CONSULTA_FORM,
  EMPTY_ENDERECO,
  EMPTY_PET_FORM,
  PET_EMOJI_MAP,
  getNextId,
  initialConsultas,
  initialPets,
} from "./dashboard.data";
import type {
  Cliente,
  Consulta,
  ConsultaForm,
  Endereco,
  PerfilForm,
  Pet,
  PetForm,
} from "./dashboard.types";
import {
  default as AgendarConsultaModal,
} from "./components/modals/AgendarConsultaModal";
import { default as PetModal } from "./components/modals/PetModal";
import { default as PerfilModal } from "./components/modals/PerfilModal";
import { default as EnderecoModal } from "./components/modals/EnderecoModal";
import {
  ConsultasSection,
  DashboardHeader,
  DashboardSidebar,
  DashboardStats,
  PetsSection,
} from "./components/DashboardSections";

export type { Cliente };

const CLIENTE_PROFILE_OVERRIDE_KEY = "petcare_cliente_profile_override";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeCpf(value: unknown): string {
  const cpf = normalizeText(value);
  return cpf.toUpperCase().startsWith("GOOGLE_") ? "" : cpf;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function maskPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

function loadClienteProfileOverride(clienteId: number): { nome: string; cpf: string; telefone: string } | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CLIENTE_PROFILE_OVERRIDE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      id?: number;
      nome?: string;
      cpf?: string;
      telefone?: string;
    };

    if (
      parsed.id !== clienteId ||
      typeof parsed.nome !== "string" ||
      typeof parsed.cpf !== "string" ||
      typeof parsed.telefone !== "string"
    ) {
      return null;
    }

    return {
      nome: parsed.nome,
      cpf: parsed.cpf,
      telefone: parsed.telefone,
    };
  } catch {
    return null;
  }
}

function saveClienteProfileOverride(clienteId: number, payload: { nome: string; cpf: string; telefone: string }): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CLIENTE_PROFILE_OVERRIDE_KEY,
    JSON.stringify({
      id: clienteId,
      ...payload,
    })
  );
}

function clearClienteProfileOverride(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CLIENTE_PROFILE_OVERRIDE_KEY);
}

function normalizeCliente(cliente: Cliente): Cliente {
  return {
    ...cliente,
    cpf: sanitizeCpf((cliente as { cpf?: unknown }).cpf),
    telefone: normalizeText((cliente as { telefone?: unknown }).telefone),
  };
}

export default function DashboardClient({ initialCliente }: { initialCliente: Cliente }) {
  const router = useRouter();
  const initialClienteNormalizado = normalizeCliente(initialCliente);

  const [cliente, setCliente] = useState<Cliente>(initialClienteNormalizado);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [consultas, setConsultas] = useState<Consulta[]>(initialConsultas);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);

  const [editingConsultaId, setEditingConsultaId] = useState<number | null>(null);

  const [formPerfil, setFormPerfil] = useState<PerfilForm>({
    nome: initialClienteNormalizado.nome ?? "",
    cpf: initialClienteNormalizado.cpf ?? "",
    telefone: maskPhone(initialClienteNormalizado.telefone ?? ""),
  });
  const [formConsulta, setFormConsulta] = useState<ConsultaForm>({ ...EMPTY_CONSULTA_FORM });
  const [formPet, setFormPet] = useState<PetForm>({ ...EMPTY_PET_FORM });

  const [enderecos, setEnderecos] = useState<[Endereco | null, Endereco | null]>([null, null]);
  const [enderecoSlotAtual, setEnderecoSlotAtual] = useState<0 | 1>(0);
  const [enderecoDraft, setEnderecoDraft] = useState<Endereco>({ ...EMPTY_ENDERECO });

  useEffect(() => {
    const override = loadClienteProfileOverride(initialClienteNormalizado.id);
    if (!override) {
      return;
    }

    setCliente((current) => ({
      ...current,
      nome: override.nome,
      cpf: override.cpf,
      telefone: override.telefone,
    }));
  }, [initialClienteNormalizado.id]);

  const consultasPendentes = consultas.filter(
    (consulta) => consulta.status === "pendente" || consulta.status === "confirmado"
  ).length;
  const consultasConcluidas = consultas.filter((consulta) => consulta.status === "concluido").length;
  const clientePrimeiroNome = normalizeText(cliente.nome).split(" ").filter(Boolean)[0] || "Cliente";
  const hasEnderecoCadastrado = enderecos.some((endereco) => endereco !== null);
  const cadastroCompleto =
    hasEnderecoCadastrado &&
    Boolean(sanitizeCpf(cliente.cpf).trim()) &&
    Boolean(normalizeText(cliente.telefone).trim());

  const closeAgendarModal = () => {
    setShowAgendarModal(false);
    setEditingConsultaId(null);
    setFormConsulta({ ...EMPTY_CONSULTA_FORM });
  };

  const closePetModal = () => {
    setShowPetModal(false);
    setFormPet({ ...EMPTY_PET_FORM });
  };

  const closeEnderecoModal = () => {
    setShowEnderecoModal(false);
    setEnderecoDraft({ ...EMPTY_ENDERECO });
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setSidebarOpen(false);

    if (menu === "agendar") {
      if (!cadastroCompleto) {
        toast.warning("Conclua seu cadastro no perfil para agendar consultas.");
        return;
      }
      setShowAgendarModal(true);
    }

    if (menu === "perfil") {
      setFormPerfil({
        nome: cliente.nome,
        cpf: sanitizeCpf(cliente.cpf),
        telefone: maskPhone(normalizeText(cliente.telefone)),
      });
      setShowPerfilModal(true);
    }
  };

  const handleOpenPets = () => {
    setActiveMenu("pets");
    setSidebarOpen(false);
    setShowPetModal(true);
  };

  const handleLogout = async () => {
    try {
      await postAuthLogout();
    } catch {
      toast.warning("Nao foi possivel confirmar logout no servidor.");
    } finally {
      clearClienteProfileOverride();
      router.replace("/login");
    }
  };

  const handleAgendarConsulta = () => {
    if (!formConsulta.petId || !formConsulta.tipo || !formConsulta.data || !formConsulta.hora) {
      toast.error("Preencha os campos obrigatorios da consulta.");
      return;
    }

    const pet = pets.find((item) => item.id === Number(formConsulta.petId));
    if (!pet) {
      toast.error("Selecione um pet valido.");
      return;
    }

    if (editingConsultaId) {
      setConsultas((current) =>
        current.map((consulta) =>
          consulta.id === editingConsultaId
            ? {
              ...consulta,
              petId: pet.id,
              petNome: pet.nome,
              tipo: formConsulta.tipo,
              data: formConsulta.data,
              hora: formConsulta.hora,
              observacoes: formConsulta.observacoes,
            }
            : consulta
        )
      );
      toast.success("Consulta atualizada com sucesso.");
    } else {
      const novaConsulta: Consulta = {
        id: getNextId(consultas),
        petId: pet.id,
        petNome: pet.nome,
        tipo: formConsulta.tipo,
        data: formConsulta.data,
        hora: formConsulta.hora,
        veterinario: "A definir",
        status: "pendente",
        observacoes: formConsulta.observacoes,
      };

      setConsultas((current) => [novaConsulta, ...current]);
      toast.success("Consulta agendada com sucesso.");
    }

    closeAgendarModal();
  };

  const handleEditarConsulta = (consulta: Consulta) => {
    setFormConsulta({
      petId: String(consulta.petId),
      tipo: consulta.tipo,
      data: consulta.data,
      hora: consulta.hora,
      observacoes: consulta.observacoes,
    });
    setEditingConsultaId(consulta.id);
    setShowAgendarModal(true);
  };

  const handleCancelarConsulta = (id: number) => {
    setConsultas((current) => current.filter((consulta) => consulta.id !== id));
    toast.success("Consulta cancelada.");
  };

  const handleCadastrarPet = () => {
    if (!formPet.nome || !formPet.tipo) {
      toast.error("Preencha nome e tipo do pet.");
      return;
    }

    const novoPet: Pet = {
      id: getNextId(pets),
      nome: formPet.nome,
      tipo: formPet.tipo,
      raca: formPet.raca,
      idade: formPet.idade,
      foto: PET_EMOJI_MAP[formPet.tipo] ?? "🐾",
    };

    setPets((current) => [...current, novoPet]);
    closePetModal();
    setActiveMenu("pets");
    toast.success(`${novoPet.nome} cadastrado com sucesso.`);
  };

  const handleSalvarPerfil = async () => {
    const cpfLimpo = onlyDigits(sanitizeCpf(formPerfil.cpf));
    const telefoneLimpo = onlyDigits(normalizeText(formPerfil.telefone));

    if (!formPerfil.nome || !cpfLimpo || !telefoneLimpo) {
      toast.error("Nome, CPF e telefone sao obrigatorios.");
      return;
    }

    if (cpfLimpo.length !== 11) {
      toast.error("CPF deve conter 11 digitos.");
      return;
    }

    if (telefoneLimpo.length < 10) {
      toast.error("Telefone deve conter ao menos 10 digitos.");
      return;
    }

    const payload = {
      nome: formPerfil.nome.trim(),
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
    };

    try {
      const response = await putAtualizarCliente(cliente.id, payload);

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Nao foi possivel atualizar o perfil.");
      }

      setCliente((current) => ({
        ...current,
        nome: payload.nome,
        cpf: payload.cpf,
        telefone: payload.telefone,
      }));
      saveClienteProfileOverride(cliente.id, payload);
      setShowPerfilModal(false);
      toast.success("Perfil atualizado.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o perfil.";
      toast.error(message);
    }
  };

  const openEnderecoModal = (slot: 0 | 1) => {
    setEnderecoSlotAtual(slot);
    setEnderecoDraft(enderecos[slot] ?? { ...EMPTY_ENDERECO });
    setShowEnderecoModal(true);
  };

  const salvarEndereco = async () => {
    if (
      !enderecoDraft.cep ||
      !enderecoDraft.logradouro ||
      !enderecoDraft.numero ||
      !enderecoDraft.bairro ||
      !enderecoDraft.cidade ||
      !enderecoDraft.estado ||
      !enderecoDraft.pais ||
      !enderecoDraft.tipo
    ) {
      toast.error("CEP, logradouro, numero, bairro, cidade, estado, pais e tipo sao obrigatorios.");
      return;
    }

    const payload = {
      cep: enderecoDraft.cep,
      logradouro: enderecoDraft.logradouro,
      numero: enderecoDraft.numero,
      complemento: enderecoDraft.complemento,
      bairro: enderecoDraft.bairro,
      cidade: enderecoDraft.cidade,
      uf: enderecoDraft.estado,
      pais: enderecoDraft.pais,
      pontoReferencia: enderecoDraft.pontoReferencia,
      tipoEndereco: enderecoDraft.tipo,
      clienteId: cliente.id,
    };

    try {
      const response = await postEndereco(payload);

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Nao foi possivel salvar o endereco.");
      }

      setEnderecos((current) => {
        const updated = [...current] as [Endereco | null, Endereco | null];
        updated[enderecoSlotAtual] = { ...enderecoDraft };
        return updated;
      });

      closeEnderecoModal();
      toast.success(`Endereco ${enderecoSlotAtual + 1} salvo.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel salvar o endereco.";
      toast.error(message);
    }
  };

  const removerEndereco = (slot: 0 | 1) => {
    setEnderecos((current) => {
      const updated = [...current] as [Endereco | null, Endereco | null];
      updated[slot] = null;
      return updated;
    });
    toast.success(`Endereco ${slot + 1} removido.`);
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <Toaster position="top-center" richColors />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(17,17,17,0.16),transparent_30%)]" />

      <div className="relative flex min-h-screen">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          activeMenu={activeMenu}
          cliente={cliente}
          showPerfilWarning={!cadastroCompleto}
          onCloseSidebar={() => setSidebarOpen(false)}
          onMenuClick={handleMenuClick}
          onOpenPets={handleOpenPets}
          onLogout={handleLogout}
        />

        <div className="flex flex-1 flex-col lg:ml-0">
          <DashboardHeader
            consultasPendentes={consultasPendentes}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-6 sm:px-6">
            <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
              <Image
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1600&q=80"
                alt="Veterinaria em atendimento"
                fill
                className="object-cover"
                priority
              />

              <div className="relative z-10 grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.25fr_auto] lg:items-end">
                <div className="rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-lg shadow-zinc-900/10 backdrop-blur-[1px] sm:p-5">
                  <p className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                    Painel Profissional
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                    Ola, {clientePrimeiroNome}. Seu centro de cuidado esta pronto.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
                    Acompanhe consultas, mantenha os dados atualizados e organize as informacoes dos seus pets em um unico fluxo.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:w-72">
                  <div className="rounded-xl border border-zinc-200/90 bg-white/90 p-3 shadow-sm shadow-zinc-900/10 backdrop-blur-[1px]">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-600">Pendentes</p>
                    <p className="text-xl font-semibold text-zinc-900">{consultasPendentes}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200/90 bg-white/90 p-3 shadow-sm shadow-zinc-900/10 backdrop-blur-[1px]">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-600">Concluidas</p>
                    <p className="text-xl font-semibold text-zinc-900">{consultasConcluidas}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200/90 bg-white/90 p-3 shadow-sm shadow-zinc-900/10 backdrop-blur-[1px]">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-600">Pets</p>
                    <p className="text-xl font-semibold text-zinc-900">{pets.length}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200/90 bg-white/90 p-3 shadow-sm shadow-zinc-900/10 backdrop-blur-[1px]">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-600">Perfil</p>
                    <p className="text-sm font-semibold text-zinc-900">{cadastroCompleto ? "Completo" : "Pendente"}</p>
                  </div>
                </div>
              </div>
            </section>

            <DashboardStats
              consultasPendentes={consultasPendentes}
              totalPets={pets.length}
              consultasConcluidas={consultasConcluidas}
            />

            <PetsSection pets={pets} onAddPet={() => setShowPetModal(true)} />

            <ConsultasSection
              consultas={consultas}
              onAddConsulta={() => {
                if (!cadastroCompleto) {
                  return;
                }
                setShowAgendarModal(true);
              }}
              onEditConsulta={handleEditarConsulta}
              onCancelConsulta={handleCancelarConsulta}
              canCreateConsulta={cadastroCompleto}
            />
          </main>
        </div>

        <AgendarConsultaModal
          open={showAgendarModal}
          editingConsultaId={editingConsultaId}
          formConsulta={formConsulta}
          pets={pets}
          setFormConsulta={setFormConsulta}
          onClose={closeAgendarModal}
          onSubmit={handleAgendarConsulta}
        />

        <PetModal
          open={showPetModal}
          formPet={formPet}
          setFormPet={setFormPet}
          onClose={closePetModal}
          onSubmit={handleCadastrarPet}
        />

        <PerfilModal
          open={showPerfilModal}
          formPerfil={formPerfil}
          setFormPerfil={setFormPerfil}
          enderecos={enderecos}
          onOpenEndereco={openEnderecoModal}
          onRemoveEndereco={removerEndereco}
          onClose={() => setShowPerfilModal(false)}
          onSubmit={handleSalvarPerfil}
        />

        <EnderecoModal
          open={showEnderecoModal}
          enderecoSlotAtual={enderecoSlotAtual}
          enderecoDraft={enderecoDraft}
          setEnderecoDraft={setEnderecoDraft}
          onClose={closeEnderecoModal}
          onSubmit={salvarEndereco}
        />

        {sidebarOpen ? (
          <motion.button
            type="button"
            aria-label="Fechar menu lateral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-orange-950/35 lg:hidden"
          />
        ) : null}
      </div>
    </div>
  );
}
