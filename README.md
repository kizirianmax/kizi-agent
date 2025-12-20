# 🤖 KIZI Agent - Sistema Inteligente com 3 Motores

Agente autônomo de IA com memória infinita e 3 motores inteligentes que escolhem automaticamente o melhor modelo para cada pergunta.

## 🚀 Sistema KIZI - 3 Motores

| Motor | Tecnologia | Quando Usa | Características |
|-------|------------|------------|-----------------|
| 🧠 **KIZI 2.5 Pro** | Gemini 2.5 Pro | Perguntas complexas | Análises, código, projetos, raciocínio avançado |
| 🚀 **KIZI Speed** | Groq Llama 70B | Perguntas médias (padrão) | Ultra-rápido, boa qualidade |
| ⚡ **KIZI Flash** | Gemini Flash | Perguntas simples | Saudações, respostas curtas, conversas leves |

## 🧠 Seleção Automática

O sistema analisa automaticamente cada pergunta e escolhe o motor ideal:

- **Pergunta simples** ("Oi", "Obrigado", "Qual a capital do Brasil?") → **KIZI Flash**
- **Pergunta média** (maioria das perguntas) → **KIZI Speed** (velocidade)
- **Pergunta complexa** (código, análises, projetos, múltiplas perguntas) → **KIZI 2.5 Pro**

## 🔄 Fallback Automático

Se um motor falhar, o sistema tenta automaticamente o próximo na fila!

## ✨ Funcionalidades

- 💬 **Chat inteligente** com 3 motores de IA
- 🧠 **Memória infinita** - Lembra de todas as conversas
- 📝 **Múltiplas conversas** - Organize por temas
- 📊 **Projetos** - Salve e gerencie projetos
- 💾 **Exportação** - Exporte sua memória em JSON
- 🔒 **Privacidade** - Dados salvos localmente
- 🛡️ **Segurança** - Rate limiting e anti-scraping

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **Backend**: Vercel Serverless Functions
- **IA**: Gemini 2.5 Pro, Groq Llama 70B, Gemini Flash
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
# Gemini API (para KIZI 2.5 Pro e KIZI Flash)
GEMINI_API_KEY=sua_api_key_aqui

# Groq API (para KIZI Speed)
GROQ_API_KEY=sua_api_key_aqui
# ou
VITE_GROQ_API_KEY=sua_api_key_aqui
```

## 📁 Estrutura

```
kizi-agent/
├── api/
│   └── chat.js          # Serverless function com 3 motores
├── src/
│   ├── components/
│   │   └── ThinkingSystem.jsx  # Sistema de pensamento visível
│   ├── services/
│   │   └── groqService.js      # Serviço de API
│   ├── utils/
│   │   ├── antiScraping.js     # Proteção anti-bot
│   │   ├── rateLimiter.js      # Limitador de requisições
│   │   └── sanitizer.js        # Sanitização de input
│   ├── App.jsx          # Componente principal
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
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
3. Deploy automático a cada push

## 📝 Licença

Proprietary - © 2025 RKMMAX. Todos os direitos reservados.

## 📞 Contato

**Autor**: Roberto Kiziriam Max  
**Website**: https://kizirianmax.site

---

<div align="center">

**Parte do ecossistema KIZI/RKMMAX**

🧠 **KIZI 2.5 Pro** | 🚀 **KIZI Speed** | ⚡ **KIZI Flash**

</div>
