# 🚀 Início Rápido - Deploy em Nuvem

Guia super simplificado para colocar o sistema no ar em **menos de 10 minutos**.

## ✅ Pré-requisitos Concluídos

Você já fez:
- ✅ Criou o Google Sheet
- ✅ Criou a Service Account
- ✅ Compartilhou o Google Sheet com a Service Account
- ✅ Criou o usuário admin no Google Sheet

## 🌐 Escolha sua Plataforma de Deploy

### 🆚 Comparação Rápida

| Característica | Vercel | Render |
|----------------|--------|--------|
| **Plano Gratuito** | ✅ Sim | ✅ Sim |
| **HTTPS** | ✅ Automático | ✅ Automático |
| **Deploy Automático** | ✅ Sim | ✅ Sim |
| **Sleep/Inatividade** | ❌ Não | ⚠️ Sim (15min) |
| **Melhor para** | Next.js | Apps gerais |

**💡 Recomendação**: Use **Render** se tiver problemas com Vercel. Ambas são excelentes!

---

## 📘 Opção 1: Deploy no Render

### 1. Criar Conta
- Acesse [render.com](https://render.com)
- Clique em **Get Started** → **Sign in with GitHub**

### 2. Criar Web Service
- Clique em **New +** → **Web Service**
- Conecte o repositório **Gestao-de-Aluguel**
- Clique em **Connect**

### 3. Configurar
- **Name**: `gestao-aluguel`
- **Branch**: `claude/google-setup-service-account-011CUoSKR87oUugmb4fgCENG`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 4. Adicionar Variáveis de Ambiente

Adicione estas 5 variáveis em **Environment Variables**:

| Key | Value |
|-----|-------|
| `GOOGLE_SHEET_ID` | `1tR0UkkzDMQrNoFFO-k_z_Rc2xE_QayX9tOUmDjOs00c` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `gestao-aluguel-service@mals-aluguel-app.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | (veja abaixo) |
| `JWT_SECRET` | `b3e3713d25e721c9837f14477d33f43615ca264282d2dd1ba0ef175157722bfa` |
| `NODE_ENV` | `production` |

**GOOGLE_PRIVATE_KEY** (copie SEM aspas):
```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDuJoU4jSLlUqK+\nuxUHF+71AUXCM8rtvdzI4zKpCFa8C/ITw9XRpeUwOesqsdxrJSMB8TJLB5bNMKWQ\nieRORQxanx4nvzh948KkOls6RW7zG97/npVtEuxzUmnrHDHyjmpnkwnidoULgUI/\n+4FIDkCDc1JBJc9sAOmn7yUX2dUSxbs6x6zItF/RsYFlqTc4uVW1QxavviT96eHR\nq7xI3JXerYvnTGBdWMmcGJPZntWMurR8Uq69Ao864KEuq/zkhLykc1CY1XHwPBvB\np5Kf5JezuVKUOMYxS3kwhIOkp9OOn/afzuism+ByVE9FR7LyQvJj6H9LUUfdY8MF\nQ/l7GN05AgMBAAECgf88sxTBlTePu8A/XO+/HxqI2AovtYPDlODxUvdWngl9ZI4O\n+5tEFESWRizqdOr5ZD3IAPIQrZ6CLiQE8yB90puTfXryJor/i03RDg6yi3/79t6f\nyIvNgUVDH35frpAMgsAcJh4e2paOmCOKq1AITZmj54DPmhOEM7daVlnd+meUoNNv\nsXh4p2Wpb2os4ukAVjZNZdyt3IF3YUyZWFZNZC7bKA8TMtOroCVs+jR2fvkjQ2vI\nV21w4OvDNhu/6LMJRktgUSlm5rUc6hA8RPhzeu1kw38EYcG8djQjfTzuWDa1csN9\n/tq9vfGfrBNFR2bt96AEedAXbz65VJNcHiFdOgECgYEA/R9jYvY0eukz9ZFcK/iB\nXb3c5GfC9WM8kMo21stUZh3A1iWUy/YXuo50rqKygdmg6Gvax2SYqNw+G3ivGkzm\ndFiK3UdeAgAgk1L/04TqgQjvvaFVCc0uR/uzK3J0Iqj40qzoO9iYCIf+ofw+rjiX\nKxF+c0gGWOTFujTBEw1L/wECgYEA8NuPz41aKFQPZClvCbrWBx04bsqJqeehfESv\nBEyTCIevQCDUaMeQPunYWTA/8w1kHFAsiQ6hXnWn7tBnBCfnh3WlmqxwJFuFwLvR\nHWHKgRfkfz/fuAEsJA/FE9maHJSWkwSFMUtMrkQd+A3Gn9yDWYb74JdpAAEmLVcb\n80BDFjkCgYEA7/2npLec0IB1JDq68nG+blvKqMB8h16cmQcw8Xx9PAivwhqFttBQ\ndTAGD2Hw786gkl1YZD7LwyZ2uGM3Wi9ZPSyKFP1Kc4kdWbGTH0BhexA3BkuFrjJc\n1CEgImx1Eju1F0KbOcrFcylF0t2vrE25fjsq8jBy3CukEUVdXiv4RwECgYBpUnmW\nduc/z1JTqFKn3I2O2tY8jFCafXF+F8K4jIuXJU4bKr/3eZy4BiXXCmRMckSepOh0\nnnMuDSD8KyGBDboO4AEkm9cF7weT+g09Xe/hd4Mxqcq4ebrFoie5wGPFr6wQad+c\naKMFaT/5onyClzjQw1gNI+iEWfxJw1ezjRxI8QKBgQCwsHIgTj3JhVfmdIq79mSE\n18FqcsZDKgeTJ27F+iaSMD8zJ0gnrKQ6PIzLwVqao5Y5blBo4YNJfRgoi/GRV3wK\nD1rR4g3jkfvGNncjlA3r1CjAmelUS7tlDn3/guWsCKVk1gHs08GoAUVGkpHUvVpQ\n8VH5cQ0rYxTZEvunrjiUIg==\n-----END PRIVATE KEY-----\n
```

### 5. Fazer Deploy
- Clique em **Create Web Service**
- Aguarde 3-5 minutos

### 6. Configurar URL (Após Deploy)
- Copie a URL gerada (ex: `https://gestao-aluguel.onrender.com`)
- Vá em **Environment** → **Add Environment Variable**
- Adicione `NEXT_PUBLIC_API_URL` com a URL copiada
- Aguarde o redeploy automático (1-2 min)

### 7. Acessar
- Acesse a URL do Render
- Login:
  - **Email**: `admin@example.com`
  - **Senha**: `Admin123`

⚠️ **Nota**: No plano gratuito, o app "dorme" após 15min de inatividade. Primeiro acesso pode demorar 30-60s.

---

## 📗 Opção 2: Deploy na Vercel

### 1. Criar Conta
- Acesse [vercel.com](https://vercel.com)
- Clique em **Sign Up** → **Continue with GitHub**

### 2. Importar Projeto
- Clique em **Add New...** → **Project**
- Selecione **Gestao-de-Aluguel**
- Clique em **Import**

### 3. Adicionar Variáveis (mesmas do Render, exceto NODE_ENV)

### 4. Deploy e configurar NEXT_PUBLIC_API_URL (mesmo processo)

---

## 🎊 Pronto!

Seu sistema está rodando 100% na nuvem!

## 📚 Guias Completos

- **Render**: [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)
- **Vercel**: [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

## 🐛 Problemas?

**No Render:**
- Veja os logs em **Logs** no menu lateral
- Certifique-se de adicionar todas as 5 variáveis
- Aguarde o serviço "acordar" no primeiro acesso

**Na Vercel:**
- Veja logs em **Deployments** → **Runtime Logs**
- Lembre-se de fazer **Redeploy** após adicionar variáveis

---

**Deploy automático**: Todo push no GitHub vai atualizar o sistema automaticamente! 🚀
