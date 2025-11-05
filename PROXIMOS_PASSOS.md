# Próximos Passos - Configuração do Ambiente

Este documento contém os passos que você precisa seguir para finalizar a configuração.

## ✅ Etapas Concluídas
- [x] Criar o Google Sheet
- [x] Configurar Headers das abas
- [x] Criar Service Account no Google Cloud
- [x] Compartilhar Google Sheet com Service Account
- [x] Arquivo `.env` criado
- [x] Script `generate-hash.js` criado

## 📝 Etapas Pendentes

### Etapa 5: Configurar o arquivo .env

1. **Obter o ID do Google Sheet**:
   - Abra seu Google Sheet
   - Copie o ID da URL: `https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit`

2. **Obter credenciais da Service Account**:
   - Abra o arquivo JSON que você baixou na etapa 3
   - Encontre os campos:
     - `client_email` (email da service account)
     - `private_key` (chave privada - começa com -----BEGIN PRIVATE KEY-----)

3. **Fornecer as informações**:
   - ID do Google Sheet
   - Email da Service Account (client_email)
   - Private Key completa (private_key)

### Etapa 6: Instalar Dependências

```bash
npm install
```

### Etapa 7: Gerar Hash da Senha do Usuário Admin

```bash
node generate-hash.js
```

- Digite a senha que você deseja usar
- Copie o hash gerado

### Etapa 8: Criar Primeiro Usuário Admin no Google Sheets

1. Abra o Google Sheet
2. Vá para a aba "Usuarios"
3. Adicione uma nova linha com os dados:

| id | nome | email | senha_hash | tipo | ativo | data_criacao | ultimo_acesso |
|----|------|-------|------------|------|-------|--------------|---------------|
| 1 | Seu Nome | seu@email.com | [HASH_GERADO] | Admin | TRUE | 2025-11-04T00:00:00.000Z | |

**Importante:**
- `tipo` deve ser exatamente "Admin" (com A maiúsculo)
- `ativo` deve ser "TRUE" (maiúsculo)
- `senha_hash` deve ser o hash gerado pelo script

### Etapa 9: Testar a Configuração

```bash
npm run dev
```

- Acesse http://localhost:3000
- Faça login com o email e senha que você criou
- Você deve ver o Dashboard!

## 🔥 Próxima Ação

**Forneça as seguintes informações para eu configurar o `.env`:**

1. ID do Google Sheet
2. Email da Service Account (client_email do JSON)
3. Private Key (private_key do JSON)

Depois disso, podemos continuar com as demais etapas!
