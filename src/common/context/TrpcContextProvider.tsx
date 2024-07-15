"use client";
import { trpc } from "@/libs/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useMemo } from "react";

export const TrpcContextProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const queryClient = useMemo(() => new QueryClient(), []);
	const trpcClient = useMemo(
		() =>
			trpc.createClient({
				links: [
					httpBatchLink({
						url: "/api/trpc",
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
