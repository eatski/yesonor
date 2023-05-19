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


test("質問の送信", async ({ page }) => {
  await page.goto(BASE_URL);
  const linkToStoryPage = page
    .getByRole("article").first()
    .getByRole("link",{
      name: "このストーリーの謎を解く"
    })
  await linkToStoryPage.click();
  await expect(page).toHaveURL(/\/stories\/.+/);
  const questionForm = page.getByRole("textbox",{name: "AIに質問をする"});
  await expect(questionForm).toBeVisible();
  const submitButton = page.getByRole("button",{name: "質問を送信"});
  const question1 = "あなたはAIですか？";
  await questionForm.fill(question1);
  await submitButton.click();
  const questionResult = await page.getByRole("region",{name: "質問の結果",});
  await expect(questionResult.getByText(question1)).toBeVisible();
  await expect(questionResult.getByText("はい")).toBeVisible();
  const question2 = "あなたは人間ですか？";
  await questionForm.fill(question2);
  await submitButton.click();
  await expect(questionResult.getByText(question2)).toBeVisible();
  await expect(questionResult.getByText("いいえ")).toBeVisible();
  
})