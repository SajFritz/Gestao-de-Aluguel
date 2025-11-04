import { NextRequest, NextResponse } from "next/server";
import { Imovel, ApiResponse } from "@/types";
import { getAllRecords, createRecord, SHEETS } from "@/services/googleSheets";
import { generateId, getCurrentDateTime } from "@/utils/generators";
import { withAuth } from "@/middleware/authMiddleware";

export const GET = withAuth(async () => {
  try {
    const imoveis = await getAllRecords<Imovel>(SHEETS.IMOVEIS);
    return NextResponse.json<ApiResponse>({ success: true, data: imoveis }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar imóveis" }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    const novoImovel: Imovel = {
      id: generateId(),
      ...body,
      status: body.status || "Vago",
      data_cadastro: getCurrentDateTime(),
    };

    await createRecord(SHEETS.IMOVEIS, novoImovel);
    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "CRIAR",
      entidade: "Imovel",
      entidade_id: novoImovel.id,
      descricao: `Criou imóvel ${novoImovel.endereco}`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: novoImovel, message: "Imóvel criado com sucesso" }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao criar imóvel" }, { status: 500 });
  }
});
