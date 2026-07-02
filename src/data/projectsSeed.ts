import type { Project } from "@/lib/commercializationEngine";

// Seed data for all projects.
// NOTE: this file ships in the public bundle. Do NOT add revenue figures,
// partner names, deal terms or any internal business notes here.
// revenueRange is intentionally omitted (business-sensitive) — users can set
// it locally via the project editor; it stays in localStorage only.
export const PROJECTS_SEED: Omit<Project, "toolStatuses">[] = [
  // FOOD & DELIVERY
  { id: "1", name: "Grupo Rao", slug: "grupo-rao", description: "Rede de delivery multimarcas com operacao no Brasil e em Portugal.", vertical: "food", stage: "scaling", primaryUrl: "https://mundorao.com.br", country: "BR", tags: ["franquia", "delivery", "super-app"], priority: 2, archived: false },
  { id: "2", name: "Rob Food", slug: "rob-food", description: "Holding de marcas de hamburgueres.", vertical: "food", stage: "live", primaryUrl: "", country: "BR", tags: ["hamburgueres", "dark-kitchen"], priority: 1, archived: false },
  { id: "3", name: "FM&Kitchens", slug: "fm-kitchens", description: "Equipamentos para cozinhas profissionais.", vertical: "food", stage: "live", primaryUrl: "", country: "BR", tags: ["equipamentos", "b2b"], priority: 0, archived: false },
  { id: "4", name: "Hunters Cookie", slug: "hunters-cookie", description: "Marca de cookies artesanais.", vertical: "food", stage: "idea", primaryUrl: "", country: "BR", tags: ["cookies", "marca-propria"], priority: 0, archived: false },
  { id: "5", name: "Oliver's Pizza", slug: "olivers-pizza", description: "Marca parceira de pizza.", vertical: "food", stage: "mvp", primaryUrl: "", country: "BR", tags: ["pizza", "parceiro"], priority: 0, archived: false },
  { id: "6", name: "NBA Burguer", slug: "nba-burguer", description: "Marca de hamburgueres.", vertical: "food", stage: "idea", primaryUrl: "", country: "BR", tags: ["hamburgueres"], priority: 0, archived: false },
  { id: "7", name: "Cozinheiro Amador", slug: "cozinheiro-amador", description: "Livro e curso de culinaria com IA.", vertical: "content", stage: "idea", primaryUrl: "", country: "BR", tags: ["livro", "curso", "ia"], priority: 0, archived: false },
  { id: "8", name: "Delivery Sem Prejuizo", slug: "delivery-sem-prejuizo", description: "Conteudo e livro sobre delivery lucrativo.", vertical: "content", stage: "idea", primaryUrl: "", country: "BR", tags: ["livro", "conteudo"], priority: 0, archived: false },

  // TECH & SAAS
  { id: "10", name: "NaiA", slug: "naia", description: "Infraestrutura agent-ready para e-commerce.", vertical: "tech", stage: "live", primaryUrl: "https://naia.com.br", country: "BR", tags: ["ai", "e-commerce", "agent-ready"], priority: 2, archived: false },
  { id: "11", name: "Sales Brain AI", slug: "sales-brain-ai", description: "CRM com IA: pipeline visual, scoring de leads, analytics.", vertical: "tech", stage: "mvp", primaryUrl: "", country: "BR", tags: ["crm", "ia", "saas"], priority: 1, archived: false },
  { id: "12", name: "ajuda.ai", slug: "ajuda-ai", description: "Secretaria particular com IA.", vertical: "tech", stage: "idea", primaryUrl: "", country: "BR", tags: ["ia", "assistente"], priority: 0, archived: false },
  { id: "13", name: "Fundier Systems", slug: "fundier-systems", description: "Automacao e engenharia de negocios.", vertical: "tech", stage: "mvp", primaryUrl: "", country: "BR", tags: ["automacao", "metodo"], priority: 0, archived: false },
  { id: "14", name: "Cortex3", slug: "cortex3", description: "Livro + framework: empresas que pensam como redes neurais.", vertical: "tech", stage: "mvp", primaryUrl: "", country: "BR", tags: ["livro", "framework", "neural"], priority: 1, archived: false },
  { id: "15", name: "Pernin.IA", slug: "pernin-ia", description: "Projeto IA.", vertical: "tech", stage: "idea", primaryUrl: "", country: "BR", tags: ["ia"], priority: 0, archived: false },

  // RETAIL & COMMERCE
  { id: "20", name: "Peggo Market", slug: "peggo-market", description: "Marketplace e e-commerce.", vertical: "retail", stage: "mvp", primaryUrl: "", country: "BR", tags: ["marketplace", "e-commerce"], priority: 1, archived: false },
  { id: "21", name: "Rao Supply & ComEx", slug: "rao-supply", description: "Operacao de importacao e supply.", vertical: "retail", stage: "live", primaryUrl: "", country: "BR", tags: ["importacao", "china", "supply"], priority: 1, archived: false },
  { id: "22", name: "MACRO BOX", slug: "macro-box", description: "Produto/conceito de embalagem ou kit.", vertical: "retail", stage: "idea", primaryUrl: "", country: "BR", tags: ["produto"], priority: 0, archived: false },
  { id: "23", name: "Repasse360", slug: "repasse360", description: "Plataforma de repasse de negocios.", vertical: "retail", stage: "idea", primaryUrl: "", country: "BR", tags: ["marketplace", "repasse"], priority: 0, archived: false },

  // WELLNESS & HEALTH
  { id: "30", name: "Bruk Tech Wellness", slug: "bruk-tech-wellness", description: "Plataforma de bem-estar digital.", vertical: "wellness", stage: "idea", primaryUrl: "", country: "BR", tags: ["wellness", "tech"], priority: 0, archived: false },
  { id: "31", name: "The Circle", slug: "the-circle", description: "Clube de performance esportiva.", vertical: "sports", stage: "idea", primaryUrl: "", country: "BR", tags: ["clube", "esporte", "praia"], priority: 0, archived: false },
  { id: "32", name: "Dra Erika", slug: "dra-erika", description: "Projeto de saude.", vertical: "wellness", stage: "idea", primaryUrl: "", country: "BR", tags: ["saude"], priority: 0, archived: false },
  { id: "33", name: "Circle Wellness Hub", slug: "circle-wellness", description: "Hub de bem-estar.", vertical: "wellness", stage: "idea", primaryUrl: "", country: "BR", tags: ["wellness"], priority: 0, archived: false },

  // LOGISTICS
  { id: "40", name: "Last Mile", slug: "last-mile", description: "Projeto de logistica/delivery.", vertical: "logistics", stage: "idea", primaryUrl: "", country: "BR", tags: ["logistica", "delivery"], priority: 0, archived: false },
  { id: "41", name: "+1 km", slug: "mais-1km", description: "Projeto logistico.", vertical: "logistics", stage: "idea", primaryUrl: "", country: "BR", tags: ["logistica"], priority: 0, archived: false },

  // FINANCE & INVESTMENTS
  { id: "50", name: "Long View", slug: "long-view", description: "Venture institucional.", vertical: "finance", stage: "mvp", primaryUrl: "", country: "BR", tags: ["venture", "institucional"], priority: 1, archived: false },
  { id: "51", name: "Capital Sphere", slug: "capital-sphere", description: "Projeto financeiro/investimentos.", vertical: "finance", stage: "idea", primaryUrl: "", country: "BR", tags: ["financeiro"], priority: 0, archived: false },
  { id: "52", name: "Lav Hub", slug: "lav-hub", description: "Franquia de lavanderia autonoma.", vertical: "finance", stage: "mvp", primaryUrl: "", country: "BR", tags: ["franquia", "lavanderia"], priority: 1, archived: false },

  // INTERNATIONAL
  { id: "60", name: "Grupo +351", slug: "grupo-351", description: "Operacoes e portfolio em Portugal.", vertical: "international", stage: "live", primaryUrl: "", country: "PT", tags: ["portugal", "expansao"], priority: 1, archived: false },
  { id: "61", name: "Conexao LATAM", slug: "conexao-latam", description: "Plataforma de estruturacao empresarial no Paraguai.", vertical: "international", stage: "idea", primaryUrl: "", country: "PY", tags: ["paraguai", "latam"], priority: 0, archived: false },
  { id: "62", name: "Hidden USA", slug: "hidden-usa", description: "Projeto nos EUA.", vertical: "international", stage: "idea", primaryUrl: "", country: "US", tags: ["eua"], priority: 0, archived: false },
  { id: "63", name: "Rao Pt", slug: "rao-pt", description: "Operacao Rao em Portugal.", vertical: "international", stage: "live", primaryUrl: "", country: "PT", tags: ["portugal", "rao"], priority: 1, archived: false },
  { id: "64", name: "THALAMUS", slug: "thalamus", description: "Plataforma de sourcing internacional.", vertical: "international", stage: "mvp", primaryUrl: "", country: "CN", tags: ["china", "sourcing"], priority: 1, archived: false },

  // PHYSICAL PRODUCTS
  { id: "70", name: "Grid BackPack / Axis", slug: "grid-backpack", description: "Mochila com design inovador.", vertical: "product", stage: "mvp", primaryUrl: "", country: "BR", tags: ["mochila", "produto-fisico"], priority: 0, archived: false },
  { id: "71", name: "Forge & Flow 3D", slug: "forge-flow-3d", description: "Impressao 3D.", vertical: "product", stage: "idea", primaryUrl: "", country: "BR", tags: ["3d", "impressao"], priority: 0, archived: false },

  // SPORTS
  { id: "80", name: "Cortex FC", slug: "cortex-fc", description: "Sistema de analytics futebolistico com IA.", vertical: "sports", stage: "mvp", primaryUrl: "", country: "BR", tags: ["futebol", "analytics", "ia"], priority: 1, archived: false },
  { id: "81", name: "Voa Canarinho", slug: "voa-canarinho", description: "Projeto com tema patriotico.", vertical: "sports", stage: "idea", primaryUrl: "", country: "BR", tags: ["patriotico"], priority: 0, archived: false },

  // OTHER
  { id: "90", name: "Innova SA", slug: "innova-sa", description: "Empresa em estruturacao.", vertical: "other", stage: "mvp", primaryUrl: "", country: "BR", tags: ["sociedade"], priority: 0, archived: false },
  { id: "91", name: "VENHA", slug: "venha", description: "Projeto em fase de conceito.", vertical: "other", stage: "idea", primaryUrl: "", country: "BR", tags: [], priority: 0, archived: false },
  { id: "92", name: "Guard", slug: "guard", description: "Projeto de seguranca.", vertical: "other", stage: "idea", primaryUrl: "", country: "BR", tags: ["seguranca"], priority: 0, archived: false },
  { id: "93", name: "Go By Tesla", slug: "go-by-tesla", description: "Projeto de mobilidade.", vertical: "other", stage: "idea", primaryUrl: "", country: "BR", tags: ["mobilidade", "tesla"], priority: 0, archived: false },
  { id: "94", name: "Imovel Now", slug: "imovel-now", description: "Projeto imobiliario.", vertical: "real_estate", stage: "idea", primaryUrl: "", country: "BR", tags: ["imobiliario"], priority: 0, archived: false },
  { id: "95", name: "Casarao", slug: "casarao", description: "Espaco ou marca.", vertical: "real_estate", stage: "idea", primaryUrl: "", country: "BR", tags: [], priority: 0, archived: false },
  { id: "96", name: "Escola da Saidera", slug: "escola-da-saidera", description: "Projeto educacional.", vertical: "content", stage: "idea", primaryUrl: "", country: "BR", tags: ["educacao"], priority: 0, archived: false },
  { id: "97", name: "Payroll App", slug: "payroll-app", description: "App de folha de pagamento.", vertical: "tech", stage: "idea", primaryUrl: "", country: "BR", tags: ["rh", "payroll"], priority: 0, archived: false },
  { id: "98", name: "Cultura Builder", slug: "cultura-builder", description: "Cultura empresarial.", vertical: "other", stage: "idea", primaryUrl: "", country: "BR", tags: ["cultura"], priority: 0, archived: false },
];
