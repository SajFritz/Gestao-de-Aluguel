# Configuração do Google Sheets

Este documento explica como configurar o Google Sheets para funcionar como banco de dados do sistema.

## 1. Criar o Google Sheet

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha chamada "Sistema_Alugueis_DB"
3. Crie as seguintes abas (exatamente com esses nomes):
   - Usuarios
   - Imoveis
   - Inquilinos
   - Contratos
   - Movimentacoes
   - Despesas
   - Logs

## 2. Configurar Headers de cada Aba

### Aba: Usuarios
Primeira linha (headers):
```
id | nome | email | senha_hash | tipo | ativo | data_criacao | ultimo_acesso
```

### Aba: Imoveis
Primeira linha (headers):
```
id | tipo | endereco | numero | complemento | bairro | cidade | estado | cep | quartos | iptu_anual | status | data_cadastro | observacoes
```

### Aba: Inquilinos
Primeira linha (headers):
```
id | nome | cpf | rg | data_nascimento | email | telefone | telefone_alternativo | endereco_atual | profissao | renda_mensal | data_cadastro | observacoes
```

### Aba: Contratos
Primeira linha (headers):
```
id | imovel_id | inquilino_id | data_inicio | data_fim | valor_aluguel | dia_vencimento | valor_condominio | valor_iptu | forma_pagamento | indice_reajuste | observacoes | status | data_cadastro
```

### Aba: Movimentacoes
Primeira linha (headers):
```
id | contrato_id | tipo | data_vencimento | data_pagamento | valor_esperado | valor_pago | status | forma_pagamento | observacoes | data_cadastro
```

### Aba: Despesas
Primeira linha (headers):
```
id | imovel_id | categoria | descricao | valor | data_despesa | data_pagamento | fornecedor | nota_fiscal | observacoes | data_cadastro
```

### Aba: Logs
Primeira linha (headers):
```
id | usuario_id | tipo_acao | entidade | entidade_id | descricao | data_hora | ip
```

## 3. Criar Service Account no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**:
   - Menu → APIs & Services → Library
   - Procure por "Google Sheets API"
   - Clique em "Enable"

4. Crie uma Service Account:
   - Menu → IAM & Admin → Service Accounts
   - Clique em "Create Service Account"
   - Nome: "gestao-aluguel-service"
   - Clique em "Create and Continue"
   - Não precisa adicionar roles, clique em "Continue"
   - Clique em "Done"

5. Gere a chave privada:
   - Clique na Service Account criada
   - Aba "Keys"
   - "Add Key" → "Create new key"
   - Tipo: JSON
   - Clique em "Create"
   - Salve o arquivo JSON (não compartilhe!)

## 4. Compartilhar o Google Sheet com a Service Account

1. Abra o arquivo JSON baixado
2. Copie o email da service account (campo `client_email`)
3. No Google Sheet criado, clique em "Compartilhar"
4. Cole o email da service account
5. Dê permissão de "Editor"
6. Clique em "Enviar"

## 5. Configurar as Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:

   - **GOOGLE_SHEET_ID**: Copie o ID do Google Sheet da URL
     - URL: `https://docs.google.com/spreadsheets/d/ABC123xyz/edit`
     - ID: `ABC123xyz`

   - **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Cole o valor do campo `client_email` do arquivo JSON

   - **GOOGLE_PRIVATE_KEY**: Cole o valor do campo `private_key` do arquivo JSON
     - **IMPORTANTE**: Mantenha as aspas e quebras de linha `\n`

   - **JWT_SECRET**: Crie uma string aleatória forte (mínimo 32 caracteres)

## 6. Criar o Primeiro Usuário Admin

Para criar o primeiro usuário admin, você precisa adicionar manualmente no Google Sheets:

### Opção 1: Gerar hash da senha via Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo temporário `generate-hash.js`:
   ```javascript
   const bcrypt = require('bcryptjs');
   const senha = 'SuaSenhaAqui123';
   bcrypt.hash(senha, 10).then(hash => {
     console.log('Hash gerado:');
     console.log(hash);
   });
   ```

3. Execute:
   ```bash
   node generate-hash.js
   ```

4. Copie o hash gerado

### Opção 2: Usar um gerador online de bcrypt

1. Acesse um gerador online (ex: https://bcrypt-generator.com/)
2. Digite sua senha
3. Rounds: 10
4. Copie o hash gerado

### Adicionar no Google Sheets

1. Abra a aba "Usuarios" no Google Sheet
2. Adicione uma nova linha com os seguintes dados:

| id | nome | email | senha_hash | tipo | ativo | data_criacao | ultimo_acesso |
|----|------|-------|------------|------|-------|--------------|---------------|
| 1 | Admin | admin@example.com | $2a$10$... | Admin | TRUE | 2025-01-01T00:00:00.000Z | |

**Campos:**
- **id**: Use "1" para o primeiro usuário
- **nome**: Seu nome
- **email**: Seu email
- **senha_hash**: Cole o hash bcrypt gerado
- **tipo**: "Admin" (com A maiúsculo)
- **ativo**: TRUE (maiúsculo)
- **data_criacao**: Data atual no formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
- **ultimo_acesso**: Deixe vazio

## 7. Testar a Configuração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse http://localhost:3000

3. Faça login com as credenciais criadas

4. Se tudo estiver correto, você verá o Dashboard!

## Troubleshooting

### Erro: "Falha ao ler dados da planilha"
- Verifique se compartilhou o Google Sheet com o email da Service Account
- Verifique se o GOOGLE_SHEET_ID está correto
- Verifique se os nomes das abas estão exatos (case-sensitive)

### Erro: "Token inválido"
- Verifique se o GOOGLE_PRIVATE_KEY está correto
- Certifique-se de manter as quebras de linha `\n` no private key
- Verifique se está usando aspas duplas no .env

### Erro: "Credenciais inválidas" no login
- Verifique se o hash da senha está correto
- Verifique se o email está exatamente igual
- Verifique se o campo "ativo" está como TRUE
