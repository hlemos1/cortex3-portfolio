# Editora Cortex3

> Landing publica da Editora Cortex3 — livros, ebooks, papers e teses de Henrique Lemos.

[![CI](https://github.com/hlemos1/cortex3-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/hlemos1/cortex3-portfolio/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Conhecimento operacional de quem construiu, nao de quem opina. Vitrine editorial do
ecossistema Cortex3, plugada ao LinkedIn como rede social da persona.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (SWC) |
| Estilizacao | Tailwind CSS + Typography |
| Routing | React Router 7 |
| Icones | Lucide React |

## Quick Start

```bash
git clone https://github.com/hlemos1/cortex3-portfolio.git
cd cortex3-portfolio
pnpm install
pnpm dev
```

## Estrutura

```
src/
  data/catalog.ts        Fonte da verdade da vitrine (obras + autor + editora)
  components/editora/     Layout (header/footer/LinkedIn), ObraCard
  pages/
    EditoraHome.tsx       /
    CatalogoPage.tsx      /catalogo
    ObraPage.tsx          /livros/:slug
    AutorPage.tsx         /autor
```

## Rotas

| Rota | Pagina |
|------|--------|
| `/` | Home (hero, lancamento em foco, catalogo) |
| `/catalogo` | Grid filtravel por tipo (livro/ebook/paper/tese) |
| `/livros/:slug` | Pagina da obra (capa, blurb, destaques, CTA) |
| `/autor` | Bio + LinkedIn + lista de obras |

## Adicionar uma obra

Edite `src/data/catalog.ts`. Ao publicar na Amazon:

```ts
{
  slug: "...",
  status: "publicado",
  links: { amazon: "https://www.amazon.com.br/dp/XXXXXXXXXX" },
  // ...
}
```

Sem `links.amazon`, o CTA vira "Avise-me no lancamento" (LinkedIn).

## Seguranca

O dashboard interno de portfolio (`/interno`) so existe em desenvolvimento.
Em producao ele e eliminado do bundle (dead-code via `import.meta.env.DEV`),
de modo que dados internos nunca sao servidos no CDN. Por ser um app frontend-only,
nao ha autenticacao no servidor: nada sensivel deve ser importado nas paginas publicas.

## Scripts

| Comando | Acao |
|---------|------|
| `pnpm dev` | Servidor de desenvolvimento (porta 5180) |
| `pnpm build` | TypeScript + Vite build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |

## Status

| Item | Valor |
|------|-------|
| Fase | PROD-lite |
| Deploy | Static SPA (Vercel / CDN) |
| CI | GitHub Actions |
