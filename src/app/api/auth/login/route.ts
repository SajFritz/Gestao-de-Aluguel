import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse, Usuario, ApiResponse } from "@/types";
import { comparePassword, generateToken } from "@/utils/auth";
import { getAllRecords, createRecord } from "@/services/googleSheets";
import { SHEETS } from "@/services/googleSheets";
import { getCurrentDateTime } from "@/utils/generators";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email e senha são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Busca usuário no Google Sheets
    const usuarios = await getAllRecords<Usuario>(SHEETS.USUARIOS);
    const usuario = usuarios.find((u) => u.email === email);

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
    const senhaValida = await comparePassword(senha, usuario.senha_hash);

    if (!senhaValida) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Credenciais inválidas",
        },
        { status: 401 }
      );
    }

    // Atualiza o último acesso
    const usuarioAtualizado = {
      ...usuario,
      ultimo_acesso: getCurrentDateTime(),
    };

    // Atualiza no Google Sheets
    const { updateRecord } = await import("@/services/googleSheets");
    await updateRecord(SHEETS.USUARIOS, usuarioAtualizado);

    // Registra o log de login
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

    // Gera o token JWT
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    // Remove a senha do objeto de resposta
    const { senha_hash, ...usuarioSemSenha } = usuario;

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
    console.error("Erro ao fazer login:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Erro ao processar login",
      },
      { status: 500 }
    );
  }
}
