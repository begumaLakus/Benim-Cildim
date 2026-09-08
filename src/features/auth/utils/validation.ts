const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'E-posta gerekli.';
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Geçerli bir e-posta adresi gir.';
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Şifre gerekli.';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`;
  }
  return undefined;
}
