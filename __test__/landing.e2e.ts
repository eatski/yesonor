import { prepareStoryFromYaml } from '@/test/prepareStory';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { resolveFixturePath } from '../fixtures';

const BASE_URL = 'http://localhost:3000';

test('ランディングページ表示', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Yesonor/);
});

test('aa', async ({ page }) => {
    const id = "test"
    const prisma = new PrismaClient();
    prisma.$connect();
    await prisma.user.upsert({
        where: {
            id: id,
        },
        create: {
            id: id,
        },
        update: {}
    })
    const storyId = "test"

    const cleanup = await prepareStoryFromYaml(resolveFixturePath("test.yaml"), {
        authorId: id,
        storyId: storyId,
        published: true
    })
    
    await page.goto(BASE_URL);

    const newRegion = await page.getByRole('region', { name: "新着ストーリー" });

    const links = await newRegion.getByRole('link', { name: "Yesonorの謎" });
    
    // Expect a title "to contain" a substring.
    await expect(links).toBeVisible();

    await cleanup();
}); 
