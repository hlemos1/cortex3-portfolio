import { useState, useEffect, type FormEvent } from "react";
import { VERTICALS, STAGES } from "@/data/verticalDefinitions";
import type { Project } from "@/lib/commercializationEngine";

interface ProjectModalProps {
  project?: Project;
  onSave: (project: Project) => void;
  onClose: () => void;
  onArchive?: (id: string) => void;
}

const COUNTRIES = [
  { value: "BR", label: "Brasil" },
  { value: "PT", label: "Portugal" },
  { value: "US", label: "Estados Unidos" },
  { value: "CN", label: "China" },
  { value: "PY", label: "Paraguai" },
  { value: "other", label: "Outro" },
];

const REVENUE_RANGES = [
  { value: "pre_revenue", label: "Pre-revenue" },
  { value: "0_100k", label: "0 - 100k" },
  { value: "100k_1m", label: "100k - 1M" },
  { value: "1m_10m", label: "1M - 10M" },
  { value: "10m_50m", label: "10M - 50M" },
  { value: "50m_plus", label: "50M+" },
];

const PRIORITIES = [
  { value: 0, label: "Baixa" },
  { value: 1, label: "Media" },
  { value: 2, label: "Alta" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ProjectModal({ project, onSave, onClose, onArchive }: ProjectModalProps) {
  const isEdit = !!project;

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [vertical, setVertical] = useState(project?.vertical ?? "other");
  const [stage, setStage] = useState(project?.stage ?? "idea");
  const [primaryUrl, setPrimaryUrl] = useState(project?.primaryUrl ?? "");
  const [country, setCountry] = useState(project?.country ?? "BR");
  const [revenueRange, setRevenueRange] = useState(project?.revenueRange ?? "pre_revenue");
  const [priority, setPriority] = useState(project?.priority ?? 0);
  const [tagsInput, setTagsInput] = useState(project?.tags?.join(", ") ?? "");
  const [notes, setNotes] = useState(project?.notes ?? "");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const saved: Project = {
      id: project?.id ?? String(Date.now()),
      name,
      slug: slugify(name),
      description,
      vertical,
      stage,
      primaryUrl: primaryUrl || undefined,
      country,
      revenueRange,
      tags,
      priority,
      archived: project?.archived ?? false,
      notes: notes || undefined,
      toolStatuses: project?.toolStatuses ?? [],
    };

    onSave(saved);
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-5">
          {isEdit ? "Editar Projeto" : "Novo Projeto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nome do projeto"
            />
            {name && (
              <span className="text-[11px] text-muted-foreground mt-1 block">
                slug: {slugify(name)}
              </span>
            )}
          </div>

          {/* Descricao */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Descricao
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Breve descricao do projeto"
            />
          </div>

          {/* Vertical + Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Vertical
              </label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                className={inputClass}
              >
                {Object.values(VERTICALS).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Estagio
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className={inputClass}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              URL Principal
            </label>
            <input
              type="url"
              value={primaryUrl}
              onChange={(e) => setPrimaryUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {/* Pais + Faturamento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Pais
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Faixa de Receita
              </label>
              <select
                value={revenueRange}
                onChange={(e) => setRevenueRange(e.target.value)}
                className={inputClass}
              >
                {REVENUE_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Tags (separadas por virgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClass}
              placeholder="franquia, delivery, tech"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Observacoes internas"
            />
          </div>

          {/* Botoes */}
          <div className="flex items-center justify-between pt-3">
            <div>
              {isEdit && onArchive && project && (
                <button
                  type="button"
                  onClick={() => onArchive(project.id)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-red-400 border border-red-500/40 hover:bg-red-500/10 transition-colors"
                >
                  Arquivar
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
