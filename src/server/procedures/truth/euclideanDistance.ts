import { Embedding } from "./type";

export const euclideanDistance = (a: Embedding, b: Embedding): number => {
  return Math.sqrt(a.reduce((sum, _, i) => sum + Math.pow(a[i] - b[i], 2), 0));
};