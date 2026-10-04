import { describe, expect, it } from 'vitest';
import { DISCOUNT_CODES } from '../../src/domain/discounts';
import { lineTotal, priceCart, shippingCost } from '../../src/domain/pricing';

const code = (c: string) => DISCOUNT_CODES.find((d) => d.code === c)!;

describe('pricing', () => {
  it('liczy wartosc pozycji zgodnie z zaokragleniem do groszy (BR-08)', () => {
    expect(lineTotal(44.99, 3)).toBe(134.97);
  });

  it('nalicza dostawe standardowa ponizej progu (BR-04)', () => {
    expect(shippingCost(150, 'STANDARD')).toBe(14.99);
  });

  it('daje darmowa dostawe powyzej progu (BR-04)', () => {
    expect(shippingCost(250, 'STANDARD')).toBe(0);
  });

  it('daje darmowa dostawe dla pustego koszyka (BR-04)', () => {
    expect(shippingCost(0, 'STANDARD')).toBe(0);
  });

  it('nalicza doplate za express przy darmowej dostawie (BR-04)', () => {
    expect(shippingCost(250, 'EXPRESS')).toBe(10);
  });

  it.fails('daje darmowa dostawe od 200,00 zl wlacznie (BR-04) // BUG: kod uzywa > zamiast >=', () => {
    expect(shippingCost(200, 'STANDARD')).toBe(0);
  });

  it('nalicza rabat procentowy i zwraca kod (BR-05, BR-08)', () => {
    const summary = priceCart([{ lineTotal: 100 }], [code('KAWA10')], 'STANDARD');
    expect(summary.subtotal).toBe(100);
    expect(summary.discount).toBe(10);
    expect(summary.shipping).toBe(14.99);
    expect(summary.total).toBe(104.99);
    expect(summary.appliedCodes).toEqual(['KAWA10']);
  });

  it('rabat kwotowy nie obniza ceny ponizej zera (BR-05, BR-08)', () => {
    const summary = priceCart([{ lineTotal: 10 }], [code('MINUS20')], 'STANDARD');
    expect(summary.discount).toBe(10);
    expect(summary.total).toBe(14.99);
  });
});
