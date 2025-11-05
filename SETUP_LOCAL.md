# Configuração do Ambiente Local

Este documento explica como configurar o ambiente de desenvolvimento na sua máquina local.

## 📋 Pré-requisitos

- Node.js 18+ instalado ([Download aqui](https://nodejs.org/))
- Git instalado
- Acesso ao repositório GitHub

## 🚀 Passo a Passo

### 1. Clonar ou Atualizar o Repositório

**Se você já tem o repositório clonado:**
```bash
git pull origin claude/google-setup-service-account-011CUoSKR87oUugmb4fgCENG
```

**Se você ainda não clonou o repositório:**
```bash
git clone https://github.com/SajFritz/Gestao-de-Aluguel.git
cd Gestao-de-Aluguel
git checkout claude/google-setup-service-account-011CUoSKR87oUugmb4fgCENG
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Criar o Arquivo .env

⚠️ **IMPORTANTE**: O arquivo `.env` não está no GitHub por motivos de segurança. Você precisa criá-lo manualmente.

**Crie um arquivo chamado `.env` na raiz do projeto** com o seguinte conteúdo:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=1tR0UkkzDMQrNoFFO-k_z_Rc2xE_QayX9tOUmDjOs00c
GOOGLE_SERVICE_ACCOUNT_EMAIL=gestao-aluguel-service@mals-aluguel-app.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDuJoU4jSLlUqK+\nuxUHF+71AUXCM8rtvdzI4zKpCFa8C/ITw9XRpeUwOesqsdxrJSMB8TJLB5bNMKWQ\nieRORQxanx4nvzh948KkOls6RW7zG97/npVtEuxzUmnrHDHyjmpnkwnidoULgUI/\n+4FIDkCDc1JBJc9sAOmn7yUX2dUSxbs6x6zItF/RsYFlqTc4uVW1QxavviT96eHR\nq7xI3JXerYvnTGBdWMmcGJPZntWMurR8Uq69Ao864KEuq/zkhLykc1CY1XHwPBvB\np5Kf5JezuVKUOMYxS3kwhIOkp9OOn/afzuism+ByVE9FR7LyQvJj6H9LUUfdY8MF\nQ/l7GN05AgMBAAECgf88sxTBlTePu8A/XO+/HxqI2AovtYPDlODxUvdWngl9ZI4O\n+5tEFESWRizqdOr5ZD3IAPIQrZ6CLiQE8yB90puTfXryJor/i03RDg6yi3/79t6f\nyIvNgUVDH35frpAMgsAcJh4e2paOmCOKq1AITZmj54DPmhOEM7daVlnd+meUoNNv\nsXh4p2Wpb2os4ukAVjZNZdyt3IF3YUyZWFZNZC7bKA8TMtOroCVs+jR2fvkjQ2vI\nV21w4OvDNhu/6LMJRktgUSlm5rUc6hA8RPhzeu1kw38EYcG8djQjfTzuWDa1csN9\n/tq9vfGfrBNFR2bt96AEedAXbz65VJNcHiFdOgECgYEA/R9jYvY0eukz9ZFcK/iB\nXb3c5GfC9WM8kMo21stUZh3A1iWUy/YXuo50rqKygdmg6Gvax2SYqNw+G3ivGkzm\ndFiK3UdeAgAgk1L/04TqgQjvvaFVCc0uR/uzK3J0Iqj40qzoO9iYCIf+ofw+rjiX\nKxF+c0gGWOTFujTBEw1L/wECgYEA8NuPz41aKFQPZClvCbrWBx04bsqJqeehfESv\nBEyTCIevQCDUaMeQPunYWTA/8w1kHFAsiQ6hXnWn7tBnBCfnh3WlmqxwJFuFwLvR\nHWHKgRfkfz/fuAEsJA/FE9maHJSWkwSFMUtMrkQd+A3Gn9yDWYb74JdpAAEmLVcb\n80BDFjkCgYEA7/2npLec0IB1JDq68nG+blvKqMB8h16cmQcw8Xx9PAivwhqFttBQ\ndTAGD2Hw786gkl1YZD7LwyZ2uGM3Wi9ZPSyKFP1Kc4kdWbGTH0BhexA3BkuFrjJc\n1CEgImx1Eju1F0KbOcrFcylF0t2vrE25fjsq8jBy3CukEUVdXiv4RwECgYBpUnmW\nduc/z1JTqFKn3I2O2tY8jFCafXF+F8K4jIuXJU4bKr/3eZy4BiXXCmRMckSepOh0\nnnMuDSD8KyGBDboO4AEkm9cF7weT+g09Xe/hd4Mxqcq4ebrFoie5wGPFr6wQad+c\naKMFaT/5onyClzjQw1gNI+iEWfxJw1ezjRxI8QKBgQCwsHIgTj3JhVfmdIq79mSE\n18FqcsZDKgeTJ27F+iaSMD8zJ0gnrKQ6PIzLwVqao5Y5blBo4YNJfRgoi/GRV3wK\nD1rR4g3jkfvGNncjlA3r1CjAmelUS7tlDn3/guWsCKVk1gHs08GoAUVGkpHUvVpQ\n8VH5cQ0rYxTZEvunrjiUIg==\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=b3e3713d25e721c9837f14477d33f43615ca264282d2dd1ba0ef175157722bfa

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Verificar Configuração

Verifique se o arquivo `.env` foi criado corretamente:

```bash
# Windows (PowerShell)
Get-Content .env

# Mac/Linux
cat .env
```

### 5. Iniciar o Servidor

```bash
npm run dev
```

Aguarde a mensagem:
```
✓ Ready in 3s
- Local: http://localhost:3000
```

### 6. Acessar o Sistema

Abra seu navegador e acesse: **http://localhost:3000**

### 7. Fazer Login

Use as credenciais do usuário admin que você criou no Google Sheets:

- **Email**: `admin@example.com` (ou o email que você configurou)
- **Senha**: `Admin123` (ou a senha que você gerou)

## 🎊 Pronto!

Se tudo estiver correto, você verá o Dashboard do sistema de gestão de aluguéis!

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "GOOGLE_SHEET_ID is not defined"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se o arquivo está no formato correto (sem espaços extras)

### Erro: "Failed to authenticate"
- Verifique se a GOOGLE_PRIVATE_KEY está completa (incluindo `-----BEGIN` e `-----END`)
- Verifique se manteve as quebras de linha `\n`
- Verifique se está usando aspas duplas

### Porta 3000 já está em uso
```bash
# Altere a porta no package.json ou use:
PORT=3001 npm run dev
```

## 📝 Notas Importantes

- ⚠️ **NUNCA** faça commit do arquivo `.env` no GitHub
- 🔒 O arquivo `.env` contém credenciais sensíveis
- 📋 O arquivo `.env.example` serve apenas como template
- 🔄 Se precisar regenerar a senha do admin, use: `node generate-hash.js`

## 📧 Suporte

Se tiver problemas, verifique:
1. Node.js está instalado (versão 18+)
2. Dependências foram instaladas (`npm install`)
3. Arquivo `.env` existe e está correto
4. Google Sheet foi compartilhado com a Service Account
5. Usuário admin foi criado no Google Sheets

---

**Desenvolvido para facilitar a gestão de aluguéis** 🏠
