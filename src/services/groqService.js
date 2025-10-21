/**
 * Groq API Service
 * Serviço para integração com Groq AI (Llama 3.1 70B)
 * Gratuito com rate limits generosos
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Envia mensagem para o Groq AI
 * @param {Array} messages - Array de mensagens no formato OpenAI
 * @param {Object} options - Opções adicionais
 * @returns {Promise<string>} - Resposta do AI
 */
export async function sendMessageToGroq(messages, options = {}) {
  try {
    // Validar API key
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key não configurada. Configure em .env');
    }

    // Preparar payload
    const payload = {
      model: options.model || 'llama-3.1-70b-versatile',
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      top_p: options.topP || 1,
      stream: options.stream || false,
    };

    // Fazer requisição
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Verificar erros
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao comunicar com Groq API');
    }

    // Parsear resposta
    const data = await response.json();
    
    // Retornar conteúdo da mensagem
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Erro no Groq Service:', error);
    throw error;
  }
}

/**
 * Gera resposta com streaming (para mostrar texto aparecendo aos poucos)
 * @param {Array} messages - Array de mensagens
 * @param {Function} onChunk - Callback para cada chunk de texto
 * @returns {Promise<string>} - Texto completo
 */
export async function sendMessageToGroqStream(messages, onChunk) {
  try {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key não configurada');
    }

    const payload = {
      model: 'llama-3.1-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true, // Habilitar streaming
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao comunicar com Groq API');
    }

    // Ler stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              onChunk(content); // Callback para cada pedaço
            }
          } catch (e) {
            // Ignorar erros de parsing
          }
        }
      }
    }

    return fullText;
    
  } catch (error) {
    console.error('Erro no Groq Stream:', error);
    throw error;
  }
}

/**
 * Modelos disponíveis no Groq
 */
export const GROQ_MODELS = {
  LLAMA_70B: 'llama-3.1-70b-versatile',
  LLAMA_8B: 'llama-3.1-8b-instant',
  MIXTRAL: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it',
};

export default {
  sendMessageToGroq,
  sendMessageToGroqStream,
  GROQ_MODELS,
};

