export interface PasswordCheck {
  valid: boolean;
  errors: string[];
}

/** BR-01: 8-64 znaki, min. 1 wielka litera i 1 cyfra. */
export function validatePassword(password: string): PasswordCheck {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Hasło musi mieć co najmniej 8 znaków');
  if (password.length > 64) errors.push('Hasło może mieć najwyżej 64 znaki');
  if (!/[A-Z]/.test(password)) errors.push('Hasło musi zawierać wielką literę');
  if (!/[0-9]/.test(password)) errors.push('Hasło musi zawierać cyfrę');
  return { valid: errors.length === 0, errors };
}
