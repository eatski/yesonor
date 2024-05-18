import { generateId } from "@/common/util/id";
import { neverReach } from "@/common/util/never";
import { prisma } from "@/libs/prisma";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (
	!process.env.GOOGLE_ID ||
	!process.env.GOOGLE_SECRET ||
	!process.env.NEXTAUTH_SECRET
) {
	throw new Error("Google OAuth is not configured");
}

export const authConfig: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, account }) {
			if (account?.providerAccountId && !token?.userId) {
				// 初回ログイン時のみuserが存在します
				const user = await prisma.user.upsert({
					where: { oauthId: account.providerAccountId },
					update: {},
					create: {
						id: generateId(),
						oauthId: account.providerAccountId,
					},
				});
				const userId: string = user.id;
				token.userId = userId; // userオブジェクトに保存されているカスタム値をトークンに追加します
			}
			return token;
		},
		async session({ session, token }) {
			// トークンからセッションにカスタム値を追加します
			session.custom = {
				userId:
					typeof token.userId === "string"
						? token.userId
						: neverReach("token.userId is not string"),
			};
			return session;
		},
	},
};

export default NextAuth(authConfig);
