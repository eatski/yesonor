type Embedding = number[];

export const euclideanDistance = (a: Embedding, b: Embedding): number => {
  return Math.sqrt(a.reduce((sum, _, i) => sum + Math.pow(a[i] - b[i], 2), 0));
};

const calculateAverageDistance = (examples: Embedding[]): number => {
  let totalDistances = 0;
  let count = 0;

  for (let i = 0; i < examples.length; i++) {
    for (let j = i + 1; j < examples.length; j++) {
      totalDistances += euclideanDistance(examples[i], examples[j]);
      count++;
    }
  }

  return totalDistances / count;
};

//REVIEW: ロジックが正しいかわからない
export const calcInputIsCloseToExamples = (
  input: Embedding,
  examples: Embedding[],
): boolean => {
  const  threshold = calculateAverageDistance(examples);
  for (const example of examples) {
    if (euclideanDistance(input, example) <= threshold) {
      return true;
    }
  }
  return false;
};
