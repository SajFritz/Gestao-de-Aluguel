import { NextRequest, NextResponse } from "next/server";
import { Imovel, ApiResponse } from "@/types";
import { findById, updateRecord, deleteRecord, SHEETS, createRecord } from "@/services/googleSheets";
import { getCurrentDateTime, generateId } from "@/utils/generators";
import { withAuth } from "@/middleware/authMiddleware";

export const GET = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const imovel = await findById<Imovel>(SHEETS.IMOVEIS, params.id);
    if (!imovel) return NextResponse.json<ApiResponse>({ success: false, error: "Imóvel não encontrado" }, { status: 404 });
    return NextResponse.json<ApiResponse>({ success: true, data: imovel }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar imóvel" }, { status: 500 });
  }
});

export const PUT = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();
    const imovel = await findById<Imovel>(SHEETS.IMOVEIS, params.id);
    if (!imovel) return NextResponse.json<ApiResponse>({ success: false, error: "Imóvel não encontrado" }, { status: 404 });

    const imovelAtualizado = { ...imovel, ...body, id: params.id };
    await updateRecord(SHEETS.IMOVEIS, imovelAtualizado);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "EDITAR",
      entidade: "Imovel",
      entidade_id: params.id,
      descricao: `Atualizou imóvel ${imovelAtualizado.endereco}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: imovelAtualizado, message: "Imóvel atualizado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao atualizar imóvel" }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const imovel = await findById<Imovel>(SHEETS.IMOVEIS, params.id);
    if (!imovel) return NextResponse.json<ApiResponse>({ success: false, error: "Imóvel não encontrado" }, { status: 404 });

    await deleteRecord(SHEETS.IMOVEIS, params.id);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "EXCLUIR",
      entidade: "Imovel",
      entidade_id: params.id,
      descricao: `Excluiu imóvel ${imovel.endereco}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, message: "Imóvel deletado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao deletar imóvel" }, { status: 500 });
  }
});
