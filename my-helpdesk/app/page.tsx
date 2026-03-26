import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 p-4 md:p-6 lg:p-8">
      <ChatWindow />
    </div>
  );
}
