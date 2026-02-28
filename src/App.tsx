import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell.tsx';
import { LanguageProvider } from './components/i18n/LanguageProvider.tsx';
import HubPage from './pages/HubPage.tsx';
import BudgetPage from './pages/BudgetPage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import FindYourSharePage from './pages/FindYourSharePage.tsx';
import MethodologyPage from './pages/MethodologyPage.tsx';
import EconomyPage from './pages/EconomyPage.tsx';
import EconomyExplorePage from './pages/EconomyExplorePage.tsx';
import EconomyMethodologyPage from './pages/EconomyMethodologyPage.tsx';
import RBIPage from './pages/RBIPage.tsx';
import RBIExplorePage from './pages/RBIExplorePage.tsx';
import RBIMethodologyPage from './pages/RBIMethodologyPage.tsx';
import BudgetGlossaryPage from './pages/BudgetGlossaryPage.tsx';
import EconomyGlossaryPage from './pages/EconomyGlossaryPage.tsx';
import RBIGlossaryPage from './pages/RBIGlossaryPage.tsx';
import StatesPage from './pages/StatesPage.tsx';
import StatesExplorePage from './pages/StatesExplorePage.tsx';
import StatesMethodologyPage from './pages/StatesMethodologyPage.tsx';
import StatesGlossaryPage from './pages/StatesGlossaryPage.tsx';
import CensusPage from './pages/CensusPage.tsx';
import CensusExplorePage from './pages/CensusExplorePage.tsx';
import CensusMethodologyPage from './pages/CensusMethodologyPage.tsx';
import CensusGlossaryPage from './pages/CensusGlossaryPage.tsx';

const PAGE_ROUTES = [
  { path: '/', element: <HubPage /> },
  { path: '/budget', element: <BudgetPage /> },
  { path: '/budget/explore', element: <ExplorePage /> },
  { path: '/budget/calculator', element: <FindYourSharePage /> },
  { path: '/budget/methodology', element: <MethodologyPage /> },
  { path: '/budget/glossary', element: <BudgetGlossaryPage /> },
  { path: '/economy', element: <EconomyPage /> },
  { path: '/economy/explore', element: <EconomyExplorePage /> },
  { path: '/economy/methodology', element: <EconomyMethodologyPage /> },
  { path: '/economy/glossary', element: <EconomyGlossaryPage /> },
  { path: '/rbi', element: <RBIPage /> },
  { path: '/rbi/explore', element: <RBIExplorePage /> },
  { path: '/rbi/methodology', element: <RBIMethodologyPage /> },
  { path: '/rbi/glossary', element: <RBIGlossaryPage /> },
  { path: '/states', element: <StatesPage /> },
  { path: '/states/explore', element: <StatesExplorePage /> },
  { path: '/states/methodology', element: <StatesMethodologyPage /> },
  { path: '/states/glossary', element: <StatesGlossaryPage /> },
  { path: '/census', element: <CensusPage /> },
  { path: '/census/explore', element: <CensusExplorePage /> },
  { path: '/census/methodology', element: <CensusMethodologyPage /> },
  { path: '/census/glossary', element: <CensusGlossaryPage /> },
] as const;

// Old routes redirect to new /budget/* paths
const REDIRECTS = [
  { from: '/explore', to: '/budget/explore' },
  { from: '/calculator', to: '/budget/calculator' },
  { from: '/methodology', to: '/budget/methodology' },
] as const;

export default function App() {
  const location = useLocation();

  return (
    <PageShell>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main routes */}
            {PAGE_ROUTES.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

            {/* Backward-compatible redirects */}
            {REDIRECTS.map((r) => (
              <Route
                key={r.from}
                path={r.from}
                element={<Navigate to={r.to} replace />}
              />
            ))}

            {/* Language-prefixed routes: /hi/budget, /te/budget/explore, etc. */}
            {PAGE_ROUTES.map((r) => (
              <Route
                key={`lang-${r.path}`}
                path={`/:lang${r.path === '/' ? '' : r.path}`}
                element={r.element}
              />
            ))}
          </Routes>
        </AnimatePresence>
      </LanguageProvider>
    </PageShell>
  );
}
