import { calculateReadinessScore, generateRecommendations, getPortfolioStats, type Project } from "@/lib/commercializationEngine";
import { analyzePortfolio } from "@/lib/portfolioIntelligence";

const CACHE_KEY = "cortex3_ai_insights";
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Build compact portfolio context for AI consumption (~2000 tokens instead of 15000+)
export function buildPortfolioContext(projects: Project[]): string {
  const active = projects.filter((p) => !p.archived);
  const stats = getPortfolioStats(projects);
  const intel = analyzePortfolio(projects);

  const lines: string[] = [];

  // Summary
  lines.push(`PORTFOLIO CORTEX3 - ESTADO ATUAL`);
  lines.push(`Projetos ativos: ${stats.total} | Score medio: ${stats.avgScore}/100 | Saude: ${intel.portfolioHealth}/100 | Concentracao: ${intel.concentrationIndex}/100`);
  lines.push(`Pipeline: ${intel.pipeline.map((p) => `${p.count} ${p.label}`).join(" > ")}`);
  lines.push("");

  // Top priority projects
  const sorted = [...active]
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return calculateReadinessScore(b) - calculateReadinessScore(a);
    })
    .slice(0, 15);

  lines.push("PROJETOS PRIORITARIOS:");
  for (const p of sorted) {
    const score = calculateReadinessScore(p);
    const recs = generateRecommendations(p);
    const topGaps = recs.slice(0, 2).map((r) => r.toolName).join(", ");
    lines.push(`- ${p.name} [${p.vertical}/${p.stage}/${p.country}] Score:${score}${p.revenueRange ? ` Rev:${p.revenueRange}` : ""} Prio:${p.priority}${topGaps ? ` | Gaps: ${topGaps}` : ""}`);
  }
  lines.push("");

  // Revenue projects
  // revenueRange is optional (not in the public seed) — only list projects with explicit data
  const revenueProjects = active.filter((p) => p.revenueRange && p.revenueRange !== "pre_revenue");
  if (revenueProjects.length > 0) {
    lines.push("PROJETOS COM RECEITA:");
    for (const p of revenueProjects) {
      lines.push(`- ${p.name}: ${p.revenueRange} (${p.stage}, ${p.country})`);
    }
    lines.push("");
  }

  // Critical insights
  const criticalInsights = intel.insights.filter((i) => i.severity === "critical" || i.severity === "high");
  if (criticalInsights.length > 0) {
    lines.push("INSIGHTS CRITICOS:");
    for (const i of criticalInsights) {
      lines.push(`- [${i.severity.toUpperCase()}] ${i.title}: ${i.description}`);
    }
    lines.push("");
  }

  // Top gaps
  if (stats.topGaps.length > 0) {
    lines.push("MAIORES LACUNAS:");
    for (const g of stats.topGaps) {
      lines.push(`- ${g.toolName}: ${g.count} projetos sem`);
    }
    lines.push("");
  }

  // Synergies
  const strongSynergies = intel.synergies.filter((s) => s.strength === "strong").slice(0, 5);
  if (strongSynergies.length > 0) {
    lines.push("SINERGIAS FORTES:");
    for (const s of strongSynergies) {
      const source = active.find((p) => p.id === s.sourceId);
      const target = active.find((p) => p.id === s.targetId);
      if (source && target) {
        lines.push(`- ${source.name} + ${target.name}: ${s.reason} (ativos: ${s.sharedAssets.join(", ")})`);
      }
    }
    lines.push("");
  }

  // Strategic actions
  if (intel.topStrategicActions.length > 0) {
    lines.push("ACOES ESTRATEGICAS PENDENTES:");
    intel.topStrategicActions.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
    lines.push("");
  }

  // Geographic distribution
  if (intel.geoClusters.length > 1) {
    lines.push("DISTRIBUICAO GEOGRAFICA:");
    for (const g of intel.geoClusters) {
      lines.push(`- ${g.label} (${g.country}): ${g.projects.length} projetos, score medio ${g.avgScore}`);
    }
    lines.push("");
  }

  // Vertical clusters
  lines.push("VERTICAIS:");
  for (const v of intel.verticalClusters) {
    lines.push(`- ${v.label}: ${v.projects.length} projetos, score ${v.avgScore}, ${v.revenueProjects} com receita${v.topGap ? `, gap: ${v.topGap}` : ""}`);
  }

  return lines.join("\n");
}

// Cache management
export function getCachedInsights(): { text: string; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return cached;
  } catch {
    return null;
  }
}

function setCachedInsights(text: string): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ text, timestamp: Date.now() }));
  } catch { /* storage may be full or unavailable */ }
}

// Streaming fetch helper
async function* streamFromAPI(body: object): AsyncGenerator<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

// Fetch proactive insights with streaming
export async function* fetchProactiveInsights(projects: Project[]): AsyncGenerator<string> {
  const context = buildPortfolioContext(projects);
  let fullText = "";

  for await (const chunk of streamFromAPI({ mode: "proactive", portfolioContext: context })) {
    fullText += chunk;
    yield chunk;
  }

  setCachedInsights(fullText);
}

// Send chat message with streaming
export async function* sendChatMessage(projects: Project[], messages: ChatMessage[]): AsyncGenerator<string> {
  const context = buildPortfolioContext(projects);

  for await (const chunk of streamFromAPI({
    mode: "chat",
    portfolioContext: context,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })) {
    yield chunk;
  }
}
