import { TicketList } from "@/components/TicketList";

export default function TicketsPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 p-4 md:p-6 lg:p-8">
      <TicketList />
    </div>
  );
}
