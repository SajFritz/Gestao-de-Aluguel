"use client";

import { useEffect, useState } from "react";
import { Imovel } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/imoveis", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setImoveis(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
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
          <h1 className="text-3xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-500 mt-1">Gerencie os imóveis cadastrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Imóvel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Imóveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Quartos</TableHead>
                <TableHead>IPTU Anual</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imoveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Nenhum imóvel cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                imoveis.map((imovel) => (
                  <TableRow key={imovel.id}>
                    <TableCell className="font-medium">{imovel.tipo}</TableCell>
                    <TableCell>
                      {imovel.endereco}, {imovel.numero}
                      {imovel.complemento && ` - ${imovel.complemento}`}
                    </TableCell>
                    <TableCell>{imovel.cidade} - {imovel.estado}</TableCell>
                    <TableCell>{imovel.quartos}</TableCell>
                    <TableCell>{formatCurrency(imovel.iptu_anual)}</TableCell>
                    <TableCell>
                      <Badge variant={imovel.status === "Alugado" ? "success" : "secondary"}>
                        {imovel.status}
                      </Badge>
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
