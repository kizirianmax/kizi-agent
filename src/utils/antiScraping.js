/**
 * Anti-Scraping Protection
 * Proteção contra roubo de conteúdo e propriedade intelectual
 */

/**
 * Desabilita seleção de texto e cópia (opcional, pode ser intrusivo)
 */
export function disableTextSelection() {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
}

/**
 * Adiciona watermark invisível no texto
 * @param {string} text - Texto original
 * @param {string} userId - ID do usuário (para rastreamento)
 * @returns {string} - Texto com watermark
 */
export function addInvisibleWatermark(text, userId = 'anonymous') {
  // Adiciona caracteres Unicode invisíveis como watermark
  const watermark = `\u200B${userId}\u200B`; // Zero-width space
  return text + watermark;
}

/**
 * Detecta bots comuns através do User Agent
 * @returns {boolean} - true se é bot, false se é humano
 */
export function isBot() {
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
    'python', 'java', 'scrapy', 'selenium', 'phantomjs'
  ];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
}

/**
 * Detecta comportamento suspeito (muitos requests rápidos)
 */
class BehaviorDetector {
  constructor() {
    this.actions = [];
    this.suspicionScore = 0;
  }

  /**
   * Registra uma ação do usuário
   * @param {string} actionType - Tipo de ação (click, message, etc)
   */
  recordAction(actionType) {
    const now = Date.now();
    this.actions.push({ type: actionType, timestamp: now });

    // Remove ações antigas (mais de 1 minuto)
    this.actions = this.actions.filter(
      action => now - action.timestamp < 60000
    );

    // Calcula score de suspeita
    this.calculateSuspicion();
  }

  /**
   * Calcula score de suspeita baseado em padrões
   */
  calculateSuspicion() {
    const now = Date.now();
    const recentActions = this.actions.filter(
      action => now - action.timestamp < 10000 // Últimos 10 segundos
    );

    // Muitas ações em pouco tempo = suspeito
    if (recentActions.length > 20) {
      this.suspicionScore += 10;
    }

    // Padrão muito regular = bot
    const intervals = [];
    for (let i = 1; i < recentActions.length; i++) {
      intervals.push(
        recentActions[i].timestamp - recentActions[i-1].timestamp
      );
    }

    // Se todos os intervalos são muito similares, é bot
    if (intervals.length > 5) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => {
        return sum + Math.pow(interval - avgInterval, 2);
      }, 0) / intervals.length;

      if (variance < 100) { // Muito regular
        this.suspicionScore += 20;
      }
    }

    // Decai o score com o tempo
    this.suspicionScore = Math.max(0, this.suspicionScore - 1);
  }

  /**
   * Verifica se o comportamento é suspeito
   * @returns {boolean} - true se suspeito
   */
  isSuspicious() {
    return this.suspicionScore > 50;
  }

  /**
   * Retorna o score atual
   * @returns {number} - Score de 0-100
   */
  getScore() {
    return Math.min(100, this.suspicionScore);
  }
}

/**
 * Adiciona proteção contra DevTools (F12)
 * Detecta quando o DevTools está aberto
 */
export function detectDevTools() {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  return widthThreshold || heightThreshold;
}

/**
 * Ofusca código JavaScript no console
 */
export function obfuscateConsole() {
  // Desabilita console.log em produção
  if (import.meta.env.VITE_APP_ENV === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
  }
}

/**
 * Adiciona headers de segurança (para backend)
 * Exemplo de headers que devem ser configurados no servidor
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Detecta e bloqueia iframes (proteção contra embedding)
 */
export function preventIframeEmbedding() {
  if (window.self !== window.top) {
    // Está sendo executado em iframe
    window.top.location = window.self.location;
  }
}

// Instância global do detector de comportamento
const globalBehaviorDetector = new BehaviorDetector();

export { BehaviorDetector, globalBehaviorDetector };
export default {
  disableTextSelection,
  addInvisibleWatermark,
  isBot,
  detectDevTools,
  obfuscateConsole,
  preventIframeEmbedding,
  BehaviorDetector,
  globalBehaviorDetector,
  SECURITY_HEADERS,
};

