import { openai } from "@/libs/openapi"
import { procedure } from "../trpc"

export const hello = procedure.mutation(async () => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Output a cheerful greeting in Japanese."
            }
        ],
        temperature: 0.7
    })
    const message = response.data.choices[0].message
    if(!message){
        throw new Error("No message")
    }
    return message.content
})