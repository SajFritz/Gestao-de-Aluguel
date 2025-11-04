import { NextRequest, NextResponse } from "next/server";
import { Usuario, ApiResponse } from "@/types";
import { getAllRecords, createRecord, SHEETS } from "@/services/googleSheets";
import { hashPassword } from "@/utils/auth";
import { generateId, getCurrentDateTime } from "@/utils/generators";
import { isValidEmail, isStrongPassword } from "@/utils/validation";
import { withAdminAuth } from "@/middleware/authMiddleware";

// GET - Listar todos os usuários (apenas Admin)
export const GET = withAdminAuth(async () => {
  try {
    const usuarios = await getAllRecords<Usuario>(SHEETS.USUARIOS);

    // Remove as senhas dos usuários
    const usuariosSemSenha = usuarios.map(({ senha_hash, ...usuario }) => usuario);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: usuariosSemSenha,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Erro ao buscar usuários",
      },
      { status: 500 }
    );
  }
});

// POST - Criar novo usuário (apenas Admin)
export const POST = withAdminAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    const { nome, email, senha, tipo, ativo } = body;

    // Validações
    if (!nome || !email || !senha || !tipo) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Campos obrigatórios: nome, email, senha, tipo",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email inválido",
        },
        { status: 400 }
      );
    }

    if (!isStrongPassword(senha)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Senha deve ter no mínimo 8 caracteres",
        },
        { status: 400 }
      );
    }

    if (tipo !== "Admin" && tipo !== "Gestor") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Tipo deve ser 'Admin' ou 'Gestor'",
        },
        { status: 400 }
      );
    }

    // Verifica se email já existe
    const usuarios = await getAllRecords<Usuario>(SHEETS.USUARIOS);
    const emailExiste = usuarios.some((u) => u.email === email);

    if (emailExiste) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email já cadastrado",
        },
        { status: 400 }
      );
    }

    // Cria hash da senha
    const senha_hash = await hashPassword(senha);

    // Cria novo usuário
    const novoUsuario: Usuario = {
      id: generateId(),
      nome,
      email,
      senha_hash,
      tipo,
      ativo: ativo !== undefined ? ativo : true,
      data_criacao: getCurrentDateTime(),
    };

    await createRecord(SHEETS.USUARIOS, novoUsuario);

    // Registra log
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "CRIAR",
      entidade: "Usuario",
      entidade_id: novoUsuario.id,
      descricao: `Criou usuário ${nome} (${email})`,
      data_hora: getCurrentDateTime(),
    });

    // Remove senha do retorno
    const { senha_hash: _, ...usuarioSemSenha } = novoUsuario;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: usuarioSemSenha,
        message: "Usuário criado com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Erro ao criar usuário",
      },
      { status: 500 }
    );
  }
});
