// @vitest-environment jsdom

import { AppRouter } from "@/server";
import { useQuestion } from "./useQuestion";
import { createTRPCMsw } from 'msw-trpc'


import { setupServer } from "msw/node";
import { beforeEach, afterEach, expect,describe,it, vitest } from "vitest";
import {renderHook,waitFor} from "@testing-library/react"
import { PropsWithChildren, useMemo } from "react";
import { trpc } from "@/libs/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import fetch from "node-fetch";

const trpcMsw = createTRPCMsw<AppRouter>({
  basePath: '/api/trpc',
  baseUrl: 'https://example.com/',
});

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'https://example.com/',
          fetch: fetch as any,
        }),
      ],
    })
    , []);
    return <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
  </trpc.Provider>
}

describe("useQuestion", () => {
  const server = setupServer();

  beforeEach(() => {
    server.listen()
  });

  afterEach(() => {
    server.resetHandlers()
  });

  it("should return the latest question and answer", async () => {
    // Arrange
    const storyId = "testes";
    server.use(
        trpcMsw.question.mutation((_, res, ctx) => {
            return res(ctx.status(200), ctx.data("True"),ctx.delay(100))
        })
    );
    
    // Act

    const useQuestionMock = vitest.fn(useQuestion)

    const {result,rerender} = renderHook(
        () => useQuestionMock(storyId,false),
        {
            wrapper: Provider
        }
    );

    result.current.onSubmit("太郎は犬ですか？");

    // Assert
    await waitFor(() => {
      expect(result.current.latest?.result).toEqual("はい");
    })

    result.current.onSubmit("太郎は猫ですか？");

     

    rerender();

    // Assert
    await waitFor(() => {
      expect(result.current.latest?.result).toEqual("はい");
    })

    expect(useQuestionMock.mock.results.map(e => e.value.latest)).toMatchInlineSnapshot(`
      [
        null,
        {
          "input": "太郎は犬ですか？",
          "result": null,
        },
        {
          "id": 0,
          "input": "太郎は犬ですか？",
          "result": "はい",
        },
        {
          "input": "太郎は猫ですか？",
          "result": null,
        },
        {
          "id": 1,
          "input": "太郎は猫ですか？",
          "result": "はい",
        },
      ]
    `)
  });
});
