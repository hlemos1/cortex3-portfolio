export const config = { runtime: "edge" };

interface RequestBody {
  mode: "proactive" | "chat";
  portfolioContext: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
}

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

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), { status: 500 });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { mode, portfolioContext, messages } = body;

  const systemPrompt = `${mode === "proactive" ? SYSTEM_PROACTIVE : SYSTEM_CHAT}

DADOS DO PORTFOLIO:
${portfolioContext}`;

  const claudeMessages =
    mode === "proactive"
      ? [{ role: "user" as const, content: "Analise o portfolio e gere os 5 insights estrategicos mais relevantes para o momento atual." }]
      : messages || [{ role: "user" as const, content: "Ola" }];

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: mode === "proactive" ? 2048 : 1024,
      system: systemPrompt,
      messages: claudeMessages,
      stream: true,
    }),
  });

  if (!anthropicResponse.ok) {
    const errorText = await anthropicResponse.text();
    return new Response(JSON.stringify({ error: `Anthropic API error: ${anthropicResponse.status}`, details: errorText }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
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
      "Access-Control-Allow-Origin": "*",
    },
  });
}
