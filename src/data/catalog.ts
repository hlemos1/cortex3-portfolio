// Catalogo da Editora Cortex3 — obras de Henrique Lemos.
// Fonte da verdade do conteudo publico: livros, ebooks, papers e teses.
// Manuscritos vivem em agentes/agents/ghost/books/. Aqui fica o metadado de vitrine.

export type ObraTipo = "livro" | "ebook" | "paper" | "tese";

export type ObraStatus =
  | "publicado" // disponivel para compra/download
  | "em-breve" // anunciado, sem link ainda
  | "em-producao"; // em pipeline editorial

export interface Obra {
  slug: string;
  tipo: ObraTipo;
  titulo: string;
  subtitulo: string;
  /** Paragrafo de gancho para card e topo da pagina da obra. */
  resumo: string;
  /** Descricao completa (blurb), paragrafos separados por \n\n. */
  descricao: string;
  /** Bullets do que o leitor encontra. */
  destaques: string[];
  status: ObraStatus;
  palavras?: number;
  /** Acento de cor da capa gerada (classe gradiente Tailwind). */
  capaGradiente: string;
  /** Links externos quando publicado. */
  links?: {
    amazon?: string;
    pdf?: string;
    lead?: string;
  };
  tags: string[];
  /** Ordem de exibicao; menor primeiro. */
  ordem: number;
}

export const AUTOR = {
  nome: "Henrique Lemos",
  papel: "Empresario, engenheiro de negocios e fundador do ecossistema Cortex3",
  bio:
    "Saiu das categorias de base do Vasco e do Bangu para um subsolo em Botafogo com R$40 mil emprestados. " +
    "Construiu um grupo de R$250 milhoes em food service e, depois, um ecossistema de inteligencia artificial aplicada a negocios. " +
    "Escreve sobre o que operou: sociedade familiar, importacao, saida do gargalo, IA como infraestrutura e empresas como redes neurais.",
  // TODO(henrique): confirmar a URL exata do perfil.
  linkedin: "https://www.linkedin.com/in/henrique-lemos/",
};

export const EDITORA = {
  nome: "Editora Cortex3",
  tagline: "Conhecimento operacional de quem construiu, nao de quem opina.",
  descricao:
    "A casa editorial do ecossistema Cortex3. Livros, ebooks, papers e teses sobre " +
    "negocios, inteligencia artificial e a engenharia de construir empresas que pensam como redes neurais.",
};

export const catalog: Obra[] = [
  {
    slug: "ia-com-metodo",
    tipo: "livro",
    titulo: "IA com Metodo",
    subtitulo:
      "Como montar seu sistema de inteligencia artificial gastando menos que um estagiario — e produzindo mais que uma equipe inteira",
    resumo:
      "Voce paga por ChatGPT, Claude e mais 5 ferramentas. Usa 5% de cada uma. Este livro ensina a transformar assinaturas soltas num sistema cognitivo operacional.",
    descricao:
      "Voce paga por ChatGPT, Claude e mais 5 ferramentas de IA. Usa 5% de cada uma. Faz perguntas, copia respostas e acha que esta usando IA.\n\n" +
      "Nao esta.\n\n" +
      "Este livro ensina o que ninguem ensina: como transformar um conjunto de assinaturas num sistema cognitivo operacional. Um sistema que pensa com voce, lembra o que voce decidiu, executa o que voce mandou e aprende com cada interacao.\n\n" +
      "Henrique Lemos operou 60 projetos simultaneos sem equipe de tecnologia, sem agencia e sem consultoria. Com um sistema de IA que custava menos de US$1.000 por mes — fazendo o trabalho equivalente a uma equipe de R$50.000.\n\n" +
      "Nao e livro de prompts. Nao e tutorial generico. E o metodo que transformou um empresario sem formacao em tecnologia num operador de sistema cognitivo.",
    destaques: [
      "O que sao tokens e por que entender isso muda quanto voce paga",
      "O ecossistema de IA em 7 camadas — e qual camada resolve seu problema",
      "ChatGPT vs Claude vs Gemini: quando usar cada um",
      "Como montar fluxos entre ferramentas que produzem sozinhos",
      "A lei inviolavel: Bots, Agentes e Clones — e por que nao pular fase",
      "O plano de R$50/mes que cobre 60% das suas necessidades",
    ],
    status: "em-producao",
    palavras: 22921,
    capaGradiente: "from-sky-500 via-cyan-500 to-emerald-500",
    tags: ["Inteligencia Artificial", "Produtividade", "Negocios"],
    ordem: 1,
  },
  {
    slug: "o-preco-do-hipotalamo",
    tipo: "livro",
    titulo: "O Preco do Hipotalamo",
    subtitulo: "Como sair do centro do proprio negocio sem destruir o que voce construiu",
    resumo:
      "Voce faturou milhoes e nao consegue tirar duas semanas de ferias sem o telefone tocar. O problema nao e sua equipe. E voce.",
    descricao:
      "Voce faturou R$5 milhoes. Ou R$50 milhoes. Ou R$250 milhoes. E nao consegue tirar 2 semanas de ferias sem o telefone tocar.\n\n" +
      "O problema nao e sua equipe. O problema e voce.\n\n" +
      "Henrique Lemos operou 60 projetos simultaneos sendo o ponto de decisao de todos. Marcou 17 de 20 num teste de dependencia que ele mesmo criou. Calculou que o custo de ser gargalo era R$792.000 por ano em oportunidades perdidas — sem contar saude, relacionamento e presenca com as filhas.\n\n" +
      "Este livro documenta o processo real — com numeros, erros e metricas — de como um fundador sai do centro operacional da empresa sem perder controle.",
    destaques: [
      "O Mapa da Dependencia: 20 perguntas que medem quanto voce e gargalo",
      "O custo invisivel de ser insubstituivel (a conta que nao aparece no DRE)",
      "A ordem da saida: documentar, criar criterios, delegar, monitorar",
      "Matriz de Autonomia: o que sua equipe pode decidir sozinha",
      "Por que monitorar resultado e nao processo liberta fundador e equipe",
    ],
    status: "em-producao",
    palavras: 5370,
    capaGradiente: "from-violet-500 via-purple-500 to-fuchsia-500",
    tags: ["Lideranca", "Gestao", "Founder"],
    ordem: 2,
  },
  {
    slug: "a-rede-familiar",
    tipo: "livro",
    titulo: "A Rede Familiar",
    subtitulo: "Como dois irmaos construiram R$250 milhoes — e o que quase destruiu a parceria",
    resumo:
      "70% das empresas brasileiras sao familiares. A maioria comeca com dinheiro emprestado e regras nao escritas — e morre exatamente por isso.",
    descricao:
      "70% das empresas brasileiras sao familiares. A maioria comeca com dinheiro emprestado, confianca implicita e regras nao escritas. E a maioria morre exatamente por isso.\n\n" +
      "Este livro nao e teoria de governanca corporativa. E o relato real de 13 anos de sociedade entre dois irmaos — Henrique e Guilherme Lemos — que construiram um grupo de R$250 milhoes a partir de R$40 mil emprestados da sogra.\n\n" +
      "Com tudo que funcionou. E tudo que quase destruiu.",
    destaques: [
      "As 3 armadilhas universais da sociedade familiar",
      "A zona cinzenta: onde mora 80% dos conflitos entre socios familiares",
      "Os 3 momentos criticos que testam qualquer parceria",
      "As 7 regras nao escritas que deveriam ser escritas",
      "Governanca sem burocracia: o minimo viavel que protege a relacao",
    ],
    status: "em-producao",
    palavras: 3003,
    capaGradiente: "from-amber-500 via-orange-500 to-red-500",
    tags: ["Empresa Familiar", "Sociedade", "Governanca"],
    ordem: 3,
  },
  {
    slug: "do-campo-ao-conselho",
    tipo: "livro",
    titulo: "Do Campo ao Conselho",
    subtitulo:
      "O que o futebol ensinou sobre construir negocios — e o que os negocios ensinaram sobre pensar futebol",
    resumo:
      "Um ex-jogador das categorias de base do Vasco e do Bangu que construiu um grupo de R$250 milhoes — e depois criou um framework de IA para analytics de futebol.",
    descricao:
      "Um ex-jogador das categorias de base do Vasco e do Bangu que construiu um grupo de R$250 milhoes. E depois criou um framework de inteligencia artificial para analytics de futebol.\n\n" +
      "Este nao e livro sobre futebol. E sobre como a mentalidade de atleta se transforma em mentalidade de construtor — e como os dois mundos se retroalimentam.\n\n" +
      "Henrique Lemos saiu do campo sem saber o que era. Entrou num subsolo de Botafogo com R$40 mil emprestados e saiu com uma operacao de 200+ unidades. Depois voltou pro futebol — dessa vez com dados, com IA e com um framework que nenhum clube usa ainda.",
    destaques: [
      "A traducao: 5 habilidades do esporte que valem mais que MBA",
      "A cozinha como plataforma: o insight que multiplicou receita por 5",
      "Empresa como rede neural: o framework que funciona em qualquer dominio",
      "Cortex FC: como medir a qualidade da rede de um time",
      "Os indices Vx e Rx: valor e rendimento quantificados",
    ],
    status: "em-producao",
    palavras: 4070,
    capaGradiente: "from-emerald-500 via-teal-500 to-cyan-500",
    tags: ["Futebol", "Negocios", "Analytics"],
    ordem: 4,
  },
  {
    slug: "missao-china",
    tipo: "ebook",
    titulo: "Missao China",
    subtitulo: "O metodo completo para empresarios brasileiros importarem direto da fabrica",
    resumo:
      "A embalagem que voce paga R$1,50 custa US$0,03 na fabrica. A diferenca e margem de intermediario — e voce paga porque nao sabe chegar na fonte.",
    descricao:
      "A embalagem que voce paga R$1,50 custa US$0,03 na fabrica. O utensilio de R$45 custa US$3,80. O equipamento de R$2.800 custa US$180.\n\n" +
      "A diferenca e margem de intermediario. E voce paga porque nao sabe chegar na fonte.\n\n" +
      "Henrique Lemos opera 200+ unidades de food service e importa direto da China ha anos. Neste ebook, ele documenta o metodo completo: de ficha tecnica a Canton Fair, de negociacao a desembaraco, de primeiro pedido a operacao de sourcing.",
    destaques: [
      "O mapa da cadeia: os 7 elos entre a fabrica e voce (e quais eliminar)",
      "Ficha tecnica: o documento mais importante da importacao",
      "Canton Fair: como operar na maior feira do mundo (roteiro de 5 dias)",
      "Negociacao na China: os 5 instrumentos que reduzem preco",
      "Impostos reais: a conta completa de nacionalizacao",
    ],
    status: "em-producao",
    palavras: 4550,
    capaGradiente: "from-red-500 via-rose-500 to-orange-500",
    tags: ["Importacao", "China", "Sourcing"],
    ordem: 5,
  },
];

export function getObra(slug: string): Obra | undefined {
  return catalog.find((o) => o.slug === slug);
}

export const TIPO_LABEL: Record<ObraTipo, string> = {
  livro: "Livro",
  ebook: "E-book",
  paper: "Paper",
  tese: "Tese",
};

export const STATUS_LABEL: Record<ObraStatus, string> = {
  publicado: "Disponivel",
  "em-breve": "Em breve",
  "em-producao": "Em producao",
};
