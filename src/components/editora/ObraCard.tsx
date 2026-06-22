import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type Obra, TIPO_LABEL, STATUS_LABEL } from "../../data/catalog";

export default function ObraCard({ obra }: { obra: Obra }) {
  return (
    <Link
      to={`/livros/${obra.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60"
    >
      <div
        className={`relative aspect-[3/2] bg-gradient-to-br ${obra.capaGradiente} p-5`}
      >
        <span className="inline-block rounded-md bg-black/25 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {TIPO_LABEL[obra.tipo]}
        </span>
        <h3 className="absolute bottom-4 left-5 right-5 font-display text-xl font-bold leading-tight text-white drop-shadow">
          {obra.titulo}
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {STATUS_LABEL[obra.status]}
        </span>
        <p className="text-sm text-muted-foreground line-clamp-3">{obra.resumo}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Ver obra
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
