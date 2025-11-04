import { NextRequest, NextResponse } from "next/server";
import { Usuario, ApiResponse } from "@/types";
import { findById, updateRecord, deleteRecord, SHEETS, createRecord } from "@/services/googleSheets";
import { hashPassword } from "@/utils/auth";
import { getCurrentDateTime, generateId } from "@/utils/generators";
import { isValidEmail } from "@/utils/validation";
import { withAdminAuth } from "@/middleware/authMiddleware";

// GET - Buscar usuário por ID (apenas Admin)
export const GET = withAdminAuth(
  async (request: NextRequest, user, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      const usuario = await findById<Usuario>(SHEETS.USUARIOS, id);

      if (!usuario) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Usuário não encontrado",
          },
          { status: 404 }
        );
      }

      // Remove senha
      const { senha_hash, ...usuarioSemSenha } = usuario;

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: usuarioSemSenha,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Erro ao buscar usuário",
        },
        { status: 500 }
      );
    }
  }
);

// PUT - Atualizar usuário (apenas Admin)
export const PUT = withAdminAuth(
  async (request: NextRequest, user, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      const body = await request.json();

      const usuario = await findById<Usuario>(SHEETS.USUARIOS, id);

      if (!usuario) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Usuário não encontrado",
          },
          { status: 404 }
        );
      }

      // Validações
      if (body.email && !isValidEmail(body.email)) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Email inválido",
          },
          { status: 400 }
        );
      }

      if (body.tipo && body.tipo !== "Admin" && body.tipo !== "Gestor") {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Tipo deve ser 'Admin' ou 'Gestor'",
          },
          { status: 400 }
        );
      }

      // Atualiza dados
      const usuarioAtualizado: Usuario = {
        ...usuario,
        nome: body.nome !== undefined ? body.nome : usuario.nome,
        email: body.email !== undefined ? body.email : usuario.email,
        tipo: body.tipo !== undefined ? body.tipo : usuario.tipo,
        ativo: body.ativo !== undefined ? body.ativo : usuario.ativo,
      };

      // Se foi enviada nova senha, atualiza o hash
      if (body.senha) {
        usuarioAtualizado.senha_hash = await hashPassword(body.senha);
      }

      await updateRecord(SHEETS.USUARIOS, usuarioAtualizado);

      // Registra log
      await createRecord(SHEETS.LOGS, {
        id: generateId(),
        usuario_id: user.userId,
        tipo_acao: "EDITAR",
        entidade: "Usuario",
        entidade_id: id,
        descricao: `Atualizou usuário ${usuarioAtualizado.nome}`,
        data_hora: getCurrentDateTime(),
      });

      // Remove senha do retorno
      const { senha_hash, ...usuarioSemSenha } = usuarioAtualizado;

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: usuarioSemSenha,
          message: "Usuário atualizado com sucesso",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Erro ao atualizar usuário",
        },
        { status: 500 }
      );
    }
  }
);

// DELETE - Deletar usuário (apenas Admin)
export const DELETE = withAdminAuth(
  async (request: NextRequest, user, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      const usuario = await findById<Usuario>(SHEETS.USUARIOS, id);

      if (!usuario) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Usuário não encontrado",
          },
          { status: 404 }
        );
      }

      // Não permite deletar o próprio usuário
      if (id === user.userId) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Você não pode deletar seu próprio usuário",
          },
          { status: 400 }
        );
      }

      await deleteRecord(SHEETS.USUARIOS, id);

      // Registra log
      await createRecord(SHEETS.LOGS, {
        id: generateId(),
        usuario_id: user.userId,
        tipo_acao: "EXCLUIR",
        entidade: "Usuario",
        entidade_id: id,
        descricao: `Excluiu usuário ${usuario.nome}`,
        data_hora: getCurrentDateTime(),
      });

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Usuário deletado com sucesso",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Erro ao deletar usuário",
        },
        { status: 500 }
      );
    }
  }
);
