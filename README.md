# Cortex3 Portfolio

> Dashboard de portfolio do ecossistema Cortex3 com motor de inteligencia e engine de comercializacao

[![CI](https://github.com/hlemos1/cortex3-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/hlemos1/cortex3-portfolio/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (SWC) |
| Estilizacao | Tailwind CSS + Typography plugin |
| Routing | React Router 7 |
| Icones | Lucide React |
| Utilitarios CSS | clsx + tailwind-merge + class-variance-authority |
| Lint | ESLint 9 + typescript-eslint |

## Quick Start

```bash
git clone https://github.com/hlemos1/cortex3-portfolio.git
cd cortex3-portfolio
npm install
npm run dev
```

## Arquitetura

```
src/
  pages/
    PortfolioDashboard.tsx          Pagina principal do dashboard
  components/
    Tooltip.tsx                     Componente de tooltip reutilizavel
  data/
    projectsSeed.ts                 Base de dados dos projetos
    verticalDefinitions.ts          Definicoes de verticais e estagios
    googleToolsRegistry.ts          Ferramentas Google por projeto
  lib/
    portfolioIntelligence.ts        Motor de insights (sinergias, riscos, gargalos)
    commercializationEngine.ts      Score de prontidao e recomendacoes
  api/                              Serverless functions
  App.tsx                           Entry point com rotas
  main.tsx                          Bootstrap React
```

## Scripts

| Comando | Acao |
|---------|------|
| `npm run dev` | Servidor de desenvolvimento (porta 5180) |
| `npm run build` | TypeScript + Vite build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview do build |

## Status

| Item | Valor |
|------|-------|
| Fase | PROD-lite |
| Testes | Nenhum |
| CI | GitHub Actions |
| Deploy | Static SPA (CDN) |

## Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuicao.
