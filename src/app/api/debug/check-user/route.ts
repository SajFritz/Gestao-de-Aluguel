import { NextRequest, NextResponse } from "next/server";
import { getAllRecords } from "@/services/googleSheets";
import { SHEETS } from "@/services/googleSheets";
import { Usuario } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        error: "Email é obrigatório. Use: /api/debug/check-user?email=seu@email.com"
      }, { status: 400 });
    }

    console.log("[DEBUG] Verificando configurações do Google Sheets...");

    // Verifica variáveis de ambiente
    const config = {
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      sheetIdPreview: process.env.GOOGLE_SHEET_ID ? `${process.env.GOOGLE_SHEET_ID.substring(0, 10)}...` : "NÃO CONFIGURADO",
    };

    console.log("[DEBUG] Configurações:", config);

    // Tenta buscar usuários
    console.log("[DEBUG] Buscando usuários no Google Sheets...");
    const usuarios = await getAllRecords<Usuario>(SHEETS.USUARIOS);
    console.log("[DEBUG] Total de usuários encontrados:", usuarios.length);

    // Busca usuário específico
    const usuario = usuarios.find((u) => u.email === email);
    console.log("[DEBUG] Usuário encontrado:", usuario ? "Sim" : "Não");

    if (usuario) {
      return NextResponse.json({
        success: true,
        message: "Usuário encontrado!",
        config,
        totalUsuarios: usuarios.length,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
          ativo: usuario.ativo,
          hasSenhaHash: !!usuario.senha_hash,
          senhaHashLength: usuario.senha_hash?.length || 0,
          data_criacao: usuario.data_criacao,
          ultimo_acesso: usuario.ultimo_acesso,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Usuário não encontrado",
        config,
        totalUsuarios: usuarios.length,
        usuariosEmails: usuarios.map(u => u.email),
      });
    }

  } catch (error) {
    console.error("[DEBUG] Erro:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
