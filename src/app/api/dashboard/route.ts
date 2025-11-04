import { NextResponse } from "next/server";
import { DashboardKPIs, Imovel, Movimentacao, Despesa, ApiResponse } from "@/types";
import { getAllRecords, SHEETS } from "@/services/googleSheets";
import { withAuth } from "@/middleware/authMiddleware";
import { startOfMonth, endOfMonth, isBefore, parseISO } from "date-fns";

export const GET = withAuth(async () => {
  try {
    const imoveis = await getAllRecords<Imovel>(SHEETS.IMOVEIS);
    const movimentacoes = await getAllRecords<Movimentacao>(SHEETS.MOVIMENTACOES);
    const despesas = await getAllRecords<Despesa>(SHEETS.DESPESAS);

    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    // KPIs de imóveis
    const total_imoveis = imoveis.length;
    const imoveis_alugados = imoveis.filter((i) => i.status === "Alugado").length;
    const imoveis_vagos = total_imoveis - imoveis_alugados;
    const taxa_ocupacao = total_imoveis > 0 ? Math.round((imoveis_alugados / total_imoveis) * 100) : 0;

    // Movimentações do mês
    const movimentacoesMes = movimentacoes.filter((m) => {
      const dataVenc = parseISO(m.data_vencimento);
      return dataVenc >= inicioMes && dataVenc <= fimMes;
    });

    const receita_esperada_mes = movimentacoesMes.reduce((sum, m) => sum + m.valor_esperado, 0);
    const receita_recebida_mes = movimentacoesMes
      .filter((m) => m.status === "Pago")
      .reduce((sum, m) => sum + (m.valor_pago || 0), 0);

    const pagamentos_pendentes = movimentacoesMes.filter((m) => m.status === "Pendente").length;
    const pagamentos_atrasados = movimentacoesMes.filter((m) => {
      return m.status === "Atrasado" || (m.status === "Pendente" && isBefore(parseISO(m.data_vencimento), hoje));
    }).length;

    // Despesas do mês
    const despesasMes = despesas.filter((d) => {
      const dataDespesa = parseISO(d.data_despesa);
      return dataDespesa >= inicioMes && dataDespesa <= fimMes;
    });
    const despesas_mes = despesasMes.reduce((sum, d) => sum + d.valor, 0);

    const saldo_mes = receita_recebida_mes - despesas_mes;

    const kpis: DashboardKPIs = {
      total_imoveis,
      imoveis_alugados,
      imoveis_vagos,
      taxa_ocupacao,
      receita_esperada_mes,
      receita_recebida_mes,
      pagamentos_pendentes,
      pagamentos_atrasados,
      despesas_mes,
      saldo_mes,
    };

    return NextResponse.json<ApiResponse>({ success: true, data: kpis }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar KPIs:", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Erro ao buscar KPIs do dashboard" }, { status: 500 });
  }
});
