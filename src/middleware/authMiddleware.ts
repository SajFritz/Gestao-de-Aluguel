import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "@/utils/auth";
import { JWTPayload, ApiResponse } from "@/types";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Valida o token JWT e retorna o payload do usuário
 * Retorna null se o token for inválido
 */
export function authenticateRequest(
  request: NextRequest
): JWTPayload | null {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader || "");

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Middleware de autenticação para APIs
 * Verifica se o token é válido e retorna erro se não for
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Não autorizado. Token inválido ou ausente.",
        },
        { status: 401 }
      );
    }

    return handler(request, user, context);
  };
}

/**
 * Middleware de autenticação que também verifica se o usuário é Admin
 */
export function withAdminAuth(
  handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Não autorizado. Token inválido ou ausente.",
        },
        { status: 401 }
      );
    }

    if (user.tipo !== "Admin") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Acesso negado. Apenas administradores podem acessar.",
        },
        { status: 403 }
      );
    }

    return handler(request, user, context);
  };
}
