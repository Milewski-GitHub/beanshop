import { expect, test } from './fixtures';

test.describe('Dodawanie do koszyka bez logowania', () => {
  test('@smoke niezalogowany klient po kliknieciu "Dodaj do koszyka" trafia na strone logowania', async ({ api, page, catalog, loginPage }) => {
    await catalog.goto();
    await catalog.addToCart('Etiopia Yirgacheffe');
    await expect(page).toHaveURL(/\/login\?next=%2F$|\/login\?next=\/$/);
    await expect(page.getByRole('heading', { name: 'Logowanie' })).toBeVisible();
    await expect(loginPage.submit).toBeVisible();
  });
});
