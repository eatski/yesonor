import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('ランディングページ表示', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Yesonor/);
});

test("ストーリーへの遷移", async ({ page }) => {
  await page.goto(BASE_URL);
  const linkToStoryPage = page
    .getByRole("article").first()
    .getByRole("link",{
      name: "このストーリーの謎を解く"
    })
  await expect(linkToStoryPage).toBeVisible()
  await linkToStoryPage.click();
  await expect(page).toHaveURL(/\/stories\/.+/);
})