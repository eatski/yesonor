// ベクトルの内積を計算
function dotProduct(vec1: number[], vec2: number[]): number {
	let product = 0;
	for (let i = 0; i < vec1.length; i++) {
		product += vec1[i] * vec2[i];
	}
	return product;
}

// ベクトルの大きさを計算
function magnitude(vec: number[]): number {
	let sum = 0;
	for (let i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i];
	}
	return Math.sqrt(sum);
}

// コサイン類似度を計算
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
	if (vec1.length !== vec2.length) {
		throw new Error("ベクトルの次元が異なります");
	}

	const dotProductValue = dotProduct(vec1, vec2);
	const magnitudeVec1 = magnitude(vec1);
	const magnitudeVec2 = magnitude(vec2);

	if (magnitudeVec1 === 0 || magnitudeVec2 === 0) {
		throw new Error("ゼロベクトルが入力されました");
	}

	return dotProductValue / (magnitudeVec1 * magnitudeVec2);
}
