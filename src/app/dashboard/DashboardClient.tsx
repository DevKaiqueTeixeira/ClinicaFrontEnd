"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { postAuthLogout } from "@/app/stores/endpoints/auth/postAuthLogout";
import { deleteEndereco } from "@/app/stores/endpoints/enderecos/deleteEndereco";
import { getEnderecosByCliente } from "@/app/stores/endpoints/enderecos/getEnderecosByCliente";
import {
  postEndereco,
  type EnderecoApiResponse,
} from "@/app/stores/endpoints/enderecos/postEndereco";
import { putEndereco } from "@/app/stores/endpoints/enderecos/putEndereco";
import { deleteAgendamento } from "@/app/stores/endpoints/agendamentos/deleteAgendamento";
import {
  getAgendamentosByCliente,
  type AgendamentoApiResponse,
} from "@/app/stores/endpoints/agendamentos/getAgendamentosByCliente";
import { postAgendamento } from "@/app/stores/endpoints/agendamentos/postAgendamento";
import { putAgendamento } from "@/app/stores/endpoints/agendamentos/putAgendamento";
import { deletePet } from "@/app/stores/endpoints/pets/deletePet";
import { getPetsByCliente } from "@/app/stores/endpoints/pets/getPetsByCliente";
import { postPet } from "@/app/stores/endpoints/pets/postPet";
import { putPet } from "@/app/stores/endpoints/pets/putPet";
import { putAtualizarCliente } from "@/app/stores/endpoints/clientes/putAtualizarCliente";
import {
  EMPTY_CONSULTA_FORM,
  EMPTY_ENDERECO,
  EMPTY_PET_FORM,
  initialConsultas,
} from "./dashboard.data";
import type {
  Cliente,
  Consulta,
  ConsultaForm,
  ConsultaStatus,
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

function normalizePet(pet: Pet): Pet {
  const rawPeso = Number((pet as { peso?: unknown }).peso);

  return {
    ...pet,
    observacoes: normalizeText((pet as { observacoes?: unknown }).observacoes),
    peso: Number.isFinite(rawPeso) ? rawPeso : 0,
  };
}

async function getResponseMessage(response: Response, fallbackMessage: string): Promise<string> {
  const message = (await response.text()).trim();
  return message || fallbackMessage;
}

function normalizeHora(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const normalized = value.trim();
  return normalized.length >= 5 ? normalized.slice(0, 5) : normalized;
}

function normalizeConsultaStatus(value: unknown): ConsultaStatus {
  if (typeof value !== "string") {
    return "pendente";
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized === "pendente" ||
    normalized === "confirmado" ||
    normalized === "concluido" ||
    normalized === "cancelado"
  ) {
    return normalized;
  }

  return "pendente";
}

function mapAgendamentoApiToConsulta(
  agendamento: AgendamentoApiResponse,
  petNameById: Map<number, string>
): Consulta {
  return {
    id: agendamento.id,
    petId: agendamento.petId,
    petNome: petNameById.get(agendamento.petId) ?? `Pet #${agendamento.petId}`,
    tipo: agendamento.tipo,
    data: agendamento.data,
    hora: normalizeHora(agendamento.hora),
    veterinario: normalizeText(agendamento.veterinario) || "A definir",
    status: normalizeConsultaStatus(agendamento.status),
    observacoes: normalizeText(agendamento.observacoes),
  };
}

function mapEnderecoApiToEndereco(endereco: EnderecoApiResponse): Endereco {
  return {
    id: endereco.id,
    cep: normalizeText(endereco.cep),
    logradouro: normalizeText(endereco.logradouro),
    numero: normalizeText(endereco.numero),
    complemento: normalizeText(endereco.complemento),
    bairro: normalizeText(endereco.bairro),
    cidade: normalizeText(endereco.cidade),
    estado: normalizeText(endereco.uf),
    pais: normalizeText(endereco.pais),
    pontoReferencia: normalizeText(endereco.pontoReferencia),
    tipo: normalizeText(endereco.tipoEndereco),
  };
}

function toEnderecoSlots(enderecosApi: EnderecoApiResponse[]): [Endereco | null, Endereco | null] {
  const mapped = enderecosApi.map(mapEnderecoApiToEndereco).slice(0, 2);
  return [mapped[0] ?? null, mapped[1] ?? null];
}

export default function DashboardClient({ initialCliente }: { initialCliente: Cliente }) {
  const router = useRouter();
  const initialClienteNormalizado = normalizeCliente(initialCliente);

  const [cliente, setCliente] = useState<Cliente>(initialClienteNormalizado);
  const [pets, setPets] = useState<Pet[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>(initialConsultas);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);

  const [editingConsultaId, setEditingConsultaId] = useState<number | null>(null);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);

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
  const [isSavingPet, setIsSavingPet] = useState(false);
  const [isSavingConsulta, setIsSavingConsulta] = useState(false);
  const [isSavingEndereco, setIsSavingEndereco] = useState(false);
  const [isRemovingEndereco, setIsRemovingEndereco] = useState(false);
  const isSavingPetRef = useRef(false);
  const isSavingConsultaRef = useRef(false);
  const isSavingEnderecoRef = useRef(false);
  const isRemovingEnderecoRef = useRef(false);

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

  useEffect(() => {
    let active = true;

    const carregarDados = async () => {
      let petsNormalizados: Pet[] = [];

      try {
        const response = await getPetsByCliente(initialClienteNormalizado.id);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel carregar os pets.");
          throw new Error(message);
        }

        const petsResponse = (await response.json()) as Pet[];
        petsNormalizados = petsResponse.map(normalizePet);

        if (!active) {
          return;
        }

        setPets(petsNormalizados);
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Nao foi possivel carregar os pets.";
        toast.error(message);
      }

      try {
        const response = await getAgendamentosByCliente(initialClienteNormalizado.id);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel carregar as consultas.");
          throw new Error(message);
        }

        const agendamentosResponse = (await response.json()) as AgendamentoApiResponse[];

        if (!active) {
          return;
        }

        const petNameById = new Map<number, string>(petsNormalizados.map((pet) => [pet.id, pet.nome]));

        setConsultas(
          agendamentosResponse.map((agendamento) => mapAgendamentoApiToConsulta(agendamento, petNameById))
        );
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Nao foi possivel carregar as consultas.";
        toast.error(message);
      }

      try {
        const response = await getEnderecosByCliente(initialClienteNormalizado.id);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel carregar os enderecos.");
          throw new Error(message);
        }

        const enderecosResponse = (await response.json()) as EnderecoApiResponse[];

        if (!active) {
          return;
        }

        setEnderecos(toEnderecoSlots(enderecosResponse));
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Nao foi possivel carregar os enderecos.";
        toast.error(message);
      }
    };

    void carregarDados();

    return () => {
      active = false;
    };
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
    setEditingPetId(null);
    setFormPet({ ...EMPTY_PET_FORM });
  };

  const openCreatePetModal = () => {
    setEditingPetId(null);
    setFormPet({ ...EMPTY_PET_FORM });
    setShowPetModal(true);
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
    openCreatePetModal();
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

  const handleAgendarConsulta = async () => {
    if (isSavingConsultaRef.current) {
      return;
    }

    if (!formConsulta.petId || !formConsulta.tipo || !formConsulta.data || !formConsulta.hora) {
      toast.error("Preencha os campos obrigatorios da consulta.");
      return;
    }

    const pet = pets.find((item) => item.id === Number(formConsulta.petId));
    if (!pet) {
      toast.error("Selecione um pet valido.");
      return;
    }

    const petNameById = new Map<number, string>(pets.map((item) => [item.id, item.nome]));
    const consultaEmEdicao = editingConsultaId !== null
      ? consultas.find((consulta) => consulta.id === editingConsultaId)
      : null;

    const payload = {
      petId: pet.id,
      clienteId: cliente.id,
      tipo: formConsulta.tipo,
      data: formConsulta.data,
      hora: formConsulta.hora,
      observacoes: formConsulta.observacoes.trim(),
      veterinario: consultaEmEdicao?.veterinario ?? "A definir",
      status: consultaEmEdicao?.status ?? "pendente",
    };

    isSavingConsultaRef.current = true;
    setIsSavingConsulta(true);

    try {
      if (editingConsultaId !== null) {
        const response = await putAgendamento(editingConsultaId, payload);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel atualizar a consulta.");
          throw new Error(message);
        }

        const agendamentoAtualizado = (await response.json()) as AgendamentoApiResponse;
        const consultaAtualizada = mapAgendamentoApiToConsulta(agendamentoAtualizado, petNameById);

        setConsultas((current) =>
          current.map((consulta) => (consulta.id === editingConsultaId ? consultaAtualizada : consulta))
        );
        toast.success("Consulta atualizada com sucesso.");
      } else {
        const response = await postAgendamento(payload);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel agendar a consulta.");
          throw new Error(message);
        }

        const novoAgendamento = (await response.json()) as AgendamentoApiResponse;
        const novaConsulta = mapAgendamentoApiToConsulta(novoAgendamento, petNameById);

        setConsultas((current) => [novaConsulta, ...current]);
        toast.success("Consulta agendada com sucesso.");
      }

      closeAgendarModal();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel salvar a consulta.";
      toast.error(message);
    } finally {
      isSavingConsultaRef.current = false;
      setIsSavingConsulta(false);
    }
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

  const handleCancelarConsulta = async (id: number) => {
    const consulta = consultas.find((item) => item.id === id);
    if (!consulta) {
      return;
    }

    try {
      const response = await deleteAgendamento(id, cliente.id);

      if (!response.ok) {
        const message = await getResponseMessage(response, "Nao foi possivel cancelar a consulta.");
        throw new Error(message);
      }

      setConsultas((current) => current.filter((item) => item.id !== id));

      if (editingConsultaId === id) {
        closeAgendarModal();
      }

      toast.success(`Consulta de ${consulta.petNome} cancelada.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel cancelar a consulta.";
      toast.error(message);
    }
  };

  const handleSalvarPet = async () => {
    if (isSavingPetRef.current) {
      return;
    }

    const nome = formPet.nome.trim();
    const especie = formPet.especie;
    const raca = formPet.raca.trim();
    const sexo = formPet.sexo;
    const dataNascimento = formPet.dataNascimento;
    const cor = formPet.cor.trim();
    const porte = formPet.porte;
    const observacoes = formPet.observacoes.trim();
    const pesoDigitado = formPet.peso.trim().replace(",", ".");
    const peso = Number(pesoDigitado);

    if (!nome || !especie || !raca || !sexo || !dataNascimento || !cor || !porte || !pesoDigitado) {
      toast.error("Preencha todos os campos obrigatorios do pet.");
      return;
    }

    if (!Number.isFinite(peso) || peso <= 0) {
      toast.error("Peso deve ser maior que zero.");
      return;
    }

    const payload = {
      nome,
      especie,
      raca,
      sexo,
      dataNascimento,
      peso,
      cor,
      porte,
      observacoes,
      clienteId: cliente.id,
    };

    isSavingPetRef.current = true;
    setIsSavingPet(true);

    try {
      if (editingPetId) {
        const response = await putPet(editingPetId, payload);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel atualizar o pet.");
          throw new Error(message);
        }

        const petAtualizado = normalizePet((await response.json()) as Pet);

        setPets((current) => current.map((pet) => (pet.id === editingPetId ? petAtualizado : pet)));
        setConsultas((current) =>
          current.map((consulta) =>
            consulta.petId === editingPetId
              ? {
                ...consulta,
                petNome: petAtualizado.nome,
              }
              : consulta
          )
        );

        closePetModal();
        setActiveMenu("pets");
        toast.success(`${petAtualizado.nome} atualizado com sucesso.`);
        return;
      }

      const response = await postPet(payload);

      if (!response.ok) {
        const message = await getResponseMessage(response, "Nao foi possivel cadastrar o pet.");
        throw new Error(message);
      }

      const novoPet = normalizePet((await response.json()) as Pet);
      setPets((current) => [novoPet, ...current]);
      closePetModal();
      setActiveMenu("pets");
      toast.success(`${novoPet.nome} cadastrado com sucesso.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel salvar o pet.";
      toast.error(message);
    } finally {
      isSavingPetRef.current = false;
      setIsSavingPet(false);
    }
  };

  const handleEditarPet = (pet: Pet) => {
    setFormPet({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      sexo: pet.sexo,
      dataNascimento: pet.dataNascimento,
      peso: String(pet.peso),
      cor: pet.cor,
      porte: pet.porte,
      observacoes: pet.observacoes,
    });
    setEditingPetId(pet.id);
    setActiveMenu("pets");
    setShowPetModal(true);
  };

  const handleExcluirPet = async (id: number) => {
    const pet = pets.find((item) => item.id === id);
    if (!pet) {
      return;
    }

    if (!window.confirm(`Deseja excluir ${pet.nome}?`)) {
      return;
    }

    try {
      const response = await deletePet(id, cliente.id);

      if (!response.ok) {
        const message = await getResponseMessage(response, "Nao foi possivel excluir o pet.");
        throw new Error(message);
      }

      setPets((current) => current.filter((item) => item.id !== id));
      setConsultas((current) => current.filter((consulta) => consulta.petId !== id));
      setFormConsulta((current) => (current.petId === String(id) ? { ...current, petId: "" } : current));

      if (editingPetId === id) {
        closePetModal();
      }

      toast.success(`${pet.nome} excluido com sucesso.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel excluir o pet.";
      toast.error(message);
    }
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
    if (isSavingEnderecoRef.current) {
      return;
    }

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

    isSavingEnderecoRef.current = true;
    setIsSavingEndereco(true);

    try {
      const response = enderecoDraft.id
        ? await putEndereco(enderecoDraft.id, payload)
        : await postEndereco(payload);

      if (!response.ok) {
        const message = await getResponseMessage(response, "Nao foi possivel salvar o endereco.");
        throw new Error(message);
      }

      const enderecoSalvo = mapEnderecoApiToEndereco((await response.json()) as EnderecoApiResponse);

      setEnderecos((current) => {
        const updated = [...current] as [Endereco | null, Endereco | null];
        updated[enderecoSlotAtual] = enderecoSalvo;
        return updated;
      });

      closeEnderecoModal();
      toast.success(
        enderecoDraft.id
          ? `Endereco ${enderecoSlotAtual + 1} atualizado.`
          : `Endereco ${enderecoSlotAtual + 1} salvo.`
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel salvar o endereco.";
      toast.error(message);
    } finally {
      isSavingEnderecoRef.current = false;
      setIsSavingEndereco(false);
    }
  };

  const removerEndereco = async (slot: 0 | 1) => {
    if (isRemovingEnderecoRef.current) {
      return;
    }

    const endereco = enderecos[slot];
    if (!endereco) {
      return;
    }

    if (!window.confirm(`Deseja remover o endereco ${slot + 1}?`)) {
      return;
    }

    isRemovingEnderecoRef.current = true;
    setIsRemovingEndereco(true);

    try {
      if (endereco.id) {
        const response = await deleteEndereco(endereco.id, cliente.id);

        if (!response.ok) {
          const message = await getResponseMessage(response, "Nao foi possivel remover o endereco.");
          throw new Error(message);
        }
      }

      setEnderecos((current) => {
        const updated = [...current] as [Endereco | null, Endereco | null];
        updated[slot] = null;
        return updated;
      });

      if (showEnderecoModal && enderecoSlotAtual === slot) {
        closeEnderecoModal();
      }

      toast.success(`Endereco ${slot + 1} removido.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel remover o endereco.";
      toast.error(message);
    } finally {
      isRemovingEnderecoRef.current = false;
      setIsRemovingEndereco(false);
    }
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

            <PetsSection
              pets={pets}
              onAddPet={openCreatePetModal}
              onEditPet={handleEditarPet}
              onDeletePet={handleExcluirPet}
            />

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
          isSubmitting={isSavingConsulta}
          formConsulta={formConsulta}
          pets={pets}
          setFormConsulta={setFormConsulta}
          onClose={closeAgendarModal}
          onSubmit={handleAgendarConsulta}
        />

        <PetModal
          open={showPetModal}
          isEditing={editingPetId !== null}
          isSubmitting={isSavingPet}
          formPet={formPet}
          setFormPet={setFormPet}
          onClose={closePetModal}
          onSubmit={handleSalvarPet}
        />

        <PerfilModal
          open={showPerfilModal}
          formPerfil={formPerfil}
          setFormPerfil={setFormPerfil}
          enderecos={enderecos}
          isEnderecoBusy={isSavingEndereco || isRemovingEndereco}
          onOpenEndereco={openEnderecoModal}
          onRemoveEndereco={removerEndereco}
          onClose={() => setShowPerfilModal(false)}
          onSubmit={handleSalvarPerfil}
        />

        <EnderecoModal
          open={showEnderecoModal}
          enderecoSlotAtual={enderecoSlotAtual}
          isSubmitting={isSavingEndereco}
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
