import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  categories: Array<{ id: number; slug: string; name: string }>;
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm font-medium text-center">
        Impacto News - Informação que Transforma
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">📰</span>
          </div>
          <span className="hidden sm:inline font-bold text-xl text-foreground">
            Impacto News
          </span>
        </Link>

        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="w-full max-w-sm relative">
            <input
              type="text"
              placeholder="Buscar notícias..."
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === `/categoria/${cat.slug}`
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === `/categoria/${cat.slug}`
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
