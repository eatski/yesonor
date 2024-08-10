const date = Date.now();
export const CURRENT_HOUR_SEED = Math.floor(
	date / (1000 * 60 * 60 * 12),
).toString();
