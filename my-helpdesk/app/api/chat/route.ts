import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
    system: "You are a helpful, professional AI Help Desk Assistant for an IT support service. You answer truthfully, concisely, and try to assist the user with their tech or cloud infrastructure issues.",
  });

  return result.toUIMessageStreamResponse();
}
