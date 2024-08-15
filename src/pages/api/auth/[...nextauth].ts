import { generateId } from "@/common/util/id";
import { neverReach } from "@/common/util/never";
import { prisma } from "@/libs/prisma";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions =
	process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
		? {
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
			}
		: process.env.MOCK_LOGIN
			? {
					providers: [
						CredentialsProvider({
							credentials: {
								id: { label: "id", type: "text", placeholder: "User Id" },
							},
							authorize: function (credentials) {
								return credentials?.id
									? {
											id: credentials.id,
											email: "example@example.com",
										}
									: null;
							},
						}),
					],
					secret: "secret",
					callbacks: {
						async jwt({ user, token }) {
							if (user) {
								// 初回ログイン時のみuserが存在します
								const createdUser = await prisma.user.upsert({
									where: { oauthId: user.id },
									update: {},
									create: {
										id: user.id,
									},
								});
								const userId: string = createdUser.id;
								token.userId = userId; // userオブジ
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
				}
			: neverReach("Google OAuth is not configured");

export default NextAuth(authConfig);
