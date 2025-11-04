import { NextRequest, NextResponse } from "next/server";
import { Contrato, ContratoExpandido, ApiResponse } from "@/types";
import { getAllRecords, createRecord, SHEETS, findById } from "@/services/googleSheets";
import { generateId, getCurrentDateTime } from "@/utils/generators";
import { withAuth } from "@/middleware/authMiddleware";

export const GET = withAuth(async () => {
  try {
    const contratos = await getAllRecords<Contrato>(SHEETS.CONTRATOS);

    // Expandir com dados de imóvel e inquilino
    const contratosExpandidos: ContratoExpandido[] = await Promise.all(
      contratos.map(async (contrato) => {
        const imovel = await findById(SHEETS.IMOVEIS, contrato.imovel_id);
        const inquilino = await findById(SHEETS.INQUILINOS, contrato.inquilino_id);
        return { ...contrato, imovel, inquilino };
      })
    );

    return NextResponse.json<ApiResponse>({ success: true, data: contratosExpandidos }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar contratos" }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const novoContrato: Contrato = {
      id: generateId(),
      ...body,
      status: body.status || "Ativo",
      data_cadastro: getCurrentDateTime(),
    };

    await createRecord(SHEETS.CONTRATOS, novoContrato);

    // Atualizar status do imóvel para Alugado
    const { updateRecord } = await import("@/services/googleSheets");
    const imovel = await findById(SHEETS.IMOVEIS, novoContrato.imovel_id);
    if (imovel) {
      await updateRecord(SHEETS.IMOVEIS, { ...imovel, status: "Alugado" });
    }

    await createRecord(SHEETS.LOGS, {
      id: generateId(),
      usuario_id: user.userId,
      tipo_acao: "CRIAR",
      entidade: "Contrato",
      entidade_id: novoContrato.id,
      descricao: `Criou contrato`,
      data_hora: getCurrentDateTime(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: novoContrato, message: "Contrato criado" }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao criar contrato" }, { status: 500 });
  }
});
