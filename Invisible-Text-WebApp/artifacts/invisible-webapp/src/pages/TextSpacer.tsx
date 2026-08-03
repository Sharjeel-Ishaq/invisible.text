import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Trash2, AlignVerticalSpaceAround, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import textSpacerImage from "../../../../attached_assets/text-spacer.webp";

const ACCENT = "#00a884";
const INSTAGRAM_LIMIT = 2200;
const BLANK_LINE_CHAR = "\u2800";

// ── Font Style Transformations ────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lower = "abcdefghijklmnopqrstuvwxyz".split("");

function buildMap(start: number, lowerStart: number): Record<string, string> {
  const map: Record<string, string> = {};
  ALPHABET.forEach((c, i) => (map[c] = String.fromCodePoint(start + i)));
  lower.forEach((c, i) => (map[c] = String.fromCodePoint(lowerStart + i)));
  return map;
}

const BOLD_MAP = buildMap(0x1d400, 0x1d41a);
const ITALIC_MAP: Record<string, string> = (() => {
  const m = buildMap(0x1d434, 0x1d44e);
  m["h"] = "\u210e";
  return m;
})();
const SCRIPT_MAP: Record<string, string> = (() => {
  const m = buildMap(0x1d49c, 0x1d4b6);
  const overrides: Record<string, string> = {
    B: "\u212c", E: "\u2130", F: "\u2131", H: "\u210b", I: "\u2110",
    L: "\u2112", M: "\u2133", R: "\u211b", e: "\u212f", g: "\u210a", o: "\u2134",
  };
  Object.assign(m, overrides);
  return m;
})();
const DOUBLE_MAP: Record<string, string> = (() => {
  const m = buildMap(0x1d538, 0x1d552);
  const overrides: Record<string, string> = {
    C: "\u2102", H: "\u210d", N: "\u2115", P: "\u2119", Q: "\u211a", R: "\u211d", Z: "\u2124",
  };
  Object.assign(m, overrides);
  return m;
})();
const MONO_MAP = buildMap(0x1d670, 0x1d68a);
const SANS_MAP = buildMap(0x1d5a0, 0x1d5ba);

function applyMap(text: string, map: Record<string, string>): string {
  let out = "";
  for (const ch of text) out += map[ch] ?? ch;
  return out;
}

function applyUnderline(text: string): string {
  let out = "";
  for (const ch of text) out += ch + (ch === "\n" || ch === " " ? "" : "\u0332");
  return out;
}

type StyleKey = "normal" | "bold" | "italic" | "script" | "double" | "mono" | "sans" | "underline";
type SpacingKey = "none" | "single" | "wide" | "extra-wide" | "dots";

const SPACING_OPTIONS: { key: SpacingKey; label: string; char: string }[] = [
  { key: "none", label: "None", char: "" },
  { key: "single", label: "Single", char: " " },
  { key: "wide", label: "Wide", char: "  " },
  { key: "extra-wide", label: "Extra Wide", char: "   " },
  { key: "dots", label: "Dots", char: " . " },
];


const STYLE_OPTIONS: { key: StyleKey; label: string; preview: string }[] = [
  { key: "normal", label: "Normal", preview: "Aa" },
  { key: "bold", label: "Bold", preview: "𝐀𝐚" },
  { key: "italic", label: "Italic", preview: "𝐴𝑎" },
  { key: "script", label: "Script", preview: "𝒜𝒶" },
  { key: "double", label: "Double", preview: "𝔸𝕒" },
  { key: "mono", label: "Mono", preview: "𝙰𝚊" },
  { key: "sans", label: "Sans", preview: "𝖠𝖺" },
  { key: "underline", label: "Underline", preview: "A̲a̲" },
];

function transformLine(line: string, style: StyleKey): string {
  switch (style) {
    case "bold": return applyMap(line, BOLD_MAP);
    case "italic": return applyMap(line, ITALIC_MAP);
    case "script": return applyMap(line, SCRIPT_MAP);
    case "double": return applyMap(line, DOUBLE_MAP);
    case "mono": return applyMap(line, MONO_MAP);
    case "sans": return applyMap(line, SANS_MAP);
    case "underline": return applyUnderline(line);
    default: return line;
  }
}

// ── Page Content ─────────────────────────────────────────────────────────────

const faqs = [
  { q: "Does TextSpacer work on Instagram?", a: "Yes — it is specially designed for Instagram captions and bios. The invisible characters keep your line breaks intact when you paste the text." },
  { q: "Are the spaces visible?", a: "No. The tool inserts invisible Unicode characters (Braille Pattern Blank U+2800) that look completely empty but are recognized as valid characters by social media apps." },
  { q: "Is TextSpacer free to use?", a: "Yes, completely free. There is no signup, no registration, and no usage limit." },
  { q: "Can I use it on mobile?", a: "Yes. The tool is fully responsive and works perfectly on Android and iOS devices." },
  { q: "Does it work on Facebook and TikTok?", a: "Yes. The same technique works on Facebook, TikTok, WhatsApp, Threads, and most other social platforms that support Unicode." },
  { q: "Will my text or formatting change?", a: "No. Your original words, punctuation, emojis, and paragraph structure remain exactly as you typed them — only blank lines are filled with an invisible character (and styled letters are swapped if you pick a font style)." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const features = [
  { title: "Add Line Breaks for Instagram", description: "Insert invisible Unicode spacing so your captions and bios keep paragraph breaks when posted.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
  { title: "Maintain Spacing in Bios & Comments", description: "Stop Instagram and Facebook from collapsing your text into a single block.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
  { title: "Stylish Unicode Fonts", description: "Bold, Italic, Script, Double-struck, Monospace, Sans-serif, and Underline — convert your spaced text in one click.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
  { title: "One-Click Copy", description: "Copy the spaced version of your text to the clipboard with a single tap, ready to paste.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
  { title: "Works On All Devices", description: "Fully responsive design — works on phones, tablets, and desktops without any installation.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
  { title: "No Login Required", description: "Free to use forever with no signup, no account, and no tracking of your text.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
];

const useCases = [
  { title: "Instagram Captions", desc: "Format long captions with clean paragraphs that keep their line breaks after posting." },
  { title: "Instagram Bio Spacing", desc: "Stack bio lines neatly instead of seeing them collapse into one cramped row." },
  { title: "TikTok Captions", desc: "Make TikTok descriptions easier to read by adding visible structure and breathing room." },
  { title: "Facebook Posts", desc: "Improve engagement with well-spaced posts that readers can quickly scan." },
  { title: "WhatsApp Messages", desc: "Send neatly formatted messages, statuses, or broadcasts with proper line breaks." },
  {
    title: "Stylish Text Formatting",
    desc: (
      <>
        Combine spacing with{" "}
        <a href="/unicode-text-converter" className="text-primary hover:text-primary/80 transition-colors">
          Unicode fonts
        </a>{" "}
        for unique, eye-catching content. You can also mirror styled lines using the <a href="/mirror-text-generator" className="text-primary hover:text-primary/80 transition-colors">Mirror Text</a> tool to create reflective effects.
      </>
    ),
  },
];

export default function TextSpacer() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [style, setStyle] = useState<StyleKey>("normal");
  const [spacing, setSpacing] = useState<SpacingKey>("none");

  const charCount = input.length;
  const outputCharCount = output.length;
  const remaining = useMemo(() => INSTAGRAM_LIMIT - outputCharCount, [outputCharCount]);
  const overLimit = remaining < 0;

  const generate = () => {
    if (!input.trim()) {
      toast({ title: "Nothing to space", description: "Type or paste some text first.", variant: "destructive" });
      return;
    }
    const lines = input.split(/\r?\n/);
    const spaced = lines
      .map((line) => {
        if (line.trim() === "") return BLANK_LINE_CHAR;
        const styled = transformLine(line, style);
        const spacingChar = SPACING_OPTIONS.find(s => s.key === spacing)?.char || "";
        if (!spacingChar) return styled;
        return styled.split("").join(spacingChar);
      })
      .join("\n");
    setOutput(spaced);
    toast({ title: "Spaced Text Ready!", description: "Your text now keeps its line breaks on Instagram and other apps." });
  };

  // Re-apply automatically when style changes (if there is already an output)
  useEffect(() => {
    if (!input.trim() || !output) return;
    const lines = input.split(/\r?\n/);
    const spaced = lines
      .map((line) => {
        if (line.trim() === "") return BLANK_LINE_CHAR;
        const styled = transformLine(line, style);
        const spacingChar = SPACING_OPTIONS.find(s => s.key === spacing)?.char || "";
        if (!spacingChar) return styled;
        return styled.split("").join(spacingChar);
      })
      .join("\n");
    setOutput(spaced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, spacing]);



  const clear = () => {
    setInput("");
    setOutput("");
    toast({ title: "Cleared", description: "Input and output have been reset." });
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: "Copied!", description: "Paste it directly into Instagram, Facebook, or any app." });
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <SeoHead
        title="TextSpacer — Instagram Line Break & Spacing Fixer"
        description="Create perfect line breaks for Instagram captions, bios, and comments. Fix spacing issues instantly using our TextSpacer tool. Paste your text and generate formatted spacing."
        canonical="https://textsinvisible.com/text-spacer"
        ogTitle="TextSpacer — Instagram Line Break & Spacing Fixer"
        ogDescription="Add spacing to Instagram captions and bios to keep your formatting intact."
        schema={faqSchema}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {/* Hero + Tool — two-column layout */}
        <motion.div variants={fadeIn} className="py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left: Hero Text */}
            <div className="space-y-5 text-center lg:text-left lg:pt-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border"
                style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, borderColor: `${ACCENT}30` }}
              >
                <AlignVerticalSpaceAround className="h-4 w-4" /> Instagram Line Breaker
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight">
                Text Spacer —{" "}
                <span style={{ color: ACCENT }}>Line Breaks &amp; Spaces</span>{" "}
                for Instagram
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Create perfect line breaks for Instagram captions, bios, and comments. Fix spacing
                issues instantly — paste your text, pick a font style, and generate properly spaced
                output ready to paste anywhere.
              </p>
              <p className="text-base text-muted-foreground">
                Trusted by{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>500,000+</span>{" "}
                creators across{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>8 font styles</span>.
              </p>
            </div>

            {/* Right: Tool Card */}
            <div>
              <div
                className="rounded-2xl bg-white shadow-lg overflow-hidden"
                style={{ border: `1.5px solid ${ACCENT}30` }}
              >
                <div className="p-6 space-y-5">

                  {/* Step 1 */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Step 1: Paste Your Text
                    </p>
                    <div
                      className="rounded-xl border-2 border-dashed p-3"
                      style={{ borderColor: `${ACCENT}40` }}
                    >
                      <Textarea
                        id="ts-input"
                        data-testid="textarea-ts-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste or type your caption here..."
                        className="min-h-[120px] resize-none text-sm focus-visible:ring-0 border-0 bg-transparent p-0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{charCount} characters</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Step 2: Style &amp; Spacing (Optional)
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {STYLE_OPTIONS.map((opt) => {
                        const active = style === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setStyle(opt.key)}
                            data-testid={`style-${opt.key}`}
                            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-xs font-medium transition-all"
                            style={{
                              backgroundColor: active ? ACCENT : "#fff",
                              color: active ? "#fff" : "#374151",
                              borderColor: active ? ACCENT : "#e5e7eb",
                            }}
                          >
                            <span className="text-base leading-none">{opt.preview}</span>
                            <span className="text-[10px] uppercase tracking-wide">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {SPACING_OPTIONS.map((opt) => {
                        const active = spacing === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSpacing(opt.key)}
                            data-testid={`spacing-${opt.key}`}
                            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-[11px] font-medium transition-all"
                            style={{
                              backgroundColor: active ? ACCENT : "#fff",
                              color: active ? "#fff" : "#374151",
                              borderColor: active ? ACCENT : "#e5e7eb",
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Step 3: Generate &amp; Copy
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        data-testid="button-ts-generate"
                        onClick={generate}
                        className="text-white"
                        style={{ backgroundColor: ACCENT }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#019270")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" /> Generate
                      </Button>
                      <Button
                        data-testid="button-ts-clear"
                        onClick={clear}
                        variant="outline"
                        style={{ borderColor: "#e5e5e5" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = ACCENT;
                          e.currentTarget.style.backgroundColor = `${ACCENT}15`;
                          e.currentTarget.style.color = ACCENT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e5e5";
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "inherit";
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                      </Button>
                    </div>
                    <Textarea
                      id="ts-output"
                      data-testid="textarea-ts-output"
                      readOnly
                      value={output}
                      placeholder='Output appears here — ready to paste into Instagram…'
                      className="min-h-[100px] resize-none text-sm bg-muted/20"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        <strong>{outputCharCount}</strong> / {INSTAGRAM_LIMIT} chars
                      </span>
                      <span className="font-semibold" style={{ color: overLimit ? "#dc2626" : ACCENT }}>
                        {overLimit ? `Over by ${Math.abs(remaining)}` : `${remaining} remaining`}
                      </span>
                    </div>
                    <Button
                      data-testid="button-ts-copy"
                      onClick={handleCopy}
                      disabled={!output}
                      className="w-full text-white"
                      size="lg"
                      style={{ backgroundColor: copied ? "#16a34a" : ACCENT }}
                      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.backgroundColor = "#019270"; }}
                      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.backgroundColor = ACCENT; }}
                    >
                      {copied ? (
                        <><Check className="mr-2 h-4 w-4" /> Copied!</>
                      ) : (
                        <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>
                      )}
                    </Button>
                    {output && (
                      <div
                        className="rounded-xl p-4 border bg-white text-sm whitespace-pre-wrap leading-relaxed"
                        style={{ borderColor: `${ACCENT}30` }}
                      >
                        {output}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Tool Description */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto space-y-4 text-muted-foreground leading-relaxed pt-8 border-t border-border">
          <p>
            You can&apos;t always add proper spacing or line breaks on Instagram. Even if you press
            <strong className="text-foreground"> &ldquo;Enter&rdquo;</strong>, your caption may appear as one block of text.
            That&apos;s where <strong className="text-foreground">TextSpacer</strong> helps.
          </p>
          <p>
            This tool automatically adds invisible Unicode characters to your text so that line breaks and
            spaces stay intact when pasted into Instagram, Facebook, or other apps. Whether you are writing
            captions, bios, or comments, TextSpacer ensures your text looks clean, readable, and professional.
          </p>
        </motion.div>


        {/* What is TextSpacer */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">What is TextSpacer?</h2>
          <p className="text-muted-foreground leading-relaxed">
            TextSpacer is a free online tool that helps users add <a href="/" className="text-primary hover:text-primary/80 transition-colors">
              invisible spacing
            </a> and line breaks to their
            text. It is most commonly used for <strong className="text-foreground">Instagram captions</strong>{" "}
            and <strong className="text-foreground">bios</strong> where normal spacing does not work properly.
            The tool runs entirely in your browser — your text is never sent to a server, never stored, and
            never tracked.
          </p>
        </motion.div>

        {/* Why Instagram Removes Line Breaks */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Why Instagram Removes Line Breaks</h2>
          <p className="text-muted-foreground leading-relaxed">
            Instagram often removes standard line breaks because of the way its formatting rules clean up
            white space. Empty lines between paragraphs are treated as trailing whitespace and stripped out
            before the post goes live. TextSpacer solves this problem by inserting an invisible Unicode
            character on each blank line, so the platform sees a real character there and keeps the spacing
            exactly where you want it.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">How It Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            TextSpacer uses special Unicode space characters that are invisible but recognized by social
            media platforms. Instead of submitting an empty line — which Instagram, Facebook, and TikTok
            usually strip out — the tool inserts a Braille Pattern Blank (U+2800) on each blank line.
            The result is text that looks identical to what you typed, but with paragraph breaks that
            actually survive after posting.
          </p>
          <div className="space-y-4">
            {[
              {
                n: 1,
                title: "Paste Your Text",
                desc: (
                  <>
                    Type or paste your caption, bio, or comment into the input box above. Use{" "}
                    <a href="/" className="text-primary hover:text-primary/80 transition-colors">
                      blank lines
                    </a>{" "}
                    wherever you want a paragraph break.
                  </>
                )
              },
              { n: 2, title: "Pick a Font Style (Optional)", desc: "Choose Bold, Italic, Script, Double-struck, Monospace, Sans-serif, or Underline to convert your letters into stylish Unicode characters." },
              { n: 3, title: "Click Generate Spaced Text", desc: "The tool processes your text instantly and inserts an invisible Unicode character on each blank line." },
              { n: 4, title: "Copy the Output", desc: "Press the Copy to Clipboard button. The spaced text is now ready on your clipboard." },
              { n: 5, title: "Paste in Instagram or Any App", desc: "Open Instagram, Facebook, TikTok, or WhatsApp and paste — the formatting will remain exactly as intended." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step.n}
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TextSpacer Image */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-8">
          <img
            src={textSpacerImage}
            alt="TextSpacer demo"
            className="w-full h-auto rounded-2xl shadow-lg border border-border"
            loading="lazy"
          />
        </motion.div>

        {/* Features */}
        <motion.div variants={fadeIn} className="max-w-5xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Key Features</h2>
          <p className="text-muted-foreground leading-relaxed">
            TextSpacer is built to be the simplest, fastest way to fix Instagram spacing problems. Here is
            what makes it stand out:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl p-5 border transition-shadow hover:shadow-sm"
                style={{ backgroundColor: f.bg, borderColor: f.border }}
              >
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div variants={fadeIn} className="max-w-5xl mx-auto border-t border-border pt-10 space-y-5">
          <h2 className="text-3xl font-display font-bold">Use Cases</h2>
          <p className="text-muted-foreground leading-relaxed">TextSpacer is perfect for:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u) => (
              <div
                key={u.title}
                className="rounded-xl p-4 border bg-white"
                style={{ borderColor: `${ACCENT}25` }}
              >
                <h3 className="font-semibold text-foreground mb-1">{u.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Use TextSpacer */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Why Use TextSpacer?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Clean formatting improves readability and engagement. Instead of messy text blocks, you get:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["Clear paragraphs", "Better structure", "More professional look"].map((item) => (
              <li
                key={item}
                className="rounded-xl p-4 border text-center font-medium text-foreground"
                style={{ backgroundColor: `${ACCENT}10`, borderColor: `${ACCENT}30` }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            This helps increase user interaction and makes your content stand out — especially on platforms
            where presentation directly impacts how many people read your full caption.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">FAQs About TextSpacer</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border faq-item rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-ts-${i}`}
                >
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
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

        {/* Final Thoughts */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-12 space-y-4">
          <h2 className="text-3xl font-display font-bold">Final Thoughts</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>TextSpacer is the easiest way to fix Instagram&apos;s line break problem and make your captions, bios, and comments look polished. With one click you get clean paragraphs that survive after posting, in any of seven stylish Unicode font variants, on any device, with no signup required.</p>

            <p>For even more creative control, you can also use tools like <a href="/reverse-text" className="text-primary hover:text-primary/80 transition-colors">Reverse Text</a> to experiment with unique caption styles that stand out on Instagram. Try it now — paste your text, pick a style, click Generate Spaced Text, and copy the result.</p>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
