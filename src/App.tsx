import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell.tsx';
import { LanguageProvider } from './components/i18n/LanguageProvider.tsx';
import HomePage from './pages/HomePage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import FindYourSharePage from './pages/FindYourSharePage.tsx';
import MethodologyPage from './pages/MethodologyPage.tsx';

const PAGE_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/calculator', element: <FindYourSharePage /> },
  { path: '/methodology', element: <MethodologyPage /> },
] as const;

export default function App() {
  const location = useLocation();

  return (
    <PageShell>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Default (English) routes */}
            {PAGE_ROUTES.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {/* Language-prefixed routes: /hi/explore, /te/calculator, etc. */}
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
