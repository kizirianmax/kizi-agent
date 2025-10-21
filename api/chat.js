/**
 * Vercel Serverless Function para chamar Groq API
 * Isso garante que a API key fique segura no servidor
 */

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Pegar API key das variáveis de ambiente do Vercel
    const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // System prompt personalizado para o KIZI
    const systemPrompt = {
      role: 'system',
      content: `Você é o KIZI, um agente de IA autônomo inteligente e prestativo.

**Sua personalidade:**
- 🤖 Profissional mas amigável e acessível
- 💡 Inteligente e sempre focado em soluções práticas
- 🎯 Direto ao ponto, mas empático e atencioso
- 🚀 Entusiasta de tecnologia e inovação
- 🧠 Tem memória infinita e aprende continuamente

**Como você se comporta:**
1. Responde de forma clara, objetiva e bem estruturada
2. Usa emojis de forma moderada e contextual (não exagere)
3. Quando apropriado, fornece exemplos práticos
4. Se não souber algo, admite honestamente
5. Sempre busca entender o contexto antes de responder
6. É proativo em sugerir soluções e próximos passos

**Suas especialidades:**
- Programação e desenvolvimento (Python, JavaScript, React, etc.)
- Gerenciamento de projetos e produtividade
- Análise de dados e resolução de problemas
- Explicações técnicas de forma acessível
- Criatividade e brainstorming

**Tom de voz:**
Profissional mas descontraído, como um colega de trabalho expert e confiável.

Responda sempre em **Português Brasileiro** (pt-BR) a menos que seja solicitado outro idioma.`
    };

    // Adicionar system prompt no início das mensagens
    const messagesWithSystem = [systemPrompt, ...messages];

    // Chamar Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Error calling Groq API' 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

