'use client';

import Topbar from "@/components/Topbar";
import { chatToMarkdown, download } from "@/lib/export";
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  // hydrate messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  // auto scroll to latest message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Export current chat to Markdown
  const handleExport = () => {
    try {
      const md = chatToMarkdown(messages || []);
      download(`promptpilot-chat-${Date.now()}.md`, md);
    } catch (e) {
      console.error(e);
    }
  };

  // Optional quick actions hook (Message can ignore if not implemented)
  const onQuickAction = async (type, index) => {
    const target = messages[index];
    if (!target) return;
    setIsLoading(true);
    try {
      const prompt =
        type === "summarize"
          ? `Summarize clearly:\n\n${target.content}`
          : type === "rewrite"
          ? `Rewrite more concise and formal:\n\n${target.content}`
          : `Extract bullet points:\n\n${target.content}`;

      const res = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data?.text || "..." },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top navigation with Export button */}
      <Topbar onExport={handleExport} />

      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 relative bg-[var(--brand-bg)] text-[var(--brand-fg)]">
          {/* mobile top row */}
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt="menu"
              width={24}
              height={24}
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="chat"
              width={24}
              height={24}
            />
          </div>

          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={assets.logo_icon}
                  alt="PromptPilot"
                  className="h-16 w-16"
                  width={64}
                  height={64}
                />
                <p className="text-2xl font-medium">Hi, I’m PromptPilot.</p>
              </div>
              <p className="text-sm mt-2 opacity-80">
                How can I help you today?
              </p>
            </>
          ) : (
            <div
              ref={containerRef}
              className="relative flex flex-col items-center justify-start w-full mt-16 max-h-full overflow-y-auto"
            >
              <p className="fixed top-16 md:top-20 border border-transparent hover:border-white/10 py-1 px-2 rounded-lg font-semibold mb-6 bg-transparent backdrop-blur">
                {selectedChat?.name || "Conversation"}
              </p>

              {messages.map((msg, index) => (
                <Message
                  key={index}
                  role={msg.role}
                  content={msg.content}
                  onQuickAction={(type) => onQuickAction(type, index)}
                />
              ))}

              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    src={assets.logo_icon}
                    alt="Logo"
                    width={36}
                    height={36}
                  />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <PromptBox
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            messages={messages}
            setMessages={setMessages}
          />

          <p className="text-xs absolute bottom-1 text-white/40">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
