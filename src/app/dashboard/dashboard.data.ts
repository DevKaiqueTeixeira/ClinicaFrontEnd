import type { Consulta, ConsultaForm, Endereco, Pet, PetForm } from "./dashboard.types";

export const EMPTY_ENDERECO: Endereco = {
  rua: "",
  numero: "",
  cep: "",
  cidade: "",
};

export const EMPTY_CONSULTA_FORM: ConsultaForm = {
  petId: "",
  tipo: "",
  data: "",
  hora: "",
  observacoes: "",
};

export const EMPTY_PET_FORM: PetForm = {
  nome: "",
  tipo: "",
  raca: "",
  idade: "",
};

export const PET_EMOJI_MAP: Record<string, string> = {
  Cachorro: "🐕",
  Gato: "🐈",
  Coelho: "🐇",
  Passaro: "🦜",
  Hamster: "🐹",
};

export const initialPets: Pet[] = [
  {
    id: 1,
    nome: "Rex",
    tipo: "Cachorro",
    raca: "Golden Retriever",
    idade: "3 anos",
    foto: "🐕",
  },
  {
    id: 2,
    nome: "Mimi",
    tipo: "Gato",
    raca: "Persa",
    idade: "2 anos",
    foto: "🐈",
  },
];

export const initialConsultas: Consulta[] = [
  {
    id: 1,
    petId: 1,
    petNome: "Rex",
    tipo: "Consulta de Rotina",
    data: "2026-04-15",
    hora: "14:30",
    veterinario: "Dr. Carlos Silva",
    status: "confirmado",
    observacoes: "Checkup geral",
  },
  {
    id: 2,
    petId: 2,
    petNome: "Mimi",
    tipo: "Vacinacao",
    data: "2026-04-18",
    hora: "10:00",
    veterinario: "Dra. Ana Santos",
    status: "pendente",
    observacoes: "Vacina antirrabica",
  },
  {
    id: 3,
    petId: 1,
    petNome: "Rex",
    tipo: "Exame",
    data: "2026-04-10",
    hora: "16:00",
    veterinario: "Dr. Pedro Costa",
    status: "concluido",
    observacoes: "Exame de sangue sem alteracoes",
  },
];

export function getNextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
}

export function formatConsultaDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}
