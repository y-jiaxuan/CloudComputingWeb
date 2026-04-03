"use client";
import { useEffect, useState } from "react";
import { Ticket, Search, Filter } from "lucide-react";

type TicketData = {
    id: number;
    subject: string;
    status: "Open" | "Resolved";
    created_at: string;
};

export function TicketList() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | "Open" | "Resolved">("All");
    const [newSubject, setNewSubject] = useState("");

    useEffect(() => {
        fetch('/api/tickets')
            .then(r => r.json())
            .then(data => {
                setTickets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch = ticket.subject
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" || ticket.status === filter;

        return matchesSearch && matchesFilter;
    });

    async function createTicket() {
        const subject = prompt("Enter ticket subject:");

        if (!subject) return;

        await fetch("/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject }),
        });

        // reload tickets
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data);
    }

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full bg-gray-900 shadow-xl rounded-2xl overflow-hidden my-4 border border-gray-800">
            {/* Header */}
            <div className="bg-indigo-900/50 border-b border-indigo-500/20 p-6 shrink-0 shadow-sm z-10 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-indigo-100" />
                        My Tickets
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">Tracks the tickets of user and AI chats.</p>
                </div>
                <button
                    onClick={createTicket}
                    className="bg-gray-800 text-indigo-400 px-4 py-2 font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-colors border border-gray-700">
                    New Ticket
                </button>
            </div>
            {/* Tools */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm bg-gray-800 text-gray-200 placeholder-gray-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="flex items-center gap-2 text-sm text-gray-300 border border-gray-700 px-3 py-2 rounded-lg bg-gray-800"
                >
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
            {/* Ticket Table */}
            <div className="flex-1 overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                        Loading tickets...
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                        No tickets yet.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
                                <th className="px-6 py-4 font-semibold">Ticket ID</th>
                                <th className="px-6 py-4 font-semibold">Subject</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Date Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                               {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-800 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-200">
                                        TKT-{ticket.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {ticket.subject}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === "Open"
                                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 text-right whitespace-nowrap">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}


// import { Ticket, Search, Filter } from "lucide-react";

// type TicketData = {
//   id: string;
//   subject: string;
//   status: "Open" | "Resolved";
//   date: string;
// };

// const MOCK_TICKETS: TicketData[] = [
//   { id: "TKT-1029", subject: "Database connection timeout (RDS)", status: "Resolved", date: "2026-03-24" },
//   { id: "TKT-1030", subject: "Cannot query User table", status: "Open", date: "2026-03-24" },
//   { id: "TKT-1031", subject: "PostgreSQL high CPU usage alerts", status: "Open", date: "2026-03-23" },
// ];

// export function TicketList() {
//   return (
//     <div className="flex flex-col h-full max-w-5xl mx-auto w-full bg-gray-900 shadow-xl rounded-2xl overflow-hidden my-4 border border-gray-800">
//       {/* Header */}
//       <div className="bg-indigo-900/50 border-b border-indigo-500/20 p-6 shrink-0 shadow-sm z-10 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//             <Ticket className="w-6 h-6 text-indigo-100" />
//             My Tickets (CURRENTLY A MOCK LIST. Check MOCK_TICKETS list.)
//           </h2>
//           <p className="text-indigo-100 text-sm mt-1">Tracks the tickets of user and AI chats.</p>
//         </div>
//         <button className="bg-gray-800 text-indigo-400 px-4 py-2 font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-colors border border-gray-700">
//           New Ticket
//         </button>
//       </div>

//       {/* Tools */}
//       <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
//         <div className="relative w-64">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search tickets..."
//             className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm bg-gray-800 text-gray-200 placeholder-gray-500"
//           />
//         </div>
//         <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-gray-700 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
//           <Filter className="w-4 h-4" />
//           Filter
//         </button>
//       </div>

//       {/* Ticket Table */}
//       <div className="flex-1 overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
//               <th className="px-6 py-4 font-semibold">Ticket ID</th>
//               <th className="px-6 py-4 font-semibold">Subject</th>
//               <th className="px-6 py-4 font-semibold rounded-br-none">Status</th>
//               <th className="px-6 py-4 font-semibold text-right">Date Created</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-800">
//             {MOCK_TICKETS.map((ticket) => (
//               <tr key={ticket.id} className="hover:bg-gray-800 transition-colors group cursor-pointer">
//                 <td className="px-6 py-4 text-sm font-medium text-gray-200">
//                   {ticket.id}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-300">
//                   {ticket.subject}
//                 </td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       ticket.status === "Open"
//                         ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
//                         : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
//                     }`}
//                   >
//                     {ticket.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-400 text-right whitespace-nowrap">
//                   {ticket.date}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
