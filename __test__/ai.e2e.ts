import parser from 'node-html-parser';
import { createOpenAICompletion } from "@/libs/openai";
import { z } from "zod";
import {zodToJsonSchema} from "zod-to-json-schema"
import { ARIARoleDefinitionKey, roles } from "aria-query";
import { test } from '@playwright/test';
import { generateId } from '@/common/util/id';
import { PrismaClient } from '@prisma/client';
import { prepareStoryFromYaml } from '@/test/prepareStory';
import { resolveFixturePath } from '../fixtures';

const BASE_URL = 'http://localhost:3000';

const prepare = async () => {
    const userId = generateId();
    const prisma = new PrismaClient();
    prisma.$connect();
    await prisma.story.deleteMany();
    await prisma.user.deleteMany();
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

const operationSchema = z.union([
    z.object({
        type: z.literal("click").describe("要素をクリックする"),
    }),
    z.object({
        type: z.literal("fill").describe("要素にテキストを入力する"),
        text: z.string(),
    }),
])

const [roleHead,...roleTail] = roles.entries().filter(([,v]) => !v.abstract).map(([k]) => k);

const roleSchema = z.enum([
    roleHead as ARIARoleDefinitionKey ,...roleTail
])

const indentifier = z.object({
    role: roleSchema,
    name: z.string().optional(),
    withIn: z.object({
        role: roleSchema,
        name: z.string().optional(),
    }).optional().describe("テストケース名に範囲が指定されている場合や画面上に同じ名前を持つ要素が2つ以上あった場合に要素を1つに特定するための祖先要素のrole"),
},{
    description: "Accessibility Object Modelから要素を特定するindentifier"
})

const actionSchema = z.object({
    operation: operationSchema,
    target: indentifier.describe( "アクションの対象となる要素を特定する。"),
})

const testCaseSchema = z.object({
    case: z.string().describe("日本語名"),
    actions: z.array(actionSchema,{
        description: "テストケースとして順番に実行するユーザーの操作（クリックなど）。先頭から順番に実行する。",
    }),
    expected: z.string().describe("期待される結果を日本語でユーザーにとってわかりやすく表現しなさい。（例: 〇〇が表示されている）")
})

const testCaseJsonSchema = zodToJsonSchema(testCaseSchema);

const testCaseNamesSchema = z.object({
    cases: z.array(z.object({
        case: z.string().describe("ユーザーの操作"),
        withIn: z.string().describe("画面上に同じ名前を持つ要素が2つ以上あった場合に要素を1つに特定するためにテスト対象の範囲をユーザーにわかる言葉で指定してください。"),
        expected: z.string().describe("期待される結果を日本語でユーザーにとってわかりやすく表現しなさい。（例: 〇〇が表示されている）")
    }))
})

const testCaseNamesJsonSchema = zodToJsonSchema(testCaseNamesSchema);

const purizeHtml = (html: string) => {
    const parsedHtml = parser.parse(html);
    parsedHtml.getElementsByTagName("script").forEach((script) => {
        script.remove();
    });
    parsedHtml.getElementsByTagName("style").forEach((style) => {
        style.remove();
    });
    parsedHtml.getElementsByTagName("svg").forEach((svg) => {
        svg.innerHTML = "";
    });

    parsedHtml.querySelectorAll("*").forEach(element => {
        element.removeAttribute("class");
    })

    return parsedHtml.getElementsByTagName("body")[0]!.innerHTML;
}

test("ai", async ({page})  => {
    test.setTimeout(1000 * 60 * 10);
    await prepare();
    await page.goto(BASE_URL);
    const minimumHtml = purizeHtml(await page.content());
    console.log(minimumHtml);
    const result = await createOpenAICompletion({
        model: "gpt-4o-2024-05-13",
        tools: [
            {
                type: "function",
                function: {
                    name: "extract-test-cases",
                    parameters: testCaseNamesJsonSchema
                }
            }
        ],
        temperature: 0,
        tool_choice: "required",
        messages: [
            {
                role: "system",
                content: "あなたは凄腕のテストエンジニアです。userから提示されたHTMLからテストケースを漏れなく抽出し、構造体として出力してください。ユーザーストーリーに基づいた表現にしてください。"
            },
            {
                role: "user",
                content: minimumHtml
            }
        ]
    })

    const {cases} = testCaseNamesSchema.parse(JSON.parse(result.choices[0]?.message.tool_calls?.at(0)?.function.arguments!));

    console.log(cases);

    const testCaseDetails = await Promise.all(cases.map(async c => {
        const result = await createOpenAICompletion({
            model: "gpt-4o-2024-05-13",
            tools: [
                {
                    type: "function",
                    function: {
                        name: "extract-test-cases",
                        parameters: testCaseJsonSchema,

                    }
                }
            ],
            temperature: 0,
            tool_choice: "required",
            messages: [
                {
                    role: "system",
                    content: "あなたは凄腕のテストエンジニアです。userから提示されたテストケースをHTMLを参照しながらAccesisbility Object Model的な構造体に変換してください。"
                },
                {
                    role: "user",
                    content: `範囲: ${c.withIn}`
                },
                {
                    role: "user",
                    content: `テストケース: ${c.case}`
                },
                {
                    role: "user",
                    content: `期待される結果: ${c.expected}`
                },
                {
                    role: "user",
                    content: minimumHtml
                }
            ]
        })
        return testCaseSchema.parse(JSON.parse(result.choices[0]?.message.tool_calls?.at(0)?.function.arguments!));
    }))

    console.log(JSON.stringify(testCaseDetails,null,2));

    for (const testCase of testCaseDetails) {
        await page.waitForTimeout(300);
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle")
        const {actions} = testCase;
        for (const action of actions) {
            const {operation,target} = action;
            const {withIn} = target;
            const range = withIn ? await page.getByRole(withIn.role as never, {name: withIn.name}) : page;
            switch(operation.type) {
                case "click":
                    await (async () => {
                        const element = await range.getByRole(target.role as never, {name: target.name});
                        await element.click();
                    })();
                    break;
                case "fill":
                    await (async () => {
                        const element = await range.getByRole(target.role as never, {name: target.name});
                        await element.fill(operation.text);
                    })()
                    break;
            }
        }
        await page.waitForTimeout(300);
        console.log(testCase.case);
        const html = purizeHtml(await page.content());

        const result = await createOpenAICompletion({
            model: "gpt-4o-2024-05-13",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: "あなたは凄腕のテストエンジニアです。userから提示されたHTMLと期待値を参照して、HTMLが期待値を満たしているかどうかを評価しTrueかFalseで出力しなさい。期待値は抽象的に表現されておりある程度の解釈が必要です。"
                },
                {
                    role: "user",
                    content: testCase.expected,
                },
                {
                    role: "user",
                    content: html
                }
            ]
        })

        const resultString = result.choices[0]?.message.content;

        console.log(testCase.expected,resultString);

    }
})
