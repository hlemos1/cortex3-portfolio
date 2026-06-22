import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Linkedin } from "lucide-react";
import Layout from "../components/editora/Layout";
import ObraCard from "../components/editora/ObraCard";
import { catalog, EDITORA, AUTOR } from "../data/catalog";

export default function EditoraHome() {
  const obras = [...catalog].sort((a, b) => a.ordem - b.ordem);
  const destaque = obras[0];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="container relative py-20 sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-accent" />
            {EDITORA.nome}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            {EDITORA.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {EDITORA.descricao}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              Ver catalogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={AUTOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium hover:border-primary/60 hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
              Seguir o autor
            </a>
          </div>
        </div>
      </section>

      {/* Destaque */}
      {destaque && (
        <section className="container py-16">
          <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-6 sm:p-10 md:grid-cols-2">
            <div
              className={`aspect-[3/2] rounded-xl bg-gradient-to-br ${destaque.capaGradiente} p-8`}
            >
              <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                Lançamento em foco
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white drop-shadow">
                {destaque.titulo}
              </h2>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{destaque.titulo}</h2>
              <p className="mt-2 text-muted-foreground">{destaque.subtitulo}</p>
              <p className="mt-4 text-sm text-muted-foreground">{destaque.resumo}</p>
              <Link
                to={`/livros/${destaque.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                Conhecer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Catalogo */}
      <section className="container pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Catalogo</h2>
          <Link to="/catalogo" className="text-sm text-primary hover:underline">
            Ver tudo
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {obras.map((obra) => (
            <ObraCard key={obra.slug} obra={obra} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
