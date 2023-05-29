import { QuestionExample } from "@/server/services/story/schema";
import { OpenAIApi } from "openai";
import { calculateEuclideanDistance } from "./calculateEuclideanDistance";

export const pickSmallDistanceExampleQuestionInput = async (input: string,questionExamples: QuestionExample[],openai: OpenAIApi) => {
    
    const [inputEmbedding] = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: input
    }).then((res)=>res.data.data);

    const exampleEmbeddings = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: questionExamples.map(({question})=>question)
    }).then((res)=>res.data.data);

    const calculated = exampleEmbeddings.map(exampleEmbedding => {
        return {
            index: exampleEmbedding.index,
            distance: calculateEuclideanDistance(inputEmbedding.embedding,exampleEmbedding.embedding)
        }
    });
    calculated.sort((a,b)=>a.distance - b.distance)
    const nearby = calculated.at(0);
    if(nearby && (nearby.distance < 0.25)){
        return questionExamples.at(nearby.index);
    }
}