"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { buildApiUrl } from "@/lib/api";
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

export default function DashboardClient({ initialCliente }: { initialCliente: Cliente }) {
  const router = useRouter();

  const [cliente, setCliente] = useState<Cliente>(initialCliente);
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
    nome: initialCliente.nome ?? "",
    email: initialCliente.email ?? "",
    cpf: initialCliente.cpf ?? "",
    telefone: initialCliente.telefone ?? "",
  });
  const [formConsulta, setFormConsulta] = useState<ConsultaForm>({ ...EMPTY_CONSULTA_FORM });
  const [formPet, setFormPet] = useState<PetForm>({ ...EMPTY_PET_FORM });

  const [enderecos, setEnderecos] = useState<[Endereco | null, Endereco | null]>([null, null]);
  const [enderecoSlotAtual, setEnderecoSlotAtual] = useState<0 | 1>(0);
  const [enderecoDraft, setEnderecoDraft] = useState<Endereco>({ ...EMPTY_ENDERECO });

  const consultasPendentes = consultas.filter(
    (consulta) => consulta.status === "pendente" || consulta.status === "confirmado"
  ).length;
  const consultasConcluidas = consultas.filter((consulta) => consulta.status === "concluido").length;

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
      setShowAgendarModal(true);
    }

    if (menu === "perfil") {
      setFormPerfil({
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
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
      await fetch(buildApiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      toast.warning("Nao foi possivel confirmar logout no servidor.");
    } finally {
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

  const handleSalvarPerfil = () => {
    if (!formPerfil.nome || !formPerfil.email) {
      toast.error("Nome e email sao obrigatorios.");
      return;
    }

    setCliente((current) => ({ ...current, ...formPerfil }));
    setShowPerfilModal(false);
    toast.success("Perfil atualizado.");
  };

  const openEnderecoModal = (slot: 0 | 1) => {
    setEnderecoSlotAtual(slot);
    setEnderecoDraft(enderecos[slot] ?? { ...EMPTY_ENDERECO });
    setShowEnderecoModal(true);
  };

  const salvarEndereco = () => {
    if (!enderecoDraft.rua || !enderecoDraft.numero || !enderecoDraft.cidade) {
      toast.error("Rua, numero e cidade sao obrigatorios.");
      return;
    }

    setEnderecos((current) => {
      const updated = [...current] as [Endereco | null, Endereco | null];
      updated[enderecoSlotAtual] = { ...enderecoDraft };
      return updated;
    });

    closeEnderecoModal();
    toast.success(`Endereco ${enderecoSlotAtual + 1} salvo.`);
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
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-center" richColors />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(15,118,110,0.11),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(245,158,11,0.11),transparent_30%)]" />

      <div className="relative flex min-h-screen">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          activeMenu={activeMenu}
          cliente={cliente}
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
            <DashboardStats
              consultasPendentes={consultasPendentes}
              totalPets={pets.length}
              consultasConcluidas={consultasConcluidas}
            />

            <PetsSection pets={pets} onAddPet={() => setShowPetModal(true)} />

            <ConsultasSection
              consultas={consultas}
              onAddConsulta={() => setShowAgendarModal(true)}
              onEditConsulta={handleEditarConsulta}
              onCancelConsulta={handleCancelarConsulta}
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
            className="fixed inset-0 z-40 bg-slate-900/45 lg:hidden"
          />
        ) : null}
      </div>
    </div>
  );
}
