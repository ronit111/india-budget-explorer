import type { ReactNode } from 'react';
import { Header } from './Header.tsx';
import { MobileNav } from './MobileNav.tsx';
import { Footer } from './Footer.tsx';
import { SearchOverlay } from '../ui/SearchOverlay.tsx';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchOverlay />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
