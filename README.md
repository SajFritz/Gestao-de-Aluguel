# Sistema Pessoal de Gestão de Aluguéis

> Sistema simples e funcional para gestão de imóveis alugados com Google Sheets como base de dados

[![Versão](https://img.shields.io/badge/versão-2.0-blue.svg)](https://github.com/SajFritz/Gestao-de-Aluguel)
[![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow.svg)](https://github.com/SajFritz/Gestao-de-Aluguel)

## 📋 Sobre o Projeto

Webapp desenvolvido para uso pessoal/interno na gestão de imóveis alugados, oferecendo interface web intuitiva para operações diárias e visualização de dados. O sistema utiliza Google Sheets como base de dados, eliminando a necessidade de infraestrutura complexa.

### Usuários do Sistema
- **Usuário Principal**: Proprietário (administrador)
- **Usuário Secundário**: Assistente de gestão (acesso limitado)

## 🚀 Tecnologias

### Frontend
- **Framework**: Next.js ou React com Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Deploy**: Vercel ou Netlify (gratuito)
- **Autenticação**: JWT com bcrypt

### Backend/Dados
- **Base de Dados**: Google Sheets (7 planilhas)
- **API**: Google Sheets API v4
- **Autenticação Google**: Service Account
- **Logs**: Sistema de auditoria integrado

## 📊 Estrutura do Google Sheets

```
Sistema_Alugueis_DB
├── Aba Usuários (login e senhas)
├── Aba Imóveis
├── Aba Inquilinos
├── Aba Contratos
├── Aba Movimentações
├── Aba Despesas
└── Aba Logs (auditoria)
```

### Principais Entidades

#### 🏠 Imóveis
- Tipo, endereço completo, quartos
- IPTU anual
- Status (Alugado/Vago)

#### 👥 Inquilinos
- Dados pessoais completos
- Informações de contato
- Documentação

#### 📄 Contratos
- Dados do contrato de aluguel
- Valores e datas
- Vinculação imóvel-inquilino

#### 💰 Movimentações
- Lançamento de pagamentos
- Controle de recebimentos
- Status de pagamento

#### 🧾 Despesas
- Registro de despesas dos imóveis
- Categorização
- Vinculação por imóvel

## ✨ Funcionalidades

### MVP (Versão Mínima Viável)

#### Autenticação
- ✅ Login com email/senha
- ✅ Senhas com hash bcrypt
- ✅ Criação manual de usuários
- ✅ Token JWT para sessão
- ✅ Sistema de logout

#### Gestão de Usuários (Admin)
- ✅ Criar novo usuário manualmente
- ✅ Definir tipo (Admin/Gestor)
- ✅ Ativar/desativar usuários
- ✅ Resetar senha de usuário
- ✅ Visualizar último acesso

#### Dashboard Principal
- 📊 Total de imóveis (alugados vs vagos)
- 💵 Receita esperada do mês
- 💰 Receita recebida do mês
- ⚠️ Pagamentos pendentes/atrasados
- 📈 Taxa de ocupação

#### Gestão de Imóveis
- 🏘️ CRUD completo de imóveis
- 📍 Cadastro de endereço e características
- 💼 Controle de status

#### Gestão de Inquilinos
- 👤 CRUD completo de inquilinos
- 📞 Informações de contato
- 📋 Dados contratuais

#### Gestão de Contratos
- 📝 Criação e edição de contratos
- 📅 Controle de datas e valores
- 🔗 Vinculação automática imóvel-inquilino

#### Financeiro
- 💳 Lançamento de pagamentos
- 🧾 Registro de despesas
- 📊 Relatórios básicos

## 🔒 Segurança

- 🔐 Login com email/senha
- 🔑 Senhas armazenadas com hash bcrypt
- 👥 Usuários criados manualmente no Google Sheets
- 🎫 Tokens JWT para controle de sessão
- 📝 Sistema completo de logs para auditoria

## 🛠️ Setup Inicial

### Pré-requisitos
- Node.js 18+ instalado
- Conta Google (para Google Sheets)
- Service Account do Google configurada

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SajFritz/Gestao-de-Aluguel.git

# Entre no diretório
cd Gestao-de-Aluguel

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute o projeto
npm run dev
```

### Criar Primeiro Usuário Admin

1. Acesse o Google Sheets diretamente
2. Na aba "Usuários", adicione uma linha com:
   - **Nome**: Seu Nome
   - **Email**: seu@email.com
   - **Senha_Hash**: Hash bcrypt da sua senha
   - **Tipo**: Admin
   - **Ativo**: TRUE
   - **Data_Criacao**: Data atual
3. Faça login no sistema
4. Crie outros usuários pela interface web

### Gerar Hash bcrypt para Senha

```javascript
// Use este código Node.js para gerar o hash
const bcrypt = require('bcrypt');
const senha = 'sua_senha_aqui';
bcrypt.hash(senha, 10).then(hash => console.log(hash));
```

## 📅 Cronograma de Desenvolvimento

**Total**: 10 semanas para MVP completo

| Semanas | Fase | Atividades |
|---------|------|------------|
| 1-2 | Setup e Base | Projeto Next.js, Google Sheets, Autenticação JWT, Usuários |
| 3-4 | Cadastros | Módulo de Imóveis e Inquilinos |
| 5-6 | Contratos e Financeiro | Gestão de Contratos, Pagamentos, Despesas |
| 7-8 | Dashboard | Dashboard com KPIs e Relatórios básicos |
| 9-10 | Deploy | Testes finais e Deploy no Vercel |

## 💰 Custos

| Item | Custo |
|------|-------|
| Google Sheets | R$ 0 (gratuito) |
| Vercel/Netlify | R$ 0 (plano gratuito) |
| Autenticação JWT | R$ 0 (implementação própria) |
| Domínio | R$ 40/ano (opcional) |
| **TOTAL MENSAL** | **R$ 0** |

## ✅ Checklist de Entrega

- [ ] Login com email/senha funcionando
- [ ] Criação manual de usuários
- [ ] CRUD de Imóveis
- [ ] CRUD de Inquilinos
- [ ] Gestão de Contratos
- [ ] Lançamento de Pagamentos
- [ ] Registro de Despesas
- [ ] Dashboard com métricas
- [ ] Sistema de logs
- [ ] Interface responsiva
- [ ] Deploy em produção

## 📝 Estrutura do Projeto

```
Gestao-de-Aluguel/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas Next.js
│   ├── services/      # Integração Google Sheets API
│   ├── utils/         # Funções auxiliares
│   └── styles/        # Estilos globais
├── public/            # Arquivos estáticos
├── .env.example       # Exemplo de variáveis de ambiente
└── README.md          # Este arquivo
```

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso pessoal/interno. Todos os direitos reservados.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub.

---

**Desenvolvido com ❤️ para facilitar a gestão de aluguéis**
