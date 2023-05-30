export function calculateEuclideanDistance(
	vec1: number[],
	vec2: number[],
): number {
	if (vec1.length !== vec2.length) {
		throw new Error("Vectors must have the same dimensions");
	}

	let sum = 0;
	for (let i = 0; i < vec1.length; i++) {
		let diff = vec1[i] - vec2[i];
		sum += diff * diff;
	}

	return Math.sqrt(sum);
}
