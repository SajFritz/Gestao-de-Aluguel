# 🚀 Início Rápido - Deploy em Nuvem

Guia super simplificado para colocar o sistema no ar em **menos de 10 minutos**.

## ✅ Pré-requisitos Concluídos

Você já fez:
- ✅ Criou o Google Sheet
- ✅ Criou a Service Account
- ✅ Compartilhou o Google Sheet com a Service Account
- ✅ Criou o usuário admin no Google Sheet

## 🌐 Deploy na Vercel (100% Nuvem)

### 1. Criar Conta
- Acesse [vercel.com](https://vercel.com)
- Clique em **Sign Up** → **Continue with GitHub**

### 2. Importar Projeto
- Clique em **Add New...** → **Project**
- Selecione **Gestao-de-Aluguel**
- Clique em **Import**

### 3. Adicionar Variáveis de Ambiente

Clique em **Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `GOOGLE_SHEET_ID` | `1tR0UkkzDMQrNoFFO-k_z_Rc2xE_QayX9tOUmDjOs00c` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `gestao-aluguel-service@mals-aluguel-app.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Cole a chave completa (veja abaixo) |
| `JWT_SECRET` | `b3e3713d25e721c9837f14477d33f43615ca264282d2dd1ba0ef175157722bfa` |

**GOOGLE_PRIVATE_KEY** (copie exatamente assim, SEM aspas):
```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDuJoU4jSLlUqK+\nuxUHF+71AUXCM8rtvdzI4zKpCFa8C/ITw9XRpeUwOesqsdxrJSMB8TJLB5bNMKWQ\nieRORQxanx4nvzh948KkOls6RW7zG97/npVtEuxzUmnrHDHyjmpnkwnidoULgUI/\n+4FIDkCDc1JBJc9sAOmn7yUX2dUSxbs6x6zItF/RsYFlqTc4uVW1QxavviT96eHR\nq7xI3JXerYvnTGBdWMmcGJPZntWMurR8Uq69Ao864KEuq/zkhLykc1CY1XHwPBvB\np5Kf5JezuVKUOMYxS3kwhIOkp9OOn/afzuism+ByVE9FR7LyQvJj6H9LUUfdY8MF\nQ/l7GN05AgMBAAECgf88sxTBlTePu8A/XO+/HxqI2AovtYPDlODxUvdWngl9ZI4O\n+5tEFESWRizqdOr5ZD3IAPIQrZ6CLiQE8yB90puTfXryJor/i03RDg6yi3/79t6f\nyIvNgUVDH35frpAMgsAcJh4e2paOmCOKq1AITZmj54DPmhOEM7daVlnd+meUoNNv\nsXh4p2Wpb2os4ukAVjZNZdyt3IF3YUyZWFZNZC7bKA8TMtOroCVs+jR2fvkjQ2vI\nV21w4OvDNhu/6LMJRktgUSlm5rUc6hA8RPhzeu1kw38EYcG8djQjfTzuWDa1csN9\n/tq9vfGfrBNFR2bt96AEedAXbz65VJNcHiFdOgECgYEA/R9jYvY0eukz9ZFcK/iB\nXb3c5GfC9WM8kMo21stUZh3A1iWUy/YXuo50rqKygdmg6Gvax2SYqNw+G3ivGkzm\ndFiK3UdeAgAgk1L/04TqgQjvvaFVCc0uR/uzK3J0Iqj40qzoO9iYCIf+ofw+rjiX\nKxF+c0gGWOTFujTBEw1L/wECgYEA8NuPz41aKFQPZClvCbrWBx04bsqJqeehfESv\nBEyTCIevQCDUaMeQPunYWTA/8w1kHFAsiQ6hXnWn7tBnBCfnh3WlmqxwJFuFwLvR\nHWHKgRfkfz/fuAEsJA/FE9maHJSWkwSFMUtMrkQd+A3Gn9yDWYb74JdpAAEmLVcb\n80BDFjkCgYEA7/2npLec0IB1JDq68nG+blvKqMB8h16cmQcw8Xx9PAivwhqFttBQ\ndTAGD2Hw786gkl1YZD7LwyZ2uGM3Wi9ZPSyKFP1Kc4kdWbGTH0BhexA3BkuFrjJc\n1CEgImx1Eju1F0KbOcrFcylF0t2vrE25fjsq8jBy3CukEUVdXiv4RwECgYBpUnmW\nduc/z1JTqFKn3I2O2tY8jFCafXF+F8K4jIuXJU4bKr/3eZy4BiXXCmRMckSepOh0\nnnMuDSD8KyGBDboO4AEkm9cF7weT+g09Xe/hd4Mxqcq4ebrFoie5wGPFr6wQad+c\naKMFaT/5onyClzjQw1gNI+iEWfxJw1ezjRxI8QKBgQCwsHIgTj3JhVfmdIq79mSE\n18FqcsZDKgeTJ27F+iaSMD8zJ0gnrKQ6PIzLwVqao5Y5blBo4YNJfRgoi/GRV3wK\nD1rR4g3jkfvGNncjlA3r1CjAmelUS7tlDn3/guWsCKVk1gHs08GoAUVGkpHUvVpQ\n8VH5cQ0rYxTZEvunrjiUIg==\n-----END PRIVATE KEY-----\n
```

### 4. Deploy
- Clique em **Deploy**
- Aguarde 2-3 minutos

### 5. Configurar URL (Após o Deploy)
- Copie a URL gerada (ex: `https://gestao-de-aluguel-xyz.vercel.app`)
- Vá em **Settings** → **Environment Variables**
- Adicione `NEXT_PUBLIC_API_URL` com a URL que você copiou
- Vá em **Deployments** → **⋯** → **Redeploy**

### 6. Acessar
- Acesse a URL da Vercel
- Login:
  - **Email**: `admin@example.com`
  - **Senha**: `Admin123`

## 🎊 Pronto!

Seu sistema está rodando 100% na nuvem!

## 📚 Mais Detalhes

Para informações completas, veja [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

## 🐛 Problemas?

Se algo não funcionar:
1. Verifique os logs na Vercel (Deployments → Seu deploy → Runtime Logs)
2. Certifique-se de que todas as variáveis foram adicionadas
3. Lembre-se de fazer **Redeploy** após adicionar variáveis

---

**Deploy automático**: Todo push no GitHub vai atualizar o sistema automaticamente! 🚀
