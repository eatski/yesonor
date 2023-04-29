import { openai } from '@/libs/openapi';
import { procedure, router } from './trpc';

export const appRouter = router({
  hello: procedure.mutation(async () => {
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
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;