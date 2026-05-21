import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Ghost, Menu, X, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Invisible Text" },
    { href: "/free-fire-text", label: "FF Invisible Text" },
    { href: "/mirror-text-generator", label: "Mirror Text" },
    { href: "/reverse-text", label: "Reverse Text" },
    { href: "/unicode-text-converter", label: "Unicode Converter" },
    { href: "/text-spacer", label: "TextSpacer" },
    { href: "/blogs", label: "Blogs" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-[#00a884] from-primary to-accent rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <EyeOff className="h-5 w-5 transition-colors text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Invisible<span className="text-primary">Text</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <Button variant="default" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
