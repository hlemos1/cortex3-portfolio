export const config = { runtime: "edge" };

interface RequestBody {
  mode: "proactive" | "chat";
  portfolioContext: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
}

// ─── Hardening constants ─────────────────────────────────────────────────────

// Model is fixed server-side. Never accept a model (or max_tokens) from the client.
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS_PROACTIVE = 2048;
const MAX_TOKENS_CHAT = 1024;

const MAX_BODY_BYTES = 8 * 1024; // 8KB
const MAX_MESSAGES = 12;

const RATE_LIMIT_MAX = 10; // requests
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

// In-memory sliding-window rate limiter keyed by client IP.
// LIMITATION: this runs in a serverless/edge isolate — the Map is per-instance,
// resets on cold start and is NOT shared across regions/instances, so the real
// ceiling is (instances x RATE_LIMIT_MAX). It still stops trivial loop abuse and
// is better than nothing. For a hard guarantee, move to a shared store (KV/Redis).
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateBuckets.get(ip) || []).filter((t) => t > windowStart);

  if (hits.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, hits);
    return true;
  }

  hits.push(now);
  rateBuckets.set(ip, hits);

  // Opportunistic cleanup to bound memory.
  if (rateBuckets.size > 5000) {
    for (const [key, timestamps] of rateBuckets) {
      if (timestamps.every((t) => t <= windowStart)) rateBuckets.delete(key);
    }
  }
  return false;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

// Origin allowlist: same-origin (the deployment serving the SPA) always passes;
// extra origins (e.g. a custom production domain) via ALLOWED_ORIGIN env
// (comma-separated, full origins like "https://example.com"). Anything else: deny.
function getAllowedOrigin(req: Request): string | null {
  const requestOrigin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  let candidate: string | null = null;
  if (requestOrigin) {
    candidate = requestOrigin;
  } else if (referer) {
    try {
      candidate = new URL(referer).origin;
    } catch {
      return null;
    }
  }
  if (!candidate) return null; // no Origin/Referer (curl, scripts) → deny

  // Same-origin: browser calling /api/ai from the page served by this deployment.
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  try {
    if (host && new URL(candidate).host === host) return candidate;
  } catch {
    return null;
  }

  const extra = (process.env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return extra.includes(candidate) ? candidate : null;
}

function json(status: number, payload: object, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

const SYSTEM_PROACTIVE = `Voce e o consultor estrategico do portfolio CORTEX3. Seu papel e analisar os dados do portfolio e gerar insights acionaveis e estrategicos.

Regras:
- Responda SEMPRE em PT-BR
- Seja direto, sem filler words
- Foque em acoes concretas, nao teoria
- Use numeros e dados do portfolio fornecido
- Identifique padroes que o dono do portfolio pode nao ter visto
- Priorize por impacto: o que gera mais resultado com menos esforco

Formato da resposta:
Gere exatamente 5 insights estrategicos. Para cada um:
1. Titulo curto e direto (max 10 palavras)
2. Analise (2-3 frases explicando o insight com dados)
3. Acao recomendada (1 frase imperativa dizendo o que fazer)
4. Impacto esperado (1 frase)

Separe cada insight com uma linha "---".
Nao use markdown com # ou **. Use texto plano com numeracao.`;

const SYSTEM_CHAT = `Voce e o consultor estrategico do portfolio CORTEX3. Responda perguntas sobre os projetos com base nos dados fornecidos.

Regras:
- Responda SEMPRE em PT-BR
- Seja direto, sem filler words
- Use dados concretos do portfolio quando possivel
- Se a pergunta nao tem relacao com o portfolio, redirecione educadamente
- Sugira acoes praticas sempre que possivel
- Nao use markdown pesado. Use texto simples com numeracao quando necessario.`;

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {
  const allowedOrigin = getAllowedOrigin(req);

  if (req.method === "OPTIONS") {
    if (!allowedOrigin) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        Vary: "Origin",
      },
    });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!allowedOrigin) {
    return json(403, { error: "Forbidden" });
  }

  if (isRateLimited(getClientIp(req))) {
    return json(429, { error: "Too many requests. Try again later." }, { "Retry-After": "600" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(503, { error: "AI service unavailable" });
  }

  // Body size cap (8KB) — checked via Content-Length and the actual payload.
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { error: "Request body too large" });
  }

  let body: RequestBody;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json(413, { error: "Request body too large" });
    }
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { mode, portfolioContext, messages } = body;

  if (mode !== "proactive" && mode !== "chat") {
    return json(400, { error: "Invalid mode" });
  }
  if (typeof portfolioContext !== "string") {
    return json(400, { error: "Invalid portfolioContext" });
  }
  if (messages !== undefined) {
    if (
      !Array.isArray(messages) ||
      messages.length > MAX_MESSAGES ||
      messages.some((m) => !m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string")
    ) {
      return json(400, { error: "Invalid messages" });
    }
  }

  const systemPrompt = `${mode === "proactive" ? SYSTEM_PROACTIVE : SYSTEM_CHAT}

DADOS DO PORTFOLIO:
${portfolioContext}`;

  const claudeMessages =
    mode === "proactive"
      ? [{ role: "user" as const, content: "Analise o portfolio e gere os 5 insights estrategicos mais relevantes para o momento atual." }]
      : messages && messages.length > 0
        ? messages
        : [{ role: "user" as const, content: "Ola" }];

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: mode === "proactive" ? MAX_TOKENS_PROACTIVE : MAX_TOKENS_CHAT,
      system: systemPrompt,
      messages: claudeMessages,
      stream: true,
    }),
  });

  if (!anthropicResponse.ok) {
    // Do not forward upstream error bodies to the client.
    return json(502, { error: "Upstream AI error" });
  }

  // Transform Anthropic SSE stream to plain text stream
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicResponse.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch {
              // skip unparseable lines
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Access-Control-Allow-Origin": allowedOrigin,
      Vary: "Origin",
    },
  });
}
