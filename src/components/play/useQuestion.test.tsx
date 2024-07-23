// @vitest-environment jsdom
import { useQuestion } from "./useQuestion";

import { setTimeout } from "node:timers/promises";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
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

import * as recapcha from "../../common/util/grecaptcha";

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
	const queryClient = useMemo(() => new QueryClient(), []);
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
		// Arrange
		const sendQuestionMock = vi.fn(async () => {
			await setTimeout(100);
			return {
				answer: "True",
				hitQuestionExample: null,
			} as const;
		});

		// Act

		const useQuestionMock = vitest.fn(useQuestion);

		const { result, rerender } = renderHook(
			() => useQuestionMock(sendQuestionMock),
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

		expect(sendQuestionMock.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "recaptchaToken": "test",
			      "text": "太郎は犬ですか？",
			    },
			  ],
			  [
			    {
			      "recaptchaToken": "test",
			      "text": "太郎は猫ですか？",
			    },
			  ],
			]
		`);
	});
});
