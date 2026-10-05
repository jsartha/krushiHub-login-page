import { PasswordSecurityCheck } from '../types';

export function evaluatePasswordSecurity(password: string): PasswordSecurityCheck {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let criteriaCount = 0;
  if (hasMinLength) criteriaCount++;
  if (hasUppercase) criteriaCount++;
  if (hasLowercase) criteriaCount++;
  if (hasNumber) criteriaCount++;
  if (hasSpecialChar) criteriaCount++;

  let score = 0;
  let label: PasswordSecurityCheck['label'] = 'Too Weak';

  if (!password) {
    score = 0;
    label = 'Too Weak';
  } else if (criteriaCount <= 2 || password.length < 6) {
    score = 1;
    label = 'Weak';
  } else if (criteriaCount === 3 && password.length >= 8) {
    score = 2;
    label = 'Medium';
  } else if (criteriaCount === 4 && password.length >= 8) {
    score = 3;
    label = 'Strong';
  } else if (criteriaCount === 5 && password.length >= 10) {
    score = 4;
    label = 'Very Strong';
  } else if (criteriaCount >= 4) {
    score = 3;
    label = 'Strong';
  }

  return {
    score,
    label,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}

export interface LoginAttemptTracker {
  attempts: number;
  lockUntil: number | null;
}

const STORAGE_KEY_ATTEMPTS = 'kisan_login_attempts';
const STORAGE_KEY_AUDIT = 'kisan_auth_audit';

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  email: string;
  role: string;
  status: 'SUCCESS' | 'FAILED_PASSWORD' | 'ACCOUNT_LOCKED';
  deviceInfo: string;
}

export function getFailedAttempts(email: string): LoginAttemptTracker {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!data) return { attempts: 0, lockUntil: null };
    const all = JSON.parse(data);
    const userRecord = all[email.toLowerCase()];
    if (!userRecord) return { attempts: 0, lockUntil: null };
    
    // Check if lockout expired
    if (userRecord.lockUntil && Date.now() > userRecord.lockUntil) {
      return { attempts: 0, lockUntil: null };
    }
    return userRecord;
  } catch {
    return { attempts: 0, lockUntil: null };
  }
}

export function recordFailedAttempt(email: string): { locked: boolean; remainingSeconds: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    const all = data ? JSON.parse(data) : {};
    const norm = email.toLowerCase();
    const current = all[norm] || { attempts: 0, lockUntil: null };

    current.attempts += 1;

    if (current.attempts >= 5) {
      // 30 seconds lockout for security demonstration
      current.lockUntil = Date.now() + 30 * 1000;
      all[norm] = current;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(all));
      logSecurityAudit(email, 'unknown', 'ACCOUNT_LOCKED');
      return { locked: true, remainingSeconds: 30 };
    }

    all[norm] = current;
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(all));
    logSecurityAudit(email, 'unknown', 'FAILED_PASSWORD');
    return { locked: false, remainingSeconds: 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

export function resetFailedAttempts(email: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!data) return;
    const all = JSON.parse(data);
    delete all[email.toLowerCase()];
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function logSecurityAudit(email: string, role: string, status: SecurityAuditRecord['status']): void {
  try {
    const logsStr = localStorage.getItem(STORAGE_KEY_AUDIT);
    const logs: SecurityAuditRecord[] = logsStr ? JSON.parse(logsStr) : [];
    
    const newRecord: SecurityAuditRecord = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      email,
      role,
      status,
      deviceInfo: 'TLS 1.3 / Chrome 124 / Verified IP'
    };
    
    // Keep last 15 logs
    logs.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(0, 15)));
  } catch {
    // ignore
  }
}

export function getSecurityLogs(): SecurityAuditRecord[] {
  try {
    const logsStr = localStorage.getItem(STORAGE_KEY_AUDIT);
    return logsStr ? JSON.parse(logsStr) : [];
  } catch {
    return [];
  }
}
