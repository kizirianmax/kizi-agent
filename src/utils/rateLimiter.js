/**
 * Rate Limiter
 * Proteção contra abuso e bots
 * Limita número de requisições por minuto
 */

class RateLimiter {
  constructor(maxRequests = 30, timeWindow = 60000) {
    this.maxRequests = maxRequests; // Máximo de requisições
    this.timeWindow = timeWindow;   // Janela de tempo em ms (60000 = 1 minuto)
    this.requests = [];             // Array de timestamps das requisições
  }

  /**
   * Verifica se pode fazer uma nova requisição
   * @returns {boolean} - true se pode, false se excedeu o limite
   */
  canMakeRequest() {
    const now = Date.now();
    
    // Remove requisições antigas (fora da janela de tempo)
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );

    // Verifica se excedeu o limite
    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    // Adiciona nova requisição
    this.requests.push(now);
    return true;
  }

  /**
   * Retorna quantas requisições restam
   * @returns {number} - Número de requisições disponíveis
   */
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  /**
   * Retorna tempo em segundos até poder fazer nova requisição
   * @returns {number} - Segundos até liberar
   */
  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    
    const now = Date.now();
    const oldestRequest = Math.min(...this.requests);
    const timeElapsed = now - oldestRequest;
    const timeRemaining = this.timeWindow - timeElapsed;
    
    return Math.ceil(timeRemaining / 1000);
  }

  /**
   * Reseta o contador (para testes ou admin)
   */
  reset() {
    this.requests = [];
  }
}

// Instância global do rate limiter
const globalRateLimiter = new RateLimiter(
  parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE) || 30,
  60000 // 1 minuto
);

export { RateLimiter, globalRateLimiter };
export default globalRateLimiter;

