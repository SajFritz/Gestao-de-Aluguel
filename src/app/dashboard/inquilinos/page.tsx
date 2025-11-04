"use client";

import { useEffect, useState } from "react";
import { Inquilino } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCPF, formatPhone, formatCurrency } from "@/utils/format";

export default function InquilinosPage() {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquilinos();
  }, []);

  const fetchInquilinos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/inquilinos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setInquilinos(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar inquilinos:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquilinos</h1>
          <p className="text-gray-500 mt-1">Gerencie os inquilinos cadastrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Inquilino
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inquilinos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead>Renda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquilinos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Nenhum inquilino cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                inquilinos.map((inquilino) => (
                  <TableRow key={inquilino.id}>
                    <TableCell className="font-medium">{inquilino.nome}</TableCell>
                    <TableCell>{formatCPF(inquilino.cpf)}</TableCell>
                    <TableCell>{formatPhone(inquilino.telefone)}</TableCell>
                    <TableCell>{inquilino.email || "-"}</TableCell>
                    <TableCell>{inquilino.profissao || "-"}</TableCell>
                    <TableCell>
                      {inquilino.renda_mensal ? formatCurrency(inquilino.renda_mensal) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
