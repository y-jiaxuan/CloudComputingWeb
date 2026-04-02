"use client";
import Link from "next/link";
import { MessageSquare, Ticket, LifeBuoy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TicketData = {
    id: number;
    subject: string;
    status: string;
    created_at: string;
};

export function Sidebar() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/tickets")
            .then((r) => r.json())
            .then((data) => setTickets(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);

    const handleNew = async () => {
        const res = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "New Conversation" }),
        });
        const ticket = await res.json();
        router.push(`/tickets/${ticket.id}`);
    };

    return (
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col h-full sticky top-0">
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="bg-indigo-500 p-2 rounded-lg">
                    <LifeBuoy className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">AI HelpDesk</span>
            </div>

            <nav className="px-4 py-4 space-y-1 border-b border-gray-800">
                <button
                    onClick={handleNew}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
                <Link
                    href="/tickets"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                    <Ticket className="w-5 h-5" />
                    <span className="font-medium">All Tickets</span>
                </Link>
            </nav>

            {/* Recent tickets list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-1">Recent</p>
                <div className="space-y-1">
                    {(Array.isArray(tickets) ? tickets : []).slice(0, 20).map((t) => (
                        <Link
                            key={t.id}
                            href={`/tickets/${t.id}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white text-sm truncate"
                        >
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            <span className="truncate">{t.subject}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}