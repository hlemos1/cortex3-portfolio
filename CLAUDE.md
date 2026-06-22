# CLAUDE.md — EDITORA CORTEX3

> Regras globais em `~/.claude/CLAUDE.md`.

## O QUE E

Landing publica da Editora Cortex3 — vitrine dos livros, ebooks, papers e teses
de Henrique Lemos, plugada ao LinkedIn. Reproposito do antigo cortex3-portfolio.

## STACK

Vite + React 18 + TypeScript + React Router v7 + Tailwind CSS (+ typography) + Lucide.
Frontend-only, sem backend, sem banco. SPA estatica na Vercel.

## ESTRUTURA

```
src/
  data/catalog.ts            Fonte da verdade da vitrine (Obra[], AUTOR, EDITORA)
  components/editora/        Layout (header/footer + LinkedIn), ObraCard
  pages/
    EditoraHome.tsx          /
    CatalogoPage.tsx         /catalogo
    ObraPage.tsx             /livros/:slug
    AutorPage.tsx            /autor
    PortfolioDashboard.tsx   /interno (SO em dev — ver Seguranca)
```

## VENDA

Modelo: Amazon KDP. Cada obra publicada recebe `status: "publicado"` e
`links.amazon`. Sem link, o CTA vira "Avise-me no lancamento" (LinkedIn).
Manuscritos vivem em `agentes/agents/ghost/books/` no workspace; aqui fica so o metadado.

## SEGURANCA — NAO QUEBRAR

O dashboard interno (`/interno`) contem dados de portfolio que NAO podem ser publicos.
Ele so monta em dev via `import.meta.env.DEV` + lazy import. Em producao o Vite
elimina o ramo (dead-code) e o codigo/dados nao entram no bundle servido no CDN.
Repo frontend-only nao tem auth real: dado no bundle = publico. Nunca importar
PortfolioDashboard nem `data/`/`lib/` internos de forma estatica nas paginas publicas.

## COMO RODAR

```bash
pnpm install
pnpm dev      # porta 5180; /interno disponivel
pnpm build    # produz dist/ (sem dashboard)
pnpm lint && pnpm test
```

## DECISOES

- SPA com React Router (nao SSR), frontend-only.
- catalog.ts e a unica fonte da vitrine; sem CMS por ora.
