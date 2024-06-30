import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('ランディングページ表示', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Yesonor/);
});
