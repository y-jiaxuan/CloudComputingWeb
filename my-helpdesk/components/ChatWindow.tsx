"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Hello, I am an AI Help Desk Assistant blah blah blah blah...",
  },
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I've received your query. (This is a mocked response, in the future will query AWS architecture to provide an answer)",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-gray-900 shadow-xl rounded-2xl overflow-hidden my-4 border border-gray-800">
      {/* Header */}
      <div className="bg-indigo-900/50 border-b border-indigo-500/20 p-4 shrink-0 shadow-sm z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-100" />
          AI Helpdesk Assistant
        </h2>
        <p className="text-indigo-100 text-sm mt-1">Ask me anything.</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                m.role === "user" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
              }`}
            >
              {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div
              className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm ring-1 ring-gray-900/50"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-4 pr-14 py-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-gray-800 text-gray-100 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
