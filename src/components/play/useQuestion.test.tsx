// @vitest-environment jsdom

import type { AppRouter } from "@/server";
import { createTRPCMsw } from "msw-trpc";
import { useQuestion } from "./useQuestion";

import { setTimeout } from "node:timers/promises";
import { trpc } from "@/libs/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { httpBatchLink } from "@trpc/client";
import { setupServer } from "msw/node";
import fetch from "node-fetch";
import { type PropsWithChildren, useMemo } from "react";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	vitest,
} from "vitest";

import * as recapcha from "@/common/util/grecaptcha";

const trpcMsw = createTRPCMsw<AppRouter>({
	basePath: "/api/trpc",
	baseUrl: "https://example.com/",
});

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
	const queryClient = useMemo(() => new QueryClient(), []);
	const trpcClient = useMemo(
		() =>
			trpc.createClient({
				links: [
					httpBatchLink({
						url: "https://example.com/",
						fetch: fetch as any,
					}),
				],
			}),
		[],
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};

describe("useQuestion", () => {
	const server = setupServer();

	beforeEach(() => {
		server.listen();
		vi.spyOn(recapcha, "getRecaptchaToken").mockReturnValue(
			Promise.resolve("test"),
		);
	});

	afterEach(() => {
		server.resetHandlers();
	});

	it("should return the latest question and answer", async () => {
		const mutation = vi.fn();
		// Arrange
		const storyId = "testes";
		server.use(
			trpcMsw.question.mutation(async (input) => {
				mutation(input);
				await setTimeout(100);
				return {
					answer: "True",
					hitQuestionExample: null,
				};
			}),
		);

		// Act

		const useQuestionMock = vitest.fn(useQuestion);

		const { result, rerender } = renderHook(
			() =>
				useQuestionMock({
					id: storyId,
				}),
			{
				wrapper: Provider,
			},
		);

		result.current.onSubmit("太郎は犬ですか？");

		// Assert
		await waitFor(() => {
			expect(result.current.latest?.result).toEqual(null);
		});

		// Assert
		await waitFor(() => {
			expect(result.current.latest?.result).toEqual("はい");
		});

		expect(result.current.history).toMatchInlineSnapshot(`
			[
			  {
			    "id": 0,
			    "input": "太郎は犬ですか？",
			    "result": "はい",
			  },
			]
		`);

		result.current.onSubmit("太郎は猫ですか？");

		rerender();

		// Assert
		await waitFor(() => {
			expect(result.current.latest?.result).toEqual(null);
		});

		// Assert
		await waitFor(() => {
			expect(result.current.latest?.result).toEqual("はい");
		});

		expect(result.current.history).toMatchInlineSnapshot(`
			[
			  {
			    "id": 0,
			    "input": "太郎は犬ですか？",
			    "result": "はい",
			  },
			  {
			    "id": 1,
			    "input": "太郎は猫ですか？",
			    "result": "はい",
			  },
			]
		`);

		expect(mutation.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "0": {
			        "recaptchaToken": "test",
			        "storyId": "testes",
			        "text": "太郎は犬ですか？",
			      },
			    },
			  ],
			  [
			    {
			      "0": {
			        "recaptchaToken": "test",
			        "storyId": "testes",
			        "text": "太郎は猫ですか？",
			      },
			    },
			  ],
			]
		`);
	});
});
