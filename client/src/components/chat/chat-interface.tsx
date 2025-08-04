"use client";

import { useChat } from "@ai-sdk/react";
import { ChatMessage } from "./chat-message";
import { Input } from "@/components/chat/chat-input";
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useGetConversationById, useCreateConversation } from "@/hooks/use-convo";
import { CustomUIMessage, convertPrismaMessagesToUIMessages } from "@/types/message";

interface ChatInterfaceProps {
  conversationId: string;
}

export function ChatInterface({ conversationId: initialId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(true);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  // state + ref for the active conversation ID
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    initialId ?? null
  );
  const convIdRef = useRef<string | null>(initialId ?? null);

  // keep ref in sync if the prop ever changes
  useEffect(() => {
    if (initialId && initialId !== currentConversationId) {
      setCurrentConversationId(initialId);
      convIdRef.current = initialId;
    }
  }, [initialId, currentConversationId]);

  const { user } = useAuth();
  const router = useRouter();
  const createConversation = useCreateConversation();
  const { data: conversation } = useGetConversationById(currentConversationId);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.SERVER_URL ?? "http://localhost:4000"}/api/chat`,
      body: (outgoing: CustomUIMessage[]) => ({
        messages: outgoing,
        userId: user?.id,
        // Read immediately from the ref
        conversationId: convIdRef.current,
      }),
    }),
  });

  // Load existing messages from your backend into the SDK
  useEffect(() => {
    if (conversation?.messages?.length) {
      const uiMessages = convertPrismaMessagesToUIMessages(conversation.messages);
      setMessages(uiMessages);
    }
  }, [conversation, setMessages]);

  // Auto-scroll helpers
  const scrollToBottom = () => {
    if (messagesEndRef.current && isAutoScrollingRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const scrollToLastUserMessage = () => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll when messages change
  useEffect(() => {
    if (isAutoScrollingRef.current && status !== "streaming") {
      const id = setTimeout(scrollToBottom, 10);
      return () => clearTimeout(id);
    }
  }, [messages, status]);

  // Track manual scroll to toggle auto-scroll
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      isAutoScrollingRef.current = docH - scrollTop - winH < 200;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Send a new message (and create the conversation first if needed)
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // remember scroll position
    const wasScrolledUp = !isAutoScrollingRef.current;

    // Create conversation if this is the first message
    if (!convIdRef.current) {
      const newConv = await createConversation.mutateAsync(text);
      setCurrentConversationId(newConv.id);
      convIdRef.current = newConv.id;              // 🔑 write to ref immediately
      router.push(`/chat/${newConv.id}`);
    }

    // Now that convIdRef.current is correct, the SDK will use it
    sendMessage({ text });

    // restore scroll behavior
    if (wasScrolledUp) {
      isAutoScrollingRef.current = false;
      setTimeout(scrollToLastUserMessage, 100);
    } else {
      isAutoScrollingRef.current = true;
    }
  };

  // Find the last user message so we can scroll to it if needed
  const lastUserMessage = messages.filter((m) => m.role === "user").slice(-1)[0];

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="px-4 pt-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with the AI assistant</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              ref={message.id === lastUserMessage?.id && message.role === "user"
                ? lastUserMessageRef
                : null}
              className="mb-4"
            >
              <ChatMessage message={message} status={status} />
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error: {error.message}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 bg-white p-6 z-10"
        style={{ marginLeft: "var(--sidebar-width, 0px)" }}
      >
        <Input
          onSendMessage={handleSendMessage}
          disabled={status === "streaming"}
          isLoading={status === "streaming"}
        />
      </div>
    </div>
  );
}
