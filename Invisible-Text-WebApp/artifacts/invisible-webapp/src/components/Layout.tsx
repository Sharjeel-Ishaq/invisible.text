import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none -z-10" />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 max-w-7xl animate-in fade-in duration-500">
        {children}
      </main>
      <Footer />
    </div>
  );
}
