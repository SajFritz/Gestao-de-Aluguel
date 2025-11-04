/**
 * Gera um ID único baseado em timestamp e randomização
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Gera a data/hora atual no formato ISO
 */
export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

/**
 * Gera apenas a data atual no formato ISO (yyyy-MM-dd)
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}
