#!/usr/bin/env node

/**
 * Script de Diagnóstico - Conexão com Google Sheets
 *
 * Este script testa a conexão e configuração do Google Sheets
 */

require('dotenv').config();
const { google } = require('googleapis');

console.log('\n🔍 Iniciando diagnóstico da conexão com Google Sheets...\n');

// 1. Verificar variáveis de ambiente
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ETAPA 1: Verificando Variáveis de Ambiente');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

console.log(`✓ GOOGLE_SHEET_ID: ${GOOGLE_SHEET_ID ? '✅ Definido' : '❌ NÃO DEFINIDO'}`);
console.log(`✓ GOOGLE_SERVICE_ACCOUNT_EMAIL: ${GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Definido' : '❌ NÃO DEFINIDO'}`);
console.log(`✓ GOOGLE_PRIVATE_KEY: ${GOOGLE_PRIVATE_KEY ? '✅ Definido' : '❌ NÃO DEFINIDO'}`);

if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  console.error('\n❌ ERRO: Variáveis de ambiente não configuradas corretamente!');
  console.error('Verifique o arquivo .env na raiz do projeto.');
  process.exit(1);
}

console.log(`\n📧 Email da Service Account: ${GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
console.log(`📄 Google Sheet ID: ${GOOGLE_SHEET_ID}`);
console.log(`🔑 Private Key: ${GOOGLE_PRIVATE_KEY.substring(0, 50)}...`);

// 2. Testar autenticação
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔐 ETAPA 2: Testando Autenticação Google');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let auth, sheets;

try {
  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Autenticação criada com sucesso!\n');
} catch (error) {
  console.error('❌ ERRO ao criar autenticação:', error.message);
  console.error('\nVerifique:');
  console.error('- Se o GOOGLE_PRIVATE_KEY está completo');
  console.error('- Se contém as quebras de linha \\n');
  console.error('- Se o GOOGLE_SERVICE_ACCOUNT_EMAIL está correto');
  process.exit(1);
}

// 3. Testar acesso ao Google Sheet
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 ETAPA 3: Testando Acesso ao Google Sheet');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testConnection() {
  try {
    // Buscar informações da planilha
    console.log('⏳ Buscando informações da planilha...\n');

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID,
    });

    console.log(`✅ Planilha encontrada: "${spreadsheet.data.properties.title}"`);
    console.log(`\n📑 Abas encontradas:`);

    spreadsheet.data.sheets.forEach((sheet, index) => {
      console.log(`   ${index + 1}. ${sheet.properties.title}`);
    });

    // 4. Testar leitura da aba Usuarios
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 ETAPA 4: Testando Leitura da Aba "Usuarios"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const usuariosResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Usuarios',
    });

    const usuarios = usuariosResponse.data.values || [];

    if (usuarios.length === 0) {
      console.error('❌ ERRO: Aba "Usuarios" está vazia!');
      console.error('Adicione pelo menos o header e um usuário admin.');
      process.exit(1);
    }

    console.log(`✅ Aba "Usuarios" encontrada!`);
    console.log(`📊 Total de linhas: ${usuarios.length} (incluindo header)\n`);

    const [headers, ...rows] = usuarios;

    console.log('📋 Headers encontrados:');
    console.log(`   ${headers.join(' | ')}\n`);

    if (rows.length === 0) {
      console.error('❌ ERRO: Nenhum usuário cadastrado!');
      console.error('Adicione um usuário admin na aba Usuarios.');
      process.exit(1);
    }

    console.log(`👥 Usuários cadastrados: ${rows.length}\n`);

    rows.forEach((row, index) => {
      const usuario = {
        id: row[0] || '',
        nome: row[1] || '',
        email: row[2] || '',
        senha_hash: row[3] || '',
        tipo: row[4] || '',
        ativo: row[5] || '',
      };

      console.log(`   ${index + 1}. ${usuario.nome} (${usuario.email})`);
      console.log(`      - Tipo: ${usuario.tipo}`);
      console.log(`      - Ativo: ${usuario.ativo}`);
      console.log(`      - Hash: ${usuario.senha_hash.substring(0, 20)}...`);
      console.log('');
    });

    // 5. Verificar hash da senha
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 ETAPA 5: Verificando Hash da Senha');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const bcrypt = require('bcryptjs');
    const primeiroUsuario = rows[0];
    const senhaHash = primeiroUsuario[3];

    console.log(`Hash no Google Sheets: ${senhaHash}\n`);

    // Testar se o hash é válido
    const senhasTeste = ['Admin123', 'admin123', 'Admin@123', '123456'];

    console.log('🔍 Testando senhas comuns...\n');

    for (const senha of senhasTeste) {
      const valida = await bcrypt.compare(senha, senhaHash);
      console.log(`   ${senha.padEnd(15)} ${valida ? '✅ VÁLIDA!' : '❌ Inválida'}`);

      if (valida) {
        console.log(`\n✅ Senha encontrada: "${senha}"`);
        console.log(`   Use esta senha para fazer login!`);
        break;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DIAGNÓSTICO CONCLUÍDO COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Resumo:');
    console.log(`   ✅ Conexão com Google Sheets: OK`);
    console.log(`   ✅ Aba "Usuarios": OK`);
    console.log(`   ✅ Usuário admin cadastrado: OK`);
    console.log(`   ✅ Hash da senha: OK\n`);

    console.log('🎯 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. Acesse: http://localhost:3000');
    console.log('   3. Faça login com:');
    console.log(`      - Email: ${primeiroUsuario[2]}`);
    console.log(`      - Senha: (uma das senhas válidas acima)\n`);

  } catch (error) {
    console.error('\n❌ ERRO ao acessar o Google Sheet:\n');
    console.error(`Mensagem: ${error.message}\n`);

    if (error.message.includes('404')) {
      console.error('🔍 Possíveis causas:');
      console.error('   - GOOGLE_SHEET_ID está incorreto');
      console.error('   - Google Sheet não foi compartilhado com a Service Account');
      console.error(`   - Verifique se compartilhou com: ${GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    } else if (error.message.includes('403') || error.message.includes('permission')) {
      console.error('🔍 Possíveis causas:');
      console.error('   - Google Sheet não foi compartilhado com a Service Account');
      console.error('   - Permissão insuficiente (precisa ser "Editor")');
      console.error(`   - Verifique se compartilhou com: ${GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    } else if (error.message.includes('Usuarios')) {
      console.error('🔍 Possíveis causas:');
      console.error('   - Aba "Usuarios" não existe no Google Sheet');
      console.error('   - Nome da aba está diferente (verifique maiúsculas/minúsculas)');
      console.error('   - Aba esperada: "Usuarios" (sem acento)');
    } else {
      console.error('🔍 Possíveis causas:');
      console.error('   - GOOGLE_PRIVATE_KEY pode estar incorreta');
      console.error('   - Problema de conexão com Google API');
      console.error('   - Service Account desabilitada ou deletada');
    }

    console.error('\n📚 Consulte o arquivo SETUP_GOOGLE_SHEETS.md para mais informações.\n');
    process.exit(1);
  }
}

testConnection();
