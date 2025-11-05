# Deploy no Render - 100% em Nuvem

Este guia mostra como fazer deploy do sistema de gestão de aluguéis no **Render** de forma totalmente gratuita e sem precisar rodar nada localmente.

## 🌟 Por que Render?

- ✅ **Gratuito** para projetos pessoais
- ✅ **Deploy automático** a cada push no GitHub
- ✅ **HTTPS automático** com certificado SSL
- ✅ **Sem necessidade de servidor** ou configuração complexa
- ✅ **Suporte para Next.js**
- ✅ **Fácil de usar**

## 🚀 Passo a Passo

### 1. Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"**
3. Escolha **"Sign in with GitHub"**
4. Autorize o Render a acessar seu GitHub

### 2. Criar um novo Web Service

1. No dashboard do Render, clique em **"New +"** no topo
2. Selecione **"Web Service"**
3. Clique em **"Connect account"** para conectar seu GitHub (se ainda não conectou)
4. Procure pelo repositório **"Gestao-de-Aluguel"**
5. Clique em **"Connect"** ao lado do repositório

### 3. Configurar o Web Service

Na tela de configuração, preencha os seguintes campos:

**Name:** `gestao-aluguel` (ou outro nome de sua preferência)

**Region:** Escolha a região mais próxima (ex: `Oregon (US West)`)

**Branch:** `claude/google-setup-service-account-011CUoSKR87oUugmb4fgCENG`

**Root Directory:** (deixe em branco)

**Runtime:** `Node`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Instance Type:** `Free` (selecione o plano gratuito)

### 4. Adicionar Variáveis de Ambiente

Role a página até a seção **"Environment Variables"** e clique em **"Add Environment Variable"**.

Adicione as seguintes variáveis (uma por vez):

#### 1. GOOGLE_SHEET_ID
**Key:** `GOOGLE_SHEET_ID`
**Value:**
```
1tR0UkkzDMQrNoFFO-k_z_Rc2xE_QayX9tOUmDjOs00c
```

#### 2. GOOGLE_SERVICE_ACCOUNT_EMAIL
**Key:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
**Value:**
```
gestao-aluguel-service@mals-aluguel-app.iam.gserviceaccount.com
```

#### 3. GOOGLE_PRIVATE_KEY
**Key:** `GOOGLE_PRIVATE_KEY`
**Value:** (cole exatamente como está abaixo, SEM aspas extras)
```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDuJoU4jSLlUqK+\nuxUHF+71AUXCM8rtvdzI4zKpCFa8C/ITw9XRpeUwOesqsdxrJSMB8TJLB5bNMKWQ\nieRORQxanx4nvzh948KkOls6RW7zG97/npVtEuxzUmnrHDHyjmpnkwnidoULgUI/\n+4FIDkCDc1JBJc9sAOmn7yUX2dUSxbs6x6zItF/RsYFlqTc4uVW1QxavviT96eHR\nq7xI3JXerYvnTGBdWMmcGJPZntWMurR8Uq69Ao864KEuq/zkhLykc1CY1XHwPBvB\np5Kf5JezuVKUOMYxS3kwhIOkp9OOn/afzuism+ByVE9FR7LyQvJj6H9LUUfdY8MF\nQ/l7GN05AgMBAAECgf88sxTBlTePu8A/XO+/HxqI2AovtYPDlODxUvdWngl9ZI4O\n+5tEFESWRizqdOr5ZD3IAPIQrZ6CLiQE8yB90puTfXryJor/i03RDg6yi3/79t6f\nyIvNgUVDH35frpAMgsAcJh4e2paOmCOKq1AITZmj54DPmhOEM7daVlnd+meUoNNv\nsXh4p2Wpb2os4ukAVjZNZdyt3IF3YUyZWFZNZC7bKA8TMtOroCVs+jR2fvkjQ2vI\nV21w4OvDNhu/6LMJRktgUSlm5rUc6hA8RPhzeu1kw38EYcG8djQjfTzuWDa1csN9\n/tq9vfGfrBNFR2bt96AEedAXbz65VJNcHiFdOgECgYEA/R9jYvY0eukz9ZFcK/iB\nXb3c5GfC9WM8kMo21stUZh3A1iWUy/YXuo50rqKygdmg6Gvax2SYqNw+G3ivGkzm\ndFiK3UdeAgAgk1L/04TqgQjvvaFVCc0uR/uzK3J0Iqj40qzoO9iYCIf+ofw+rjiX\nKxF+c0gGWOTFujTBEw1L/wECgYEA8NuPz41aKFQPZClvCbrWBx04bsqJqeehfESv\nBEyTCIevQCDUaMeQPunYWTA/8w1kHFAsiQ6hXnWn7tBnBCfnh3WlmqxwJFuFwLvR\nHWHKgRfkfz/fuAEsJA/FE9maHJSWkwSFMUtMrkQd+A3Gn9yDWYb74JdpAAEmLVcb\n80BDFjkCgYEA7/2npLec0IB1JDq68nG+blvKqMB8h16cmQcw8Xx9PAivwhqFttBQ\ndTAGD2Hw786gkl1YZD7LwyZ2uGM3Wi9ZPSyKFP1Kc4kdWbGTH0BhexA3BkuFrjJc\n1CEgImx1Eju1F0KbOcrFcylF0t2vrE25fjsq8jBy3CukEUVdXiv4RwECgYBpUnmW\nduc/z1JTqFKn3I2O2tY8jFCafXF+F8K4jIuXJU4bKr/3eZy4BiXXCmRMckSepOh0\nnnMuDSD8KyGBDboO4AEkm9cF7weT+g09Xe/hd4Mxqcq4ebrFoie5wGPFr6wQad+c\naKMFaT/5onyClzjQw1gNI+iEWfxJw1ezjRxI8QKBgQCwsHIgTj3JhVfmdIq79mSE\n18FqcsZDKgeTJ27F+iaSMD8zJ0gnrKQ6PIzLwVqao5Y5blBo4YNJfRgoi/GRV3wK\nD1rR4g3jkfvGNncjlA3r1CjAmelUS7tlDn3/guWsCKVk1gHs08GoAUVGkpHUvVpQ\n8VH5cQ0rYxTZEvunrjiUIg==\n-----END PRIVATE KEY-----\n
```

#### 4. JWT_SECRET
**Key:** `JWT_SECRET`
**Value:**
```
b3e3713d25e721c9837f14477d33f43615ca264282d2dd1ba0ef175157722bfa
```

#### 5. NODE_ENV
**Key:** `NODE_ENV`
**Value:**
```
production
```

### 5. Fazer o Deploy

1. Depois de adicionar todas as variáveis de ambiente, clique em **"Create Web Service"** no final da página
2. O Render vai começar o build automaticamente
3. Aguarde 3-5 minutos para o build e deploy completarem
4. Você verá o status mudar de "Building" → "Live"

### 6. Configurar NEXT_PUBLIC_API_URL

Após o primeiro deploy bem-sucedido:

1. Copie a URL do seu serviço (algo como: `https://gestao-aluguel.onrender.com`)
2. No dashboard do Render, vá em **"Environment"** (menu lateral esquerdo)
3. Clique em **"Add Environment Variable"**
4. Adicione:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** A URL que você copiou (ex: `https://gestao-aluguel.onrender.com`)
5. Clique em **"Save Changes"**
6. O Render vai fazer um redeploy automático

### 7. Acessar o Sistema

1. Aguarde o redeploy terminar (1-2 minutos)
2. Acesse a URL do seu serviço
3. Faça login com:
   - **Email**: `admin@example.com` (ou o que você configurou)
   - **Senha**: `Admin123`

## 🔄 Deploy Automático

A partir de agora, toda vez que você fizer um push para o branch no GitHub, o Render vai:

1. Detectar o push automaticamente
2. Fazer o build
3. Fazer o deploy
4. Atualizar o site em produção

## ⚠️ Importante - Plano Gratuito

O plano gratuito do Render tem algumas características:

- ✅ **750 horas/mês gratuitas** (suficiente para 1 serviço 24/7)
- ⚠️ **Sleep após 15 minutos de inatividade**: O serviço "dorme" se não receber requisições
- 🔄 **Wake-up automático**: Primeiro acesso após o sleep pode demorar 30-60 segundos
- 💾 **512MB de RAM**

**Dica**: Para aplicações pessoais isso é perfeitamente aceitável. Se precisar que o serviço esteja sempre ativo, considere o plano pago (a partir de $7/mês).

## 🐛 Troubleshooting

### Erro de Build

Se o deploy falhar durante o build:

1. Clique em **"Logs"** no menu lateral
2. Veja os logs do build para identificar o erro
3. Geralmente é:
   - Falta de variável de ambiente
   - Erro no código
   - Problema com dependências

### Erro 500 ao fazer login

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o `GOOGLE_PRIVATE_KEY` não tem aspas extras
3. Veja os logs em tempo real:
   - Clique em **"Logs"** no menu lateral
   - Selecione **"Deploy Logs"** ou **"Runtime Logs"**

### Serviço não inicia

1. Verifique o **Start Command**: deve ser `npm start`
2. Certifique-se de que o **Build Command** está correto: `npm install && npm run build`
3. Veja os logs de deploy

### Página em branco ou erro 404

1. Verifique se configurou o `NEXT_PUBLIC_API_URL` corretamente
2. Certifique-se de fazer redeploy após adicionar a variável
3. Limpe o cache do navegador

## 📊 Monitoramento

O Render oferece:
- **Logs em tempo real**: Veja requisições e erros
- **Métricas de uso**: CPU, memória, bandwidth
- **Alertas**: Receba notificações de erros
- **Health checks**: Monitore disponibilidade

Acesse no menu lateral: **Logs**, **Metrics**, **Events**

## 🌐 Domínio Personalizado (Opcional)

Se você quiser usar seu próprio domínio:

1. Vá em **"Settings"** no menu lateral
2. Role até **"Custom Domain"**
3. Clique em **"Add Custom Domain"**
4. Digite seu domínio
5. Configure os DNS conforme as instruções
6. O Render vai gerar certificado SSL automaticamente

## 💰 Custos

**Plano Free:**
- ✅ Deploy ilimitado
- ✅ HTTPS automático
- ✅ 750 horas/mês (1 serviço 24/7)
- ✅ 100GB bandwidth/mês
- ⚠️ Sleep após inatividade

**Plano Starter ($7/mês):**
- ✅ Sem sleep
- ✅ Mais recursos (RAM, CPU)
- ✅ Priority support

Para uso pessoal, o plano gratuito é suficiente!

## 🔐 Segurança

- ✅ HTTPS automático com certificado SSL
- ✅ Variáveis de ambiente são criptografadas
- ✅ Não expõe credenciais no código
- ✅ Deploy seguro direto do GitHub

## 📝 Resumo dos Passos

1. ✅ Criar conta no Render com GitHub
2. ✅ Criar novo Web Service
3. ✅ Conectar repositório GitHub
4. ✅ Configurar build e start commands
5. ✅ Adicionar 5 variáveis de ambiente
6. ✅ Fazer deploy
7. ✅ Configurar NEXT_PUBLIC_API_URL
8. ✅ Aguardar redeploy
9. ✅ Acessar e fazer login

## 🆚 Render vs Vercel

**Render:**
- ✅ Mais flexível (suporta Docker, background jobs)
- ⚠️ Sleep no plano gratuito
- ✅ Boa documentação

**Vercel:**
- ✅ Melhor para Next.js (criada pelo time Next.js)
- ✅ Sem sleep no plano gratuito
- ✅ Serverless automático

**Ambos são excelentes!** Escolha o que preferir.

## 🎉 Pronto!

Seu sistema está rodando 100% na nuvem no Render!

---

**Dúvidas?** Consulte a [documentação do Render](https://render.com/docs)
