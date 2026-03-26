import Link from "next/link";
import { MessageSquare, Ticket, LifeBuoy } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col h-full sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <LifeBuoy className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">AI HelpDesk</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">AI Chat</span>
        </Link>
        <Link
          href="/tickets"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Ticket className="w-5 h-5" />
          <span className="font-medium">My Tickets</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800 text-sm text-gray-500 text-center">
        &copy; 2026 AI Support Inc.
      </div>
    </aside>
  );
}
