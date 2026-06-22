import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Linkedin } from "lucide-react";
import Layout from "../components/editora/Layout";
import { getObra, AUTOR, TIPO_LABEL, STATUS_LABEL } from "../data/catalog";

export default function ObraPage() {
  const { slug } = useParams<{ slug: string }>();
  const obra = slug ? getObra(slug) : undefined;

  if (!obra) {
    return (
      <Layout>
        <section className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Obra nao encontrada</h1>
          <Link to="/catalogo" className="mt-4 inline-block text-primary hover:underline">
            Voltar ao catalogo
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Catalogo
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[320px_1fr]">
          {/* Capa + CTA */}
          <div>
            <div
              className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${obra.capaGradiente} p-6`}
            >
              <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                {TIPO_LABEL[obra.tipo]}
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-white drop-shadow">
                {obra.titulo}
              </h2>
              <p className="mt-2 text-sm text-white/85">{obra.subtitulo}</p>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                Status: <span className="text-foreground">{STATUS_LABEL[obra.status]}</span>
              </p>
              {obra.palavras && (
                <p className="mt-1 text-sm text-muted-foreground">
                  ~{obra.palavras.toLocaleString("pt-BR")} palavras
                </p>
              )}
              {obra.links?.amazon ? (
                <a
                  href={obra.links.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground hover:opacity-90"
                >
                  Comprar na Amazon
                </a>
              ) : (
                <a
                  href={AUTOR.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-center font-medium hover:border-primary/60 hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                  Avise-me no lançamento
                </a>
              )}
            </div>
          </div>

          {/* Conteudo */}
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {obra.titulo}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{obra.subtitulo}</p>

            <div className="prose prose-invert mt-8 max-w-none prose-p:text-muted-foreground">
              {obra.descricao.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {obra.destaques.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-xl font-bold">O que voce vai encontrar</h3>
                <ul className="mt-4 space-y-3">
                  {obra.destaques.map((d, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <Check className="mt-0.5 h-5 w-5 flex-none text-accent" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-2">
              {obra.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
