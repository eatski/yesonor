// @vitest-environment jsdom

import { AppRouter } from "@/server";
import { useQuestion } from "./useQuestion";
import { createTRPCMsw } from "msw-trpc";

import { setupServer } from "msw/node";
import {
	beforeEach,
	afterEach,
	expect,
	describe,
	it,
	vitest,
	vi,
} from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren, useMemo } from "react";
import { trpc } from "@/libs/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import fetch from "node-fetch";
import { setTimeout } from "timers/promises";

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
