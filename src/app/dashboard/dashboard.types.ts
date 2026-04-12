export type Cliente = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

export type ConsultaStatus = "confirmado" | "pendente" | "concluido";

export type Pet = {
  id: number;
  nome: string;
  tipo: string;
  raca: string;
  idade: string;
  foto: string;
};

export type Consulta = {
  id: number;
  petId: number;
  petNome: string;
  tipo: string;
  data: string;
  hora: string;
  veterinario: string;
  status: ConsultaStatus;
  observacoes: string;
};

export type Endereco = {
  rua: string;
  numero: string;
  cep: string;
  cidade: string;
};

export type PerfilForm = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

export type ConsultaForm = {
  petId: string;
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
};

export type PetForm = {
  nome: string;
  tipo: string;
  raca: string;
  idade: string;
};
