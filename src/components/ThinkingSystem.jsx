import { useState, useEffect } from 'react';
import './ThinkingSystem.css';

// Sistema de Pensamento Visível do Kizi
export const ThinkingSystem = ({ size = 'medium', steps = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (steps.length === 0) return;

    const stepDuration = size === 'small' ? 800 : size === 'medium' ? 1500 : 3000;
    const progressInterval = stepDuration / 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStep(curr => {
            const next = curr + 1;
            if (next >= steps.length) {
              clearInterval(progressTimer);
              onComplete?.();
              return curr;
            }
            return next;
          });
          return 0;
        }
        return prev + 1;
      });
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [steps, size, currentStep]);

  if (steps.length === 0) return null;

  const sizeClass = `thinking-${size}`;
  const currentStepData = steps[currentStep];

  return (
    <div className={`thinking-container ${sizeClass}`}>
      <div className="thinking-bubble">
        <div className="thinking-header">
          <span className="thinking-icon">🧠</span>
          <span className="thinking-title">Kizi pensando...</span>
          <span className="thinking-size-badge">{size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}</span>
        </div>

        <div className="thinking-content">
          <div className="thinking-step">
            <span className="step-emoji">{currentStepData.emoji}</span>
            <span className="step-text">{currentStepData.text}</span>
          </div>

          {currentStepData.preview && (
            <div className="thinking-preview">
              <code>{currentStepData.preview}</code>
            </div>
          )}

          <div className="thinking-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          <div className="thinking-steps-list">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`step-item ${idx < currentStep ? 'completed' : idx === currentStep ? 'active' : 'pending'}`}
              >
                <span className="step-status">
                  {idx < currentStep ? '✓' : idx === currentStep ? '⏳' : '○'}
                </span>
                <span className="step-name">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para usar o sistema de pensamento
export const useThinking = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [thinkingSize, setThinkingSize] = useState('medium');

  const think = async (steps, size = 'medium') => {
    setThinkingSteps(steps);
    setThinkingSize(size);
    setIsThinking(true);

    return new Promise((resolve) => {
      const duration = size === 'small' ? steps.length * 800 : 
                      size === 'medium' ? steps.length * 1500 : 
                      steps.length * 3000;
      
      setTimeout(() => {
        setIsThinking(false);
        resolve();
      }, duration);
    });
  };

  return {
    isThinking,
    thinkingSteps,
    thinkingSize,
    think
  };
};

// Exemplos de pensamentos pré-definidos
export const ThinkingPresets = {
  small: {
    greeting: [
      { emoji: '👋', text: 'Processando saudação...' },
      { emoji: '💭', text: 'Gerando resposta...' }
    ],
    simple: [
      { emoji: '🔍', text: 'Analisando...' },
      { emoji: '✨', text: 'Respondendo...' }
    ]
  },
  
  medium: {
    analysis: [
      { emoji: '📖', text: 'Lendo sua mensagem...' },
      { emoji: '🧠', text: 'Analisando contexto...' },
      { emoji: '🔍', text: 'Buscando na memória...' },
      { emoji: '💡', text: 'Gerando resposta...' }
    ],
    coding: [
      { emoji: '📝', text: 'Entendendo requisitos...' },
      { emoji: '🏗️', text: 'Planejando estrutura...', preview: 'function createApp() {' },
      { emoji: '⚙️', text: 'Gerando código...' },
      { emoji: '✅', text: 'Validando solução...' }
    ]
  },
  
  large: {
    project: [
      { emoji: '📋', text: 'Analisando escopo do projeto...' },
      { emoji: '🎯', text: 'Definindo objetivos...' },
      { emoji: '🗂️', text: 'Organizando estrutura...' },
      { emoji: '💻', text: 'Gerando código base...', preview: 'const project = { name: "..." }' },
      { emoji: '🎨', text: 'Criando interface...' },
      { emoji: '🔧', text: 'Configurando ferramentas...' },
      { emoji: '✨', text: 'Finalizando detalhes...' }
    ],
    research: [
      { emoji: '🔍', text: 'Iniciando pesquisa...' },
      { emoji: '📚', text: 'Consultando base de conhecimento...' },
      { emoji: '🧩', text: 'Conectando informações...' },
      { emoji: '📊', text: 'Analisando dados...' },
      { emoji: '💡', text: 'Sintetizando insights...' },
      { emoji: '📝', text: 'Formatando resposta...' }
    ]
  }
};

export default ThinkingSystem;

