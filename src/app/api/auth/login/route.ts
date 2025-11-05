import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse, Usuario, ApiResponse } from "@/types";
import { comparePassword, generateToken } from "@/utils/auth";
import { getAllRecords, createRecord } from "@/services/googleSheets";
import { SHEETS } from "@/services/googleSheets";
import { getCurrentDateTime } from "@/utils/generators";

export async function POST(request: NextRequest) {
  try {
    console.log("[LOGIN] Iniciando processo de login");
    const body: LoginRequest = await request.json();

    const { email, senha } = body;
    console.log("[LOGIN] Email recebido:", email);

    if (!email || !senha) {
      console.log("[LOGIN] Email ou senha não fornecidos");
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email e senha são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Busca usuário no Google Sheets
    console.log("[LOGIN] Buscando usuários no Google Sheets...");
    const usuarios = await getAllRecords<Usuario>(SHEETS.USUARIOS);
    console.log("[LOGIN] Total de usuários encontrados:", usuarios.length);
    const usuario = usuarios.find((u) => u.email === email);
    console.log("[LOGIN] Usuário encontrado:", usuario ? "Sim" : "Não");

    if (!usuario) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Credenciais inválidas",
        },
        { status: 401 }
      );
    }

    // Verifica se o usuário está ativo
    if (!usuario.ativo) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Usuário inativo",
        },
        { status: 403 }
      );
    }

    // Verifica a senha
    console.log("[LOGIN] Verificando senha...");
    const senhaValida = await comparePassword(senha, usuario.senha_hash);
    console.log("[LOGIN] Senha válida:", senhaValida ? "Sim" : "Não");

    if (!senhaValida) {
      console.log("[LOGIN] Credenciais inválidas");
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Credenciais inválidas",
        },
        { status: 401 }
      );
    }

    // Atualiza o último acesso
    console.log("[LOGIN] Atualizando último acesso...");
    const usuarioAtualizado = {
      ...usuario,
      ultimo_acesso: getCurrentDateTime(),
    };

    // Atualiza no Google Sheets
    console.log("[LOGIN] Atualizando registro no Google Sheets...");
    const { updateRecord } = await import("@/services/googleSheets");
    await updateRecord(SHEETS.USUARIOS, usuarioAtualizado);
    console.log("[LOGIN] Registro atualizado com sucesso");

    // Registra o log de login
    console.log("[LOGIN] Registrando log de login...");
    await createRecord(SHEETS.LOGS, {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      usuario_id: usuario.id,
      tipo_acao: "LOGIN",
      entidade: "Usuario",
      entidade_id: usuario.id,
      descricao: `Login realizado por ${usuario.nome}`,
      data_hora: getCurrentDateTime(),
      ip: request.headers.get("x-forwarded-for") || request.ip || "",
    });
    console.log("[LOGIN] Log registrado com sucesso");

    // Gera o token JWT
    console.log("[LOGIN] Gerando token JWT...");
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });
    console.log("[LOGIN] Token gerado com sucesso");

    // Remove a senha do objeto de resposta
    const { senha_hash, ...usuarioSemSenha } = usuario;

    console.log("[LOGIN] Login realizado com sucesso para:", email);
    return NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        data: {
          token,
          usuario: usuarioSemSenha,
        },
        message: "Login realizado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN] Erro ao fazer login:", error);
    console.error("[LOGIN] Stack trace:", error instanceof Error ? error.stack : "N/A");
    console.error("[LOGIN] Mensagem de erro:", error instanceof Error ? error.message : String(error));

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Erro ao processar login",
        // Em desenvolvimento, retorne mais detalhes do erro
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : String(error)
        })
      },
      { status: 500 }
    );
  }
}
