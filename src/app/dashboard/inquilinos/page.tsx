"use client";

import { useEffect, useState } from "react";
import { Inquilino } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCPF, formatPhone, formatCurrency } from "@/utils/format";
import { InquilinoFormDialog } from "@/components/inquilino-form-dialog";
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

export default function InquilinosPage() {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInquilino, setEditingInquilino] = useState<Inquilino | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inquilinoToDelete, setInquilinoToDelete] = useState<Inquilino | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleNewInquilino = () => {
    setEditingInquilino(undefined);
    setFormOpen(true);
  };

  const handleEditInquilino = (inquilino: Inquilino) => {
    setEditingInquilino(inquilino);
    setFormOpen(true);
  };

  const handleDeleteClick = (inquilino: Inquilino) => {
    setInquilinoToDelete(inquilino);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!inquilinoToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/inquilinos/${inquilinoToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        await fetchInquilinos();
        setDeleteDialogOpen(false);
        setInquilinoToDelete(null);
      } else {
        alert(data.error || "Erro ao excluir inquilino");
      }
    } catch (error) {
      console.error("Erro ao excluir inquilino:", error);
      alert("Erro ao excluir inquilino");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    fetchInquilinos();
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
        <Button className="gap-2" onClick={handleNewInquilino}>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquilinos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInquilino(inquilino)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(inquilino)}
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

      <InquilinoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        inquilino={editingInquilino}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o inquilino{" "}
              <strong>{inquilinoToDelete?.nome}</strong>
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
