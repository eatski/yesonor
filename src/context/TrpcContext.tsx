import { trpc } from "@/libs/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useMemo } from "react";

export const TrpcContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
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
