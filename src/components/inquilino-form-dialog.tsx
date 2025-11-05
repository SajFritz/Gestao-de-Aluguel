"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Inquilino } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const inquilinoFormSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório (mínimo 3 caracteres)"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido (ex: 123.456.789-00)"),
  rg: z.string().optional(),
  data_nascimento: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().min(10, "Telefone é obrigatório (mínimo 10 dígitos)"),
  telefone_alternativo: z.string().optional(),
  endereco_atual: z.string().optional(),
  profissao: z.string().optional(),
  renda_mensal: z.coerce.number().min(0, "Renda mensal não pode ser negativa").optional().or(z.literal(0)),
  observacoes: z.string().optional(),
})

type InquilinoFormValues = z.infer<typeof inquilinoFormSchema>

interface InquilinoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquilino?: Inquilino
  onSuccess: () => void
}

export function InquilinoFormDialog({
  open,
  onOpenChange,
  inquilino,
  onSuccess,
}: InquilinoFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!inquilino

  const form = useForm<InquilinoFormValues>({
    resolver: zodResolver(inquilinoFormSchema),
    defaultValues: inquilino
      ? {
          nome: inquilino.nome,
          cpf: inquilino.cpf,
          rg: inquilino.rg || "",
          data_nascimento: inquilino.data_nascimento || "",
          email: inquilino.email || "",
          telefone: inquilino.telefone,
          telefone_alternativo: inquilino.telefone_alternativo || "",
          endereco_atual: inquilino.endereco_atual || "",
          profissao: inquilino.profissao || "",
          renda_mensal: inquilino.renda_mensal || 0,
          observacoes: inquilino.observacoes || "",
        }
      : {
          nome: "",
          cpf: "",
          rg: "",
          data_nascimento: "",
          email: "",
          telefone: "",
          telefone_alternativo: "",
          endereco_atual: "",
          profissao: "",
          renda_mensal: 0,
          observacoes: "",
        },
  })

  const onSubmit = async (values: InquilinoFormValues) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")

      const url = isEditing ? `/api/inquilinos/${inquilino.id}` : "/api/inquilinos"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (data.success) {
        form.reset()
        onOpenChange(false)
        onSuccess()
      } else {
        alert(data.error || "Erro ao salvar inquilino")
      }
    } catch (error) {
      console.error("Erro ao salvar inquilino:", error)
      alert("Erro ao salvar inquilino")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Inquilino" : "Novo Inquilino"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do inquilino"
              : "Preencha os dados para cadastrar um novo inquilino"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="123.456.789-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="12.345.678-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_nascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 98765-4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone_alternativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone Alternativo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 3456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="endereco_atual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Atual (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro, cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Engenheiro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="renda_mensal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renda Mensal (R$) (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="5000.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Salvar Alterações" : "Cadastrar Inquilino"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
