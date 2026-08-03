import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import unicodeConverterImage from "../../../../attached_assets/unicode-text-converter.webp";

const ACCENT = "#00a884";

// ── Unicode conversion helpers ──────────────────────────────────────────────
function toMathFont(text: string, upOff: number, loOff: number, digOff?: number): string {
  return text.replace(/[A-Za-z0-9]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(upOff + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(loOff + code - 97);
    if (digOff && code >= 48 && code <= 57) return String.fromCodePoint(digOff + code - 48);
    return c;
  });
}

const smallCapsMap: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ",
  n: "ɴ", o: "ᴏ", p: "ᴘ", q: "q", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

function toSmallCaps(text: string): string {
  return text.split("").map(c => smallCapsMap[c.toLowerCase()] ?? c).join("");
}

function toCircled(text: string): string {
  return text.replace(/[A-Za-z0-9]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
    if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
    if (code === 48) return "⓪";
    return c;
  });
}

function toFullwidth(text: string): string {
  return text.replace(/[A-Za-z0-9 ]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0xFF21 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0xFF41 + code - 97);
    if (code >= 48 && code <= 57) return String.fromCodePoint(0xFF10 + code - 48);
    if (c === " ") return "\u3000";
    return c;
  });
}

function withCombining(text: string, comb: string): string {
  return text.split("").map(c => c === " " ? c : c + comb).join("");
}

function toStrikethrough(text: string): string { return withCombining(text, "\u0336"); }
function toUnderline(text: string): string { return withCombining(text, "\u0332"); }

function toAlt(text: string): string {
  return text.split("").map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join("");
}

function toUnicodeEscape(text: string): string {
  return text.split("").map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
}

function toHtmlEntities(text: string): string {
  return text.split("").map(c => `&#${c.charCodeAt(0)};`).join("");
}

function toBase64(text: string): string {
  try { return btoa(unescape(encodeURIComponent(text))); } catch { return ""; }
}

// ── Style definitions ────────────────────────────────────────────────────────
const STYLISH_STYLES = [
  { label: "Bold", fn: (t: string) => toMathFont(t, 0x1D400, 0x1D41A, 0x1D7CE) },
  { label: "Italic", fn: (t: string) => toMathFont(t, 0x1D434, 0x1D44E) },
  { label: "Bold Italic", fn: (t: string) => toMathFont(t, 0x1D468, 0x1D482) },
  { label: "Script", fn: (t: string) => toMathFont(t, 0x1D49C, 0x1D4B6) },
  { label: "Fraktur", fn: (t: string) => toMathFont(t, 0x1D504, 0x1D51E) },
  { label: "Monospace", fn: (t: string) => toMathFont(t, 0x1D670, 0x1D68A, 0x1D7F6) },
  { label: "Double Struck", fn: (t: string) => toMathFont(t, 0x1D538, 0x1D552, 0x1D7D8) },
  { label: "Small Caps", fn: toSmallCaps },
];

const FANCY_STYLES = [
  { label: "Circled", fn: toCircled },
  { label: "Fullwidth", fn: toFullwidth },
  { label: "Strikethrough", fn: toStrikethrough },
  { label: "Underline", fn: toUnderline },
];

const CASE_STYLES = [
  { label: "UPPERCASE", fn: (t: string) => t.toUpperCase() },
  { label: "lowercase", fn: (t: string) => t.toLowerCase() },
  { label: "Title Case", fn: (t: string) => t.replace(/\b\w/g, c => c.toUpperCase()) },
  { label: "aLtErNaTiNg", fn: toAlt },
  { label: "Inverse Case", fn: (t: string) => t.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("") },
];

const ENCODE_STYLES = [
  { label: "Unicode Escape", fn: toUnicodeEscape },
  { label: "HTML Entities", fn: toHtmlEntities },
  { label: "Base64", fn: toBase64 },
  { label: "Reverse", fn: (t: string) => t.split("").reverse().join("") },
];

// ── FAQ Schema ────────────────────────────────────────────────────────────────
const faqs = [
  { q: "Is it completely free?", a: "Yes, the Unicode Text Converter is 100% free to use with no limits or registration." },
  { q: "Will the converted text work everywhere?", a: "Most modern social media platforms support Unicode characters, so the converted text works correctly on Instagram, Facebook, Twitter/X, WhatsApp, Discord, and YouTube." },
  { q: "Do I have to install any fonts?", a: "No. The converted text uses Unicode characters rather than custom fonts, so no additional font installation is needed on any device." },
  { q: "Can I use it on mobile?", a: "Yes. The tool is fully responsive and works perfectly on smartphones and tablets." },
  { q: "How is Unicode text different from regular fonts?", a: "Unicode text uses special characters from the Unicode standard rather than changing the visual font. This means the stylized text can be copied and pasted anywhere without the recipient needing a specific font installed." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ── StyleCard component ───────────────────────────────────────────────────────
function StyleCard({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: `${label} style copied to clipboard.` });
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-2 bg-white"
      style={{ borderColor: `${ACCENT}25` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
        >
          {label}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          disabled={!value}
          className="h-7 px-2 text-xs"
          style={{ color: copied ? "#16a34a" : ACCENT }}
          data-testid={`copy-style-${label.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {copied ? <><Check className="h-3 w-3 mr-1" />Copied</> : <><Copy className="h-3 w-3 mr-1" />Copy</>}
        </Button>
      </div>
      <p
        className="text-sm break-all min-h-[24px] text-foreground leading-relaxed"
        style={{ fontFamily: "inherit" }}
      >
        {value || <span className="text-muted-foreground italic text-xs">Preview will appear here…</span>}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UnicodeConverter() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyAll = (styles: { label: string; fn: (t: string) => string }[]) => {
    const allText = styles
      .map(s => `${s.label}:\n${s.fn(input)}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText);
    toast({ title: "All styles copied!", description: "All style variations copied to clipboard." });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <SeoHead
        title="Unicode Text Converter — Stylish Fonts & Symbols"
        description="Convert normal text into stylish Unicode fonts instantly. Perfect for social media bios, YouTube titles, gaming names, and more — no font installation needed."
        canonical="https://textsinvisible.com/unicode-text-converter"
        ogTitle="Unicode Text Converter"
        ogDescription="Convert normal text into stylish Unicode fonts for social media, gaming, and more."
        schema={faqSchema}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {/* Hero + Input — two-column layout */}
        <motion.div variants={fadeIn} className="py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left: Hero Text */}
            <div className="space-y-5 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border"
                style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, borderColor: `${ACCENT}30` }}
              >
                ✦ Unicode Text Converter
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight">
                Unicode Text{" "}
                <span style={{ color: ACCENT }}>Converter</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Convert normal text into stylish Unicode fonts instantly. Perfect for social media bios,
                YouTube titles, gaming names, and more — no font installation needed.
              </p>
              <p className="text-base text-muted-foreground">
                Over{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>1,400,000</span>{" "}
                texts converted across{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>25 font styles</span>.
              </p>
            </div>

            {/* Right: Input Card */}
            <div>
              <div
                className="rounded-2xl bg-white shadow-lg overflow-hidden"
                style={{ border: `1.5px solid ${ACCENT}30` }}
              >
                <div className="p-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Step 1: Enter Your Text
                  </p>
                  <div
                    className="rounded-xl border-2 border-dashed p-3"
                    style={{ borderColor: `${ACCENT}40` }}
                  >
                    <Textarea
                      id="uc-input"
                      data-testid="textarea-uc-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your text here — all font styles update instantly…"
                      className="min-h-[130px] resize-none text-sm focus-visible:ring-0 border-0 bg-transparent p-0"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{input.length} characters</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setInput("")}
                        data-testid="button-uc-clear"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Clear
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    All {[...STYLISH_STYLES, ...FANCY_STYLES, ...CASE_STYLES, ...ENCODE_STYLES].length} font styles update as you type ↓
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* All Font Styles — auto-updates as user types */}
        <motion.div variants={fadeIn} className="max-w-6xl mx-auto border-t border-border pt-8">
          {[
            { group: "Stylish Fonts", styles: STYLISH_STYLES },
            { group: "Fancy Styles", styles: FANCY_STYLES },
            { group: "Case Styles", styles: CASE_STYLES },
            { group: "Encode / Transform", styles: ENCODE_STYLES },
          ].map(({ group, styles }) => (
            <div key={group} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>{group}</h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3"
                  style={{ borderColor: `${ACCENT}40`, color: ACCENT }}
                  onClick={() => handleCopyAll(styles)}
                  disabled={!input}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {styles.map(s => (
                  <StyleCard key={s.label} label={s.label} value={input ? s.fn(input) : ""} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* What is Unicode Converter */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">What is a Unicode Text Converter?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              This Unicode Text Converter is a simple and smart online tool that converts normal text into various stylish Unicode fonts. With its help, you can make your social media bio, YouTube title, or gaming name unique. You can also combine it with other tools like <a href="/reverse-text" className="text-primary hover:text-primary/80 transition-colors">
                Reverse Text
              </a> or <a href="/text-spacer" className="text-primary hover:text-primary/80 transition-colors">
                TextSpacer
              </a> to create more creative and unique results.
            </p>
            <p>
              It uses different Unicode characters from the Unicode standard, so the converted text can be copied and pasted
              anywhere — no additional font installation is required, and it is supported on social media natively.
            </p>
            <ul className="space-y-2 pl-1">
              {["Copy-paste is possible on any platform.", "Native support on social media.", "No additional font installation required."].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: ACCENT }}
                  >✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Salient Features */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">Salient Features of This Tool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: "Simple and Clean Design",
                desc: "A modern, professional look with a clean interface that provides a comfortable user experience.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
              {
                title: "Instant Text Conversion",
                desc: "Type text in the input box and different styles are generated immediately — no button needed.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
              {
                title: "Multiple Style Tabs",
                desc: "Stylish, Fancy, Case, and Encode tabs give you dozens of ways to transform your text.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
              {
                title: "Copy All Styles Button",
                desc: "Copy all style variations with a single click — saves time and improves user experience.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
              {
                title: "Case and Encode Options",
                desc: "Convert to Uppercase, Lowercase, Title Case, or encode to HTML Entities, Unicode Escape, and Base64.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
              {
                title: "Character Counter",
                desc: "A live character count is displayed below the input box, helpful for social media character limits.",
                bg: "rgb(239, 246, 255)",
                border: "rgb(191, 219, 254)",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border p-5 space-y-1 transition-shadow duration-300 hover:shadow-sm" style={{ backgroundColor: item.bg, borderColor: item.border }}>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">How to Use Unicode Text Converter</h2>
          <p className="text-muted-foreground leading-relaxed">This tool is extremely easy to use:</p>
          <div className="space-y-5">
            {[
              { n: 1, title: "Type Your Text", desc: "Enter or paste your text into the input box at the top of the tool." },
              { n: 2, title: "See Instant Results", desc: "Different styles will automatically appear in the tabs below as you type. Switch between Stylish, Fancy, Case, and Encode tabs to explore all options." },
              { n: 3, title: "Click Copy", desc: "Click the Copy button next to the style you want to use." },
              { n: 4, title: "Paste Anywhere", desc: "Paste the copied text on Facebook, Instagram, Twitter/X, YouTube, WhatsApp or any platform. It will display in the stylized Unicode format without needing a font." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step.n}
                </div>
                <div className="pt-1 space-y-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Unicode Converter Image Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-8">
          <img
            src={unicodeConverterImage}
            alt="Unicode Text Converter - Code Text Converter"
            className="w-full h-auto rounded-2xl shadow-lg border border-border"
            loading="lazy"
          />
        </motion.div>

        {/* Styles Explained */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Stylish Tab — Available Styles</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Stylish tab contains the most popular Unicode math font styles. Here is a preview of each:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: ACCENT }}>
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">Style</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Preview (Hello)</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { style: "Bold", preview: "𝐇𝐞𝐥𝐥𝐨", best: "Headings, emphasis" },
                  { style: "Italic", preview: "𝐻𝑒𝑙𝑙𝑜", best: "Elegant bios, quotes" },
                  { style: "Bold Italic", preview: "𝑯𝒆𝒍𝒍𝒐", best: "Strong, stylish emphasis" },
                  { style: "Script", preview: "𝒽𝑒𝓁𝓁𝑜", best: "Creative, artistic text" },
                  { style: "Fraktur", preview: "𝔥𝔢𝔩𝔩𝔬", best: "Gothic, vintage feel" },
                  { style: "Monospace", preview: "𝚑𝚎𝚕𝚕𝚘", best: "Code-like, technical text" },
                  { style: "Double Struck", preview: "𝕙𝕖𝕝𝕝𝕠", best: "Math-style, unique bios" },
                  { style: "Small Caps", preview: "ʜᴇʟʟᴏ", best: "Subtle uppercase look" },
                ].map((row, i) => (
                  <tr key={row.style} className={`border-t border-border ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{row.style}</td>
                    <td className="px-4 py-3 text-foreground font-medium" style={{ fontSize: "1rem" }}>{row.preview}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Who Is This For */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Who Is This Tool Useful For?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Social Media Users", "Content Creators", "YouTubers", "Bloggers", "Web Developers", "Gamers", "Digital Marketers", "Students"].map((user) => (
              <div
                key={user}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-center"
                style={{ borderColor: `${ACCENT}30`, color: ACCENT, backgroundColor: `${ACCENT}08` }}
              >
                {user}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best for Social Media */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Best for Social Media</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unicode styled text is not a normal font — it uses special Unicode characters, so it is universally compatible:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { platform: "Instagram Bio", desc: "Works in Instagram Bio and profile name." },
              { platform: "Facebook Posts", desc: "Appears correctly in Facebook posts and comments." },
              { platform: "YouTube Titles", desc: "Can be used in YouTube video titles and descriptions." },
              { platform: "WhatsApp Status", desc: "Also supported in WhatsApp Status and messages." },
            ].map((item) => (
              <div key={item.platform} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: ACCENT }}
                >✓</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.platform}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Why Choose Our Unicode Converter?</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Fast, instant results with no page reload", "Clean and easy-to-use interface", "One-click copy for each style", "Multiple style options across 4 tabs", "Mobile and desktop friendly", "Completely free — no registration needed"].map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: ACCENT }}
                >✓</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border faq-item rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-uc-${i}`}
                >
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-blue-200 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Words */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-12 space-y-4">
          <h2 className="text-3xl font-display font-bold">Final Words</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you want to make your text look special, this Unicode Text Converter is the perfect solution for you. Just type your text and get stylish results — in a matter of seconds. Whether you are crafting a social media bio, designing a <a href="/free-fire-text" className="text-primary hover:text-primary/80 transition-colors">
              gaming username
            </a>, or experimenting with different text styles, this tool has everything you need. For even more flexibility, you can combine stylish Unicode text with <a href="/" className="text-primary hover:text-primary/80 transition-colors">
              invisible blank space
            </a> to create cleaner layouts, unique spacing, or subtle design effects. Try it now and make your words truly stand out.
          </p>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
