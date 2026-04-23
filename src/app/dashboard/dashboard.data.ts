import type { Consulta, ConsultaForm, Endereco, PetForm } from "./dashboard.types";

export const EMPTY_ENDERECO: Endereco = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  pais: "",
  pontoReferencia: "",
  tipo: "",
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
  especie: "",
  raca: "",
  sexo: "",
  dataNascimento: "",
  peso: "",
  cor: "",
  porte: "",
  observacoes: "",
};

export const initialConsultas: Consulta[] = [];

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
