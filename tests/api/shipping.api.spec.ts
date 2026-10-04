import { test, expect, type CartItem } from '../e2e/fixtures';
import { PRODUCTS } from '../support/data';

type Metoda = 'STANDARD' | 'EXPRESS';

interface Przypadek {
  opis: string;
  koszyk: CartItem[];
  /** Jeden kod albo kilka kodów stosowanych kolejno (BR-05: ostatni zastępuje poprzedni). */
  kod: string | string[] | null;
  metoda: Metoda;
  oczekiwanaDostawa: number;
  oczekiwanaSuma: number;
}

// Oczekiwane kwoty przeliczone ręcznie na podstawie docs/wymagania.md (BR-04..BR-06, BR-08), NIE z kodu aplikacji.
// Ceny: etiopia 44,99; brazylia 89,99; mlynek 159,00; v60 99,00; dzbanek 100,00; filtry 19,99.
const przypadki: Przypadek[] = [
  // --- BR-04: dostawa bez kodu ---
  {
    opis: 'BR-04: poniżej progu, standard 14,99',
    koszyk: [{ product: 'etiopia', qty: 1 }],
    kod: null,
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 59.98, // 44,99 + 14,99
  },
  {
    opis: 'BR-04: poniżej progu, express 24,99',
    koszyk: [{ product: 'etiopia', qty: 1 }],
    kod: null,
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 24.99,
    oczekiwanaSuma: 69.98, // 44,99 + 24,99
  },
  {
    opis: 'BR-04: 199,00 zł (tuż pod progiem), standard płatny',
    koszyk: [{ product: 'dzbanek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: null,
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 213.99, // 199,00 + 14,99
  },
  {
    opis: 'BR-04: 199,00 zł (tuż pod progiem), express 24,99',
    koszyk: [{ product: 'dzbanek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: null,
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 24.99,
    oczekiwanaSuma: 223.99, // 199,00 + 24,99
  },
  {
    opis: 'BR-04: dokładnie 200,00 zł, standard darmowy ("od 200,00")',
    koszyk: [{ product: 'dzbanek', qty: 2 }],
    kod: null,
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 200.0,
  },
  {
    opis: 'BR-04: dokładnie 200,00 zł, express przy darmowej dostawie = dopłata 10,00',
    koszyk: [{ product: 'dzbanek', qty: 2 }],
    kod: null,
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 10.0,
    oczekiwanaSuma: 210.0,
  },
  {
    opis: 'BR-04: 258,00 zł (powyżej progu), standard darmowy',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: null,
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 258.0,
  },
  {
    opis: 'BR-04: 258,00 zł (powyżej progu), express = dopłata 10,00',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: null,
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 10.0,
    oczekiwanaSuma: 268.0,
  },

  // --- BR-06 + BR-04: próg liczony od wartości PO rabacie ---
  {
    opis: 'BR-04/06: 200,00 zł z KAWA10 -> 180,00 po rabacie, standard płatny',
    koszyk: [{ product: 'dzbanek', qty: 2 }],
    kod: 'KAWA10',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 194.99, // 200 - 20 + 14,99
  },
  {
    opis: 'BR-04/06: 200,00 zł z KAWA10, express płatny 24,99',
    koszyk: [{ product: 'dzbanek', qty: 2 }],
    kod: 'KAWA10',
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 24.99,
    oczekiwanaSuma: 204.99, // 180 + 24,99
  },
  {
    opis: 'BR-04/06: 200,00 zł z MINUS20 -> 180,00 po rabacie, standard płatny',
    koszyk: [{ product: 'dzbanek', qty: 2 }],
    kod: 'MINUS20',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 194.99, // 200 - 20 + 14,99
  },
  {
    opis: 'BR-04/06: 219,99 zł z MINUS20 -> 199,99 po rabacie (pod progiem), standard płatny',
    koszyk: [{ product: 'dzbanek', qty: 2 }, { product: 'filtry', qty: 1 }],
    kod: 'MINUS20',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 214.98, // 199,99 + 14,99
  },
  {
    opis: 'BR-04/06: 258,00 zł z KAWA10 -> 232,20 po rabacie, standard darmowy',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: 'KAWA10',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 232.2, // 258 - 25,80
  },
  {
    opis: 'BR-04/06: 258,00 zł z KAWA10, express przy darmowej dostawie = 10,00',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: 'KAWA10',
    metoda: 'EXPRESS',
    oczekiwanaDostawa: 10.0,
    oczekiwanaSuma: 242.2, // 232,20 + 10
  },
  {
    opis: 'BR-06: 258,00 zł z MINUS20 -> 238,00, standard darmowy',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'v60', qty: 1 }],
    kod: 'MINUS20',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 238.0,
  },

  // --- BR-06: warunki kodów, zaokrąglanie (BR-08) ---
  {
    opis: 'BR-06: KAWA10 na 44,99 -> rabat 4,50 (half-up), standard 14,99',
    koszyk: [{ product: 'etiopia', qty: 1 }],
    kod: 'KAWA10',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 55.48, // 44,99 - 4,50 + 14,99
  },
  {
    opis: 'BR-06/08: KAWA10 na 89,99 -> rabat 9,00 (8,999 zaokrąglone), standard 14,99',
    koszyk: [{ product: 'brazylia', qty: 1 }],
    kod: 'KAWA10',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 95.98, // 89,99 - 9,00 + 14,99
  },
  {
    opis: 'BR-05: wielkość liter w kodzie nie ma znaczenia ("kawa10")',
    koszyk: [{ product: 'etiopia', qty: 1 }],
    kod: 'kawa10',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 55.48,
  },
  {
    opis: 'BR-06: MINUS20 przy dokładnie 100,00 zł (próg min. włącznie) -> 80,00 + 14,99',
    koszyk: [{ product: 'dzbanek', qty: 1 }],
    kod: 'MINUS20',
    metoda: 'STANDARD',
    oczekiwanaDostawa: 14.99,
    oczekiwanaSuma: 94.99,
  },

  // --- BR-05: jeden kod, nowy zastępuje poprzedni ---
  {
    opis: 'BR-05: MINUS20, potem KAWA10 -> aktywny tylko KAWA10 (259,00 - 25,90, dostawa darmowa)',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'dzbanek', qty: 1 }],
    kod: ['MINUS20', 'KAWA10'],
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 233.1,
  },
  {
    opis: 'BR-05: KAWA10, potem MINUS20 -> aktywny tylko MINUS20 (259,00 - 20,00, dostawa darmowa)',
    koszyk: [{ product: 'mlynek', qty: 1 }, { product: 'dzbanek', qty: 1 }],
    kod: ['KAWA10', 'MINUS20'],
    metoda: 'STANDARD',
    oczekiwanaDostawa: 0,
    oczekiwanaSuma: 239.0,
  },
];

test.describe('Dostawa i kody rabatowe (BR-04..BR-06)', () => {
  for (const { opis, koszyk, kod, metoda, oczekiwanaDostawa, oczekiwanaSuma } of przypadki) {
    test(opis, async ({ api }) => {
      const login = await api.login();
      expect(login.ok()).toBeTruthy();

      for (const { product, qty } of koszyk) {
        const res = await api.addToCart(PRODUCTS[product].id, qty);
        expect(res.status(), `dodanie "${product}" x${qty}`).toBe(201);
      }

      const kody = kod === null ? [] : Array.isArray(kod) ? kod : [kod];
      for (const k of kody) {
        const res = await api.applyCode(k);
        expect(res.status(), `kod ${k}`).toBe(200);
      }

      const shipping = await api.setShipping(metoda);
      expect(shipping.ok()).toBeTruthy();

      const { summary } = await (await api.cart()).json();
      expect(summary.shipping, 'koszt dostawy').toBe(oczekiwanaDostawa);
      expect(summary.total, 'suma do zapłaty').toBe(oczekiwanaSuma);
    });
  }
});
