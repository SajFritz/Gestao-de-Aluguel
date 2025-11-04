// Tipos de usuário
export type TipoUsuario = "Admin" | "Gestor";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  tipo: TipoUsuario;
  ativo: boolean;
  data_criacao: string;
  ultimo_acesso?: string;
}

export interface UsuarioSemSenha extends Omit<Usuario, "senha_hash"> {}

// Tipos de imóvel
export type StatusImovel = "Alugado" | "Vago";
export type TipoImovel = "Casa" | "Apartamento" | "Kitnet" | "Comercial" | "Outro";

export interface Imovel {
  id: string;
  tipo: TipoImovel;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  quartos: number;
  iptu_anual: number;
  status: StatusImovel;
  data_cadastro: string;
  observacoes?: string;
}

// Inquilino
export interface Inquilino {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  email?: string;
  telefone: string;
  telefone_alternativo?: string;
  endereco_atual?: string;
  profissao?: string;
  renda_mensal?: number;
  data_cadastro: string;
  observacoes?: string;
}

// Contrato
export type StatusContrato = "Ativo" | "Encerrado" | "Pendente";

export interface Contrato {
  id: string;
  imovel_id: string;
  inquilino_id: string;
  data_inicio: string;
  data_fim: string;
  valor_aluguel: number;
  dia_vencimento: number;
  valor_condominio?: number;
  valor_iptu?: number;
  forma_pagamento?: string;
  indice_reajuste?: string;
  observacoes?: string;
  status: StatusContrato;
  data_cadastro: string;
}

// Dados expandidos do contrato (com dados do imóvel e inquilino)
export interface ContratoExpandido extends Contrato {
  imovel?: Imovel;
  inquilino?: Inquilino;
}

// Movimentação financeira
export type TipoMovimentacao = "Aluguel" | "Condominio" | "IPTU" | "Outro";
export type StatusPagamento = "Pendente" | "Pago" | "Atrasado" | "Cancelado";

export interface Movimentacao {
  id: string;
  contrato_id: string;
  tipo: TipoMovimentacao;
  data_vencimento: string;
  data_pagamento?: string;
  valor_esperado: number;
  valor_pago?: number;
  status: StatusPagamento;
  forma_pagamento?: string;
  observacoes?: string;
  data_cadastro: string;
}

export interface MovimentacaoExpandida extends Movimentacao {
  contrato?: ContratoExpandido;
}

// Despesa
export type CategoriaDespesa =
  | "Manutencao"
  | "Reforma"
  | "IPTU"
  | "Condominio"
  | "Taxa"
  | "Seguro"
  | "Outro";

export interface Despesa {
  id: string;
  imovel_id: string;
  categoria: CategoriaDespesa;
  descricao: string;
  valor: number;
  data_despesa: string;
  data_pagamento?: string;
  fornecedor?: string;
  nota_fiscal?: string;
  observacoes?: string;
  data_cadastro: string;
}

export interface DespesaExpandida extends Despesa {
  imovel?: Imovel;
}

// Log de auditoria
export type TipoAcao =
  | "LOGIN"
  | "LOGOUT"
  | "CRIAR"
  | "EDITAR"
  | "EXCLUIR"
  | "VISUALIZAR";

export type TipoEntidade =
  | "Usuario"
  | "Imovel"
  | "Inquilino"
  | "Contrato"
  | "Movimentacao"
  | "Despesa";

export interface Log {
  id: string;
  usuario_id: string;
  tipo_acao: TipoAcao;
  entidade: TipoEntidade;
  entidade_id?: string;
  descricao: string;
  data_hora: string;
  ip?: string;
}

export interface LogExpandido extends Log {
  usuario?: UsuarioSemSenha;
}

// Dashboard KPIs
export interface DashboardKPIs {
  total_imoveis: number;
  imoveis_alugados: number;
  imoveis_vagos: number;
  taxa_ocupacao: number;
  receita_esperada_mes: number;
  receita_recebida_mes: number;
  pagamentos_pendentes: number;
  pagamentos_atrasados: number;
  despesas_mes: number;
  saldo_mes: number;
}

// Tipos de requisição para APIs
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSemSenha;
}

// Payload do JWT
export interface JWTPayload {
  userId: string;
  email: string;
  tipo: TipoUsuario;
}

// Resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
