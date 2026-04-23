export type Cliente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

export type ConsultaStatus = "confirmado" | "pendente" | "concluido" | "cancelado";

export type Pet = {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  dataNascimento: string;
  peso: number;
  cor: string;
  porte: string;
  observacoes: string;
  clienteId: number;
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
  id?: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  pontoReferencia: string;
  tipo: string;
};

export type PerfilForm = {
  nome: string;
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
  especie: string;
  raca: string;
  sexo: string;
  dataNascimento: string;
  peso: string;
  cor: string;
  porte: string;
  observacoes: string;
};
