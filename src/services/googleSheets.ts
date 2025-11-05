import { google } from "googleapis";

// Nome das abas do Google Sheets
export const SHEETS = {
  USUARIOS: "Usuarios",
  IMOVEIS: "Imoveis",
  INQUILINOS: "Inquilinos",
  CONTRATOS: "Contratos",
  MOVIMENTACOES: "Movimentacoes",
  DESPESAS: "Despesas",
  LOGS: "Logs",
} as const;

// Configuração do cliente Google Sheets
let sheets: any = null;

/**
 * Inicializa o cliente Google Sheets com Service Account
 */
function getSheets() {
  if (sheets) return sheets;

  // Validação das variáveis de ambiente
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.error("[SHEETS] GOOGLE_SERVICE_ACCOUNT_EMAIL não configurado");
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL não está configurado");
  }

  if (!process.env.GOOGLE_PRIVATE_KEY) {
    console.error("[SHEETS] GOOGLE_PRIVATE_KEY não configurado");
    throw new Error("GOOGLE_PRIVATE_KEY não está configurado");
  }

  if (!process.env.GOOGLE_SHEET_ID) {
    console.error("[SHEETS] GOOGLE_SHEET_ID não configurado");
    throw new Error("GOOGLE_SHEET_ID não está configurado");
  }

  // Tratamento da chave privada - remove aspas extras e corrige quebras de linha
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Remove aspas duplas no início e fim (se houver)
  privateKey = privateKey.replace(/^["']|["']$/g, '');

  // Substitui \\n literal por quebra de linha real
  privateKey = privateKey.replace(/\\n/g, '\n');

  // Remove espaços em branco extras no início e fim
  privateKey = privateKey.trim();

  console.log("[SHEETS] Inicializando Google Sheets API...");
  console.log("[SHEETS] Service Account:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  console.log("[SHEETS] Private Key início:", privateKey.substring(0, 30) + "...");
  console.log("[SHEETS] Private Key contém quebras de linha:", privateKey.includes('\n'));

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheets = google.sheets({ version: "v4", auth });
    console.log("[SHEETS] Google Sheets API inicializado com sucesso");
    return sheets;
  } catch (error) {
    console.error("[SHEETS] Erro ao inicializar Google Sheets API:", error);
    throw error;
  }
}

/**
 * Lê dados de uma aba do Google Sheets
 */
export async function readSheet(
  sheetName: string,
  range?: string
): Promise<any[][]> {
  try {
    console.log(`[SHEETS] Lendo planilha ${sheetName}...`);
    const sheetsApi = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    console.log(`[SHEETS] Spreadsheet ID: ${spreadsheetId ? 'Configurado' : 'NÃO CONFIGURADO'}`);

    const fullRange = range ? `${sheetName}!${range}` : sheetName;

    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    });

    console.log(`[SHEETS] Planilha ${sheetName} lida com sucesso. Linhas: ${response.data.values?.length || 0}`);
    return response.data.values || [];
  } catch (error) {
    console.error(`[SHEETS] Erro ao ler planilha ${sheetName}:`, error);
    console.error(`[SHEETS] Detalhes do erro:`, error instanceof Error ? error.message : String(error));
    throw new Error(`Falha ao ler dados da planilha ${sheetName}`);
  }
}

/**
 * Escreve dados em uma aba do Google Sheets
 */
export async function writeSheet(
  sheetName: string,
  range: string,
  values: any[][]
): Promise<void> {
  try {
    const sheetsApi = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error(`Erro ao escrever na planilha ${sheetName}:`, error);
    throw new Error(`Falha ao escrever dados na planilha ${sheetName}`);
  }
}

/**
 * Adiciona uma nova linha no final de uma aba
 */
export async function appendSheet(
  sheetName: string,
  values: any[][]
): Promise<void> {
  try {
    const sheetsApi = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error(`Erro ao adicionar linha na planilha ${sheetName}:`, error);
    throw new Error(`Falha ao adicionar dados na planilha ${sheetName}`);
  }
}

/**
 * Atualiza uma linha específica em uma aba
 */
export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: any[]
): Promise<void> {
  try {
    const range = `A${rowIndex}:Z${rowIndex}`;
    await writeSheet(sheetName, range, [values]);
  } catch (error) {
    console.error(`Erro ao atualizar linha ${rowIndex} na planilha ${sheetName}:`, error);
    throw new Error(`Falha ao atualizar linha na planilha ${sheetName}`);
  }
}

/**
 * Deleta uma linha (marca como deletada ou limpa os dados)
 * Nota: Google Sheets API não permite deletar linhas facilmente,
 * então vamos limpar os dados da linha
 */
export async function deleteRow(
  sheetName: string,
  rowIndex: number
): Promise<void> {
  try {
    const sheetsApi = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Obter o ID da aba
    const spreadsheet = await sheetsApi.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s: any) => s.properties.title === sheetName
    );

    if (!sheet) {
      throw new Error(`Aba ${sheetName} não encontrada`);
    }

    const sheetId = sheet.properties.sheetId;

    // Deletar a linha
    await sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex - 1, // 0-indexed
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar linha ${rowIndex} na planilha ${sheetName}:`, error);
    throw new Error(`Falha ao deletar linha na planilha ${sheetName}`);
  }
}

/**
 * Converte array de valores em objeto baseado no header
 */
export function rowToObject<T>(headers: string[], row: any[]): T {
  const obj: any = {};

  headers.forEach((header, index) => {
    const value = row[index];

    // Converte valores booleanos
    if (value === "TRUE" || value === "true") {
      obj[header] = true;
    } else if (value === "FALSE" || value === "false") {
      obj[header] = false;
    }
    // Converte números
    else if (value && !isNaN(Number(value)) && value !== "") {
      obj[header] = Number(value);
    }
    // Mantém strings e valores vazios
    else {
      obj[header] = value || "";
    }
  });

  return obj as T;
}

/**
 * Converte objeto em array de valores baseado no header
 */
export function objectToRow(headers: string[], obj: any): any[] {
  return headers.map((header) => {
    const value = obj[header];

    // Converte undefined/null para string vazia
    if (value === undefined || value === null) {
      return "";
    }

    // Converte booleanos
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }

    return value;
  });
}

/**
 * Obtém todos os registros de uma aba como objetos
 */
export async function getAllRecords<T>(sheetName: string): Promise<T[]> {
  const data = await readSheet(sheetName);

  if (data.length === 0) {
    return [];
  }

  const [headers, ...rows] = data;

  return rows.map((row) => rowToObject<T>(headers, row));
}

/**
 * Busca um registro por ID em uma aba
 */
export async function findById<T extends { id: string }>(
  sheetName: string,
  id: string
): Promise<T | null> {
  const records = await getAllRecords<T>(sheetName);
  return records.find((record) => record.id === id) || null;
}

/**
 * Cria um novo registro em uma aba
 */
export async function createRecord<T>(
  sheetName: string,
  record: T
): Promise<void> {
  const data = await readSheet(sheetName);

  if (data.length === 0) {
    throw new Error(`Planilha ${sheetName} não possui headers`);
  }

  const headers = data[0];
  const row = objectToRow(headers, record);

  await appendSheet(sheetName, [row]);
}

/**
 * Atualiza um registro existente em uma aba
 */
export async function updateRecord<T extends { id: string }>(
  sheetName: string,
  record: T
): Promise<void> {
  console.log(`[SHEETS] Atualizando registro ${record.id} na planilha ${sheetName}...`);
  const data = await readSheet(sheetName);

  if (data.length === 0) {
    console.error(`[SHEETS] Planilha ${sheetName} não possui dados`);
    throw new Error(`Planilha ${sheetName} não possui dados`);
  }

  const [headers, ...rows] = data;

  // Encontra o índice da linha (começando em 2, pois 1 é o header)
  const rowIndex = rows.findIndex((row) => row[0] === record.id) + 2;

  if (rowIndex < 2) {
    console.error(`[SHEETS] Registro com ID ${record.id} não encontrado`);
    throw new Error(`Registro com ID ${record.id} não encontrado`);
  }

  console.log(`[SHEETS] Registro encontrado na linha ${rowIndex}`);
  const row = objectToRow(headers, record);
  await updateRow(sheetName, rowIndex, row);
  console.log(`[SHEETS] Registro ${record.id} atualizado com sucesso`);
}

/**
 * Deleta um registro de uma aba
 */
export async function deleteRecord(
  sheetName: string,
  id: string
): Promise<void> {
  const data = await readSheet(sheetName);

  if (data.length === 0) {
    throw new Error(`Planilha ${sheetName} não possui dados`);
  }

  const [, ...rows] = data;

  // Encontra o índice da linha (começando em 2, pois 1 é o header)
  const rowIndex = rows.findIndex((row) => row[0] === id) + 2;

  if (rowIndex < 2) {
    throw new Error(`Registro com ID ${id} não encontrado`);
  }

  await deleteRow(sheetName, rowIndex);
}
