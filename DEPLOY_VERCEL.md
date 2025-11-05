# Deploy na Vercel - 100% em Nuvem

Este guia mostra como fazer deploy do sistema de gestão de aluguéis na **Vercel** de forma totalmente gratuita e sem precisar rodar nada localmente.

## 🌟 Por que Vercel?

- ✅ **Gratuito** para projetos pessoais
- ✅ **Deploy automático** a cada push no GitHub
- ✅ **HTTPS automático** com certificado SSL
- ✅ **Sem necessidade de servidor** ou configuração complexa
- ✅ **Suporte nativo** para Next.js
- ✅ **Domínio gratuito** (.vercel.app)

## 🚀 Passo a Passo

### 1. Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seu GitHub

### 2. Importar o Projeto do GitHub

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Procure pelo repositório **"Gestao-de-Aluguel"**
3. Clique em **"Import"**

### 3. Configurar o Projeto

Na tela de configuração:

**Framework Preset:** Next.js (deve ser detectado automaticamente)

**Root Directory:** `./` (deixe como está)

**Build Command:** `npm run build` (padrão)

**Output Directory:** `.next` (padrão)

**Install Command:** `npm install` (padrão)

### 4. Configurar Variáveis de Ambiente (IMPORTANTE!)

Antes de fazer o deploy, você precisa adicionar as variáveis de ambiente. Clique em **"Environment Variables"** e adicione:

#### GOOGLE_SHEET_ID
```
1tR0UkkzDMQrNoFFO-k_z_Rc2xE_QayX9tOUmDjOs00c
```

#### GOOGLE_SERVICE_ACCOUNT_EMAIL
```
gestao-aluguel-service@mals-aluguel-app.iam.gserviceaccount.com
```

#### GOOGLE_PRIVATE_KEY

⚠️ **IMPORTANTE**: Cole a chave EXATAMENTE como está abaixo (com as quebras de linha `\n`):

```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDuJoU4jSLlUqK+\nuxUHF+71AUXCM8rtvdzI4zKpCFa8C/ITw9XRpeUwOesqsdxrJSMB8TJLB5bNMKWQ\nieRORQxanx4nvzh948KkOls6RW7zG97/npVtEuxzUmnrHDHyjmpnkwnidoULgUI/\n+4FIDkCDc1JBJc9sAOmn7yUX2dUSxbs6x6zItF/RsYFlqTc4uVW1QxavviT96eHR\nq7xI3JXerYvnTGBdWMmcGJPZntWMurR8Uq69Ao864KEuq/zkhLykc1CY1XHwPBvB\np5Kf5JezuVKUOMYxS3kwhIOkp9OOn/afzuism+ByVE9FR7LyQvJj6H9LUUfdY8MF\nQ/l7GN05AgMBAAECgf88sxTBlTePu8A/XO+/HxqI2AovtYPDlODxUvdWngl9ZI4O\n+5tEFESWRizqdOr5ZD3IAPIQrZ6CLiQE8yB90puTfXryJor/i03RDg6yi3/79t6f\nyIvNgUVDH35frpAMgsAcJh4e2paOmCOKq1AITZmj54DPmhOEM7daVlnd+meUoNNv\nsXh4p2Wpb2os4ukAVjZNZdyt3IF3YUyZWFZNZC7bKA8TMtOroCVs+jR2fvkjQ2vI\nV21w4OvDNhu/6LMJRktgUSlm5rUc6hA8RPhzeu1kw38EYcG8djQjfTzuWDa1csN9\n/tq9vfGfrBNFR2bt96AEedAXbz65VJNcHiFdOgECgYEA/R9jYvY0eukz9ZFcK/iB\nXb3c5GfC9WM8kMo21stUZh3A1iWUy/YXuo50rqKygdmg6Gvax2SYqNw+G3ivGkzm\ndFiK3UdeAgAgk1L/04TqgQjvvaFVCc0uR/uzK3J0Iqj40qzoO9iYCIf+ofw+rjiX\nKxF+c0gGWOTFujTBEw1L/wECgYEA8NuPz41aKFQPZClvCbrWBx04bsqJqeehfESv\nBEyTCIevQCDUaMeQPunYWTA/8w1kHFAsiQ6hXnWn7tBnBCfnh3WlmqxwJFuFwLvR\nHWHKgRfkfz/fuAEsJA/FE9maHJSWkwSFMUtMrkQd+A3Gn9yDWYb74JdpAAEmLVcb\n80BDFjkCgYEA7/2npLec0IB1JDq68nG+blvKqMB8h16cmQcw8Xx9PAivwhqFttBQ\ndTAGD2Hw786gkl1YZD7LwyZ2uGM3Wi9ZPSyKFP1Kc4kdWbGTH0BhexA3BkuFrjJc\n1CEgImx1Eju1F0KbOcrFcylF0t2vrE25fjsq8jBy3CukEUVdXiv4RwECgYBpUnmW\nduc/z1JTqFKn3I2O2tY8jFCafXF+F8K4jIuXJU4bKr/3eZy4BiXXCmRMckSepOh0\nnnMuDSD8KyGBDboO4AEkm9cF7weT+g09Xe/hd4Mxqcq4ebrFoie5wGPFr6wQad+c\naKMFaT/5onyClzjQw1gNI+iEWfxJw1ezjRxI8QKBgQCwsHIgTj3JhVfmdIq79mSE\n18FqcsZDKgeTJ27F+iaSMD8zJ0gnrKQ6PIzLwVqao5Y5blBo4YNJfRgoi/GRV3wK\nD1rR4g3jkfvGNncjlA3r1CjAmelUS7tlDn3/guWsCKVk1gHs08GoAUVGkpHUvVpQ\n8VH5cQ0rYxTZEvunrjiUIg==\n-----END PRIVATE KEY-----\n
```

**NOTA**: NÃO coloque aspas ao redor da chave na Vercel!

#### JWT_SECRET
```
b3e3713d25e721c9837f14477d33f43615ca264282d2dd1ba0ef175157722bfa
```

#### NEXT_PUBLIC_API_URL

⚠️ **Deixe este em branco por enquanto!** Vamos configurar depois do primeiro deploy.

### 5. Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde a Vercel fazer o build (1-3 minutos)
3. Quando terminar, você verá uma tela de sucesso com a URL do seu app

### 6. Configurar NEXT_PUBLIC_API_URL

Após o primeiro deploy:

1. A Vercel vai te dar uma URL como: `https://gestao-de-aluguel-xyz123.vercel.app`
2. Copie essa URL
3. Vá em **Settings** → **Environment Variables**
4. Adicione/Edite a variável `NEXT_PUBLIC_API_URL` com o valor da URL que você copiou
5. Clique em **Save**
6. Vá em **Deployments** e clique nos 3 pontinhos do último deployment
7. Clique em **Redeploy** para aplicar a nova variável

### 7. Acessar o Sistema

Acesse a URL fornecida pela Vercel (ex: `https://gestao-de-aluguel-xyz123.vercel.app`)

Faça login com:
- **Email**: `admin@example.com` (ou o que você configurou)
- **Senha**: `Admin123` (ou a senha que você gerou)

## 🔄 Deploy Automático

A partir de agora, toda vez que você fizer um push para o branch no GitHub, a Vercel vai:

1. Detectar o push automaticamente
2. Fazer o build
3. Fazer o deploy
4. Atualizar o site em produção

## 🌐 Domínio Personalizado (Opcional)

Se você quiser usar seu próprio domínio:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme as instruções
4. A Vercel vai gerar certificado SSL automaticamente

## 🐛 Troubleshooting

### Erro de Build

Se o deploy falhar:
1. Clique no deployment com erro
2. Veja os logs para identificar o problema
3. Geralmente é falta de variável de ambiente

### Erro 500 ao fazer login

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Verifique se o `GOOGLE_PRIVATE_KEY` não tem aspas extras
3. Veja os logs em **Runtime Logs**

### Como ver os logs

1. Acesse o projeto na Vercel
2. Clique em **Deployments**
3. Clique no deployment ativo
4. Vá em **Runtime Logs** para ver erros em tempo real

### Variáveis de ambiente não estão funcionando

1. Verifique se salvou todas as variáveis
2. Depois de adicionar/editar variáveis, você PRECISA fazer um **Redeploy**
3. Vá em **Deployments** → **⋯** → **Redeploy**

## 📊 Monitoramento

A Vercel oferece gratuitamente:
- Logs de runtime
- Analytics de uso
- Métricas de performance
- Alertas de erro

Acesse em: **Analytics** e **Speed Insights**

## 💰 Custos

**Plano Hobby (Gratuito):**
- ✅ Deploy ilimitado
- ✅ HTTPS automático
- ✅ 100GB de bandwidth/mês
- ✅ Serverless Functions

Para uso pessoal, o plano gratuito é mais que suficiente!

## 🔐 Segurança

- ✅ HTTPS automático com certificado SSL
- ✅ Variáveis de ambiente são criptografadas
- ✅ Não expõe credenciais no código
- ✅ Deploy seguro direto do GitHub

## 📝 Resumo dos Passos

1. ✅ Criar conta na Vercel com GitHub
2. ✅ Importar repositório
3. ✅ Adicionar variáveis de ambiente
4. ✅ Fazer deploy
5. ✅ Configurar NEXT_PUBLIC_API_URL
6. ✅ Redeploy
7. ✅ Acessar e fazer login

## 🎉 Pronto!

Seu sistema está rodando 100% na nuvem, sem precisar de servidor local ou configurações complexas!

---

**Dúvidas?** Consulte a [documentação da Vercel](https://vercel.com/docs)
