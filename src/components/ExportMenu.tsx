import { useState, useRef, useEffect } from "react";
import { Download, FileText, Copy, Check } from "lucide-react";

interface ExportMenuProps {
  onExportBriefing: () => string;
  onExportJSON: () => string;
}

export default function ExportMenu({ onExportBriefing, onExportJSON }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const copyBriefing = () => {
    const text = onExportBriefing();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-8 px-3 rounded-lg border border-border/40 bg-card/40 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center gap-1.5"
      >
        <Download className="h-3.5 w-3.5" />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-border/30 bg-card shadow-xl z-50 overflow-hidden">
          <button
            onClick={copyBriefing}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-foreground hover:bg-muted/10 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
            {copied ? "Copiado!" : "Copiar briefing"}
          </button>
          <button
            onClick={() => downloadFile(onExportBriefing(), `cortex3-briefing-${new Date().toISOString().slice(0, 10)}.txt`, "text/plain")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-foreground hover:bg-muted/10 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Baixar briefing (.txt)
          </button>
          <button
            onClick={() => downloadFile(onExportJSON(), `cortex3-portfolio-${new Date().toISOString().slice(0, 10)}.json`, "application/json")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-foreground hover:bg-muted/10 transition-colors border-t border-border/20"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            Baixar dados (.json)
          </button>
        </div>
      )}
    </div>
  );
}
