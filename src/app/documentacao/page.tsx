"use client";

import {
  Database,
  LogIn,
  Mail,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type NavItem = {
  id: string;
  label: string;
};

type FeatureCard = {
  title: string;
  summary: string;
  bullets: string[];
};

type FeatureSection = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  cards: FeatureCard[];
};

type EndpointItem = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
};

type EndpointGroup = {
  title: string;
  note?: string;
  endpoints: EndpointItem[];
};

type EntityDoc = {
  name: string;
  table: string;
  purpose: string;
  fields: string[];
  rules: string[];
};

type DaoMethodDoc = {
  signature: string;
  description: string;
};

type DaoDoc = {
  name: string;
  purpose: string;
  methods: DaoMethodDoc[];
};

const navigationItems: NavItem[] = [
  { id: "visao-geral", label: "Visao geral" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "status-email", label: "Status e email" },
  { id: "endpoints", label: "Endpoints" },
  { id: "dados", label: "Dados" },
  { id: "diagrama-classes", label: "Diagrama" },
  { id: "diagrama-sequencia", label: "Sequencia" },
  { id: "seguranca", label: "Seguranca" },
  { id: "operacao", label: "Operacao" },
];

const architectureFlow = [
  "Login / Sessao",
  "Dashboard Cliente",
  "Pets",
  "Consultas",
  "Painel Medico",
  "Receita por Email",
  "Status Automatico",
  "Notificacao de Mudanca",
];

const featureSections: FeatureSection[] = [
  {
    id: "visao-geral",
    title: "Visao geral da plataforma",
    subtitle: "Escopo funcional atual do produto",
    overview:
      "A FullStackClinica esta dividida em front-end (Next.js) e back-end (Spring Boot). O fluxo principal cobre autenticacao, cadastro de cliente, gerenciamento de pets, gestao de consultas e rotina medica com envio de receita por email.",
    cards: [
      {
        title: "Objetivo do sistema",
        summary:
          "Centralizar jornada do cliente e do medico em um unico fluxo, com historico e comunicacao automatizada.",
        bullets: [
          "Cliente acompanha pets e consultas no dashboard.",
          "Medico altera status das consultas em tela dedicada.",
          "Receita medica e registrada no banco e enviada por email.",
          "Mudanca de status dispara notificacao informativa automaticamente.",
        ],
      },
      {
        title: "Arquitetura em camadas",
        summary:
          "Back-end organizado com Controller -> Service -> DAO, usando queries nativas via EntityManager.",
        bullets: [
          "Controllers expõem endpoints REST com mapeamento de status HTTP.",
          "Services concentram validacoes, regras de negocio e orquestracao.",
          "DAOs executam INSERT/SELECT/UPDATE/DELETE com SQL nativo.",
          "Models JPA representam tabelas e usam Builder para criar objetos validos.",
        ],
      },
      {
        title: "Integracao front-back",
        summary:
          "Todo fluxo principal ja esta integrado com API real, sem mocks para pets/consultas no uso normal.",
        bullets: [
          "Frontend usa fetch com credentials include para manter sessao.",
          "Cadastro/edicao/exclusao de pets e consultas passa pelos endpoints REST.",
          "Painel medico consome lista geral de agendamentos e atualiza status em tempo real.",
          "Toasts orientam o usuario em sucesso, validacao e erros de negocio.",
        ],
      },
    ],
  },
  {
    id: "frontend",
    title: "Features de frontend",
    subtitle: "Paginas e comportamentos da interface",
    overview:
      "O front-end foi desenhado para dois papeis principais: cliente e medico. A tela de login tambem agrega atalhos para medico e documentacao tecnica.",
    cards: [
      {
        title: "Tela de login",
        summary:
          "Entrada por email/senha e opcao de login Google, com validacoes e feedback visual.",
        bullets: [
          "Valida email e senha no client antes da chamada de API.",
          "Mantem redirecionamento para dashboard se sessao ja estiver ativa.",
          "Atalhos flutuantes para documentacao e tela do medico.",
          "Botao de retorno rapido na documentacao leva de volta ao login.",
        ],
      },
      {
        title: "Dashboard do cliente",
        summary:
          "Tela principal para gerir perfil, enderecos, pets e consultas com cards e modais.",
        bullets: [
          "Perfil com atualizacao de nome, CPF e telefone.",
          "Endereco com cadastro, edicao e remocao sincronizados com API.",
          "Pets com CRUD completo e validacoes de campos obrigatorios.",
          "Consultas com agendamento, edicao e cancelamento respeitando status.",
        ],
      },
      {
        title: "Tela do medico",
        summary:
          "Painel operacional para alterar status e emitir receita vinculada a consulta.",
        bullets: [
          "Lista geral de consultas com status atual em badge.",
          "Select para status pendente/confirmado/concluido/cancelado.",
          "Textbox de receita por consulta e acao de envio por email.",
          "Quando concluida, consulta recebe destaque visual com shadow verde.",
        ],
      },
    ],
  },
  {
    id: "backend",
    title: "Features de backend",
    subtitle: "Regras de negocio e processamento",
    overview:
      "O backend atende os modulos de autenticacao, cliente, endereco, pet, agendamento e receita, com foco em consistencia de dados e mensagens claras de erro.",
    cards: [
      {
        title: "Autenticacao e sessao",
        summary:
          "Suporte para login tradicional e Google OAuth2 com sessao HTTP.",
        bullets: [
          "AuthService valida credenciais e senha criptografada.",
          "SecurityConfig integra OAuth2 e registra usuario na sessao.",
          "Endpoint de usuario autenticado retorna cliente da sessao.",
          "CORS e credenciais habilitados para app web local.",
        ],
      },
      {
        title: "Cadastros principais",
        summary:
          "Cliente, endereco e pet usam Builders com validacoes para evitar persistencia inconsistente.",
        bullets: [
          "Cliente verifica CPF/email unicos e regras de senha.",
          "Endereco valida relacionamento com cliente existente.",
          "Pet valida 10 atributos de cadastro, incluindo clienteId.",
          "CRUD feito com DAO e SQL nativo para controle de consulta.",
        ],
      },
      {
        title: "Consultas e receita",
        summary:
          "Consulta possui ciclo de vida de status e pode gerar receita com envio por email.",
        bullets: [
          "AgendamentoService garante que pet pertence ao cliente.",
          "ReceitaService envia email com texto do medico e salva receita.",
          "Ao enviar receita, consulta e marcada como concluido.",
          "Mudancas de status disparam notificacao informativa para o cliente.",
        ],
      },
    ],
  },
  {
    id: "status-email",
    title: "Regra de status e notificacoes",
    subtitle: "Comportamento automatico de comunicacao com cliente",
    overview:
      "Toda alteracao real de status da consulta agora pode gerar notificacao por email para o dono da consulta, com texto contextual e detalhes do atendimento.",
    cards: [
      {
        title: "Alteracao manual de status",
        summary:
          "Quando medico muda status no endpoint dedicado, a plataforma notifica cliente por email.",
        bullets: [
          "Endpoint: PUT /agendamentos/{id}/status.",
          "Service compara status anterior e novo para evitar email duplicado.",
          "Email inclui status anterior, novo status e dados da consulta.",
          "Se status nao mudar, sistema nao envia notificacao.",
        ],
      },
      {
        title: "Alteracao de status em atualizacao completa",
        summary:
          "No PUT de consulta completa, se o status mudar dentro da atualizacao, a notificacao tambem dispara.",
        bullets: [
          "Endpoint: PUT /agendamentos/{id}.",
          "Fluxo reaproveita mesma service de notificacao para padrao unico.",
          "Mensagem enviada sempre para email do cliente vinculado ao clienteId da consulta.",
          "Falhas SMTP retornam erro explicito para diagnostico rapido.",
        ],
      },
      {
        title: "Envio de receita",
        summary:
          "Ao enviar receita, o sistema salva a receita no banco e conclui a consulta.",
        bullets: [
          "Endpoint: POST /receitas/enviar-email.",
          "Texto do textbox do medico vira corpo principal da receita no email.",
          "Receita fica persistida com agendamentoId, clienteId, petId e emailDestino.",
          "Consulta muda para concluido e interface reflete com destaque verde.",
        ],
      },
    ],
  },
  {
    id: "seguranca",
    title: "Seguranca e CORS",
    subtitle: "Controle de acesso, preflight e sessao",
    overview:
      "As configuracoes de seguranca foram ajustadas para o fluxo web local com credenciais, cobrindo OPTIONS e rotas necessarias para o frontend.",
    cards: [
      {
        title: "Politica CORS",
        summary:
          "Origem permitida para localhost:3000 com metodos e headers necessarios.",
        bullets: [
          "Allowed origins inclui http://localhost:3000.",
          "Allowed methods inclui GET, POST, PUT, DELETE e OPTIONS.",
          "AllowCredentials ativado para uso de sessao no browser.",
          "Preflight OPTIONS permitido globalmente no SecurityConfig.",
        ],
      },
      {
        title: "Mapeamento de rotas",
        summary:
          "Endpoints de cliente, endereco, pet, agendamento e receita foram liberados para a aplicacao local.",
        bullets: [
          "Matchers incluem rotas com e sem wildcard para evitar bloqueio acidental.",
          "Rotas OAuth2 mantidas para login social.",
          "Controladores usam respostas padronizadas de erro com status HTTP adequado.",
          "Excecoes de negocio retornam mensagens diretas para o front.",
        ],
      },
    ],
  },
  {
    id: "operacao",
    title: "Operacao e configuracao",
    subtitle: "Checklist para ambiente local",
    overview:
      "Este bloco consolida os pontos operacionais essenciais para manter envio de email, persistencia e integracao front-back funcionando sem surpresa.",
    cards: [
      {
        title: "SMTP Gmail",
        summary:
          "Envio usa spring-boot-starter-mail com TLS e autenticacao.",
        bullets: [
          "Remetente configurado para kaiqueteixeiradev@gmail.com.",
          "Para estabilidade, usar senha de app de 16 caracteres do Google.",
          "Quando autenticacao falha, API retorna mensagem explicita de SMTP.",
          "Timeouts de conexao, leitura e escrita ja configurados.",
        ],
      },
      {
        title: "Persistencia MySQL",
        summary:
          "Banco clinica com ddl-auto update para evoluir schema automaticamente em dev.",
        bullets: [
          "Tabelas-chave: clientes, enderecos, pets, agendamentos, receitas.",
          "DAOs usam SQL nativo para operacoes sensiveis.",
          "Services garantem consistencia antes de persistir.",
          "Erros de regra sao retornados com mensagem legivel para o front.",
        ],
      },
      {
        title: "Confiabilidade de UX",
        summary:
          "Frontend bloqueia submits simultaneos para evitar duplicidade em pet/consulta/endereco.",
        bullets: [
          "Botoes entram em estado de loading durante requisicao.",
          "Refs de lock impedem duplo clique com corrida de estado.",
          "Toasts deixam claro o resultado de cada operacao.",
          "Build e lint validados apos as principais alteracoes.",
        ],
      },
    ],
  },
];

const endpointGroups: EndpointGroup[] = [
  {
    title: "Autenticacao e cliente",
    endpoints: [
      { method: "POST", path: "/auth/login", description: "Autentica cliente por email/senha." },
      { method: "POST", path: "/auth/logout", description: "Encerra sessao atual." },
      { method: "GET", path: "/clientes/user", description: "Retorna cliente autenticado na sessao." },
      { method: "POST", path: "/clientes", description: "Cadastra novo cliente." },
      {
        method: "PUT",
        path: "/clientes/atualizarCliente/{id}",
        description: "Atualiza nome, CPF e telefone do cliente.",
      },
    ],
  },
  {
    title: "Enderecos",
    endpoints: [
      { method: "POST", path: "/enderecos", description: "Cadastra endereco para cliente." },
      {
        method: "GET",
        path: "/enderecos/cliente/{clienteId}",
        description: "Lista enderecos do cliente.",
      },
      { method: "PUT", path: "/enderecos/{id}", description: "Atualiza endereco especifico." },
      {
        method: "DELETE",
        path: "/enderecos/{id}?clienteId=...",
        description: "Remove endereco do cliente.",
      },
    ],
  },
  {
    title: "Pets",
    endpoints: [
      { method: "POST", path: "/pets", description: "Cadastra pet com atributos completos." },
      { method: "GET", path: "/pets/cliente/{clienteId}", description: "Lista pets do cliente." },
      { method: "GET", path: "/pets/{id}?clienteId=...", description: "Busca pet por id e cliente." },
      { method: "PUT", path: "/pets/{id}", description: "Atualiza dados de pet." },
      {
        method: "DELETE",
        path: "/pets/{id}?clienteId=...",
        description: "Exclui pet do cliente.",
      },
    ],
  },
  {
    title: "Agendamentos",
    note: "Status permitido: pendente, confirmado, concluido, cancelado.",
    endpoints: [
      { method: "POST", path: "/agendamentos", description: "Abre novo agendamento." },
      {
        method: "GET",
        path: "/agendamentos/cliente/{clienteId}",
        description: "Lista agendamentos do cliente.",
      },
      { method: "GET", path: "/agendamentos", description: "Lista geral usada na tela do medico." },
      { method: "GET", path: "/agendamentos/{id}?clienteId=...", description: "Busca agendamento unico." },
      { method: "PUT", path: "/agendamentos/{id}", description: "Atualiza consulta completa." },
      {
        method: "PUT",
        path: "/agendamentos/{id}/status",
        description: "Atualiza somente status e notifica cliente se houve mudanca.",
      },
      {
        method: "DELETE",
        path: "/agendamentos/{id}?clienteId=...",
        description: "Exclui agendamento.",
      },
    ],
  },
  {
    title: "Receitas e email",
    endpoints: [
      {
        method: "POST",
        path: "/receitas/enviar-email",
        description: "Envia receita por email, salva no banco e conclui a consulta.",
      },
    ],
  },
];

const entities: EntityDoc[] = [
  {
    name: "Cliente",
    table: "clientes",
    purpose: "Representa usuario dono da jornada de atendimento.",
    fields: ["id", "nome", "cpf", "email", "senha", "telefone"],
    rules: [
      "CPF e email unicos.",
      "Senha codificada para login tradicional.",
      "Usado como referencia central para endereco, pet e agendamento.",
    ],
  },
  {
    name: "Endereco",
    table: "enderecos",
    purpose: "Armazena localizacao e dados complementares do cliente.",
    fields: [
      "id",
      "cep",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "pais",
      "pontoReferencia",
      "tipoEndereco",
      "clienteId",
    ],
    rules: [
      "Vinculo obrigatorio com clienteId existente.",
      "CRUD com filtros por cliente.",
      "Suporta edicao e remocao via dashboard.",
    ],
  },
  {
    name: "Pet",
    table: "pets",
    purpose: "Cadastro completo do animal para atendimento clinico.",
    fields: [
      "id",
      "nome",
      "especie",
      "raca",
      "sexo",
      "dataNascimento",
      "peso",
      "cor",
      "porte",
      "observacoes",
      "clienteId",
    ],
    rules: [
      "Builder exige campos obrigatorios e peso maior que zero.",
      "Acesso por id sempre combinado com clienteId quando aplicavel.",
      "Atualizacao preserva consistencia de dono do pet.",
    ],
  },
  {
    name: "Agendamento",
    table: "agendamentos",
    purpose: "Registra consulta e ciclo de status do atendimento.",
    fields: ["id", "petId", "clienteId", "tipo", "data", "hora", "observacoes", "veterinario", "status"],
    rules: [
      "Status normalizado para pendente/confirmado/concluido/cancelado.",
      "Valida pet pertencente ao cliente antes de persistir.",
      "Alteracao de status pode disparar notificacao por email.",
    ],
  },
  {
    name: "Receita",
    table: "receitas",
    purpose: "Guarda historico de receitas enviadas ao cliente.",
    fields: ["id", "agendamentoId", "petId", "clienteId", "texto", "emailDestino", "criadaEm"],
    rules: [
      "Criada no envio de receita pelo painel medico.",
      "Sempre vinculada a um agendamento valido.",
      "Persiste email de destino para trilha de auditoria.",
    ],
  },
];

const daoDocs: DaoDoc[] = [
  {
    name: "ClienteDAO",
    purpose: "Persistencia e consulta de clientes para autenticacao e perfil.",
    methods: [
      {
        signature: "salvar(Cliente cliente)",
        description: "Insere cliente no banco e retorna o registro recuperado por email.",
      },
      {
        signature: "buscarPorCpf(String cpf)",
        description: "Busca cliente unico por CPF e retorna Optional.",
      },
      {
        signature: "buscarPorEmail(String email)",
        description: "Busca cliente unico por email e retorna Optional.",
      },
      {
        signature: "buscarPorId(Long id)",
        description: "Busca cliente pelo id e retorna Optional.",
      },
      {
        signature: "existeCpfParaOutroId(String cpf, Long id)",
        description: "Verifica se o CPF informado ja pertence a outro cliente.",
      },
      {
        signature: "atualizarCampos(Long id, String nome, String cpf, String telefone)",
        description: "Atualiza os campos de perfil e retorna cliente atualizado.",
      },
      {
        signature: "listarTodos()",
        description: "Lista todos os clientes da base.",
      },
    ],
  },
  {
    name: "EnderecoDAO",
    purpose: "Operacoes SQL de endereco vinculadas ao cliente.",
    methods: [
      {
        signature: "salvar(Endereco endereco)",
        description: "Insere endereco e retorna o ultimo registro persistido.",
      },
      {
        signature: "clienteExiste(Long clienteId)",
        description: "Confere se existe cliente para o clienteId informado.",
      },
      {
        signature: "listarPorClienteId(Long clienteId)",
        description: "Lista enderecos do cliente em ordem crescente de id.",
      },
      {
        signature: "buscarPorIdEClienteId(Long id, Long clienteId)",
        description: "Busca endereco especifico validando dono por clienteId.",
      },
      {
        signature:
          "atualizarCampos(Long id, Long clienteId, String cep, String logradouro, String numero, String complemento, String bairro, String cidade, String uf, String pais, String pontoReferencia, String tipoEndereco)",
        description: "Atualiza endereco completo e retorna versao atualizada.",
      },
      {
        signature: "excluir(Long id, Long clienteId)",
        description: "Remove endereco pelo id respeitando clienteId.",
      },
      {
        signature: "[interno] buscarUltimoInserido()",
        description: "Helper privado usado apos insert para retornar o endereco criado.",
      },
    ],
  },
  {
    name: "PetDAO",
    purpose: "Persistencia SQL nativa para cadastro e manutencao de pets.",
    methods: [
      {
        signature: "salvar(Pet pet)",
        description: "Insere pet no banco e retorna pet persistido.",
      },
      {
        signature: "listarPorClienteId(Long clienteId)",
        description: "Lista pets do cliente ordenados por nome.",
      },
      {
        signature: "buscarPorIdEClienteId(Long id, Long clienteId)",
        description: "Busca pet por id validando cliente dono.",
      },
      {
        signature:
          "atualizarCampos(Long id, Long clienteId, String nome, String especie, String raca, String sexo, LocalDate dataNascimento, BigDecimal peso, String cor, String porte, String observacoes)",
        description: "Atualiza campos de pet e retorna versao atualizada.",
      },
      {
        signature: "excluir(Long id, Long clienteId)",
        description: "Exclui pet por id respeitando clienteId.",
      },
      {
        signature: "[interno] buscarUltimoInserido()",
        description: "Helper privado para recuperar o pet recem-criado.",
      },
    ],
  },
  {
    name: "AgendamentoDAO",
    purpose: "CRUD de consultas e transicao de status no banco.",
    methods: [
      {
        signature: "salvar(Agendamento agendamento)",
        description: "Insere agendamento e retorna registro persistido.",
      },
      {
        signature: "listarPorClienteId(Long clienteId)",
        description: "Lista consultas de um cliente por data/hora.",
      },
      {
        signature: "listarTodos()",
        description: "Lista geral de consultas usada na tela do medico.",
      },
      {
        signature: "buscarPorId(Long id)",
        description: "Busca consulta por id sem filtro de cliente.",
      },
      {
        signature: "buscarPorIdEClienteId(Long id, Long clienteId)",
        description: "Busca consulta por id com validacao de dono.",
      },
      {
        signature:
          "atualizarCampos(Long id, Long clienteId, Long petId, String tipo, LocalDate data, LocalTime hora, String observacoes, String veterinario, String status)",
        description: "Atualiza todos os campos principais da consulta.",
      },
      {
        signature: "excluir(Long id, Long clienteId)",
        description: "Remove consulta pelo id com clienteId.",
      },
      {
        signature: "atualizarStatus(Long id, String status)",
        description: "Atualiza somente o status da consulta.",
      },
      {
        signature: "[interno] buscarUltimoInserido()",
        description: "Helper privado para retornar o agendamento inserido.",
      },
    ],
  },
  {
    name: "ReceitaDAO",
    purpose: "Persistencia das receitas emitidas no painel medico.",
    methods: [
      {
        signature: "salvar(Receita receita)",
        description: "Insere receita no banco e retorna registro salvo.",
      },
      {
        signature: "[interno] buscarUltimaInserida()",
        description: "Helper privado para recuperar a ultima receita criada.",
      },
    ],
  },
];

const classDiagramMermaid = String.raw`
classDiagram
direction LR

class Cliente {
  +Long id
  +String nome
  +String cpf
  +String email
  +String senha
  +String telefone
  +getId()
  +getNome()
  +getCpf()
  +getEmail()
  +getSenha()
  +getTelefone()
}

class Endereco {
  +Long id
  +String cep
  +String logradouro
  +String numero
  +String complemento
  +String bairro
  +String cidade
  +String uf
  +String pais
  +String pontoReferencia
  +String tipoEndereco
  +Long clienteId
  +getId()
  +setId(id)
  +getCep()
  +setCep(cep)
  +getLogradouro()
  +setLogradouro(logradouro)
  +getNumero()
  +setNumero(numero)
  +getComplemento()
  +setComplemento(complemento)
  +getBairro()
  +setBairro(bairro)
  +getCidade()
  +setCidade(cidade)
  +getUf()
  +setUf(uf)
  +getPais()
  +setPais(pais)
  +getPontoReferencia()
  +setPontoReferencia(pontoReferencia)
  +getTipoEndereco()
  +setTipoEndereco(tipoEndereco)
  +getClienteId()
  +setClienteId(clienteId)
}

class Pet {
  +Long id
  +String nome
  +String especie
  +String raca
  +String sexo
  +LocalDate dataNascimento
  +BigDecimal peso
  +String cor
  +String porte
  +String observacoes
  +Long clienteId
  +getId()
  +getNome()
  +getEspecie()
  +getRaca()
  +getSexo()
  +getDataNascimento()
  +getPeso()
  +getCor()
  +getPorte()
  +getObservacoes()
  +getClienteId()
}

class Agendamento {
  +Long id
  +Long petId
  +Long clienteId
  +String tipo
  +LocalDate data
  +LocalTime hora
  +String observacoes
  +String veterinario
  +String status
  +getId()
  +getPetId()
  +getClienteId()
  +getTipo()
  +getData()
  +getHora()
  +getObservacoes()
  +getVeterinario()
  +getStatus()
}

class Receita {
  +Long id
  +Long agendamentoId
  +Long petId
  +Long clienteId
  +String texto
  +String emailDestino
  +LocalDateTime criadaEm
  +getId()
  +getAgendamentoId()
  +getPetId()
  +getClienteId()
  +getTexto()
  +getEmailDestino()
  +getCriadaEm()
}

class Login {
  +String email
  +String senha
  +getEmail()
  +getSenha()
  +setEmail(email)
  +setSenha(senha)
}

class ClienteBuilder {
  +nome(nome)
  +cpf(cpf)
  +email(email)
  +senha(senha)
  +telefone(telefone)
  +build()
}

class EnderecoBuilder {
  +id(id)
  +cep(cep)
  +logradouro(logradouro)
  +numero(numero)
  +complemento(complemento)
  +bairro(bairro)
  +cidade(cidade)
  +uf(uf)
  +pais(pais)
  +pontoReferencia(pontoReferencia)
  +tipoEndereco(tipoEndereco)
  +clienteId(clienteId)
  +build()
}

class PetBuilder {
  +id(id)
  +nome(nome)
  +especie(especie)
  +raca(raca)
  +sexo(sexo)
  +dataNascimento(dataNascimento)
  +peso(peso)
  +cor(cor)
  +porte(porte)
  +observacoes(observacoes)
  +clienteId(clienteId)
  +build()
}

class AgendamentoBuilder {
  +id(id)
  +petId(petId)
  +clienteId(clienteId)
  +tipo(tipo)
  +data(data)
  +hora(hora)
  +observacoes(observacoes)
  +veterinario(veterinario)
  +status(status)
  +build()
}

class ReceitaBuilder {
  +id(id)
  +agendamentoId(agendamentoId)
  +petId(petId)
  +clienteId(clienteId)
  +texto(texto)
  +emailDestino(emailDestino)
  +criadaEm(criadaEm)
  +build()
}

class LoginBuilder {
  +email(email)
  +senha(senha)
  +build()
}

class AuthController {
  +login(login,session)
  +logout(session,response)
}

class ClienteController {
  +salvar(cliente)
  +user(session)
  +atualizarCliente(id,dadosAtualizados)
}

class EnderecoController {
  +cadastrarEndereco(endereco)
  +listarPorCliente(clienteId)
  +atualizar(id,endereco)
  +excluir(id,clienteId)
}

class PetController {
  +cadastrar(pet)
  +listarPorCliente(clienteId)
  +buscarPorId(id,clienteId)
  +atualizar(id,pet)
  +excluir(id,clienteId)
}

class AgendamentoController {
  +abrir(agendamento)
  +listarPorCliente(clienteId)
  +listarTodos()
  +buscarPorId(id,clienteId)
  +atualizar(id,agendamento)
  +excluir(id,clienteId)
  +atualizarStatus(id,request)
}

class ReceitaController {
  +enviarPorEmail(request)
}

class AuthService {
  +verificarLogin(login)
}

class ClienteService {
  +salvar(cliente)
  +atualizarCliente(id,dadosAtualizados)
  +listar()
  +loginComGoogle(email,nome)
}

class EnderecoService {
  +cadastrar(endereco)
  +listarPorClienteId(clienteId)
  +atualizar(id,dadosAtualizados)
  +excluir(id,clienteId)
}

class PetService {
  +cadastrar(pet)
  +listarPorClienteId(clienteId)
  +buscarPorId(id,clienteId)
  +atualizar(id,dadosAtualizados)
  +excluir(id,clienteId)
}

class AgendamentoService {
  +abrir(agendamento)
  +listarPorClienteId(clienteId)
  +listarTodos()
  +buscarPorId(id,clienteId)
  +atualizar(id,dadosAtualizados)
  +excluir(id,clienteId)
  +atualizarStatus(id,status)
}

class ReceitaService {
  +enviarReceitaPorEmail(agendamentoId,texto)
}

class NotificacaoConsultaService {
  +enviarAtualizacaoStatus(agendamento,statusAnterior,statusNovo)
}

class ClienteDAO {
  +salvar(cliente)
  +buscarPorCpf(cpf)
  +buscarPorEmail(email)
  +buscarPorId(id)
  +existeCpfParaOutroId(cpf,id)
  +atualizarCampos(id,nome,cpf,telefone)
  +listarTodos()
}

class EnderecoDAO {
  +salvar(endereco)
  +clienteExiste(clienteId)
  +listarPorClienteId(clienteId)
  +buscarPorIdEClienteId(id,clienteId)
  +atualizarCampos(id,clienteId,campos)
  +excluir(id,clienteId)
}

class PetDAO {
  +salvar(pet)
  +listarPorClienteId(clienteId)
  +buscarPorIdEClienteId(id,clienteId)
  +atualizarCampos(id,clienteId,campos)
  +excluir(id,clienteId)
}

class AgendamentoDAO {
  +salvar(agendamento)
  +listarPorClienteId(clienteId)
  +listarTodos()
  +buscarPorId(id)
  +buscarPorIdEClienteId(id,clienteId)
  +atualizarCampos(id,clienteId,campos)
  +excluir(id,clienteId)
  +atualizarStatus(id,status)
}

class ReceitaDAO {
  +salvar(receita)
}

class SecurityConfig {
  +successHandler()
  +filterChain(http)
  +corsConfigurationSource()
}

class JavaMailSender

Cliente "1" --> "N" Endereco : possui
Cliente "1" --> "N" Pet : possui
Cliente "1" --> "N" Agendamento : agenda
Pet "1" --> "N" Agendamento : participa
Agendamento "1" --> "N" Receita : gera historico

ClienteBuilder ..> Cliente : build()
EnderecoBuilder ..> Endereco : build()
PetBuilder ..> Pet : build()
AgendamentoBuilder ..> Agendamento : build()
ReceitaBuilder ..> Receita : build()
LoginBuilder ..> Login : build()

AuthController ..> AuthService
AuthController ..> Login : recebe
AuthController ..> LoginBuilder : valida
ClienteController ..> ClienteService
EnderecoController ..> EnderecoService
PetController ..> PetService
AgendamentoController ..> AgendamentoService
ReceitaController ..> ReceitaService

AuthService ..> ClienteDAO
ClienteService ..> ClienteDAO
EnderecoService ..> EnderecoDAO
PetService ..> PetDAO
AgendamentoService ..> AgendamentoDAO
AgendamentoService ..> ClienteDAO
AgendamentoService ..> PetDAO
AgendamentoService ..> NotificacaoConsultaService
ReceitaService ..> ReceitaDAO
ReceitaService ..> AgendamentoDAO
ReceitaService ..> ClienteDAO

NotificacaoConsultaService ..> ClienteDAO
ReceitaService ..> JavaMailSender
NotificacaoConsultaService ..> JavaMailSender
SecurityConfig ..> ClienteService
`;

const jornadaCadastroSequenceMermaid = String.raw`
sequenceDiagram
autonumber

actor Usuario as Cliente
participant Frontend as Frontend (Next.js)
participant Api as Backend REST
participant Banco as Banco de dados

Usuario->>Frontend: Cadastra cliente
Frontend->>Api: POST /clientes
Api->>Banco: Salva cliente
Banco-->>Api: Cliente criado
Api-->>Frontend: 201 + dados

Usuario->>Frontend: Cadastra endereco
Frontend->>Api: POST /enderecos
Api->>Banco: Salva endereco
Banco-->>Api: Endereco criado
Api-->>Frontend: 201 + dados

Usuario->>Frontend: Cadastra pet
Frontend->>Api: POST /pets
Api->>Banco: Salva pet
Banco-->>Api: Pet criado
Api-->>Frontend: 201 + dados

Usuario->>Frontend: Agenda consulta
Frontend->>Api: POST /agendamentos
Api->>Banco: Salva consulta
Banco-->>Api: Consulta criada
Api-->>Frontend: 201 + dados
`;

function methodBadgeClass(method: EndpointItem["method"]): string {
  if (method === "GET") {
    return "methodGet";
  }

  if (method === "POST") {
    return "methodPost";
  }

  if (method === "PUT") {
    return "methodPut";
  }

  return "methodDelete";
}

function MermaidClassDiagram({ chart }: { chart: string }) {
  const rawId = useId();
  const [svgMarkup, setSvgMarkup] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "Manrope, Segoe UI, sans-serif",
          themeVariables: {
            background: "#101722",
            primaryColor: "#24324a",
            primaryTextColor: "#f2f6ff",
            primaryBorderColor: "#7fb1ff",
            lineColor: "#ff9a4b",
            secondaryColor: "#1b2a3f",
            tertiaryColor: "#172235",
          },
        });

        const safeId = rawId.replace(/:/g, "");
        const result = await mermaid.render(`class-diagram-${safeId}-${Date.now()}`, chart);

        if (!isMounted) {
          return;
        }

        setSvgMarkup(result.svg);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Falha ao renderizar diagrama Mermaid", error);
        setErrorMessage("Nao foi possivel renderizar o diagrama automaticamente.");
      }
    };

    void renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, rawId]);

  if (errorMessage) {
    return <p className="diagramError">{errorMessage}</p>;
  }

  if (!svgMarkup) {
    return <p className="diagramLoading">Renderizando diagrama...</p>;
  }

  return <div className="diagramSvg" dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
}

export default function DocumentacaoPage() {
  const topbarRef = useRef<HTMLElement | null>(null);
  const navBarRef = useRef<HTMLElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hashId = window.location.hash.replace("#", "");
      if (hashId && navigationItems.some((item) => item.id === hashId)) {
        return hashId;
      }
    }

    return navigationItems[0]?.id ?? "";
  });

  const navItems = useMemo(() => navigationItems, []);

  useEffect(() => {
    const calculateOffset = () => {
      const topbarHeight = topbarRef.current?.offsetHeight ?? 0;
      const extraGap = window.innerWidth <= 980 ? 18 : 24;
      const finalOffset = topbarHeight + extraGap;

      document.documentElement.style.setProperty("--doc-sticky-offset", `${finalOffset}px`);
      return finalOffset;
    };

    let stickyOffset = calculateOffset();

    const updateActiveSection = () => {
      const currentY = window.scrollY + stickyOffset + 4;
      let currentSection = navItems[0]?.id ?? "";

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (!element) {
          continue;
        }

        if (element.offsetTop <= currentY) {
          currentSection = item.id;
        }
      }

      setActiveSectionId((previous) => (previous === currentSection ? previous : currentSection));
    };

    const handleResize = () => {
      stickyOffset = calculateOffset();
      updateActiveSection();
    };

    const handleHashChange = () => {
      const nextHashId = window.location.hash.replace("#", "");
      if (nextHashId && navItems.some((item) => item.id === nextHashId)) {
        setActiveSectionId(nextHashId);
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
      document.documentElement.style.removeProperty("--doc-sticky-offset");
    };
  }, [navItems]);

  useEffect(() => {
    const navBar = navBarRef.current;
    if (!navBar || !activeSectionId) {
      return;
    }

    const activeLink = navBar.querySelector<HTMLAnchorElement>(`a[data-nav-id="${activeSectionId}"]`);
    activeLink?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSectionId]);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const topbarHeight = topbarRef.current?.offsetHeight ?? 0;
    const extraGap = window.innerWidth <= 980 ? 18 : 24;
    const scrollOffset = topbarHeight + extraGap;
    const nextTop = target.getBoundingClientRect().top + window.scrollY - scrollOffset;

    window.scrollTo({ top: Math.max(nextTop, 0), behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveSectionId(id);
  };

  return (
    <main className="docPage">
      <div className="pageGlow" aria-hidden="true" />

      <header className="topbar" ref={topbarRef}>
        <div className="brandWrap">
          <div className="brandTitle">FullStackClinica</div>
          <p className="brandSubtitle">Documentacao funcional e tecnica</p>
        </div>

        <div className="topbarActions">
          <nav className="navBar" aria-label="Navegacao da documentacao" ref={navBarRef}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-nav-id={item.id}
                onClick={(event) => handleNavClick(event, item.id)}
                className={`navLink ${activeSectionId === item.id ? "navLinkActive" : ""}`}
                aria-current={activeSectionId === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link href="/login" className="loginButton">
            <LogIn size={16} />
            Voltar ao login
          </Link>
        </div>
      </header>

      <section id="visao-geral" className="hero">
        <p className="tag">Guia oficial do projeto</p>
        <h1>Documentacao completa das features, fluxos e arquitetura</h1>
        <p>
          Esta pagina resume o estado atual do sistema com foco pratico: o que existe no frontend,
          como o backend processa cada fluxo, quais regras de negocio estao ativas e como os modulos
          se conectam nos diagramas de classes e de sequencia.
        </p>

        <div className="flowGrid">
          {architectureFlow.map((item) => (
            <span key={item} className="flowItem">
              {item}
            </span>
          ))}
        </div>
      </section>

      {featureSections
        .filter((section) =>
          ["visao-geral", "frontend", "backend", "status-email"].includes(section.id)
        )
        .map((section) => (
          <section key={section.id} id={section.id} className="docSection">
            <div className="sectionHeader">
              <h2>{section.title}</h2>
              <p className="sectionSubtitle">{section.subtitle}</p>
              <p>{section.overview}</p>
            </div>

            <div className="cardGrid">
              {section.cards.map((card) => (
                <article key={`${section.id}-${card.title}`} className="featureCard">
                  <h3>{card.title}</h3>
                  <p>{card.summary}</p>

                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={`${card.title}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}

      <section id="endpoints" className="docSection">
        <div className="sectionHeader">
          <h2>Mapa de endpoints</h2>
          <p className="sectionSubtitle">Contrato atual de API usado pelo frontend</p>
          <p>
            Lista consolidada dos endpoints REST ativos, separados por dominio funcional para facilitar
            manutencao e onboard do time.
          </p>
        </div>

        <div className="endpointGroups">
          {endpointGroups.map((group) => (
            <article key={group.title} className="endpointCard">
              <header>
                <h3>{group.title}</h3>
                {group.note ? <p className="endpointNote">{group.note}</p> : null}
              </header>

              <div className="endpointList">
                {group.endpoints.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="endpointRow">
                    <span className={`methodBadge ${methodBadgeClass(endpoint.method)}`}>{endpoint.method}</span>
                    <code>{endpoint.path}</code>
                    <p>{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="dados" className="docSection">
        <div className="sectionHeader">
          <h2>Modelo de dados</h2>
          <p className="sectionSubtitle">Entidades, tabelas e regras de consistencia</p>
          <p>
            Todas as entidades abaixo estao ativas no backend e suportam os fluxos atuais da aplicacao,
            incluindo trilha de receita e notificacao de status.
          </p>
        </div>

        <div className="cardGrid">
          {entities.map((entity) => (
            <article key={entity.name} className="featureCard">
              <h3>
                {entity.name} <span className="entityTable">({entity.table})</span>
              </h3>
              <p>{entity.purpose}</p>

              <p className="groupTitle">Campos principais</p>
              <div className="pillWrap">
                {entity.fields.map((field) => (
                  <span key={`${entity.name}-${field}`} className="fieldPill">
                    {field}
                  </span>
                ))}
              </div>

              <p className="groupTitle">Regras</p>
              <ul>
                {entity.rules.map((rule) => (
                  <li key={`${entity.name}-${rule}`}>{rule}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="groupTitle daoTitle">DAO e metodos</p>
        <div className="daoGrid">
          {daoDocs.map((dao) => (
            <article key={dao.name} className="featureCard daoCard">
              <h3>{dao.name}</h3>
              <p>{dao.purpose}</p>

              <div className="daoMethodList">
                {dao.methods.map((method) => (
                  <article key={`${dao.name}-${method.signature}`} className="daoMethodItem">
                    <code className="daoSignature">{method.signature}</code>
                    <p>{method.description}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="diagrama-classes" className="docSection">
        <div className="sectionHeader">
          <h2>Diagrama de classes (atualizado)</h2>
          <p className="sectionSubtitle">Relacoes reais entre controllers, services, DAOs e models</p>
          <p>
            O diagrama abaixo foi refeito para refletir os modulos de pet, agendamento, receita e
            notificacao por email de mudanca de status.
          </p>
        </div>

        <article className="featureCard diagramCard">
          <MermaidClassDiagram chart={classDiagramMermaid} />
        </article>

        <article className="featureCard diagramCodeCard">
          <p className="groupTitle">Codigo Mermaid</p>
          <pre className="diagramCode">
            <code>{classDiagramMermaid}</code>
          </pre>
        </article>
      </section>

      <section id="diagrama-sequencia" className="docSection">
        <div className="sectionHeader">
          <h2>Diagrama simples de sequencia</h2>
          <p className="sectionSubtitle">Jornada: cliente, endereco, pet e consulta</p>
          <p>
            Este fluxo resume a ordem principal da jornada do cliente: primeiro cadastro, depois
            endereco, pet e por fim o agendamento da consulta.
          </p>
        </div>

        <article className="featureCard diagramCard">
          <MermaidClassDiagram chart={jornadaCadastroSequenceMermaid} />
        </article>

        <article className="featureCard diagramCodeCard">
          <p className="groupTitle">Codigo Mermaid</p>
          <pre className="diagramCode">
            <code>{jornadaCadastroSequenceMermaid}</code>
          </pre>
        </article>
      </section>

      {featureSections
        .filter((section) => ["seguranca", "operacao"].includes(section.id))
        .map((section) => (
          <section key={section.id} id={section.id} className="docSection">
            <div className="sectionHeader">
              <h2>{section.title}</h2>
              <p className="sectionSubtitle">{section.subtitle}</p>
              <p>{section.overview}</p>
            </div>

            <div className="cardGrid">
              {section.cards.map((card) => (
                <article key={`${section.id}-${card.title}`} className="featureCard">
                  <h3>{card.title}</h3>
                  <p>{card.summary}</p>

                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={`${card.title}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}

      <footer className="footer">
        <div className="footerGrid">
          <div className="footerItem">
            <PawPrint size={16} />
            <span>Jornada completa do cliente: perfil, endereco, pets e consultas.</span>
          </div>
          <div className="footerItem">
            <Stethoscope size={16} />
            <span>Painel medico com mudanca de status e emissao de receita por email.</span>
          </div>
          <div className="footerItem">
            <Mail size={16} />
            <span>Notificacao automatica por email para mudancas de status da consulta.</span>
          </div>
          <div className="footerItem">
            <Database size={16} />
            <span>Persistencia SQL nativa com trilha de receita e historico de atendimento.</span>
          </div>
          <div className="footerItem">
            <ShieldCheck size={16} />
            <span>Seguranca com sessao, CORS para frontend local e preflight OPTIONS liberado.</span>
          </div>
          <div className="footerItem">
            <Workflow size={16} />
            <span>Arquitetura organizada por camada para evolucao continua do projeto.</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap");

        html,
        body {
          margin: 0;
          padding: 0;
          background: #0d0f14;
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      <style jsx>{`
        .docPage {
          --bg-0: #0d0f14;
          --bg-1: #121824;
          --bg-2: #1b2434;
          --card: rgba(255, 255, 255, 0.06);
          --card-border: rgba(255, 255, 255, 0.14);
          --text: #f3f5f8;
          --muted: #b6becf;
          --accent: #ff7a00;
          --accent-soft: rgba(255, 122, 0, 0.18);
          --radius-lg: 24px;
          --radius-md: 16px;

          position: relative;
          min-height: 100vh;
          padding: 24px 24px 48px;
          color: var(--text);
          font-family: "Manrope", "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 14% 16%, rgba(255, 122, 0, 0.16), transparent 40%),
            radial-gradient(circle at 87% 5%, rgba(79, 164, 255, 0.15), transparent 38%),
            linear-gradient(165deg, var(--bg-0), var(--bg-1) 48%, var(--bg-2));
        }

        .pageGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 22% 75%, rgba(255, 122, 0, 0.1), transparent 45%),
            radial-gradient(circle at 74% 56%, rgba(98, 140, 255, 0.12), transparent 42%);
          z-index: 0;
        }

        .topbar,
        .hero,
        .docSection,
        .footer {
          position: relative;
          z-index: 1;
          max-width: 1340px;
          margin: 0 auto;
        }

        .topbar {
          position: sticky;
          top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
          padding: 12px 14px;
          border: 1px solid var(--card-border);
          border-radius: 18px;
          backdrop-filter: blur(12px);
          background: rgba(14, 18, 27, 0.72);
          z-index: 20;
        }

        .brandWrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex-shrink: 0;
        }

        .brandTitle {
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--accent);
          text-shadow: 0 0 14px rgba(255, 122, 0, 0.45);
        }

        .brandSubtitle {
          margin: 0;
          color: #c8d1e4;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
        }

        .topbarActions {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
          justify-content: flex-end;
        }

        .navBar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          flex-wrap: wrap;
        }

        .navLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          text-decoration: none;
          color: var(--text);
          font-weight: 600;
          font-size: 0.84rem;
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.04);
          transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }

        .navLink:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 122, 0, 0.55);
          background: var(--accent-soft);
        }

        .navLinkActive {
          border-color: rgba(255, 140, 46, 0.9);
          background: rgba(255, 122, 0, 0.22);
          color: #ffe7cf;
          box-shadow: inset 0 0 0 1px rgba(255, 180, 120, 0.3);
        }

        .loginButton {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #ffe7cf;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 152, 83, 0.55);
          background: rgba(255, 122, 0, 0.2);
          transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .loginButton:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 180, 120, 0.8);
          background: rgba(255, 122, 0, 0.28);
        }

        .hero {
          margin-bottom: 26px;
          padding: 26px;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          background: linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          box-shadow: 0 24px 40px rgba(6, 8, 12, 0.35);
        }

        .tag {
          display: inline-block;
          margin: 0 0 10px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 122, 0, 0.45);
          background: rgba(255, 122, 0, 0.12);
          color: #ffb679;
        }

        h1 {
          margin: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: clamp(1.5rem, 2.2vw, 2.2rem);
          line-height: 1.2;
        }

        .hero > p {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.65;
          max-width: 980px;
        }

        .flowGrid {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .flowItem {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.05);
          color: #e6eaf2;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 0.82rem;
        }

        .docSection {
          margin-bottom: 24px;
          scroll-margin-top: var(--doc-sticky-offset, 110px);
        }

        .sectionHeader {
          margin-bottom: 12px;
        }

        .sectionHeader h2 {
          margin: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: clamp(1.2rem, 1.85vw, 1.72rem);
        }

        .sectionSubtitle {
          margin: 6px 0 8px;
          color: #ffb276;
          font-weight: 700;
          font-size: 0.92rem;
        }

        .sectionHeader p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
          max-width: 1050px;
        }

        .cardGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 12px;
        }

        .featureCard {
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          background: var(--card);
          backdrop-filter: blur(8px);
          padding: 14px;
          box-shadow: 0 10px 24px rgba(5, 8, 14, 0.28);
        }

        .featureCard h3 {
          margin: 0;
          font-size: 1.03rem;
          color: #ffe0c5;
          font-family: "Space Grotesk", "Manrope", sans-serif;
        }

        .featureCard p {
          margin: 8px 0 0;
          color: #d6deeb;
          line-height: 1.55;
          font-size: 0.9rem;
        }

        .featureCard ul {
          margin: 10px 0 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
        }

        .featureCard li {
          color: #dfe6f5;
          line-height: 1.5;
          font-size: 0.86rem;
        }

        .endpointGroups {
          display: grid;
          gap: 12px;
        }

        .endpointCard {
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          background: var(--card);
          backdrop-filter: blur(8px);
          padding: 14px;
          box-shadow: 0 10px 24px rgba(5, 8, 14, 0.28);
        }

        .endpointCard h3 {
          margin: 0;
          font-size: 1rem;
          color: #ffe0c5;
          font-family: "Space Grotesk", "Manrope", sans-serif;
        }

        .endpointNote {
          margin: 6px 0 0;
          color: #ffd3ad;
          font-size: 0.8rem;
        }

        .endpointList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .endpointRow {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          background: rgba(10, 14, 22, 0.58);
          padding: 10px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          grid-template-areas:
            "method path"
            "desc desc";
          gap: 6px 8px;
          align-items: center;
        }

        .endpointRow code {
          grid-area: path;
          color: #9ec3ff;
          font-size: 0.84rem;
          word-break: break-word;
        }

        .endpointRow p {
          grid-area: desc;
          margin: 0;
          color: #d5deef;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .methodBadge {
          grid-area: method;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 62px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
        }

        .methodGet {
          color: #75d8ff;
          background: rgba(76, 180, 255, 0.16);
          border-color: rgba(128, 209, 255, 0.35);
        }

        .methodPost {
          color: #ffd289;
          background: rgba(255, 164, 64, 0.17);
          border-color: rgba(255, 197, 119, 0.4);
        }

        .methodPut {
          color: #b2f5b2;
          background: rgba(74, 204, 109, 0.18);
          border-color: rgba(131, 236, 157, 0.4);
        }

        .methodDelete {
          color: #ffb1b1;
          background: rgba(255, 82, 82, 0.17);
          border-color: rgba(255, 141, 141, 0.38);
        }

        .entityTable {
          color: #9ec3ff;
          font-size: 0.78rem;
          font-weight: 700;
          margin-left: 5px;
        }

        .groupTitle {
          margin-top: 12px !important;
          font-size: 0.82rem !important;
          font-weight: 700;
          color: #ffd3ad !important;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .pillWrap {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .fieldPill {
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 0.75rem;
          border: 1px solid rgba(111, 162, 255, 0.35);
          background: rgba(66, 126, 247, 0.14);
          color: #d7e6ff;
        }

        .daoTitle {
          margin-top: 16px !important;
          margin-bottom: 8px !important;
        }

        .daoGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 12px;
        }

        .daoCard {
          display: flex;
          flex-direction: column;
        }

        .daoMethodList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .daoMethodItem {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          background: rgba(10, 14, 22, 0.54);
          padding: 9px;
        }

        .daoMethodItem p {
          margin: 7px 0 0;
          color: #d6deeb;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .daoSignature {
          display: inline-block;
          max-width: 100%;
          overflow-wrap: anywhere;
          font-size: 0.77rem;
          color: #a7caff;
          background: rgba(66, 126, 247, 0.14);
          border: 1px solid rgba(111, 162, 255, 0.35);
          border-radius: 999px;
          padding: 5px 9px;
        }

        .diagramCard {
          padding: 12px;
        }

        .diagramLoading,
        .diagramError {
          margin: 0;
          padding: 18px;
          border-radius: var(--radius-md);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          background: rgba(12, 18, 28, 0.65);
          color: #d7dfef;
          font-size: 0.9rem;
        }

        .diagramError {
          color: #ffcab3;
          border-color: rgba(255, 119, 77, 0.45);
          background: rgba(43, 18, 14, 0.65);
        }

        .diagramSvg {
          border-radius: 12px;
          border: 1px solid rgba(124, 166, 255, 0.35);
          background: rgba(10, 15, 23, 0.88);
          overflow: auto;
          padding: 10px;
        }

        .diagramSvg :global(svg) {
          display: block;
          min-width: 1080px;
          height: auto;
        }

        .diagramCodeCard {
          margin-top: 10px;
        }

        .diagramCode {
          margin: 0;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(8, 12, 20, 0.7);
          max-height: 380px;
          overflow: auto;
          font-size: 0.77rem;
          line-height: 1.45;
          color: #c3d2ed;
        }

        .footer {
          margin-top: 14px;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.04);
        }

        .footerGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 10px;
        }

        .footerItem {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 14, 22, 0.45);
          padding: 10px;
          color: #d6deeb;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        @media (max-width: 980px) {
          .docPage {
            padding: 16px 14px 30px;
          }

          .topbar {
            top: 6px;
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 18px;
            border-radius: 14px;
            padding: 12px;
          }

          .brandWrap {
            width: 100%;
          }

          .topbarActions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .navBar {
            width: 100%;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 4px;
            padding-right: 2px;
            scroll-snap-type: x proximity;
            justify-content: flex-start;
          }

          .navLink {
            scroll-snap-align: center;
          }

          .loginButton {
            align-self: flex-end;
          }

          .hero {
            padding: 18px;
          }

          .diagramSvg :global(svg) {
            min-width: 900px;
          }
        }

        @media (max-width: 640px) {
          .docPage {
            padding: 12px 10px 24px;
          }

          .topbar {
            top: 4px;
            margin-bottom: 14px;
            padding: 10px;
          }

          .brandTitle {
            font-size: 0.98rem;
          }

          .brandSubtitle {
            font-size: 0.74rem;
          }

          .cardGrid {
            grid-template-columns: 1fr;
          }

          .daoGrid {
            grid-template-columns: 1fr;
          }

          .featureCard {
            padding: 12px;
          }

          .featureCard p,
          .featureCard li {
            font-size: 0.83rem;
          }

          .endpointRow {
            grid-template-columns: 1fr;
            grid-template-areas:
              "method"
              "path"
              "desc";
          }

          .diagramSvg :global(svg) {
            min-width: 740px;
          }
        }
      `}</style>
    </main>
  );
}
