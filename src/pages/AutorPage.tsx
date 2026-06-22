import { Link } from "react-router-dom";
import { Linkedin, ArrowRight } from "lucide-react";
import Layout from "../components/editora/Layout";
import { AUTOR, catalog } from "../data/catalog";

export default function AutorPage() {
  return (
    <Layout>
      <section className="container py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_280px]">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{AUTOR.nome}</h1>
            <p className="mt-2 text-lg text-primary">{AUTOR.papel}</p>
            <p className="mt-6 max-w-2xl text-muted-foreground">{AUTOR.bio}</p>

            <a
              href={AUTOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              <Linkedin className="h-4 w-4" />
              Conectar no LinkedIn
            </a>
          </div>

          <aside className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-sm font-semibold">Obras</p>
            <ul className="mt-3 space-y-2">
              {[...catalog]
                .sort((a, b) => a.ordem - b.ordem)
                .map((o) => (
                  <li key={o.slug}>
                    <Link
                      to={`/livros/${o.slug}`}
                      className="group flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
                    >
                      {o.titulo}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
