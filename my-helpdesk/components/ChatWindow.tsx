"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Plus } from "lucide-react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";

type MessagePart = {
  type: string;
  text?: string;
};

type SimpleMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  ticketId?: number;
  initialMessages?: { role: string; content: string }[];
};

export function ChatWindow({ ticketId, initialMessages = [] }: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [historyMessages, setHistoryMessages] = useState<SimpleMessage[]>(
    initialMessages.map((m, i) => ({
      id: String(i),
      role: m.role as "user" | "assistant",
      content: m.content,
    }))
  );

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { ticketId },
    }),
    id: ticketId ? String(ticketId) : "new",
  });

  const [isCreating, setIsCreating] = useState(false);
  const isLoading = status === "submitted" || status === "streaming" || isCreating;

  useEffect(() => {
    if (ticketId) {
      const pendingPrompt = sessionStorage.getItem("pendingPrompt");
      if (pendingPrompt) {
        sessionStorage.removeItem("pendingPrompt");
        sendMessage({ text: pendingPrompt });
      }
    }
  }, [ticketId, sendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, historyMessages]);

  const handleNewTicket = async () => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "New Conversation" }),
    });
    const ticket = await res.json();
    router.push(`/tickets/${ticket.id}`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!ticketId) {
      setIsCreating(true);
      sessionStorage.setItem("pendingPrompt", input);
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: input.slice(0, 80) }),
      });
      const ticket = await res.json();
      router.push(`/tickets/${ticket.id}`);
      return;
    }

    sendMessage({ text: input });
    setInput("");
  };

  const renderMessage = (role: string, content: string, key: string) => (
    <div
      key={key}
      className={`flex gap-4 ${role === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
          role === "user" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
        }`}
      >
        {role === "user" ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div
        className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
          role === "user"
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm ring-1 ring-gray-900/50"
        }`}
      >
        {content}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-gray-900 shadow-xl rounded-2xl overflow-hidden my-4 border border-gray-800">
      <div className="bg-indigo-900/50 border-b border-indigo-500/20 p-4 shrink-0 shadow-sm z-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-100" />
            AI Helpdesk Assistant
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            {ticketId ? `Ticket #${ticketId}` : "Ask me anything."}
          </p>
        </div>
        <button
          onClick={handleNewTicket}
          className="flex items-center gap-2 bg-gray-800 text-indigo-400 px-4 py-2 font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-colors border border-gray-700"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950/50">
        {/* Show history messages first */}
        {historyMessages.length > 0
          ? historyMessages.map((m) => renderMessage(m.role, m.content, `history-${m.id}`))
          : messages.length === 0 && renderMessage("assistant", "Hello, I am your AI Help Desk Assistant. How may I assist you today?", "welcome")}

        {/* Show new messages from useChat */}
        {messages.map((m: UIMessage) =>
          renderMessage(
            m.role,
            m.parts?.map((p: MessagePart) => (p.type === "text" ? p.text : "")).join("") ?? "",
            `new-${m.id}`
          )
        )}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-emerald-600 text-white">
              <Bot size={20} />
            </div>
            <div className="px-5 py-3.5 rounded-2xl bg-gray-800 border border-gray-700 text-gray-400 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
        <form onSubmit={onSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ticketId ? "Continue the conversation..." : "Start typing to create a ticket..."}
            className="w-full pl-4 pr-14 py-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-gray-800 text-gray-100 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}