"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Phone, Send, Bot, User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { findBestAnswer, suggestedQuestions, type ChatEntry } from "@/lib/chatbot";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const GREETING =
  "Hi there — I'm the U.S. Tax Experts assistant. Ask me anything about our services, pricing, or getting started, or pick a question below.";

const FALLBACK =
  "I don't have an exact answer for that yet. Call our toll-free line or send us a message and a specialist will follow up personally.";

const tollFree = siteConfig.phones.find((p) => p.type === "Toll-Free") ?? siteConfig.phones[0];

function Avatar({ role }: { role: "bot" | "user" }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        role === "bot" ? "bg-gold-gradient text-navy-ink" : "bg-navy-900 text-white"
      }`}
    >
      {role === "bot" ? <Bot size={15} /> : <User size={14} />}
    </span>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2.5"
    >
      <Avatar role="bot" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-section px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-900/40 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-900/40 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-900/40" />
      </div>
    </motion.div>
  );
}

export default function ChatWidget({ knowledgeBase }: { knowledgeBase: ChatEntry[] }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!hasOpened) setShowTeaser(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [hasOpened]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function openChat() {
    setOpen(true);
    setHasOpened(true);
    setShowTeaser(false);
  }

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [...prev, { id: nextId.current++, role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const thinkTime = 550 + Math.random() * 650;
    window.setTimeout(() => {
      const answer = findBestAnswer(trimmed, knowledgeBase) ?? FALLBACK;
      setMessages((prev) => [...prev, { id: nextId.current++, role: "bot", text: answer }]);
      setTyping(false);
    }, thinkTime);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end lg:right-8 lg:bottom-8">
      {!open && showTeaser && (
        <div className="relative mb-4 max-w-65 overflow-hidden rounded-2xl border border-black/10 bg-white py-4 pr-8 pl-4 shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
          <span aria-hidden className="bg-gold-gradient absolute inset-y-0 left-0 w-1" />
          <button
            type="button"
            onClick={() => setShowTeaser(false)}
            aria-label="Dismiss"
            className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-section hover:text-navy-900"
          >
            <X size={12} />
          </button>
          <button type="button" onClick={openChat} className="flex w-full items-start gap-3 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
              <Bot size={16} />
            </span>
            <span>
              <span className="block text-[13px] font-bold text-heading">Need help?</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
                Ask me a quick question about our tax &amp; accounting services.
              </span>
            </span>
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with U.S. Tax Experts"
          className="mb-4 flex h-[calc(100vh-140px)] max-h-170 w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:w-100"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-navy-900 px-5 py-5">
            <div className="flex items-center gap-3.5">
              <span className="bg-gold-gradient ring-2 ring-white/15 flex h-11 w-11 items-center justify-center rounded-full text-navy-ink">
                <Bot size={20} />
              </span>
              <div>
                <h6 className="text-[15px] font-bold tracking-tight text-white">U.S. Tax Experts Assistant</h6>
                <p className="text-xs text-white/60">Online now &middot; Replies instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          {messages.length === 1 ? (
            <div className="flex-1 overflow-y-auto bg-white p-5">
              <span className="bg-gold-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-navy-ink">
                <Bot size={26} />
              </span>
              <h5 className="mt-4 text-heading">Hi there 👋</h5>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{GREETING}</p>

              <p className="mt-6 mb-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
                Popular questions
              </p>
              <div className="grid gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => ask(question)}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-left text-[13px] font-medium text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                  >
                    {question}
                    <Send
                      size={12}
                      className="shrink-0 text-navy-900/30 transition-colors group-hover:text-white/60"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              ref={listRef}
              className="flex-1 space-y-4 overflow-y-auto bg-white p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar role={message.role} />
                  <p
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-sm bg-navy-900 text-white"
                        : "rounded-bl-sm bg-section text-heading"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}

              <AnimatePresence>{typing && <TypingBubble />}</AnimatePresence>
            </div>
          )}

          <div className="shrink-0 border-t border-black/10 bg-white p-3.5">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={typing}
                placeholder={typing ? "Thinking..." : "Type a question..."}
                aria-label="Type a question"
                className="w-full rounded-full border border-black/15 bg-section py-2.5 pr-12 pl-4 text-[13.5px] outline-none focus:border-navy-800 focus:bg-white disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                aria-label="Send"
                className="bg-gold-gradient absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy-ink transition-opacity disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>
            <div className="mt-2.5 flex items-center justify-between text-[12px] text-muted">
              <a href={tollFree.href} className="flex items-center gap-1.5 hover:text-navy-900">
                <Phone size={12} className="text-gold-600" />
                {tollFree.label}
              </a>
              <Link href="/contact-us" onClick={() => setOpen(false)} className="hover:text-navy-900">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {!hasOpened && (
          <motion.span
            aria-hidden
            className="bg-gold-gradient absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-label={open ? "Close chat widget" : "Open chat widget"}
          className="bg-gold-gradient relative flex h-14 w-14 items-center justify-center rounded-full text-navy-ink shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
          {!hasOpened && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-navy-900" />
          )}
        </button>
      </div>
    </div>
  );
}
