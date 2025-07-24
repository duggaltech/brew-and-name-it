/**
 * Security utilities for input validation and sanitization
 */

// Content Security Policy helper for future implementation
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://*.supabase.co"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

/**
 * Sanitizes text input by removing potential XSS characters
 */
export const sanitizeText = (input: string, maxLength = 255): string => {
  return input
    .replace(/[<>'"&]/g, '') // Remove XSS-prone characters
    .slice(0, maxLength)
    .trim();
};

/**
 * Validates and sanitizes ingredient amounts
 */
export const validateAmount = (amount: string): string => {
  const sanitized = sanitizeText(amount, 10);
  
  // Allow only numbers, fractions, and common measurement characters
  const validChars = /^[\d.,\/½¼¾\s-]*$/;
  if (!validChars.test(sanitized)) {
    return '';
  }
  
  return sanitized;
};

/**
 * Validates email format (basic validation)
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Password strength validation
 */
export interface PasswordStrength {
  isStrong: boolean;
  score: number; // 0-5
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use at least 8 characters");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (!@#$%^&*)");
  }

  if (password.length >= 12) {
    score += 1;
  }

  const isStrong = score >= 4;

  return {
    isStrong,
    score,
    feedback: isStrong ? [] : feedback
  };
};

/**
 * Rate limiting helper (client-side tracking)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove expired attempts
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingMs = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }
}

// Global rate limiter instance for auth operations
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

/**
 * Secure error message formatting (avoid exposing sensitive info)
 */
export const formatSecureErrorMessage = (error: any): string => {
  // Common secure error messages
  const secureMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'User already registered': 'An account with this email already exists',
    'Email not confirmed': 'Please check your email and confirm your account',
    'Password too weak': 'Password does not meet security requirements',
    'Rate limit exceeded': 'Too many attempts. Please try again later',
    'Network error': 'Connection error. Please check your internet connection',
  };

  // Check for known secure error messages first
  const errorMessage = error?.message || error || 'An unexpected error occurred';
  
  for (const [key, secureMsg] of Object.entries(secureMessages)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return secureMsg;
    }
  }

  // For unknown errors, return a generic message to avoid information leakage
  return 'An error occurred. Please try again or contact support if the problem persists';
};