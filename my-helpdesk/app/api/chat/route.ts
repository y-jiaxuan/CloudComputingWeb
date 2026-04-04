import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import type { UIMessage } from 'ai';
import { prisma } from '@/lib/prisma';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, ticketId }: { messages: UIMessage[]; ticketId?: number } = await req.json();
  const tid = ticketId ? Number(ticketId) : null;

  if (tid) {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      const text = lastUserMsg.parts?.find((p) => p.type === 'text' && 'text' in p)
        ? (lastUserMsg.parts.find((p) => p.type === 'text') as { type: 'text'; text: string })?.text
        : '';
      if (text) {
        await prisma.message.create({
          data: { ticket_id: tid, role: 'user', content: text },
        });
      }
    }
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
    system: "You are a helpful, professional AI Help Desk Assistant for an IT support service. You answer truthfully, concisely, and try to assist the user with their tech or cloud infrastructure issues.",
    async onFinish({ text }) {
      if (!tid) return;
      await prisma.message.create({
        data: { ticket_id: tid, role: 'assistant', content: text },
      });
      const ticket = await prisma.ticket.findUnique({ where: { id: tid } });
      if (ticket?.subject === 'New Conversation') {
        const firstUserMsg = messages.find((m) => m.role === 'user');
        const firstText = firstUserMsg?.parts?.find((p) => p.type === 'text') as { type: 'text'; text: string } | undefined;
        if (firstText?.text) {
          await prisma.ticket.update({
            where: { id: tid },
            data: { subject: firstText.text.slice(0, 80) },
          });
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}