---
applyTo: "tests/e2e/**"
---
# Testy e2e (Playwright)

- Importuj `test` i `expect` z `tests/e2e/fixtures.ts`, nie z `@playwright/test`.
- Stan początkowy: fixture `api` resetuje dane. Logowanie: fixture `loggedInPage` (przez API, nie przez formularz), chyba że testujesz sam formularz logowania.
- Interakcje przez page objects z `tests/e2e/pages/`. Brakujące elementy dodaj do page objectu, nie do testu.
- Lokatory w kolejności: `getByRole`, `getByLabel`, `getByText`, `getByTestId`. Bez XPath i bez selektorów CSS opartych na klasach.
- Tylko asercje web-first (`await expect(locator).toHaveText(...)`). Zakaz `waitForTimeout` i `textContent()` + `toBe`.
- Dane przygotowuj przez API (`page.request` lub `BeanShopApi`), a przez UI wykonuj tylko testowany krok.
- Kwoty w UI mają format `1 234,56 zł` (przecinek, spacja przed zł).
- Każdy test ma tag `@smoke` albo `@regression` w tytule.
