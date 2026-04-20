"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
type MethodDoc = {
  name: string;
  signature: string;
  returns: string;
  description: string;
  rules?: string[];
};

type ClassDoc = {
  file: string;
  packageName: string;
  className: string;
  role: string;
  notes?: string[];
  methods: MethodDoc[];
};

type SectionDoc = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  classes: ClassDoc[];
};

type NavItem = {
  id: string;
  label: string;
};

type FieldSpec = {
  camel: string;
  type: string;
  description: string;
};

const toPascal = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const createAccessorDocs = (
  fields: FieldSpec[],
  options?: { includeSetter?: boolean },
): MethodDoc[] => {
  const includeSetter = options?.includeSetter ?? true;

  return fields.flatMap((field) => {
    const methodSuffix = toPascal(field.camel);

    const getter: MethodDoc = {
      name: `get${methodSuffix}`,
      signature: `get${methodSuffix}()`,
      returns: field.type,
      description: `Retorna ${field.description}.`,
    };

    if (!includeSetter) {
      return [getter];
    }

    const setter: MethodDoc = {
      name: `set${methodSuffix}`,
      signature: `set${methodSuffix}(${field.type} ${field.camel})`,
      returns: "void",
      description: `Atualiza ${field.description}.`,
    };

    return [getter, setter];
  });
};

const createBuilderDocs = (
  entityName: string,
  fields: FieldSpec[],
  buildDescription: string,
  buildRules?: string[],
): MethodDoc[] => {
  const fluentMethods = fields.map((field) => ({
    name: field.camel,
    signature: `${field.camel}(${field.type} ${field.camel})`,
    returns: "Builder",
    description: `Define ${field.description} no Builder e retorna o proprio Builder para encadeamento.`,
  }));

  return [
    ...fluentMethods,
    {
      name: "build",
      signature: "build()",
      returns: entityName,
      description: buildDescription,
      rules: buildRules,
    },
  ];
};

const jpaRepositoryInheritedMethods: MethodDoc[] = [
  {
    name: "save",
    signature: "save(S entity)",
    returns: "S",
    description: "Salva ou atualiza uma entidade conforme o estado do id.",
  },
  {
    name: "saveAll",
    signature: "saveAll(Iterable<S> entities)",
    returns: "List<S>",
    description: "Salva uma coleção de entidades em lote.",
  },
  {
    name: "findById",
    signature: "findById(ID id)",
    returns: "Optional<T>",
    description: "Busca uma entidade pelo id e retorna Optional.",
  },
  {
    name: "existsById",
    signature: "existsById(ID id)",
    returns: "boolean",
    description: "Verifica se existe registro para o id informado.",
  },
  {
    name: "findAll",
    signature: "findAll()",
    returns: "List<T>",
    description: "Lista todos os registros da entidade.",
  },
  {
    name: "findAllById",
    signature: "findAllById(Iterable<ID> ids)",
    returns: "List<T>",
    description: "Busca todos os registros cujos ids foram informados.",
  },
  {
    name: "count",
    signature: "count()",
    returns: "long",
    description: "Conta o total de registros da tabela.",
  },
  {
    name: "deleteById",
    signature: "deleteById(ID id)",
    returns: "void",
    description: "Remove um registro pelo id.",
  },
  {
    name: "delete",
    signature: "delete(T entity)",
    returns: "void",
    description: "Remove o registro correspondente a entidade recebida.",
  },
  {
    name: "deleteAllById",
    signature: "deleteAllById(Iterable<? extends ID> ids)",
    returns: "void",
    description: "Remove varios registros pelos ids informados.",
  },
  {
    name: "deleteAll",
    signature: "deleteAll(Iterable<? extends T> entities)",
    returns: "void",
    description: "Remove uma colecao de entidades.",
  },
  {
    name: "deleteAll",
    signature: "deleteAll()",
    returns: "void",
    description: "Remove todos os registros da tabela.",
  },
  {
    name: "findAll",
    signature: "findAll(Sort sort)",
    returns: "List<T>",
    description: "Lista os registros com ordenacao customizada.",
  },
  {
    name: "findAll",
    signature: "findAll(Pageable pageable)",
    returns: "Page<T>",
    description: "Retorna uma pagina de resultados com paginacao.",
  },
  {
    name: "flush",
    signature: "flush()",
    returns: "void",
    description: "Forca sincronizacao imediata do contexto JPA com o banco.",
  },
  {
    name: "saveAndFlush",
    signature: "saveAndFlush(S entity)",
    returns: "S",
    description: "Salva a entidade e executa flush na mesma operacao.",
  },
  {
    name: "saveAllAndFlush",
    signature: "saveAllAndFlush(Iterable<S> entities)",
    returns: "List<S>",
    description: "Salva uma colecao e executa flush ao final.",
  },
  {
    name: "deleteAllInBatch",
    signature: "deleteAllInBatch()",
    returns: "void",
    description: "Remove todos os registros em lote usando SQL direto.",
  },
  {
    name: "deleteAllInBatch",
    signature: "deleteAllInBatch(Iterable<T> entities)",
    returns: "void",
    description: "Remove em lote apenas as entidades informadas.",
  },
  {
    name: "deleteAllByIdInBatch",
    signature: "deleteAllByIdInBatch(Iterable<ID> ids)",
    returns: "void",
    description: "Remove em lote pelos ids sem carregar entidades.",
  },
  {
    name: "getReferenceById",
    signature: "getReferenceById(ID id)",
    returns: "T",
    description: "Retorna uma referencia lazy para a entidade, sem consulta imediata.",
  },
  {
    name: "findOne",
    signature: "findOne(Example<S> example)",
    returns: "Optional<S>",
    description: "Busca um unico registro por Query by Example.",
  },
  {
    name: "findAll",
    signature: "findAll(Example<S> example)",
    returns: "List<S>",
    description: "Busca varios registros por Query by Example.",
  },
  {
    name: "findAll",
    signature: "findAll(Example<S> example, Sort sort)",
    returns: "List<S>",
    description: "Query by Example com ordenacao.",
  },
  {
    name: "findAll",
    signature: "findAll(Example<S> example, Pageable pageable)",
    returns: "Page<S>",
    description: "Query by Example com paginacao.",
  },
  {
    name: "count",
    signature: "count(Example<S> example)",
    returns: "long",
    description: "Conta registros que combinam com o exemplo.",
  },
  {
    name: "exists",
    signature: "exists(Example<S> example)",
    returns: "boolean",
    description: "Verifica se existe ao menos um registro compativel com o exemplo.",
  },
];

const clienteFields: FieldSpec[] = [
  { camel: "id", type: "Long", description: "o identificador unico do cliente" },
  { camel: "nome", type: "String", description: "o nome completo do cliente" },
  { camel: "cpf", type: "String", description: "o CPF unico do cliente" },
  { camel: "email", type: "String", description: "o email de acesso do cliente" },
  { camel: "senha", type: "String", description: "a senha criptografada do cliente" },
  { camel: "telefone", type: "String", description: "o telefone de contato do cliente" },
];

const enderecoFields: FieldSpec[] = [
  { camel: "id", type: "Long", description: "o identificador unico do endereco" },
  { camel: "cep", type: "String", description: "o CEP do endereco" },
  { camel: "logradouro", type: "String", description: "o logradouro" },
  { camel: "numero", type: "String", description: "o numero do imovel" },
  { camel: "complemento", type: "String", description: "o complemento do endereco" },
  { camel: "bairro", type: "String", description: "o bairro" },
  { camel: "cidade", type: "String", description: "a cidade" },
  { camel: "uf", type: "String", description: "a unidade federativa" },
  { camel: "pais", type: "String", description: "o pais" },
  {
    camel: "pontoReferencia",
    type: "String",
    description: "o ponto de referencia para facilitar localizacao",
  },
  { camel: "tipoEndereco", type: "String", description: "o tipo do endereco (ex: residencial)" },
  { camel: "clienteId", type: "Long", description: "o id do cliente dono do endereco" },
];

const sections: SectionDoc[] = [
  {
    id: "model",
    title: "Model",
    subtitle: "Entidades e objetos de dominio",
    overview:
      "Camada que representa o dominio da aplicacao e o mapeamento das tabelas. Reune atributos, construtores e Builders para criar objetos consistentes antes da persistencia.",
    classes: [
      {
        file: "src/main/java/com/example/demo/model/Cliente.java",
        packageName: "com.example.demo.model",
        className: "Cliente",
        role:
          "Entidade JPA da tabela clientes. Centraliza dados de identificacao e autenticacao, usando Builder para montagem segura do objeto.",
        methods: [
          {
            name: "Cliente",
            signature: "Cliente()",
            returns: "construtor protegido",
            description: "Construtor sem argumentos exigido pelo JPA para materializar a entidade.",
          },
          {
            name: "Cliente",
            signature: "Cliente(Builder builder)",
            returns: "construtor privado",
            description: "Recebe os dados montados no Builder e cria a instancia final da entidade.",
          },
          ...createAccessorDocs(clienteFields, { includeSetter: false }),
          ...createBuilderDocs(
            "Cliente",
            clienteFields.filter((field) => field.camel !== "id"),
            "Cria e retorna um Cliente pronto para persistencia, aplicando validacoes de campos obrigatorios.",
            [
              "nome nao pode ser nulo ou vazio",
              "cpf nao pode ser nulo ou vazio",
              "senha precisa ter no minimo 6 caracteres",
            ],
          ),
        ],
      },
      {
        file: "src/main/java/com/example/demo/model/Endereco.java",
        packageName: "com.example.demo.model",
        className: "Endereco",
        role:
          "Entidade JPA da tabela enderecos. Armazena dados de localizacao vinculados ao cliente para cadastro e atendimento.",
        methods: [
          {
            name: "Endereco",
            signature: "Endereco()",
            returns: "construtor publico",
            description: "Construtor vazio utilizado pelo JPA e por desserializacao JSON.",
          },
          {
            name: "Endereco",
            signature: "Endereco(Builder builder)",
            returns: "construtor privado",
            description: "Cria o objeto Endereco a partir dos dados montados no Builder.",
          },
          {
            name: "Endereco",
            signature:
              "Endereco(Long id, String cep, String logradouro, String numero, String complemento, String bairro, String cidade, String uf, String pais, String pontoReferencia, String tipoEndereco, Long clienteId)",
            returns: "construtor publico",
            description: "Permite instanciar Endereco com todos os campos de forma direta.",
          },
          ...createAccessorDocs(enderecoFields, { includeSetter: true }),
          ...createBuilderDocs(
            "Endereco",
            enderecoFields,
            "Cria e retorna um Endereco com os dados validados no Builder.",
          ),
        ],
      },
    ],
  },
  {
    id: "builder",
    title: "Builder",
    subtitle: "Motivo do uso e pontos de aplicacao",
    overview:
      "Esta secao explica por que o padrao Builder e adotado no projeto: ele evita construtores longos, centraliza validacoes no build() e garante objetos consistentes antes da persistencia ou autenticacao.",
    classes: [
      {
        file: "src/main/java/com/example/demo/model/Cliente.java",
        packageName: "com.example.demo.model",
        className: "Cliente.Builder",
        role:
          "Builder responsavel por montar Cliente com legibilidade e regras minimas de consistencia antes de salvar.",
        notes: [
          "Motivo: reduzir construtor com muitos parametros",
          "Onde e usado: cadastro de cliente e criacao em fluxo social",
          "Resultado: objeto final validado antes de chegar ao DAO",
        ],
        methods: createBuilderDocs(
          "Cliente",
          clienteFields.filter((field) => field.camel !== "id"),
          "Valida campos obrigatorios e retorna Cliente pronto para persistencia.",
          ["nome e cpf obrigatorios", "senha com regra minima"],
        ),
      },
      {
        file: "src/main/java/com/example/demo/Auth/Login.java",
        packageName: "com.example.demo.Auth",
        className: "Login.Builder",
        role:
          "Builder do DTO de login que impede autenticacao com payload parcial e organiza a validacao de entrada.",
        notes: [
          "Motivo: padronizar validacao do payload de login",
          "Onde e usado: AuthController.login antes do AuthService",
          "Resultado: erros de entrada mais previsiveis (HTTP 400)",
        ],
        methods: [
          {
            name: "email",
            signature: "email(String email)",
            returns: "Builder",
            description: "Define email no Builder e retorna o proprio Builder.",
          },
          {
            name: "senha",
            signature: "senha(String senha)",
            returns: "Builder",
            description: "Define senha no Builder e retorna o proprio Builder.",
          },
          {
            name: "build",
            signature: "build()",
            returns: "Login",
            description: "Valida email/senha e retorna Login pronto para autenticacao.",
            rules: ["email obrigatorio", "senha obrigatoria"],
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/model/Endereco.java",
        packageName: "com.example.demo.model",
        className: "Endereco.Builder",
        role:
          "Builder usado para montar Endereco de forma segura, sem depender de construtor com muitos argumentos.",
        notes: [
          "Motivo: facilitar manutencao e evolucao do modelo de endereco",
          "Onde e usado: EnderecoService.cadastrar",
          "Resultado: persistencia com objeto padronizado e completo",
        ],
        methods: createBuilderDocs(
          "Endereco",
          enderecoFields,
          "Retorna Endereco final para o fluxo de cadastro e persistencia.",
        ),
      },
    ],
  },
  {
    id: "login",
    title: "Login",
    subtitle: "Autenticacao e seguranca",
    overview:
      "Reune DTOs e configuracoes de autenticacao (email/senha e Google OAuth2), incluindo criacao de sessao e regras de CORS para integracao com o frontend.",
    classes: [
      {
        file: "src/main/java/com/example/demo/Auth/Login.java",
        packageName: "com.example.demo.Auth",
        className: "Login",
        role: "DTO de entrada do login tradicional. Carrega email e senha recebidos pela API.",
        methods: [
          {
            name: "Login",
            signature: "Login()",
            returns: "construtor publico",
            description: "Construtor vazio usado para criar o objeto de requisicao.",
          },
          {
            name: "Login",
            signature: "Login(Builder builder)",
            returns: "construtor privado",
            description: "Monta o objeto final com os campos validados no Builder.",
          },
          {
            name: "getEmail",
            signature: "getEmail()",
            returns: "String",
            description: "Retorna o email informado no login.",
          },
          {
            name: "getSenha",
            signature: "getSenha()",
            returns: "String",
            description: "Retorna a senha informada no login.",
          },
          {
            name: "setEmail",
            signature: "setEmail(String email)",
            returns: "void",
            description: "Atualiza o email da requisicao de login.",
          },
          {
            name: "setSenha",
            signature: "setSenha(String senha)",
            returns: "void",
            description: "Atualiza a senha da requisicao de login.",
          },
          {
            name: "Builder.email",
            signature: "email(String email)",
            returns: "Builder",
            description: "Define email no builder e permite encadear chamadas.",
          },
          {
            name: "Builder.senha",
            signature: "senha(String senha)",
            returns: "Builder",
            description: "Define senha no builder e permite encadear chamadas.",
          },
          {
            name: "Builder.build",
            signature: "build()",
            returns: "Login",
            description: "Valida campos obrigatorios e retorna o objeto Login pronto para autenticacao.",
            rules: ["email nao pode ser vazio", "senha nao pode ser vazia"],
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/config/SecurityConfig.java",
        packageName: "com.example.demo.config",
        className: "SecurityConfig",
        role:
          "Configuracao central do Spring Security. Define rotas publicas, fluxo OAuth2 e politica de CORS da aplicacao.",
        methods: [
          {
            name: "SecurityConfig",
            signature: "SecurityConfig(ClienteService clienteService)",
            returns: "construtor publico",
            description: "Injeta ClienteService para uso no fluxo de sucesso do OAuth2.",
          },
          {
            name: "successHandler",
            signature: "successHandler()",
            returns: "AuthenticationSuccessHandler",
            description:
              "Processa sucesso do Google OAuth2: extrai email/nome, chama loginComGoogle, registra usuarioLogado na sessao e redireciona para /dashboard.",
          },
          {
            name: "filterChain",
            signature: "filterChain(HttpSecurity http)",
            returns: "SecurityFilterChain",
            description:
              "Monta a cadeia de seguranca: habilita CORS, desabilita CSRF para API stateless e exige autenticacao apenas nas rotas protegidas.",
          },
          {
            name: "corsConfigurationSource",
            signature: "corsConfigurationSource()",
            returns: "CorsConfigurationSource",
            description:
              "Define CORS para o frontend em http://localhost:3000, liberando metodos e headers necessarios com envio de credenciais de sessao.",
          },
        ],
      },
    ],
  },
  {
    id: "controller",
    title: "Controller",
    subtitle: "Entrada HTTP e respostas REST",
    overview:
      "Ponto de entrada HTTP da API. Controllers recebem payloads, traduzem erros para codigos HTTP e delegam regras de negocio para os services.",
    classes: [
      {
        file: "src/main/java/com/example/demo/controller/AuthController.java",
        packageName: "com.example.demo.controller",
        className: "AuthController",
        role:
          "Controlador de sessao: autentica com email/senha, guarda usuario na sessao HTTP e encerra login no logout.",
        methods: [
          {
            name: "AuthController",
            signature: "AuthController(AuthService authService)",
            returns: "construtor publico",
            description: "Injeta AuthService que valida credenciais de login.",
          },
          {
            name: "login",
            signature: "login(@RequestBody Login login, HttpSession session)",
            returns: "ResponseEntity<?>",
            description:
              "Valida o payload com Login.Builder, autentica via AuthService, salva usuarioLogado na sessao e retorna os dados do cliente autenticado.",
            rules: [
              "IllegalArgumentException gera HTTP 400",
              "RuntimeException de autenticacao gera HTTP 401",
            ],
          },
          {
            name: "logout",
            signature: "logout(HttpSession session, HttpServletResponse response)",
            returns: "ResponseEntity<?>",
            description:
              "Invalida a sessao atual, remove o cookie JSESSIONID e confirma o logout com mensagem de sucesso.",
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/controller/ClienteController.java",
        packageName: "com.example.demo.controller",
        className: "ClienteController (equivalente ao ControllerCliente pedido)",
        role:
          "Controlador de cliente: cadastro inicial, leitura do usuario em sessao e atualizacao cadastral.",
        methods: [
          {
            name: "ClienteController",
            signature: "ClienteController(ClienteService service)",
            returns: "construtor publico",
            description: "Injeta ClienteService com regras de negocio do cliente.",
          },
          {
            name: "salvar",
            signature: "salvar(@RequestBody Cliente cliente)",
            returns: "ResponseEntity<?>",
            description:
              "Recebe os dados do cliente, chama service.salvar e retorna o registro criado. Conflitos de negocio sao devolvidos como HTTP 409.",
          },
          {
            name: "user",
            signature: "user(HttpSession session)",
            returns: "ResponseEntity<?>",
            description:
              "Le usuarioLogado da sessao e retorna o cliente autenticado. Se nao houver sessao valida, responde com HTTP 401.",
          },
          {
            name: "atualizarCliente",
            signature: "atualizarCliente(@PathVariable Long id, @RequestBody Cliente dadosAtualizados)",
            returns: "ResponseEntity<?>",
            description:
              "Atualiza nome/cpf/telefone do cliente e mapeia cada falha para o status correto: 404 (nao encontrado), 409 (conflito) e 500 (erro interno).",
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/controller/EnderecoController.java",
        packageName: "com.example.demo.controller",
        className: "EnderecoController",
        role: "Controlador de endereco: recebe o payload, aciona o service e devolve resposta HTTP adequada.",
        methods: [
          {
            name: "EnderecoController",
            signature: "EnderecoController(EnderecoService enderecoService)",
            returns: "construtor publico",
            description: "Injeta EnderecoService responsavel pelas validacoes de endereco.",
          },
          {
            name: "cadastrarEndereco",
            signature: "cadastrarEndereco(@RequestBody Endereco endereco)",
            returns: "ResponseEntity<?>",
            description:
              "Cria novo endereco via service.cadastrar e responde HTTP 201 no sucesso. Erros de validacao/negocio retornam 400 ou 404; falhas inesperadas retornam 500.",
          },
        ],
      },
    ],
  },
  {
    id: "dao",
    title: "Dao",
    subtitle: "Acesso SQL nativo com EntityManager",
    overview:
      "Camada de persistencia com SQL nativo via EntityManager. E usada quando a aplicacao precisa de controle fino sobre INSERT, SELECT e UPDATE alem do CRUD padrao.",
    classes: [
      {
        file: "src/main/java/com/example/demo/DAO/ClienteDAO.java",
        packageName: "com.example.demo.DAO",
        className: "ClienteDAO",
        role: "Persistencia de Cliente com SQL nativo e transacoes Spring para escrita segura.",
        methods: [
          {
            name: "salvar",
            signature: "salvar(Cliente cliente)",
            returns: "Cliente",
            description:
              "Executa INSERT em clientes, valida linhas afetadas e consulta novamente por email para devolver o cliente persistido com dados finais.",
            rules: [
              "usa @Transactional",
              "se linhasAfetadas == 0 dispara RuntimeException",
              "se nao encontrar apos insert dispara RuntimeException",
            ],
          },
          {
            name: "buscarPorCpf",
            signature: "buscarPorCpf(String cpf)",
            returns: "Optional<Cliente>",
            description: "Busca cliente por CPF com LIMIT 1 e retorna Optional.",
          },
          {
            name: "buscarPorEmail",
            signature: "buscarPorEmail(String email)",
            returns: "Optional<Cliente>",
            description: "Busca cliente por email com LIMIT 1 e retorna Optional.",
          },
          {
            name: "buscarPorId",
            signature: "buscarPorId(Long id)",
            returns: "Optional<Cliente>",
            description: "Busca cliente por id com SQL nativo e retorna Optional.",
          },
          {
            name: "existeCpfParaOutroId",
            signature: "existeCpfParaOutroId(String cpf, Long id)",
            returns: "boolean",
            description:
              "Conta quantos clientes possuem o mesmo CPF com id diferente, evitando duplicidade durante atualizacao.",
          },
          {
            name: "atualizarCampos",
            signature: "atualizarCampos(Long id, String nome, String cpf, String telefone)",
            returns: "Cliente",
            description:
              "Executa UPDATE de nome/cpf/telefone. Se nenhum registro for alterado dispara erro; depois busca por id para retornar o estado atualizado.",
            rules: ["usa @Transactional", "retorna RuntimeException quando id nao existe"],
          },
          {
            name: "listarTodos",
            signature: "listarTodos()",
            returns: "List<Cliente>",
            description: "Retorna todos os clientes da tabela com SELECT nativo.",
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/DAO/EnderecoDAO.java",
        packageName: "com.example.demo.DAO",
        className: "EnderecoDAO",
        role: "Persistencia de Endereco com SQL nativo, incluindo validacao de cliente existente.",
        methods: [
          {
            name: "salvar",
            signature: "salvar(Endereco endereco)",
            returns: "Endereco",
            description:
              "Executa INSERT em enderecos e recupera o registro recem criado para devolver o objeto completo.",
            rules: ["usa @Transactional", "depende de LAST_INSERT_ID() do MySQL"],
          },
          {
            name: "clienteExiste",
            signature: "clienteExiste(Long clienteId)",
            returns: "boolean",
            description: "Verifica por COUNT se o cliente informado existe na tabela clientes.",
          },
          {
            name: "buscarUltimoInserido",
            signature: "buscarUltimoInserido()",
            returns: "Optional<Endereco>",
            description: "Metodo privado que recupera o endereco recem inserido via LAST_INSERT_ID().",
          },
        ],
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    subtitle: "Regras de negocio da aplicacao",
    overview:
      "Camada que concentra regras de negocio e validacoes. Orquestra fluxo entre controllers e persistencia antes de salvar ou retornar dados.",
    classes: [
      {
        file: "src/main/java/com/example/demo/services/AuthService.java",
        packageName: "com.example.demo.services",
        className: "AuthService",
        role: "Servico de autenticacao que valida credenciais e compara senha com PasswordEncoder.",
        methods: [
          {
            name: "AuthService",
            signature: "AuthService(ClienteDAO clienteDAO, PasswordEncoder passwordEncoder)",
            returns: "construtor publico",
            description: "Injeta DAO para busca de cliente e encoder para validacao segura da senha.",
          },
          {
            name: "verificarLogin",
            signature: "verificarLogin(Login login)",
            returns: "Cliente",
            description:
              "Busca cliente por email e compara a senha com passwordEncoder.matches. Retorna o cliente autenticado ou erro de credenciais.",
            rules: [
              "se email nao existir dispara RuntimeException('Usuario nao encontrado')",
              "se senha nao bater dispara RuntimeException('Senha invalida')",
            ],
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/services/ClienteService.java",
        packageName: "com.example.demo.services",
        className: "ClienteService",
        role: "Servico de cliente: cadastro, atualizacao e login social com regras de validacao.",
        methods: [
          {
            name: "ClienteService",
            signature: "ClienteService(ClienteDAO clienteDAO, PasswordEncoder passwordEncoder)",
            returns: "construtor publico",
            description: "Injeta DAO e encoder para as regras de cliente.",
          },
          {
            name: "contarLetras",
            signature: "contarLetras(String senha)",
            returns: "int",
            description: "Metodo privado que conta quantos caracteres alfabeticos existem na senha.",
          },
          {
            name: "salvar",
            signature: "salvar(Cliente cliente)",
            returns: "Cliente",
            description:
              "Valida unicidade de CPF/email, exige senha minima com letras, criptografa a senha e persiste o cliente via DAO.",
            rules: [
              "cpf duplicado gera RuntimeException",
              "email duplicado gera RuntimeException",
              "senha com menos de 3 letras gera RuntimeException",
            ],
          },
          {
            name: "atualizarCliente",
            signature: "atualizarCliente(Long id, Cliente dadosAtualizados)",
            returns: "Cliente",
            description:
              "Busca cliente existente, combina dados antigos com os novos, valida CPF unico e persiste uma atualizacao parcial segura.",
          },
          {
            name: "listar",
            signature: "listar()",
            returns: "Iterable<Cliente>",
            description: "Lista todos os clientes delegando para clienteDAO.listarTodos().",
          },
          {
            name: "loginComGoogle",
            signature: "loginComGoogle(String email, String nome)",
            returns: "Cliente",
            description:
              "Se o email ja existir reutiliza o cliente atual; caso contrario cria um novo cliente com marcadores de origem Google.",
          },
        ],
      },
      {
        file: "src/main/java/com/example/demo/services/EnderecoService.java",
        packageName: "com.example.demo.services",
        className: "EnderecoService",
        role: "Servico de endereco com validacao do cliente dono antes da persistencia.",
        methods: [
          {
            name: "EnderecoService",
            signature: "EnderecoService(EnderecoDAO enderecoDAO)",
            returns: "construtor publico",
            description: "Injeta EnderecoDAO para operacoes de persistencia.",
          },
          {
            name: "cadastrar",
            signature: "cadastrar(Endereco endereco)",
            returns: "Endereco",
            description:
              "Valida clienteId obrigatorio, confirma que o cliente existe, monta o Endereco com Builder e salva via DAO.",
            rules: [
              "clienteId nulo gera RuntimeException",
              "cliente inexistente gera RuntimeException('Cliente nao encontrado')",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "repository",
    title: "Repository",
    subtitle: "Spring Data JPA e metodos herdados",
    overview:
      "Camada declarativa do Spring Data JPA. Combina metodos customizados (findBy...) com CRUD, paginacao e ordenacao herdados automaticamente.",
    classes: [
      {
        file: "src/main/java/com/example/demo/repository/ClienteRepository.java",
        packageName: "com.example.demo.repository",
        className: "ClienteRepository",
        role:
          "Repositorio JPA de Cliente com consultas por email/CPF e acesso completo a CRUD, ordenacao e paginacao herdados.",
        notes: [
          "Extende JpaRepository<Cliente, Long>",
          "Metodos declarados no arquivo convivem com metodos herdados",
        ],
        methods: [
          {
            name: "findByEmail",
            signature: "findByEmail(String email)",
            returns: "Optional<Cliente>",
            description: "Consulta cliente pelo email.",
          },
          {
            name: "findByCpf",
            signature: "findByCpf(String cpf)",
            returns: "Optional<Cliente>",
            description: "Consulta cliente pelo CPF.",
          },
          {
            name: "findById",
            signature: "findById(long id)",
            returns: "Optional<Cliente>",
            description: "Consulta cliente por id usando assinatura declarada no proprio repositorio.",
          },
          ...jpaRepositoryInheritedMethods,
        ],
      },
      {
        file: "src/main/java/com/example/demo/repository/EnderecoRepository.java",
        packageName: "com.example.demo.repository",
        className: "EnderecoRepository",
        role: "Repositorio JPA de Endereco que utiliza diretamente os metodos herdados do JpaRepository.",
        notes: [
          "Nao declara metodos customizados no arquivo",
          "Toda operacao CRUD e paginacao vem da heranca",
        ],
        methods: [...jpaRepositoryInheritedMethods],
      },
    ],
  },
];

const architectureFlow = [
  "Controller recebe HTTP, valida e delega",
  "Service aplica regras de negocio",
  "DAO/Repository persiste e consulta dados",
  "Model define estrutura do dominio",
  "Sessao preserva o usuario autenticado",
];

const navigationItems: NavItem[] = [
  { id: "diagrama-classe", label: "Diagrama" },
  ...sections.map((section) => ({ id: section.id, label: section.title })),
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
}

class Login {
  +String email
  +String senha
}

class AuthController {
  +AuthController(authService)
  +login(login, session) ResponseEntity
  +logout(session, response) ResponseEntity
}

class ClienteController {
  +ClienteController(service)
  +salvar(cliente) ResponseEntity
  +user(session) ResponseEntity
  +atualizarCliente(id, dadosAtualizados) ResponseEntity
}

class EnderecoController {
  +EnderecoController(enderecoService)
  +cadastrarEndereco(endereco) ResponseEntity
}

class SecurityConfig {
  +SecurityConfig(clienteService)
  +successHandler() AuthenticationSuccessHandler
  +filterChain(http) SecurityFilterChain
  +corsConfigurationSource() CorsConfigurationSource
}

class AuthService {
  +AuthService(clienteDAO, passwordEncoder)
  +verificarLogin(login) Cliente
}

class ClienteService {
  +ClienteService(clienteDAO, passwordEncoder)
  -contarLetras(senha) int
  +salvar(cliente) Cliente
  +atualizarCliente(id, dadosAtualizados) Cliente
  +listar() Iterable~Cliente~
  +loginComGoogle(email, nome) Cliente
}

class EnderecoService {
  +EnderecoService(enderecoDAO)
  +cadastrar(endereco) Endereco
}

class ClienteDAO {
  +salvar(cliente) Cliente
  +buscarPorCpf(cpf) Optional~Cliente~
  +buscarPorEmail(email) Optional~Cliente~
  +buscarPorId(id) Optional~Cliente~
  +existeCpfParaOutroId(cpf, id) boolean
  +atualizarCampos(id, nome, cpf, telefone) Cliente
  +listarTodos() List~Cliente~
}

class EnderecoDAO {
  +salvar(endereco) Endereco
  +clienteExiste(clienteId) boolean
  -buscarUltimoInserido() Optional~Endereco~
}

class ClienteRepository {
  +findByEmail(email) Optional~Cliente~
  +findByCpf(cpf) Optional~Cliente~
  +findById(id) Optional~Cliente~
  +save(entity) Cliente
  +findAll() List~Cliente~
}

class EnderecoRepository {
  +save(entity) Endereco
  +findById(id) Optional~Endereco~
  +findAll() List~Endereco~
  +deleteById(id) void
}

class PasswordEncoder
class JpaRepository
class ClienteBuilder
class EnderecoBuilder
class LoginBuilder

ClienteBuilder ..> Cliente : build()
EnderecoBuilder ..> Endereco : build()
LoginBuilder ..> Login : build()

Cliente "1" --> "N" Endereco : possui

AuthController ..> AuthService : usa
AuthController ..> Login : recebe

ClienteController ..> ClienteService : usa
ClienteController ..> Cliente : recebe/retorna

EnderecoController ..> EnderecoService : usa
EnderecoController ..> Endereco : recebe

SecurityConfig ..> ClienteService : loginComGoogle()

AuthService ..> ClienteDAO : consulta
AuthService ..> PasswordEncoder : matches()
AuthService ..> Cliente : retorna

ClienteService ..> ClienteDAO : persiste/consulta
ClienteService ..> PasswordEncoder : encode()
ClienteService ..> Cliente : gerencia

EnderecoService ..> EnderecoDAO : persiste/valida
EnderecoService ..> Endereco : monta

ClienteDAO ..> Cliente : mapeia
EnderecoDAO ..> Endereco : mapeia

JpaRepository <|-- ClienteRepository
JpaRepository <|-- EnderecoRepository
ClienteRepository ..> Cliente
EnderecoRepository ..> Endereco
`;

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
            primaryColor: "#223149",
            primaryTextColor: "#f1f5ff",
            primaryBorderColor: "#6aa0ff",
            lineColor: "#f7933b",
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

    renderDiagram();

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

export default function Page() {
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
      const extraGap = window.innerWidth <= 980 ? 18 : 26;
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

    updateActiveSection();

    const handleHashChange = () => {
      const nextHashId = window.location.hash.replace("#", "");
      if (nextHashId && navItems.some((item) => item.id === nextHashId)) {
        setActiveSectionId(nextHashId);
      }
    };

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
    const extraGap = window.innerWidth <= 980 ? 18 : 26;
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
          <div className="brand">KaiqueTeixeiraDEV</div>
          <p className="brandSub">Mayara Dev</p>
        </div>

        <nav className="navBar" aria-label="Navegacao principal da documentacao" ref={navBarRef}>
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
      </header>

      <section className="hero">
        <p className="tag">Documentacao tecnica FullStackClinica</p>
        <h1>Guia completo das camadas Login, Controller, DAO, Services, Repository e Model</h1>
        <p>
          Esta pagina organiza as classes por camada e explica cada metodo com foco no fluxo real da
          aplicacao: entrada HTTP, regras de negocio, persistencia e sessao.
        </p>

        <div className="flowGrid">
          {architectureFlow.map((item) => (
            <span key={item} className="flowItem">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="diagrama-classe" className="docSection">
        <div className="sectionHeader">
          <h2>Diagrama de Classes</h2>
          <p className="sectionSubtitle">Visao geral das relacoes entre as camadas</p>
          <p>
            Este diagrama foi gerado a partir da propria documentacao da pagina para facilitar leitura da
            arquitetura em uma unica visao.
          </p>
          <p className="diagramHint">
            Relacao principal: <strong>1 Cliente para N Enderecos</strong> (via <code>clienteId</code> em
            Endereco).
          </p>
        </div>

        <article className="classCard">
          <MermaidClassDiagram chart={classDiagramMermaid} />
        </article>

        <article className="classCard diagramCodeCard">
          <p className="methodCount">Codigo Mermaid usado no diagrama</p>
          <pre className="diagramCode">
            <code>{classDiagramMermaid}</code>
          </pre>
        </article>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="docSection">
          <div className="sectionHeader">
            <h2>{section.title}</h2>
            <p className="sectionSubtitle">{section.subtitle}</p>
            <p>{section.overview}</p>
          </div>

          <div className="classGrid">
            {section.classes.map((item) => (
              <article key={item.file} className="classCard">
                <header className="classHeader">
                  <p className="className">{item.className}</p>
                  <p className="metaLine">{item.file}</p>
                  <p className="metaLine">{item.packageName}</p>
                  <p className="roleText">{item.role}</p>
                  {item.notes?.length ? (
                    <div className="notesWrap">
                      {item.notes.map((note) => (
                        <span key={`${item.className}-${note}`} className="notePill">
                          {note}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </header>

                <p className="methodCount">{item.methods.length} metodos documentados</p>

                <div className="methodGrid">
                  {item.methods.map((method, index) => (
                    <article key={`${item.className}-${method.signature}-${index}`} className="methodCard">
                      <h3>{method.name}</h3>
                      <p className="signature">{method.signature}</p>
                      <p>{method.description}</p>
                      <p className="returns">
                        <strong>Retorno:</strong> {method.returns}
                      </p>

                      {method.rules?.length ? (
                        <div className="rulesWrap">
                          {method.rules.map((rule) => (
                            <span key={`${method.signature}-${rule}`} className="rulePill">
                              {rule}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className="footer">
        <p>
          Documentacao de referencia para consulta rapida da arquitetura backend e do fluxo de autenticacao.
        </p>
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
          max-width: 1320px;
          margin: 0 auto;
        }

        .topbar {
          position: sticky;
          top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          padding: 14px 16px;
          border: 1px solid var(--card-border);
          border-radius: 18px;
          backdrop-filter: blur(12px);
          background: rgba(14, 18, 27, 0.7);
          z-index: 20;
        }

        .brand {
          flex-shrink: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--accent);
          text-shadow: 0 0 14px rgba(255, 122, 0, 0.45);
        }

        .brandWrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-shrink: 0;
        }

        .brandSub {
          margin: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #bf79ff;
          text-shadow: 0 0 10px rgba(191, 121, 255, 0.4);
        }

        .navBar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .navLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 0;
          text-decoration: none;
          color: var(--text);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 10px 14px;
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

        .navLink:focus-visible {
          outline: 2px solid rgba(255, 168, 96, 0.85);
          outline-offset: 2px;
        }

        .navLinkActive {
          border-color: rgba(255, 140, 46, 0.9);
          background: rgba(255, 122, 0, 0.22);
          color: #ffe7cf;
          box-shadow: inset 0 0 0 1px rgba(255, 180, 120, 0.3);
        }

        .hero {
          margin-bottom: 30px;
          padding: 28px;
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
          font-size: clamp(1.55rem, 2.2vw, 2.35rem);
          line-height: 1.2;
        }

        .hero > p {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.65;
          max-width: 900px;
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
          font-size: 0.84rem;
        }

        .docSection {
          margin-bottom: 26px;
          scroll-margin-top: var(--doc-sticky-offset, 112px);
        }

        .sectionHeader {
          margin-bottom: 14px;
        }

        .sectionHeader h2 {
          margin: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: clamp(1.25rem, 1.85vw, 1.75rem);
        }

        .sectionSubtitle {
          margin: 6px 0 8px;
          color: #ffb276;
          font-weight: 700;
        }

        .sectionHeader p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .classGrid {
          display: grid;
          gap: 16px;
        }

        .classCard {
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          background: var(--card);
          backdrop-filter: blur(8px);
          padding: 18px;
          box-shadow: 0 10px 24px rgba(5, 8, 14, 0.28);
        }

        .diagramLoading,
        .diagramError {
          margin: 0;
          padding: 18px;
          border-radius: var(--radius-md);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          background: rgba(12, 18, 28, 0.65);
          color: #d7dfef;
          font-size: 0.92rem;
        }

        .diagramError {
          color: #ffcab3;
          border-color: rgba(255, 119, 77, 0.45);
          background: rgba(43, 18, 14, 0.65);
        }

        .diagramSvg {
          border-radius: var(--radius-md);
          border: 1px solid rgba(124, 166, 255, 0.35);
          background: rgba(10, 15, 23, 0.88);
          overflow: auto;
          padding: 14px;
        }

        .diagramSvg :global(svg) {
          display: block;
          min-width: 980px;
          height: auto;
        }

        .diagramCodeCard {
          margin-top: 12px;
        }

        .diagramCode {
          margin: 0;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(8, 12, 20, 0.7);
          max-height: 360px;
          overflow: auto;
          font-size: 0.78rem;
          line-height: 1.45;
          color: #c3d2ed;
        }

        .diagramHint {
          margin-top: 10px !important;
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 122, 0, 0.42);
          background: rgba(255, 122, 0, 0.14);
          color: #ffd3ad !important;
          font-size: 0.84rem;
        }

        .diagramHint code {
          color: #ffdcae;
        }

        .classHeader {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        .className {
          margin: 0;
          font-family: "Space Grotesk", "Manrope", sans-serif;
          font-size: 1.2rem;
          color: #ffe0c5;
        }

        .metaLine {
          margin: 6px 0 0;
          color: #9da8bd;
          font-size: 0.82rem;
          word-break: break-word;
        }

        .roleText {
          margin: 10px 0 0;
          color: #d3d9e7;
          line-height: 1.6;
        }

        .notesWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .notePill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
          border: 1px solid rgba(255, 122, 0, 0.42);
          background: rgba(255, 122, 0, 0.12);
          color: #ffca9c;
        }

        .methodCount {
          margin: 0 0 12px;
          color: #cdd5e5;
          font-weight: 700;
          font-size: 0.86rem;
        }

        .methodGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px;
        }

        .methodCard {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          padding: 12px;
          background: rgba(10, 14, 22, 0.58);
        }

        .methodCard h3 {
          margin: 0;
          font-size: 0.98rem;
          color: #ffd9b5;
        }

        .signature {
          margin: 6px 0 8px;
          display: inline-block;
          font-size: 0.8rem;
          color: #9ec3ff;
          background: rgba(66, 126, 247, 0.14);
          border: 1px solid rgba(111, 162, 255, 0.35);
          border-radius: 999px;
          padding: 5px 10px;
          max-width: 100%;
          overflow-wrap: anywhere;
        }

        .methodCard p {
          margin: 0;
          color: #d6deeb;
          line-height: 1.55;
          font-size: 0.88rem;
        }

        .returns {
          margin-top: 8px !important;
          color: #e9edf5 !important;
        }

        .rulesWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .rulePill {
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 0.76rem;
          color: #fbdcc5;
          border: 1px solid rgba(255, 153, 69, 0.4);
          background: rgba(255, 108, 0, 0.16);
        }

        .footer {
          margin-top: 10px;
          padding: 18px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.04);
          color: #d1d8e7;
          font-size: 0.92rem;
        }

        .footer code {
          color: #ffc996;
        }

        @media (max-width: 980px) {
          .docPage {
            padding: 16px 14px 30px;
          }

          .topbar {
            top: 6px;
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
            border-radius: 14px;
            padding: 12px;
          }

          .brandWrap {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: baseline;
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

          .navBar::-webkit-scrollbar {
            height: 6px;
          }

          .navBar::-webkit-scrollbar-thumb {
            background: rgba(255, 122, 0, 0.4);
            border-radius: 999px;
          }

          .hero {
            padding: 18px;
          }
        }

        @media (max-width: 640px) {
          .docPage {
            padding: 12px 10px 26px;
          }

          .topbar {
            top: 4px;
            margin-bottom: 16px;
            padding: 10px;
          }

          .brand,
          .brandSub {
            font-size: 0.94rem;
          }

          .diagramSvg :global(svg) {
            min-width: 760px;
          }

          .methodGrid {
            grid-template-columns: 1fr;
          }

          .classCard {
            padding: 14px;
          }

          .flowItem,
          .navLink,
          .notePill,
          .rulePill {
            font-size: 0.75rem;
          }

          .navLink {
            padding: 8px 11px;
          }

          .methodCard p {
            font-size: 0.84rem;
          }
        }
      `}</style>
    </main>
  );
}
