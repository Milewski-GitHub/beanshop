import { expect, test } from './fixtures';

test.describe('Katalog', () => {
  test('pokazuje wszystkie produkty', async ({ api, catalog }) => {
    await catalog.goto();
    await expect(catalog.products).toHaveCount(9);
  });

  test('wyszukuje produkt po nazwie', async ({ api, catalog }) => {
    await catalog.goto();
    await catalog.searchFor('Kolumbia');
    await expect(catalog.products).toHaveCount(1);
  });

  test('produkt bez stanu ma nieaktywny przycisk', async ({ api, catalog }) => {
    await catalog.goto();
    await expect(catalog.product('Drip Kenia').getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();
  });

  // BR-10: wyszukiwanie bez rozróżniania wielkości liter
  for (const fraza of ['kol', 'KOL', 'Kol']) {
    test(`BR-10: fraza "${fraza}" zwraca Kolumbia Supremo 250 g`, async ({ api, catalog }) => {
      // BUG: src/routes/products.ts filtruje przez name.includes(q) z rozróżnianiem wielkości liter, BR-10
      test.fail(fraza !== 'Kol');
      await catalog.goto();
      await catalog.searchFor(fraza);
      await expect(catalog.products).toHaveCount(1);
      await expect(catalog.product('Kolumbia Supremo 250 g')).toBeVisible();
    });
  }

  // BR-10: minimum 2 znaki
  test('BR-10: jeden znak daje komunikat "Wpisz co najmniej 2 znaki"', async ({ api, catalog }) => {
    await catalog.goto();
    await catalog.searchFor('k');
    await expect(catalog.searchError).toHaveText('Wpisz co najmniej 2 znaki');
  });

  // BR-10: poprawne zapytanie bez dopasowań
  test('BR-10: fraza "xyz" pokazuje brak produktów spełniających kryteria', async ({ api, catalog }) => {
    await catalog.goto();
    await catalog.searchFor('xyz');
    await expect(catalog.products).toHaveCount(0);
    await expect(catalog.noResults).toHaveText('Brak produktów spełniających kryteria.');
    await expect(catalog.searchError).toBeEmpty();
  });
});
