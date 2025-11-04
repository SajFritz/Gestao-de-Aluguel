#!/usr/bin/env node

/**
 * Script para gerar hash bcrypt de senhas
 * Uso: node generate-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Gerador de Hash bcrypt para Senha\n');

rl.question('Digite a senha que deseja hashear: ', (senha) => {
  if (!senha || senha.length < 6) {
    console.error('\n❌ Erro: A senha deve ter pelo menos 6 caracteres');
    rl.close();
    process.exit(1);
  }

  console.log('\n⏳ Gerando hash...\n');

  bcrypt.hash(senha, 10)
    .then(hash => {
      console.log('✅ Hash gerado com sucesso!');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Copie o hash abaixo:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(hash);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('📝 Use este hash no campo "senha_hash" da aba Usuarios do Google Sheets\n');
      rl.close();
    })
    .catch(err => {
      console.error('\n❌ Erro ao gerar hash:', err.message);
      rl.close();
      process.exit(1);
    });
});
