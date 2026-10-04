import { describe, expect, it } from 'vitest';
import { validatePassword } from '../../src/domain/password';

const BRAK_WIELKIEJ = 'Hasło musi zawierać wielką literę';
const BRAK_CYFRY = 'Hasło musi zawierać cyfrę';
const ZA_KROTKIE = 'Hasło musi mieć co najmniej 8 znaków';
const ZA_DLUGIE = 'Hasło może mieć najwyżej 64 znaki';

/** Hasło o zadanej długości: "Aa1" + wypełnienie małymi literami. */
const hasloODlugosci = (n: number) => 'Aa1' + 'a'.repeat(n - 3);

describe('validatePassword (BR-01)', () => {
  it('akceptuje poprawne hasło', () => {
    // BR-01
    expect(validatePassword('Kawa1234')).toEqual({ valid: true, errors: [] });
  });

  describe('długość hasła - wartości brzegowe', () => {
    it.each([
      { dlugosc: 7, valid: false, errors: [ZA_KROTKIE] },
      { dlugosc: 8, valid: true, errors: [] },
      { dlugosc: 64, valid: true, errors: [] },
      { dlugosc: 65, valid: false, errors: [ZA_DLUGIE] },
    ])('hasło o długości $dlugosc znaków: valid=$valid', ({ dlugosc, valid, errors }) => {
      // BR-01
      const haslo = hasloODlugosci(dlugosc);
      expect(haslo).toHaveLength(dlugosc);
      expect(validatePassword(haslo)).toEqual({ valid, errors });
    });
  });

  describe('wymagane znaki', () => {
    it.each([
      { opis: 'brak wielkiej litery', haslo: 'kawa1234', errors: [BRAK_WIELKIEJ] },
      { opis: 'brak cyfry', haslo: 'KawaKawa', errors: [BRAK_CYFRY] },
      { opis: 'brak wielkiej litery i cyfry', haslo: 'kawakawa', errors: [BRAK_WIELKIEJ, BRAK_CYFRY] },
    ])('odrzuca hasło: $opis', ({ haslo, errors }) => {
      // BR-01
      expect(validatePassword(haslo)).toEqual({ valid: false, errors });
    });
  });

  it('zgłasza wszystkie błędy naraz dla krótkiego hasła bez wielkiej litery i cyfry', () => {
    // BR-01
    expect(validatePassword('kawa')).toEqual({
      valid: false,
      errors: [ZA_KROTKIE, BRAK_WIELKIEJ, BRAK_CYFRY],
    });
  });
});
