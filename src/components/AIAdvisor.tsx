import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Send, RefreshCw, MessageSquare, Loader2, Zap } from "lucide-react";
import type { Project } from "@/lib/commercializationEngine";
import {
  type ChatMessage,
  getCachedInsights,
  fetchProactiveInsights,
  sendChatMessage,
} from "@/lib/aiService";

interface AIAdvisorProps {
  projects: Project[];
  isActive: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Quais projetos devo priorizar agora?",
  "Onde estao as maiores sinergias?",
  "Como melhorar o score do portfolio?",
  "Analise as operacoes internacionais",
  "Quais projetos estao travados e por que?",
  "Qual a estrategia ideal para os proximos 90 dias?",
];

export default function AIAdvisor({ projects, isActive }: AIAdvisorProps) {
  const [insights, setInsights] = useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-load proactive insights when tab becomes active
  useEffect(() => {
    if (!isActive) return;

    const cached = getCachedInsights();
    if (cached) {
      setInsights(cached.text);
      return;
    }

    loadInsights();
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    setError(null);
    setInsights("");

    try {
      let text = "";
      for await (const chunk of fetchProactiveInsights(projects)) {
        text += chunk;
        setInsights(text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar insights");
    } finally {
      setIsLoadingInsights(false);
    }
  }, [projects]);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input.trim();
      if (!msg || isLoadingChat) return;

      setInput("");
      setError(null);

      const newMessages: ChatMessage[] = [...messages, { role: "user", content: msg }];
      setMessages(newMessages);
      setIsLoadingChat(true);

      try {
        let assistantText = "";
        setMessages([...newMessages, { role: "assistant", content: "" }]);

        for await (const chunk of sendChatMessage(projects, newMessages)) {
          assistantText += chunk;
          setMessages([...newMessages, { role: "assistant", content: assistantText }]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao enviar mensagem");
        setMessages(newMessages); // remove the empty assistant message
      } finally {
        setIsLoadingChat(false);
      }
    },
    [input, messages, projects, isLoadingChat]
  );

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when tab activates
  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[12px] text-red-400">
          {error}
          {error.includes("ANTHROPIC_API_KEY") && (
            <span className="block mt-1 text-red-400/70">
              Configure a variavel ANTHROPIC_API_KEY nas Environment Variables do Vercel.
            </span>
          )}
        </div>
      )}

      {/* Proactive Insights */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Insights Estrategicos</span>
            {isLoadingInsights && (
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
            )}
          </div>
          <button
            onClick={loadInsights}
            disabled={isLoadingInsights}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isLoadingInsights ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        <div className="px-5 py-4">
          {!insights && !isLoadingInsights && !error && (
            <div className="text-center py-6">
              <Sparkles className="h-8 w-8 text-primary/30 mx-auto mb-3" />
              <p className="text-[12px] text-muted-foreground">
                Clique em "Atualizar" para gerar insights estrategicos do seu portfolio.
              </p>
            </div>
          )}

          {isLoadingInsights && !insights && (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted/20 rounded w-3/4" />
                  <div className="h-3 bg-muted/10 rounded w-full" />
                  <div className="h-3 bg-muted/10 rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {insights && (
            <div className="space-y-4">
              {insights.split("---").map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;
                return (
                  <div key={i} className="text-[12px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {trimmed}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="rounded-xl border border-border/30 bg-card/40 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/20">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Pergunte ao Advisor</span>
        </div>

        {/* Messages */}
        <div className="px-5 py-4 max-h-[400px] overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-4">
              <p className="text-[12px] text-muted-foreground mb-4">
                Pergunte qualquer coisa sobre seu portfolio. O advisor tem acesso a todos os dados.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoadingChat}
                    className="rounded-full border border-border/30 bg-card/60 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50"
                  >
                    <Zap className="h-3 w-3 inline mr-1 text-primary/50" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-[12px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/10 text-foreground/90 border border-border/20"
                }`}
              >
                {msg.content || (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t border-border/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre seu portfolio..."
              disabled={isLoadingChat}
              className="flex-1 h-9 rounded-lg border border-border/40 bg-background px-3 text-sm outline-none focus:border-primary/50 disabled:opacity-50 placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoadingChat}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoadingChat ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
