import { euclideanDistance } from "./euclideanDistance";
import { Embedding } from "../type";

import {kmeans} from "ml-kmeans";

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


export const calculateDistanceThreshold = (examples: Embedding[]): number => {

  if(examples.length < 2){
    throw new Error("examples.length must be greater than 1");
  }
  const minK = 2;
  const maxK = examples.length;
  const scores: number[] = [];

  for (let index = minK; index < maxK; index++) {
    const {clusters} = kmeans(examples, index, {
      distanceFunction: euclideanDistance,
      seed: 36,
    });
    for (let culsterId = 0; culsterId < maxK; culsterId++) {
      const examplesInCluster = clusters.flatMap((cid,i) => cid === culsterId ? [examples[i]] : [])
      const avg = calculateAverageDistance(examplesInCluster);
      if(!isNaN(avg)){
        scores.push(avg);
      }
    }
  }
  return average(scores);
};

const average = (arr: number[]): number => {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

//REVIEW: ロジックが正しいかわからない
export const calcInputIsCloseToExamples = (
  input: Embedding,
  examples: Embedding[],
): boolean => {
  const threshold = calculateDistanceThreshold(examples);
  return examples.some((example) => euclideanDistance(input, example) <= threshold);
};
