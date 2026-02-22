import { Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell.tsx';
import HomePage from './pages/HomePage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import FindYourSharePage from './pages/FindYourSharePage.tsx';
import MethodologyPage from './pages/MethodologyPage.tsx';

export default function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/calculator" element={<FindYourSharePage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
      </Routes>
    </PageShell>
  );
}
