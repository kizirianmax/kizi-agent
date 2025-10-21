/**
 * Input Sanitizer
 * Proteção contra XSS, SQL Injection e outros ataques
 */

/**
 * Remove tags HTML perigosas do texto
 * @param {string} text - Texto com possível HTML
 * @returns {string} - Texto sanitizado
 */
export function sanitizeHTML(text) {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Remove scripts e tags perigosas
 * @param {string} text - Texto potencialmente perigoso
 * @returns {string} - Texto seguro
 */
export function removeScripts(text) {
  if (!text) return '';
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: URLs
}

/**
 * Valida e limita tamanho da mensagem
 * @param {string} message - Mensagem do usuário
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} - Mensagem validada
 */
export function validateMessage(message, maxLength = 4000) {
  if (!message || typeof message !== 'string') {
    throw new Error('Mensagem inválida');
  }

  // Remove espaços extras
  message = message.trim();

  // Verifica se não está vazia
  if (message.length === 0) {
    throw new Error('Mensagem não pode estar vazia');
  }

  // Limita tamanho
  if (message.length > maxLength) {
    throw new Error(`Mensagem muito longa. Máximo ${maxLength} caracteres.`);
  }

  // Remove caracteres de controle perigosos
  message = message.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return message;
}

/**
 * Detecta tentativas de injection
 * @param {string} text - Texto a verificar
 * @returns {boolean} - true se detectou injection
 */
export function detectInjection(text) {
  if (!text) return false;

  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
    /import\s+/i,
    /document\./i,
    /window\./i,
  ];

  return injectionPatterns.some(pattern => pattern.test(text));
}

/**
 * Escapa caracteres especiais para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
export function escapeHTML(text) {
  if (!text) return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Valida URL para prevenir ataques
 * @param {string} url - URL a validar
 * @returns {boolean} - true se URL é segura
 */
export function isValidURL(url) {
  try {
    const parsed = new URL(url);
    // Apenas permite http e https
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Remove URLs suspeitas do texto
 * @param {string} text - Texto com possíveis URLs
 * @returns {string} - Texto sem URLs suspeitas
 */
export function removeSuspiciousURLs(text) {
  if (!text) return '';

  // Remove URLs com javascript:, data:, file:, etc
  return text.replace(/(javascript|data|file|vbscript):[^\s]*/gi, '[URL removida]');
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} - true se email é válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza objeto completo (recursivo)
 * @param {Object} obj - Objeto a sanitizar
 * @returns {Object} - Objeto sanitizado
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeHTML(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

export default {
  sanitizeHTML,
  removeScripts,
  validateMessage,
  detectInjection,
  escapeHTML,
  isValidURL,
  removeSuspiciousURLs,
  isValidEmail,
  sanitizeObject,
};

