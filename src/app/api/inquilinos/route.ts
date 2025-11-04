import { NextRequest, NextResponse } from "next/server";
import { Inquilino, ApiResponse } from "@/types";
import { getAllRecords, createRecord, SHEETS } from "@/services/googleSheets";
import { generateId, getCurrentDateTime } from "@/utils/generators";
import { withAuth } from "@/middleware/authMiddleware";

export const GET = withAuth(async () => {
  try {
    const inquilinos = await getAllRecords<Inquilino>(SHEETS.INQUILINOS);
    return NextResponse.json<ApiResponse>({ success: true, data: inquilinos }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar inquilinos" }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const novoInquilino: Inquilino = {
      id: generateId(),
      ...body,
      data_cadastro: getCurrentDateTime(),
    };

    await createRecord(SHEETS.INQUILINOS, novoInquilino);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "CRIAR",
      entidade: "Inquilino",
      entidade_id: novoInquilino.id,
      descricao: `Criou inquilino ${novoInquilino.nome}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: novoInquilino, message: "Inquilino criado" }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao criar inquilino" }, { status: 500 });
  }
});
