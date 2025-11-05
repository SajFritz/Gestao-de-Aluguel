"use client";

import { useEffect, useState } from "react";
import { Imovel } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { ImovelFormDialog } from "@/components/imovel-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingImovel, setEditingImovel] = useState<Imovel | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState<Imovel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleNewImovel = () => {
    setEditingImovel(undefined);
    setFormOpen(true);
  };

  const handleEditImovel = (imovel: Imovel) => {
    setEditingImovel(imovel);
    setFormOpen(true);
  };

  const handleDeleteClick = (imovel: Imovel) => {
    setImovelToDelete(imovel);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imovelToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/imoveis/${imovelToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        await fetchImoveis();
        setDeleteDialogOpen(false);
        setImovelToDelete(null);
      } else {
        alert(data.error || "Erro ao excluir imóvel");
      }
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      alert("Erro ao excluir imóvel");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    fetchImoveis();
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
        <Button className="gap-2" onClick={handleNewImovel}>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imoveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditImovel(imovel)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(imovel)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ImovelFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        imovel={editingImovel}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o imóvel{" "}
              <strong>
                {imovelToDelete?.endereco}, {imovelToDelete?.numero}
              </strong>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
