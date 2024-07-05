import { prepareStoryFromYaml } from '@/test/prepareStory';
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { resolveFixturePath } from '../fixtures';
import { generateId } from '@/common/util/id';
import { RECAPTCHA_COOKIE_KEY } from '@/common/util/grecaptcha';

const BASE_URL = 'http://localhost:3000';


test('ストーリーページの表示', async ({ page }) => {
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
    
    await page.goto(BASE_URL + "/stories/" + storyId);

    expect(page).toHaveTitle(/Yesonorの謎/);

    
}); 

test('質問の送信', async ({ page }) => {
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
    
    await page.goto(BASE_URL + "/stories/" + storyId);
    process.env.MACHINE_TOKEN && await page.context().addCookies([{
        name: RECAPTCHA_COOKIE_KEY,
        value: process.env.MACHINE_TOKEN,
        url: BASE_URL,
        httpOnly: true
    }]);
    await page.waitForLoadState("networkidle")
    const input = await page.getByRole('textbox', { name: "AIへの質問" });
    await input.fill("あなたはAIですか？");
    const button = await page.getByRole('button', { name: "質問を送信" });
    await button.click();
    const status = await page.getByRole("status")
    await expect(status).toHaveAttribute("aria-busy", "true");
    await expect(status).not.toHaveAttribute("aria-busy", "true");
    await expect(status).toHaveText("はい")
}); 
