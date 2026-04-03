import { ChatWindow } from "@/components/ChatWindow";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function TicketChatPage({ params }: Props) {
    const resolved = await params;
    const ticketId = Number(resolved.id);

    if (!ticketId || isNaN(ticketId)) return notFound();

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { messages: { orderBy: { created_at: "asc" } } },
        });

        console.log("ticket:", ticket);
        console.log("messages:", ticket?.messages);

        if (!ticket) return notFound();

        return (
            <div className="flex-1 flex flex-col h-full bg-gray-50 p-4 md:p-6 lg:p-8">
                <ChatWindow
                    key={ticketId}
                    ticketId={ticketId}
                    initialMessages={ticket.messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    }))}
                />
            </div>
        );
    } catch (err) {
        console.error("Prisma error:", err);
        return notFound();
    }
}