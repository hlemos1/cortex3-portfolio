import { useState } from "react";
import Layout from "../components/editora/Layout";
import ObraCard from "../components/editora/ObraCard";
import { catalog, type ObraTipo, TIPO_LABEL } from "../data/catalog";

const FILTROS: Array<{ key: ObraTipo | "todos"; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "livro", label: "Livros" },
  { key: "ebook", label: "E-books" },
  { key: "paper", label: "Papers" },
  { key: "tese", label: "Teses" },
];

export default function CatalogoPage() {
  const [filtro, setFiltro] = useState<ObraTipo | "todos">("todos");
  const obras = [...catalog]
    .filter((o) => filtro === "todos" || o.tipo === filtro)
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <Layout>
      <section className="container py-16">
        <h1 className="font-display text-4xl font-bold tracking-tight">Catalogo</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Livros, e-books, papers e teses. Conhecimento operacional de quem construiu.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTROS.map((f) => {
            const count =
              f.key === "todos"
                ? catalog.length
                : catalog.filter((o) => o.tipo === f.key).length;
            const active = filtro === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                disabled={count === 0}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {obras.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            Nenhuma obra em {TIPO_LABEL[filtro as ObraTipo]} ainda. Em breve.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <ObraCard key={obra.slug} obra={obra} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
