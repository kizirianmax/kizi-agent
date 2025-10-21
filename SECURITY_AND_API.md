# 🔒 KIZI - Segurança e Integração com APIs

## ✅ Implementações Concluídas

### 1. 🤖 Integração com Groq API (IA Gratuita)

**Arquivo**: `src/services/groqService.js`

**Funcionalidades**:
- ✅ Integração completa com Groq AI (Llama 3.1 70B)
- ✅ Suporte a streaming (texto aparecendo aos poucos)
- ✅ Tratamento de erros robusto
- ✅ Múltiplos modelos disponíveis

**Como usar**:
1. Criar conta em: https://console.groq.com
2. Gerar API Key
3. Adicionar no arquivo `.env`:
   ```
   VITE_GROQ_API_KEY=gsk_sua_chave_aqui
   ```
4. Pronto! O KIZI já usa IA real!

**Modelos disponíveis**:
- `llama-3.1-70b-versatile` (padrão) - Melhor qualidade
- `llama-3.1-8b-instant` - Mais rápido
- `mixtral-8x7b-32768` - Contexto grande
- `gemma-7b-it` - Leve e rápido

---

### 2. 🛡️ Rate Limiting (Proteção contra Abuso)

**Arquivo**: `src/utils/rateLimiter.js`

**Funcionalidades**:
- ✅ Limita número de requisições por minuto
- ✅ Configurável via `.env`
- ✅ Mensagem amigável quando limite é atingido
- ✅ Contador de requisições restantes

**Configuração padrão**:
- **30 mensagens por minuto** por usuário
- Janela de tempo: 60 segundos
- Pode ser ajustado em `.env`:
  ```
  VITE_MAX_REQUESTS_PER_MINUTE=30
  ```

**Como funciona**:
```javascript
if (!rateLimiter.canMakeRequest()) {
  alert('Limite atingido. Aguarde...');
  return;
}
```

---

### 3. 🚫 Anti-Scraping (Proteção contra Bots)

**Arquivo**: `src/utils/antiScraping.js`

**Funcionalidades**:
- ✅ Detecta bots através do User Agent
- ✅ Detecta comportamento suspeito (muitos requests rápidos)
- ✅ Previne embedding em iframes
- ✅ Detecta DevTools aberto
- ✅ Watermark invisível (rastreamento)
- ✅ Score de suspeita (0-100)

**Proteções ativas**:

1. **Detecção de Bots**:
   - Identifica crawlers, scrapers, selenium, etc.
   - Bloqueia automaticamente

2. **Análise de Comportamento**:
   - Monitora padrões de uso
   - Detecta ações muito rápidas ou regulares
   - Score de suspeita aumenta com comportamento anômalo

3. **Prevenção de Iframe**:
   - Impede que o KIZI seja incorporado em outros sites
   - Proteção contra clickjacking

4. **Watermark Invisível**:
   - Adiciona marcadores Unicode invisíveis
   - Permite rastrear origem de conteúdo copiado

**Exemplo de uso**:
```javascript
if (isBot()) {
  console.warn('Bot detectado!');
}

if (globalBehaviorDetector.isSuspicious()) {
  console.warn('Comportamento suspeito!');
}
```

---

### 4. 🧹 Sanitização de Input (Proteção XSS)

**Arquivo**: `src/utils/sanitizer.js`

**Funcionalidades**:
- ✅ Remove tags HTML perigosas
- ✅ Detecta tentativas de injection
- ✅ Valida tamanho de mensagens
- ✅ Escapa caracteres especiais
- ✅ Valida URLs e emails

**Proteções**:

1. **Validação de Mensagem**:
   - Máximo 4000 caracteres
   - Remove espaços extras
   - Remove caracteres de controle

2. **Detecção de Injection**:
   - Detecta `<script>`, `javascript:`, `eval()`, etc.
   - Bloqueia automaticamente

3. **Sanitização HTML**:
   - Remove tags perigosas
   - Escapa caracteres especiais
   - Previne XSS

**Exemplo de uso**:
```javascript
const sanitized = validateMessage(userInput);

if (detectInjection(sanitized)) {
  alert('Conteúdo suspeito bloqueado!');
}
```

---

## 📁 Estrutura de Arquivos

```
kizi-agent/
├── .env                          # Variáveis de ambiente (API keys)
├── .env.example                  # Template de variáveis
├── src/
│   ├── services/
│   │   └── groqService.js       # Integração Groq API
│   ├── utils/
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── antiScraping.js      # Anti-bot/scraping
│   │   └── sanitizer.js         # Sanitização de input
│   ├── components/
│   │   └── ThinkingSystem.jsx   # Sistema de pensamento visível
│   ├── App.jsx                   # Componente principal (atualizado)
│   └── App.css                   # Estilos
└── SECURITY_AND_API.md          # Esta documentação
```

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env` (criar na raiz do projeto)

```env
# Groq API (IA gratuita)
VITE_GROQ_API_KEY=gsk_sua_chave_aqui

# OpenAI API (opcional - planos pagos)
VITE_OPENAI_API_KEY=sk_sua_chave_aqui

# Anthropic API (opcional - planos premium)
VITE_ANTHROPIC_API_KEY=sk-ant_sua_chave_aqui

# Google Gemini API (opcional - backup gratuito)
VITE_GOOGLE_API_KEY=AIzaSy_sua_chave_aqui

# Configurações de segurança
VITE_ENABLE_RATE_LIMIT=true
VITE_MAX_REQUESTS_PER_MINUTE=30
VITE_MAX_MESSAGE_LENGTH=4000

# Ambiente
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Como Obter API Keys Gratuitas

### 1. Groq (Recomendado - Gratuito)

1. Acesse: https://console.groq.com
2. Crie uma conta (só precisa de email)
3. Vá em "API Keys"
4. Clique em "Create API Key"
5. Copie a chave (começa com `gsk_`)
6. Cole no `.env`

**Limites gratuitos**:
- 30 req/min
- 6,000 tokens/min
- 14,400 req/dia

### 2. Google AI Studio (Alternativa Gratuita)

1. Acesse: https://aistudio.google.com
2. Login com conta Google
3. Clique em "Get API Key"
4. Copie a chave
5. Cole no `.env`

**Limites gratuitos**:
- 60 req/min
- Ilimitado (por enquanto)

---

## 🛠️ Fluxo de Segurança Implementado

### Quando o usuário envia uma mensagem:

```
1. ✅ Validar input (tamanho, formato)
2. ✅ Detectar injection (XSS, scripts)
3. ✅ Verificar rate limit (30/min)
4. ✅ Registrar comportamento (anti-bot)
5. ✅ Sanitizar mensagem
6. ✅ Enviar para Groq API
7. ✅ Receber resposta da IA
8. ✅ Mostrar para o usuário
```

### Proteções em background:

```
- 🔍 Detectar bots (User Agent)
- 🔍 Analisar comportamento (padrões)
- 🔍 Prevenir iframe embedding
- 🔍 Adicionar watermark invisível
- 🔍 Monitorar DevTools
```

---

## 📊 Estatísticas de Proteção

### Rate Limiting:
- **30 mensagens/minuto** por usuário
- Janela de 60 segundos
- Mensagem amigável quando limite é atingido

### Detecção de Bots:
- **User Agent** verificado
- **Padrões de comportamento** analisados
- **Score de suspeita** calculado (0-100)

### Sanitização:
- **4000 caracteres** máximo por mensagem
- **Tags HTML** removidas
- **Scripts** bloqueados
- **Caracteres especiais** escapados

---

## 🔄 Próximas Melhorias Planejadas

### Curto Prazo:
- [ ] Adicionar suporte a OpenAI (planos pagos)
- [ ] Implementar sistema de planos (básico/premium)
- [ ] Adicionar autenticação de usuários
- [ ] Dashboard de uso e estatísticas

### Médio Prazo:
- [ ] Implementar CAPTCHA para casos suspeitos
- [ ] Adicionar logs de segurança
- [ ] Implementar blacklist de IPs
- [ ] Sistema de reputação de usuários

### Longo Prazo:
- [ ] Machine Learning para detectar bots
- [ ] Análise de sentimento
- [ ] Moderação automática de conteúdo
- [ ] Backup e recuperação de dados

---

## 🐛 Troubleshooting

### Erro: "Groq API key não configurada"

**Solução**:
1. Verifique se o arquivo `.env` existe na raiz
2. Verifique se a variável `VITE_GROQ_API_KEY` está definida
3. Reinicie o servidor de desenvolvimento

### Erro: "Limite de mensagens atingido"

**Solução**:
- Aguarde 60 segundos
- Ou aumente o limite em `.env`:
  ```
  VITE_MAX_REQUESTS_PER_MINUTE=60
  ```

### Erro: "Mensagem contém conteúdo suspeito"

**Solução**:
- Remova tags HTML da mensagem
- Remova scripts ou código JavaScript
- Use texto simples

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console (F12)
2. Verifique o arquivo `.env`
3. Teste com uma mensagem simples ("Olá")
4. Verifique se a API key do Groq está válida

---

## ✅ Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Arquivo `.env` configurado
- [ ] Groq API key válida
- [ ] Rate limiting configurado
- [ ] Proteções anti-bot ativas
- [ ] Sanitização de input funcionando
- [ ] Build testado localmente
- [ ] Variáveis de ambiente no Vercel configuradas

---

**Status**: ✅ Todas as proteções implementadas e testadas!

**Última atualização**: 21 de outubro de 2025

