/**
 * 🤖 KIZI API - Sistema Inteligente com 3 Motores
 * 
 * Motores disponíveis:
 * - KIZI 2.5 Pro (Gemini 2.5 Pro) - Raciocínio complexo
 * - KIZI Speed (Groq Llama 70B) - Velocidade máxima
 * - KIZI Flash (Gemini Flash) - Respostas rápidas
 */

// ═══════════════════════════════════════════════════════════════
// ANÁLISE DE COMPLEXIDADE
// ═══════════════════════════════════════════════════════════════

function analyzeComplexity(message) {
  const msg = message.toLowerCase();
  
  // Indicadores de pergunta SIMPLES (Flash)
  const simplePatterns = [
    /^(oi|olá|ola|hey|hi|hello|e aí|eai|opa|fala)\b/i,
    /^(obrigado|valeu|thanks|brigado|vlw|tmj)\b/i,
    /^(sim|não|nao|ok|beleza|blz|show)\b/i,
    /^(bom dia|boa tarde|boa noite|tchau|bye)\b/i,
    /^(tudo bem|como vai|td bem)\??\s*$/i,
  ];
  
  // Indicadores de pergunta COMPLEXA (Pro)
  const complexPatterns = [
    /analis[ae]/i,
    /compar[ae]/i,
    /expliqu[ae].*detalh/i,
    /código|code|programa|script|função|function/i,
    /debug|erro|bug|fix/i,
    /projeto|arquitetura|sistema|design/i,
    /estratégia|plano|planej/i,
    /\?.*\?/,  // Múltiplas perguntas
    /passo a passo|step by step/i,
    /diferença entre|compare|versus|vs\./i,
    /como funciona.*internamente/i,
    /implemente|desenvolva|crie.*aplicação/i,
  ];
  
  // Verificar padrões simples
  const isSimple = simplePatterns.some(p => p.test(msg));
  const messageLength = message.length;
  
  // Mensagem muito curta e simples → Flash
  if (isSimple && messageLength < 50) {
    return { engine: 'flash', reason: 'Saudação ou resposta simples' };
  }
  
  // Verificar padrões complexos
  const complexScore = complexPatterns.filter(p => p.test(msg)).length;
  
  // Alta complexidade → Pro
  if (complexScore >= 2 || messageLength > 500) {
    return { engine: 'pro', reason: 'Pergunta complexa detectada' };
  }
  
  // Complexidade média → Speed (padrão)
  return { engine: 'speed', reason: 'Pergunta de complexidade média' };
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════

const KIZI_SYSTEM_PROMPT = `Você é o KIZI 2.5 Pro, um agente de IA autônomo inteligente e prestativo.

IDENTIDADE:
- Você é KIZI 2.5 Pro, criado por Roberto Kiziriam Max
- NUNCA mencione "Gemini", "GPT", "Claude" ou outros modelos
- Você faz parte do ecossistema RKMMAX

PERSONALIDADE:
- 🤖 Profissional mas amigável e acessível
- 💡 Inteligente e focado em soluções práticas
- 🎯 Direto ao ponto, mas empático e atencioso
- 🚀 Entusiasta de tecnologia e inovação
- 🧠 Tem memória infinita e aprende continuamente

COMPORTAMENTO:
1. Responde de forma clara, objetiva e bem estruturada
2. Usa emojis de forma moderada e contextual
3. Fornece exemplos práticos quando apropriado
4. Admite honestamente quando não sabe algo
5. Busca entender o contexto antes de responder
6. É proativo em sugerir soluções e próximos passos

ESPECIALIDADES:
- Programação e desenvolvimento (Python, JavaScript, React, etc.)
- Gerenciamento de projetos e produtividade
- Análise de dados e resolução de problemas
- Explicações técnicas de forma acessível
- Criatividade e brainstorming

FORMATAÇÃO:
- Use Markdown para estruturar respostas
- Use código formatado quando relevante
- Use listas para múltiplos itens
- Use tabelas para comparações

Responda sempre em **Português Brasileiro** (pt-BR).`;

// ═══════════════════════════════════════════════════════════════
// MOTORES DE IA
// ═══════════════════════════════════════════════════════════════

async function callKiziPro(messages, systemPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 16000,
          topP: 0.95,
          topK: 64
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro no KIZI 2.5 Pro');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
}

async function callKiziSpeed(messages, systemPrompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurada');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro no KIZI Speed');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Sem resposta';
}

async function callKiziFlash(messages, systemPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro no KIZI Flash');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, forceEngine } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Pegar última mensagem do usuário para análise
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const userContent = lastUserMessage?.content || '';

    // Determinar motor (pode ser forçado ou automático)
    let engine = forceEngine;
    let reason = 'Motor forçado pelo usuário';
    
    if (!engine) {
      const analysis = analyzeComplexity(userContent);
      engine = analysis.engine;
      reason = analysis.reason;
    }

    console.log(`[KIZI] Motor selecionado: ${engine} - ${reason}`);

    // Tentar motor selecionado com fallback
    let response;
    let usedEngine = engine;
    const engines = {
      pro: callKiziPro,
      speed: callKiziSpeed,
      flash: callKiziFlash
    };
    
    // Ordem de fallback
    const fallbackOrder = {
      pro: ['pro', 'speed', 'flash'],
      speed: ['speed', 'pro', 'flash'],
      flash: ['flash', 'speed', 'pro']
    };

    const tryOrder = fallbackOrder[engine] || ['speed', 'pro', 'flash'];
    
    for (const tryEngine of tryOrder) {
      try {
        response = await engines[tryEngine](messages, KIZI_SYSTEM_PROMPT);
        usedEngine = tryEngine;
        break;
      } catch (error) {
        console.warn(`[KIZI] Falha no ${tryEngine}: ${error.message}`);
        if (tryEngine === tryOrder[tryOrder.length - 1]) {
          throw error; // Último da fila, propagar erro
        }
      }
    }

    // Mapear nome do motor para exibição
    const engineNames = {
      pro: 'KIZI 2.5 Pro',
      speed: 'KIZI Speed',
      flash: 'KIZI Flash'
    };

    return res.status(200).json({ 
      response,
      engine: usedEngine,
      engineName: engineNames[usedEngine],
      reason
    });

  } catch (error) {
    console.error('[KIZI] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
