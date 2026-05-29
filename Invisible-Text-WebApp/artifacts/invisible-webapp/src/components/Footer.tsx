import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-4">
            <div className="font-display font-bold text-lg">
              <Link href="/" className="hover:text-primary transition-colors">Invisible<span className="text-primary">Text</span></Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create blank spaces, empty messages, and invisible characters for your social media profiles and chats.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Invisible Text</Link></li>
              <li><Link href="/free-fire-text" className="hover:text-primary transition-colors">FF Invisible Text</Link></li>
              <li><Link href="/unicode-text-converter" className="hover:text-primary transition-colors">Unicode Converter</Link></li>
              <li><Link href="/reverse-text" className="hover:text-primary transition-colors">Reverse Text</Link></li>
              <li><Link href="/mirror-text-generator" className="hover:text-primary transition-colors">Mirror Text</Link></li>
              <li><Link href="/text-spacer" className="hover:text-primary transition-colors">TextSpacer</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex justify-center items-center text-xs text-muted-foreground">
          <p className="text-center">&copy; {currentYear} InvisibleText. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
