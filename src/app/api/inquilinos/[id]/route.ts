import { NextRequest, NextResponse } from "next/server";
import { Inquilino, ApiResponse } from "@/types";
import { findById, updateRecord, deleteRecord, SHEETS, createRecord } from "@/services/googleSheets";
import { getCurrentDateTime, generateId } from "@/utils/generators";
import { withAuth } from "@/middleware/authMiddleware";

export const GET = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const inquilino = await findById<Inquilino>(SHEETS.INQUILINOS, params.id);
    if (!inquilino) return NextResponse.json<ApiResponse>({ success: false, error: "Inquilino não encontrado" }, { status: 404 });
    return NextResponse.json<ApiResponse>({ success: true, data: inquilino }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar inquilino" }, { status: 500 });
  }
});

export const PUT = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();
    const inquilino = await findById<Inquilino>(SHEETS.INQUILINOS, params.id);
    if (!inquilino) return NextResponse.json<ApiResponse>({ success: false, error: "Inquilino não encontrado" }, { status: 404 });

    const inquilinoAtualizado = { ...inquilino, ...body, id: params.id };
    await updateRecord(SHEETS.INQUILINOS, inquilinoAtualizado);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "EDITAR",
      entidade: "Inquilino",
      entidade_id: params.id,
      descricao: `Atualizou inquilino ${inquilinoAtualizado.nome}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: inquilinoAtualizado, message: "Inquilino atualizado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao atualizar inquilino" }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const inquilino = await findById<Inquilino>(SHEETS.INQUILINOS, params.id);
    if (!inquilino) return NextResponse.json<ApiResponse>({ success: false, error: "Inquilino não encontrado" }, { status: 404 });

    await deleteRecord(SHEETS.INQUILINOS, params.id);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "EXCLUIR",
      entidade: "Inquilino",
      entidade_id: params.id,
      descricao: `Excluiu inquilino ${inquilino.nome}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, message: "Inquilino deletado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao deletar inquilino" }, { status: 500 });
  }
});
