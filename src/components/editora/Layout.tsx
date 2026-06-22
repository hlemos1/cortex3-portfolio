import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { AUTOR, EDITORA } from "../../data/catalog";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 font-display text-sm font-bold text-background">
            C3
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            {EDITORA.nome}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/catalogo" className="hover:text-foreground">
            Catalogo
          </Link>
          <Link to="/autor" className="hover:text-foreground">
            Autor
          </Link>
          <a
            href={AUTOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-foreground hover:border-primary/60 hover:text-primary"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold">{EDITORA.nome}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">{EDITORA.tagline}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href={AUTOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-primary"
          >
            <Linkedin className="h-4 w-4" />
            {AUTOR.nome}
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
