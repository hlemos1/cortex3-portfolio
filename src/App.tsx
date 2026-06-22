import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import EditoraHome from "./pages/EditoraHome";
import CatalogoPage from "./pages/CatalogoPage";
import ObraPage from "./pages/ObraPage";
import AutorPage from "./pages/AutorPage";

// Dashboard interno: contem dados de portfolio que NAO podem ser publicos.
// Em producao, import.meta.env.DEV vira `false` e o Vite elimina este ramo
// (dead-code) — o componente e seus dados nao entram no bundle servido no CDN.
// /interno so existe rodando local em modo dev.
const InternoDashboard = import.meta.env.DEV
  ? lazy(() => import("./pages/PortfolioDashboard"))
  : null;

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Editora Cortex3 — publico */}
      <Route path="/" element={<EditoraHome />} />
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="/livros/:slug" element={<ObraPage />} />
      <Route path="/autor" element={<AutorPage />} />

      {/* Dashboard interno — apenas em desenvolvimento */}
      {InternoDashboard && (
        <Route
          path="/interno"
          element={
            <Suspense fallback={null}>
              <InternoDashboard />
            </Suspense>
          }
        />
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
