"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardKPIs } from "@/types";
import { formatCurrency, calculatePercentage } from "@/utils/format";
import { Building2, Home, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error || "Erro ao carregar KPIs");
          setLoading(false);
          return;
        }

        setKpis(data.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao conectar com o servidor");
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema de gestão de aluguéis</p>
      </div>

      {/* KPIs de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Imóveis
            </CardTitle>
            <Building2 className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{kpis.total_imoveis}</div>
            <p className="text-sm text-gray-500 mt-1">
              {kpis.imoveis_alugados} alugados, {kpis.imoveis_vagos} vagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Ocupação
            </CardTitle>
            <Home className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{kpis.taxa_ocupacao}%</div>
            <p className="text-sm text-gray-500 mt-1">
              {kpis.imoveis_alugados} de {kpis.total_imoveis} imóveis alugados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagamentos Pendentes
            </CardTitle>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{kpis.pagamentos_pendentes}</div>
            <p className="text-sm text-red-600 mt-1">
              {kpis.pagamentos_atrasados} atrasados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receitas do Mês
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Esperada</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(kpis.receita_esperada_mes)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recebida</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(kpis.receita_recebida_mes)}
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">
                {calculatePercentage(kpis.receita_recebida_mes, kpis.receita_esperada_mes)}% do esperado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Balanço do Mês
            </CardTitle>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(kpis.receita_recebida_mes)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(kpis.despesas_mes)}
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">Saldo</p>
              <p
                className={`text-3xl font-bold ${
                  kpis.saldo_mes >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(kpis.saldo_mes)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
