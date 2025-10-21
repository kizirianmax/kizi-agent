import { useState, useEffect, useRef } from 'react'
import './App.css'

// Simulação de IA (será substituído por API real)
const generateResponse = async (message, history) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = {
    'oi': 'Olá! Sou o Kizi, seu agente autônomo. Como posso ajudar você hoje?',
    'quem é você': 'Sou o Kizi, um agente autônomo inteligente com memória infinita. Aprendo com você e te ajudo a gerenciar projetos!',
    'projetos': 'Vejo que você tem alguns projetos em andamento. Quer que eu liste eles?',
    'default': `Entendi sua mensagem: "${message}". Estou processando e aprendendo com você!`
  };
  
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return responses.default;
};

// Gerenciador de memória local
const MemoryManager = {
  save: (key, data) => {
    try {
      localStorage.setItem(`kizi_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  },
  
  load: (key) => {
    try {
      const data = localStorage.getItem(`kizi_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Erro ao carregar:', e);
      return null;
    }
  },
  
  clear: () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('kizi_'));
    keys.forEach(k => localStorage.removeItem(k));
  },
  
  export: () => {
    const data = {};
    const keys = Object.keys(localStorage).filter(k => k.startsWith('kizi_'));
    keys.forEach(k => {
      data[k] = localStorage.getItem(k);
    });
    return JSON.stringify(data, null, 2);
  }
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = MemoryManager.load('messages');
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      setMessages([{
        role: 'assistant',
        content: '👋 Olá! Sou o Kizi, seu agente autônomo inteligente.\n\nTenho memória infinita e aprendo continuamente com você!\n\nComo posso ajudar?',
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      MemoryManager.save('messages', messages);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(input, messages);
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMemory = () => {
    if (confirm('Limpar toda a memória?')) {
      MemoryManager.clear();
      setMessages([{
        role: 'assistant',
        content: '🔄 Memória limpa!',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const exportMemory = () => {
    const data = MemoryManager.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kizi-memory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <div>
            <h1>Kizi</h1>
            <p>Agente Autônomo</p>
          </div>
        </div>
        <button onClick={() => setShowMemory(!showMemory)}>🧠</button>
      </header>

      {showMemory && (
        <div className="memory-panel">
          <h3>Gerenciamento de Memória</h3>
          <p>💬 Conversas: {messages.length}</p>
          <button onClick={exportMemory}>📥 Exportar</button>
          <button onClick={clearMemory}>🗑️ Limpar</button>
        </div>
      )}

      <main className="chat">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
              <div className="content">
                {msg.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                <span className="time">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
            </div>
          ))}
          {loading && <div className="typing">...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-box">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Digite sua mensagem..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}>
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
