import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
	plugins: [react()],
	test: {
		alias: {
			"@": "./src",
		},
		testTimeout: 10000,
		env: {
			CRYPTO_KEY: "password",
		},
	},
});
