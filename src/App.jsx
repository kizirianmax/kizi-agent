import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ThinkingSystem, useThinking, ThinkingPresets } from './components/ThinkingSystem';

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
    Object.keys(localStorage).filter(k => k.startsWith('kizi_')).forEach(k => {
      data[k] = localStorage.getItem(k);
    });
    return JSON.stringify(data, null, 2);
  }
};

// Simulação de IA
const simulateAI = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola')) {
    return '👋 Olá! Como posso ajudar você hoje?';
  }
  
  if (msg.includes('quem') && (msg.includes('você') || msg.includes('voce'))) {
    return 'Sou o Kizi, seu agente autônomo inteligente! Tenho memória infinita e aprendo continuamente com você. Posso ajudar com projetos, tarefas e muito mais!';
  }
  
  if (msg.includes('projeto')) {
    return '📊 Posso ajudar com gerenciamento de projetos! Use a aba "Projetos" no menu lateral para criar e organizar seus projetos.';
  }
  
  return `Entendi sua mensagem: "${message}". Estou processando e aprendendo com você!`;
};

function App() {
  const [view, setView] = useState('chat'); // chat, conversations, projects, settings
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Hook do sistema de pensamento
  const { isThinking, thinkingSteps, thinkingSize, think } = useThinking();

  // Carregar dados ao iniciar
  useEffect(() => {
    const savedConversations = MemoryManager.load('conversations') || [];
    const savedProjects = MemoryManager.load('projects') || [];
    
    if (savedConversations.length === 0) {
      // Criar primeira conversa
      const firstConv = {
        id: Date.now(),
        name: 'Conversa 1',
        createdAt: new Date().toISOString(),
        messages: [{
          role: 'assistant',
          content: '👋 Olá! Sou o Kizi, seu agente autônomo inteligente.\n\nTenho memória infinita e aprendo continuamente com você!\n\nComo posso ajudar?',
          timestamp: new Date().toISOString()
        }]
      };
      savedConversations.push(firstConv);
      MemoryManager.save('conversations', savedConversations);
    }
    
    setConversations(savedConversations);
    setProjects(savedProjects);
    
    // Carregar primeira conversa
    if (savedConversations.length > 0) {
      setCurrentConvId(savedConversations[0].id);
      setMessages(savedConversations[0].messages);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Salvar conversas
  useEffect(() => {
    if (conversations.length > 0) {
      MemoryManager.save('conversations', conversations);
    }
  }, [conversations]);

  // Salvar projetos
  useEffect(() => {
    if (projects.length > 0) {
      MemoryManager.save('projects', projects);
    }
  }, [projects]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const userInput = input;
    setInput('');
    setLoading(true);

    // Atualizar conversa atual
    updateCurrentConversation(newMessages);

    // Determinar o tipo de pensamento baseado na mensagem
    let thinkingSteps;
    let thinkingSize;
    
    const msg = userInput.toLowerCase();
    if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola')) {
      thinkingSteps = ThinkingPresets.small.greeting;
      thinkingSize = 'small';
    } else if (msg.includes('código') || msg.includes('codigo') || msg.includes('programa')) {
      thinkingSteps = ThinkingPresets.medium.coding;
      thinkingSize = 'medium';
    } else if (msg.includes('projeto') || msg.includes('criar') || msg.includes('desenvolver')) {
      thinkingSteps = ThinkingPresets.large.project;
      thinkingSize = 'large';
    } else if (msg.length > 100) {
      thinkingSteps = ThinkingPresets.medium.analysis;
      thinkingSize = 'medium';
    } else {
      thinkingSteps = ThinkingPresets.small.simple;
      thinkingSize = 'small';
    }

    // Mostrar pensamento visível
    await think(thinkingSteps, thinkingSize);

    // Gerar resposta da IA
    const aiResponse = {
      role: 'assistant',
      content: simulateAI(userInput),
      timestamp: new Date().toISOString()
    };
    
    const finalMessages = [...newMessages, aiResponse];
    setMessages(finalMessages);
    updateCurrentConversation(finalMessages);
    setLoading(false);
  };

  const updateCurrentConversation = (newMessages) => {
    setConversations(prev => prev.map(conv => 
      conv.id === currentConvId 
        ? { ...conv, messages: newMessages }
        : conv
    ));
  };

  const deleteMessage = (index) => {
    // Confirmar antes de deletar
    if (confirm('Deletar esta mensagem?')) {
      const newMessages = messages.filter((_, i) => i !== index);
      setMessages(newMessages);
      updateCurrentConversation(newMessages);
    }
  };

  const createNewConversation = () => {
    const newConv = {
      id: Date.now(),
      name: `Conversa ${conversations.length + 1}`,
      createdAt: new Date().toISOString(),
      messages: [{
        role: 'assistant',
        content: '👋 Nova conversa iniciada! Como posso ajudar?',
        timestamp: new Date().toISOString()
      }]
    };
    
    setConversations([...conversations, newConv]);
    setCurrentConvId(newConv.id);
    setMessages(newConv.messages);
    setView('chat');
  };

  const switchConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConvId(convId);
      setMessages(conv.messages);
      setView('chat');
    }
  };

  const deleteConversation = (convId) => {
    if (conversations.length === 1) {
      alert('Você precisa ter pelo menos uma conversa!');
      return;
    }
    
    if (confirm('Deletar esta conversa?')) {
      const newConversations = conversations.filter(c => c.id !== convId);
      setConversations(newConversations);
      
      if (convId === currentConvId) {
        setCurrentConvId(newConversations[0].id);
        setMessages(newConversations[0].messages);
      }
    }
  };

  const renameConversation = (convId) => {
    const newName = prompt('Novo nome:');
    if (newName && newName.trim()) {
      setConversations(prev => prev.map(conv =>
        conv.id === convId ? { ...conv, name: newName.trim() } : conv
      ));
    }
  };

  const createNewProject = () => {
    const name = prompt('Nome do projeto:');
    if (name && name.trim()) {
      const newProject = {
        id: Date.now(),
        name: name.trim(),
        status: 'Em andamento',
        createdAt: new Date().toISOString(),
        conversations: []
      };
      setProjects([...projects, newProject]);
    }
  };

  const deleteProject = (projectId) => {
    if (confirm('Deletar este projeto?')) {
      setProjects(projects.filter(p => p.id !== projectId));
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

  const clearAllMemory = () => {
    if (confirm('Limpar TODA a memória? (conversas e projetos)')) {
      MemoryManager.clear();
      window.location.reload();
    }
  };

  const currentConv = conversations.find(c => c.id === currentConvId);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="avatar">🤖</div>
            <div>
              <h2>Kizi</h2>
              <p>Agente Autônomo</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={view === 'chat' ? 'active' : ''}
            onClick={() => setView('chat')}
          >
            💬 Chat
          </button>
          <button 
            className={view === 'conversations' ? 'active' : ''}
            onClick={() => setView('conversations')}
          >
            📝 Conversas ({conversations.length})
          </button>
          <button 
            className={view === 'projects' ? 'active' : ''}
            onClick={() => setView('projects')}
          >
            📊 Projetos ({projects.length})
          </button>
          <button 
            className={view === 'settings' ? 'active' : ''}
            onClick={() => setView('settings')}
          >
            ⚙️ Configurações
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setShowMemory(!showMemory)} className="memory-btn">
            🧠 Memória
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {view === 'chat' && (
          <div className="chat-view">
            <header className="chat-header">
              <h3>{currentConv?.name || 'Conversa'}</h3>
              <button onClick={() => setView('conversations')} className="btn-secondary">
                Trocar Conversa
              </button>
            </header>

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
                  <button 
                    className="delete-msg"
                    onClick={() => deleteMessage(idx)}
                    title="Deletar mensagem"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* Sistema de Pensamento Visível */}
              {isThinking && (
                <ThinkingSystem 
                  size={thinkingSize}
                  steps={thinkingSteps}
                  onComplete={() => {}}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}>
                📤
              </button>
            </div>
          </div>
        )}

        {view === 'conversations' && (
          <div className="list-view">
            <header className="list-header">
              <h3>Minhas Conversas</h3>
              <button onClick={createNewConversation} className="btn-primary">
                + Nova Conversa
              </button>
            </header>

            <div className="list-items">
              {conversations.map(conv => (
                <div key={conv.id} className="list-item">
                  <div className="item-info" onClick={() => switchConversation(conv.id)}>
                    <h4>{conv.name}</h4>
                    <p>{conv.messages.length} mensagens</p>
                    <span className="date">
                      {new Date(conv.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => renameConversation(conv.id)} title="Renomear">
                      ✏️
                    </button>
                    <button onClick={() => deleteConversation(conv.id)} title="Deletar">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'projects' && (
          <div className="list-view">
            <header className="list-header">
              <h3>Meus Projetos</h3>
              <button onClick={createNewProject} className="btn-primary">
                + Novo Projeto
              </button>
            </header>

            <div className="list-items">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <p>📊 Nenhum projeto ainda</p>
                  <button onClick={createNewProject} className="btn-primary">
                    Criar Primeiro Projeto
                  </button>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="list-item">
                    <div className="item-info">
                      <h4>{project.name}</h4>
                      <p className="status">{project.status}</p>
                      <span className="date">
                        Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => deleteProject(project.id)} title="Deletar">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="settings-view">
            <h3>Configurações</h3>
            
            <div className="settings-section">
              <h4>🧠 Memória</h4>
              <p>Total de conversas: {conversations.length}</p>
              <p>Total de projetos: {projects.length}</p>
              <p>Total de mensagens: {conversations.reduce((sum, c) => sum + c.messages.length, 0)}</p>
              
              <div className="settings-actions">
                <button onClick={exportMemory} className="btn-secondary">
                  📥 Exportar Memória
                </button>
                <button onClick={clearAllMemory} className="btn-danger">
                  🗑️ Limpar Tudo
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h4>ℹ️ Sobre o Kizi</h4>
              <p>Versão: 2.0 (MVP Avançado)</p>
              <p>Memória: Local (seu dispositivo)</p>
              <p>Privacidade: Máxima</p>
            </div>
          </div>
        )}
      </main>

      {/* Memory Panel */}
      {showMemory && (
        <div className="memory-panel">
          <div className="memory-header">
            <h4>🧠 Gerenciamento de Memória</h4>
            <button onClick={() => setShowMemory(false)}>×</button>
          </div>
          <div className="memory-stats">
            <p>💬 Conversas: {conversations.length}</p>
            <p>📊 Projetos: {projects.length}</p>
            <p>💾 Mensagens: {conversations.reduce((sum, c) => sum + c.messages.length, 0)}</p>
          </div>
          <div className="memory-actions">
            <button onClick={exportMemory}>📥 Exportar</button>
            <button onClick={clearAllMemory} className="danger">🗑️ Limpar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

