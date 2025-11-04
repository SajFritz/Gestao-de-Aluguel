import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata um valor monetário para Real brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma data no padrão brasileiro (dd/MM/yyyy)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata uma data com hora no padrão brasileiro
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Formata um CPF (###.###.###-##)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata um telefone brasileiro
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

/**
 * Formata um CEP (##.###-###)
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
}

/**
 * Remove formatação e retorna apenas números
 */
export function removeFormatting(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Converte data brasileira (dd/MM/yyyy) para ISO (yyyy-MM-dd)
 */
export function brDateToISO(brDate: string): string {
  const [day, month, year] = brDate.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Calcula a porcentagem
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
