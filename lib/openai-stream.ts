import { OpenAIStreamPayload } from "@/types/openai";

import openai from "./openai";

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();

  let counter = 0;

  try {
    const stream = await openai.chat.completions.create({
      model: payload.model,
      messages: payload.messages,
      max_tokens: payload.max_tokens,
      temperature: payload.temperature ?? 0.7,
      top_p: payload.top_p ?? 1,
      presence_penalty: payload.presence_penalty ?? 0,
      frequency_penalty: payload.frequency_penalty ?? 0,
      n: payload.n ?? 1,
      stream: true,
    });

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            
            // Skip empty chunks
            if (!text) continue;
            
            // Skip prefix newlines (common in responses)
            if (counter < 2 && (text.match(/\n/) || []).length) {
              continue;
            }

            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });
  } catch (error) {
    console.error('Stream creation failed:', error);
    throw error;
  }
}