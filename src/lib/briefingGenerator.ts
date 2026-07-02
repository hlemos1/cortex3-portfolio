import {
  calculateReadinessScore,
  generateRecommendations,
  getPortfolioStats,
  type Project,
  type Recommendation,
} from "@/lib/commercializationEngine";
import { analyzePortfolio } from "@/lib/portfolioIntelligence";
import { VERTICALS, STAGES } from "@/data/verticalDefinitions";

function formatDate(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function priorityLabel(p: Recommendation["priority"]): string {
  const map: Record<string, string> = { critical: "CRITICO", high: "ALTO", medium: "MEDIO", low: "BAIXO" };
  return map[p] || p;
}

function stageLabel(stage: string): string {
  const map: Record<string, string> = { idea: "Ideia", mvp: "MVP", live: "Live", scaling: "Scaling" };
  return map[stage] || stage;
}

function revenueLabel(range: string): string {
  const map: Record<string, string> = {
    pre_revenue: "Pre-receita",
    "0_100k": "0-100k",
    "100k_1m": "100k-1M",
    "1m_10m": "1M-10M",
    "10m_50m": "10M-50M",
    "50m_plus": "50M+",
  };
  return map[range] || range;
}

export function generateBriefing(projects: Project[]): string {
  const active = projects.filter((p) => !p.archived);
  const stats = getPortfolioStats(projects);
  const intel = analyzePortfolio(projects);

  const lines: string[] = [];
  const hr = "=".repeat(60);
  const sr = "-".repeat(60);

  // ─── Header ───────────────────────────────────────────────────────────────
  lines.push(hr);
  lines.push("  CORTEX3 PORTFOLIO BRIEFING");
  lines.push(`  Data: ${formatDate()}`);
  lines.push(hr);
  lines.push("");

  // ─── Resumo ───────────────────────────────────────────────────────────────
  lines.push("RESUMO GERAL");
  lines.push(sr);
  lines.push(`Projetos ativos: ${stats.total}`);
  lines.push(`Score medio do portfolio: ${stats.avgScore}/100`);
  lines.push(`Saude do portfolio: ${intel.portfolioHealth}/100`);
  lines.push(`Indice de concentracao: ${intel.concentrationIndex}/100`);
  lines.push("");
  lines.push("Distribuicao por estagio:");
  for (const s of STAGES) {
    const count = stats.byStage[s.id as keyof typeof stats.byStage] || 0;
    if (count > 0) lines.push(`  ${s.label}: ${count}`);
  }
  lines.push("");

  // ─── Top 5 Projetos Prioritarios ──────────────────────────────────────────
  lines.push("TOP 5 PROJETOS PRIORITARIOS");
  lines.push(sr);

  const sorted = [...active]
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return calculateReadinessScore(b) - calculateReadinessScore(a);
    })
    .slice(0, 5);

  for (const p of sorted) {
    const score = calculateReadinessScore(p);
    const recs = generateRecommendations(p);
    const topRec = recs[0];
    const vertLabel = VERTICALS[p.vertical]?.label || p.vertical;

    lines.push(`  ${p.name}`);
    lines.push(`    Vertical: ${vertLabel} | Estagio: ${stageLabel(p.stage)} | Pais: ${p.country}`);
    lines.push(`    Score: ${score}/100 | Prioridade: ${p.priority}`);
    if (topRec) {
      lines.push(`    Acao principal: [${priorityLabel(topRec.priority)}] ${topRec.title}`);
      lines.push(`    Motivo: ${topRec.reason}`);
    } else {
      lines.push(`    Acao principal: Nenhuma pendencia critica`);
    }
    lines.push("");
  }

  // ─── Insights Criticos ────────────────────────────────────────────────────
  lines.push("INSIGHTS CRITICOS");
  lines.push(sr);

  const criticalInsights = intel.insights.filter((i) => i.severity === "critical" || i.severity === "high");
  if (criticalInsights.length === 0) {
    lines.push("  Nenhum insight critico no momento.");
  } else {
    for (const insight of criticalInsights) {
      lines.push(`  [${insight.severity.toUpperCase()}] ${insight.title}`);
      lines.push(`    ${insight.description}`);
      lines.push(`    Acao: ${insight.action}`);
      lines.push("");
    }
  }
  lines.push("");

  // ─── Top 3 Acoes Estrategicas ─────────────────────────────────────────────
  lines.push("TOP 3 ACOES ESTRATEGICAS");
  lines.push(sr);

  const topActions = intel.topStrategicActions.slice(0, 3);
  if (topActions.length === 0) {
    lines.push("  Nenhuma acao estrategica pendente.");
  } else {
    topActions.forEach((action, idx) => {
      lines.push(`  ${idx + 1}. ${action}`);
    });
  }
  lines.push("");

  // ─── Projetos com Receita ─────────────────────────────────────────────────
  lines.push("PROJETOS COM RECEITA");
  lines.push(sr);

  // revenueRange is optional (not in the public seed) — only list projects with explicit data
  const revenueProjects = active.filter((p) => p.revenueRange && p.revenueRange !== "pre_revenue");
  if (revenueProjects.length === 0) {
    lines.push("  Nenhum projeto com dados de receita registrados.");
  } else {
    for (const p of revenueProjects) {
      const score = calculateReadinessScore(p);
      lines.push(`  ${p.name} | Receita: ${revenueLabel(p.revenueRange ?? "")} | Score: ${score}/100 | ${stageLabel(p.stage)} | ${p.country}`);
    }
  }
  lines.push("");

  // ─── Operacoes Internacionais ─────────────────────────────────────────────
  lines.push("OPERACOES INTERNACIONAIS");
  lines.push(sr);

  const intlProjects = active.filter((p) => p.country !== "BR");
  if (intlProjects.length === 0) {
    lines.push("  Todas as operacoes sao no Brasil.");
  } else {
    const byCountry: Record<string, Project[]> = {};
    for (const p of intlProjects) {
      if (!byCountry[p.country]) byCountry[p.country] = [];
      byCountry[p.country].push(p);
    }
    const countryLabels: Record<string, string> = { PT: "Portugal", US: "Estados Unidos", CN: "China", PY: "Paraguai" };
    for (const [country, projs] of Object.entries(byCountry)) {
      const geoCluster = intel.geoClusters.find((g) => g.country === country);
      lines.push(`  ${countryLabels[country] || country} (${projs.length} projeto(s), score medio: ${geoCluster?.avgScore || 0})`);
      for (const p of projs) {
        const score = calculateReadinessScore(p);
        lines.push(`    - ${p.name} | ${stageLabel(p.stage)} | Score: ${score}/100`);
      }
    }
  }
  lines.push("");

  // ─── Proximos Passos ──────────────────────────────────────────────────────
  lines.push("PROXIMOS PASSOS (TOP 10 RECOMENDACOES)");
  lines.push(sr);

  const allRecs: { projectName: string; rec: Recommendation }[] = [];
  for (const p of active) {
    for (const r of generateRecommendations(p)) {
      allRecs.push({ projectName: p.name, rec: r });
    }
  }

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  allRecs.sort((a, b) => priorityOrder[a.rec.priority] - priorityOrder[b.rec.priority]);

  const top10 = allRecs.slice(0, 10);
  if (top10.length === 0) {
    lines.push("  Nenhuma recomendacao pendente. Portfolio otimizado.");
  } else {
    top10.forEach((item, idx) => {
      lines.push(`  ${idx + 1}. [${priorityLabel(item.rec.priority)}] ${item.rec.title}`);
      lines.push(`     Projeto: ${item.projectName}`);
      lines.push(`     ${item.rec.reason}`);
      lines.push(`     Tempo estimado: ${item.rec.estimatedTime}`);
      lines.push("");
    });
  }

  lines.push(hr);
  lines.push("  Gerado pelo CORTEX3 Portfolio Intelligence Engine");
  lines.push(hr);

  return lines.join("\n");
}
