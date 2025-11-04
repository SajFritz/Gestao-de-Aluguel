import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";
import { verifyToken, extractTokenFromHeader } from "@/utils/auth";
import { createRecord, SHEETS } from "@/services/googleSheets";
import { getCurrentDateTime } from "@/utils/generators";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader || "");

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Token não fornecido",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Token inválido",
        },
        { status: 401 }
      );
    }

    // Registra o log de logout
    await createRecord(SHEETS.LOGS, {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      usuario_id: payload.userId,
      tipo_acao: "LOGOUT",
      entidade: "Usuario",
      entidade_id: payload.userId,
      descricao: `Logout realizado`,
      data_hora: getCurrentDateTime(),
      ip: request.headers.get("x-forwarded-for") || request.ip || "",
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logout realizado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Erro ao processar logout",
      },
      { status: 500 }
    );
  }
}
