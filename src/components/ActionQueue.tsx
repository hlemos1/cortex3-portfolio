import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, Play, X, Plus, Clock } from "lucide-react";
import type { Project, Recommendation } from "@/lib/commercializationEngine";
import { generateRecommendations } from "@/lib/commercializationEngine";
import Tooltip from "@/components/Tooltip";

const STORAGE_KEY = "cortex3_action_queue";

interface QueueItem {
  id: string;
  projectId: string;
  projectName: string;
  toolId: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "queued" | "in_progress" | "done" | "skipped";
  addedAt: string;
  completedAt?: string;
}

interface ActionQueueProps {
  projects: Project[];
  onToolStatusUpdate: (projectId: string, toolId: string, status: string) => void;
}

const PRIORITY_COLORS: Record<QueueItem["priority"], string> = {
  critical: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const PRIORITY_BG: Record<QueueItem["priority"], string> = {
  critical: "bg-red-500/10 border-red-500/30",
  high: "bg-orange-500/10 border-orange-500/30",
  medium: "bg-yellow-500/10 border-yellow-500/30",
  low: "bg-blue-500/10 border-blue-500/30",
};

const PRIORITY_DOT: Record<QueueItem["priority"], string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

function loadQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(items: QueueItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function ActionQueue({ projects, onToolStatusUpdate }: ActionQueueProps) {
  const [queue, setQueue] = useState<QueueItem[]>(() => loadQueue());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queuedIds = new Set(queue.map((q) => q.id));

  const availableRecs: { project: Project; rec: Recommendation }[] = [];
  for (const project of projects) {
    if (project.archived) continue;
    const recs = generateRecommendations(project);
    for (const rec of recs) {
      if ((rec.priority === "critical" || rec.priority === "high") && !queuedIds.has(`${project.id}-${rec.toolId}`)) {
        availableRecs.push({ project, rec });
      }
    }
  }

  const addToQueue = useCallback((project: Project, rec: Recommendation) => {
    const item: QueueItem = {
      id: `${project.id}-${rec.toolId}`,
      projectId: project.id,
      projectName: project.name,
      toolId: rec.toolId,
      title: rec.title,
      priority: rec.priority,
      status: "queued",
      addedAt: new Date().toISOString(),
    };
    setQueue((prev) => [...prev, item]);
    setShowDropdown(false);
  }, []);

  const updateStatus = useCallback(
    (id: string, status: QueueItem["status"]) => {
      setQueue((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, status };
          if (status === "done" || status === "skipped") {
            updated.completedAt = new Date().toISOString();
          } else {
            updated.completedAt = undefined;
          }
          if (status === "done") {
            onToolStatusUpdate(item.projectId, item.toolId, "configured");
          }
          return updated;
        })
      );
    },
    [onToolStatusUpdate]
  );

  const clearDone = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== "done"));
  }, []);

  const activeItems = queue.filter((i) => i.status === "queued" || i.status === "in_progress");
  const completedItems = queue.filter((i) => i.status === "done" || i.status === "skipped");

  const countQueued = queue.filter((i) => i.status === "queued").length;
  const countInProgress = queue.filter((i) => i.status === "in_progress").length;
  const countDone = queue.filter((i) => i.status === "done").length;

  return (
    <div className="rounded-xl border border-border/30 bg-card/40 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">Fila de Acoes</h3>
          <div className="flex items-center gap-2">
            {countQueued > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/15 px-2 py-0.5 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" />
                {countQueued}
              </span>
            )}
            {countInProgress > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[11px] text-blue-400">
                <Play className="w-3 h-3" />
                {countInProgress}
              </span>
            )}
            {countDone > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                {countDone}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {countDone > 0 && (
            <button
              onClick={clearDone}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar concluidos
            </button>
          )}
          <div className="relative" ref={dropdownRef}>
            <Tooltip content="Adicionar recomendacoes a fila">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 text-[11px] text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar acoes
              </button>
            </Tooltip>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 w-80 max-h-72 overflow-y-auto rounded-xl border border-border/30 bg-card shadow-xl">
                {availableRecs.length === 0 ? (
                  <p className="p-4 text-[11px] text-muted-foreground text-center">
                    Nenhuma recomendacao critica ou alta pendente
                  </p>
                ) : (
                  availableRecs.map(({ project, rec }) => (
                    <button
                      key={`${project.id}-${rec.toolId}`}
                      onClick={() => addToQueue(project, rec)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left border-b border-border/10 last:border-b-0"
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[rec.priority]}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{rec.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{project.name}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Queue items */}
      {queue.length === 0 ? (
        <p className="text-[11px] text-muted-foreground text-center py-6">
          Nenhuma acao na fila. Clique em "Adicionar acoes" para comecar.
        </p>
      ) : (
        <div className="space-y-2">
          {/* Active items first */}
          {activeItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${PRIORITY_BG[item.priority]}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[item.priority]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.projectName} &middot;{" "}
                  <span className={PRIORITY_COLORS[item.priority]}>{item.priority}</span>
                  {item.status === "in_progress" && (
                    <span className="ml-1 text-blue-400">em andamento</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.status === "queued" && (
                  <Tooltip content="Iniciar">
                    <button
                      onClick={() => updateStatus(item.id, "in_progress")}
                      className="p-1 rounded hover:bg-white/10 text-blue-400 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip>
                )}
                <Tooltip content="Concluir">
                  <button
                    onClick={() => updateStatus(item.id, "done")}
                    className="p-1 rounded hover:bg-white/10 text-green-400 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
                <Tooltip content="Pular">
                  <button
                    onClick={() => updateStatus(item.id, "skipped")}
                    className="p-1 rounded hover:bg-white/10 text-muted-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}

          {/* Completed items */}
          {completedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border/10 bg-white/[0.02] px-3 py-2 opacity-60"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.status === "done" ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate line-through">{item.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.projectName} &middot;{" "}
                  {item.status === "done" ? (
                    <span className="text-green-400">concluido</span>
                  ) : (
                    <span className="text-gray-500">pulado</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
