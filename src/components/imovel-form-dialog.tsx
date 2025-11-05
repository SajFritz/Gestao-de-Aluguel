"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Imovel, TipoImovel, StatusImovel } from "@/types"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const imovelFormSchema = z.object({
  tipo: z.enum(["Casa", "Apartamento", "Kitnet", "Comercial", "Outro"], {
    required_error: "Selecione um tipo de imóvel",
  }),
  endereco: z.string().min(3, "Endereço é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres (ex: SP)").toUpperCase(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (ex: 12345-678)"),
  quartos: z.coerce.number().min(0, "Número de quartos não pode ser negativo"),
  iptu_anual: z.coerce.number().min(0, "IPTU anual não pode ser negativo"),
  status: z.enum(["Alugado", "Vago"], {
    required_error: "Selecione um status",
  }),
  observacoes: z.string().optional(),
})

type ImovelFormValues = z.infer<typeof imovelFormSchema>

interface ImovelFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imovel?: Imovel
  onSuccess: () => void
}

export function ImovelFormDialog({
  open,
  onOpenChange,
  imovel,
  onSuccess,
}: ImovelFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!imovel

  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(imovelFormSchema),
    defaultValues: imovel
      ? {
          tipo: imovel.tipo,
          endereco: imovel.endereco,
          numero: imovel.numero,
          complemento: imovel.complemento || "",
          bairro: imovel.bairro,
          cidade: imovel.cidade,
          estado: imovel.estado,
          cep: imovel.cep,
          quartos: imovel.quartos,
          iptu_anual: imovel.iptu_anual,
          status: imovel.status,
          observacoes: imovel.observacoes || "",
        }
      : {
          tipo: "Casa" as TipoImovel,
          endereco: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          quartos: 0,
          iptu_anual: 0,
          status: "Vago" as StatusImovel,
          observacoes: "",
        },
  })

  const onSubmit = async (values: ImovelFormValues) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")

      const url = isEditing ? `/api/imoveis/${imovel.id}` : "/api/imoveis"
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
        alert(data.error || "Erro ao salvar imóvel")
      }
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error)
      alert("Erro ao salvar imóvel")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do imóvel"
              : "Preencha os dados para cadastrar um novo imóvel"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Apartamento">Apartamento</SelectItem>
                        <SelectItem value="Kitnet">Kitnet</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vago">Vago</SelectItem>
                        <SelectItem value="Alugado">Alugado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto 101, Bloco A..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SP"
                        maxLength={2}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="12345-678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quartos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iptu_anual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPTU Anual (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="1200.00"
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
                {isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
