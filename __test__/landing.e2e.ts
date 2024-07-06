import { AxeBuilder } from "@axe-core/playwright"
import { prepareStoryFromYaml } from '@/test/prepareStory';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { resolveFixturePath } from '../fixtures';
import { generateId } from '@/common/util/id';

const BASE_URL = 'http://localhost:3000';

const prepare = async () => {
    const userId = generateId();
    const prisma = new PrismaClient();
    prisma.$connect();
    await prisma.user.upsert({
        where: {
            id: userId,
        },
        create: {
            id: userId,
        },
        update: {}
    })
    const storyId = generateId();

    await prepareStoryFromYaml(resolveFixturePath("sample1.yaml"), {
        authorId: userId,
        storyId: storyId,
        published: true
    })

}

test('ランディングページ表示', async ({ page }) => {
  await prepare();
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Yesonor/);
});

test('新着のストーリーが表示されている', async ({ page }) => {
    await prepare();
    await page.goto(BASE_URL);

    const newRegion = await page.getByRole('region', { name: "新着ストーリー" });

    const links = await newRegion.getByRole('link', { name: "Yesonorの謎" });
    
    // Expect a title "to contain" a substring.
    await expect(links).toBeVisible();
}); 

test('アクセシビリティ', async ({ page }) => {
    await prepare();
    await page.goto(BASE_URL);

    const axe = new AxeBuilder({
        page
    });

    page.screenshot

    const {violations} = await axe.disableRules('color-contrast') .analyze();
    expect(violations,violations.map(v => v.description).join("\n")).toEqual([]);
});
