# 🤖 KIZI Agent - RKMMAX Ecosystem Architecture

Agente autônomo de IA com memória infinita e arquitetura de 4 camadas. Sistema generalista automatizado, competidor direto do Manus.

## 🏗️ Arquitetura de 4 Camadas

Sistema generalista automatizado com arquitetura hierárquica de IA:

### 🎯 Hierarquia de AI Engine

| Nível | Motor | Função | Características |
|-------|-------|--------|-----------------|
| 🥇 **Primary** | Vertex AI | Sistema Principal | Motor primário para todas as requisições |
| 🥈 **Fallback 1** | Claude Sonnet 3.5 | Backup Inteligente | Ativado quando Vertex AI falha |
| 🥉 **Fallback 2** | Groq 70b | Turbo Mode | O mais rápido - usado como "Turbo" |
| 🔄 **Adaptativo** | Auto-seleção | Inteligente | Escolhe automaticamente baseado na carga |

### 🧠 Sistema de Raciocínio

O sistema utiliza modelos de reasoning avançados dependendo do plano:

- **Gemini 2.5**: Reasoning padrão para análises complexas
- **Gemini 2.5 Pro**: Reasoning avançado para tarefas Premium
- **Gemini 3 Pro**: Próxima geração (planos Ultra/Dev)

### 🔄 Fallback Automático Inteligente

Se um motor falhar, o sistema tenta automaticamente o próximo na hierarquia, garantindo disponibilidade máxima!

## 📋 Planos e Limites de Uso

Escolha o plano ideal para suas necessidades:

| Plano | AI Stack | Limite Diário | Características |
|-------|----------|---------------|-----------------|
| 💚 **Básico** | Gemini 2.5 (Reasoning) + Modelo Complementar Leve/Rápido | 50 msg/dia | Ideal para uso pessoal básico |
| 💙 **Intermediário** | Gemini 2.5 (Reasoning) + Modelo Complementar Potente | 200 msg/dia | Para usuários regulares |
| 💜 **Premium** | Gemini 2.5 Pro (Reasoning) + Modelo Melhor/Mais Rápido | 500 msg/dia | Profissionais e empresas |
| 🔥 **Ultra** | Gemini 2.5 + Claude Sonnet 3.5 + Gemini 3 Pro + Groq 70b | 2000 msg/dia | Máxima performance e redundância |
| 👨‍💻 **Dev** | Ultra + Google Max Potential Model | Ilimitado | Desenvolvedores e pesquisadores |

### 🎁 Benefícios por Plano

- **Básico**: Acesso às funcionalidades essenciais
- **Intermediário**: Modelos mais potentes + suporte prioritário
- **Premium**: Reasoning avançado + velocidade máxima
- **Ultra**: Todos os motores + máxima redundância + acesso antecipado
- **Dev**: Tudo do Ultra + sem limites + modelos experimentais

## ✨ Funcionalidades

- 💬 **Chat inteligente** com hierarquia de IA de 4 camadas
- 🧠 **Memória infinita** - Lembra de todas as conversas
- 📝 **Múltiplas conversas** - Organize por temas
- 📊 **Projetos** - Salve e gerencie projetos
- 💾 **Exportação** - Exporte sua memória em JSON
- 🔒 **Privacidade** - Dados salvos localmente
- 🛡️ **Segurança** - Rate limiting e anti-scraping
- 🔗 **GitHub Integration** - Integração direta com GitHub
- 📧 **Email Integration** - Envio e gestão de emails

## 🛠️ Tecnologias

- **Frontend**: React (usado em todos os frontends RKMMAX)
- **Backend**: Vercel Serverless Functions
- **IA Primary**: Vertex AI
- **IA Fallback**: Claude Sonnet 3.5, Groq 70b
- **Reasoning**: Gemini 2.5, Gemini 2.5 Pro, Gemini 3 Pro
- **Estilo**: CSS puro (sem frameworks)

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/kizirianmax/kizi-agent.git
cd kizi-agent

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas API keys

# Rodar em desenvolvimento
pnpm dev
```

## ⚙️ Variáveis de Ambiente

```env
# Vertex AI (Primary System)
VERTEX_AI_API_KEY=sua_api_key_aqui

# Claude Sonnet 3.5 (Fallback 1)
CLAUDE_API_KEY=sua_api_key_aqui

# Groq API (Fallback 2 - Turbo)
GROQ_API_KEY=sua_api_key_aqui
# ou
VITE_GROQ_API_KEY=sua_api_key_aqui

# Gemini API (Reasoning Models)
GEMINI_API_KEY=sua_api_key_aqui
```

## 📁 Estrutura

```
kizi-agent/
├── api/
│   └── chat.js          # Serverless function com hierarquia de IA
├── src/
│   ├── components/
│   │   └── ThinkingSystem.jsx  # Sistema de pensamento visível
│   ├── services/
│   │   └── groqService.js      # Serviço de API
│   ├── utils/
│   │   ├── antiScraping.js     # Proteção anti-bot
│   │   ├── rateLimiter.js      # Limitador de requisições
│   │   └── sanitizer.js        # Sanitização de input
│   ├── App.jsx          # Componente principal React
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🔒 Segurança

- **Rate Limiting**: Limite de requisições por minuto
- **Sanitização**: Input sanitizado contra XSS
- **Anti-Injection**: Detecção de prompt injection
- **Anti-Scraping**: Detecção de bots e comportamento suspeito
- **Iframe Protection**: Previne embedding não autorizado

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   - `VERTEX_AI_API_KEY` (Primary)
   - `CLAUDE_API_KEY` (Fallback 1)
   - `GROQ_API_KEY` (Fallback 2 - Turbo)
   - `GEMINI_API_KEY` (Reasoning)
3. Deploy automático a cada push

## 📝 Licença

Proprietary - © 2025 RKMMAX. Todos os direitos reservados.

## 📞 Contato

**Autor**: Roberto Kiziriam Max  
**Website**: https://kizirianmax.site

---

<div align="center">

**Parte do ecossistema RKMMAX**

🏗️ **Arquitetura 4 Camadas** | 🥇 **Vertex AI** | 🥈 **Claude Sonnet 3.5** | 🥉 **Groq 70b Turbo**

*Padrão implementado em: `kizi-agent` | `kizirian-max-site` | `rkmmax-specialists` | `rkmmax-hibrido`*

</div>
