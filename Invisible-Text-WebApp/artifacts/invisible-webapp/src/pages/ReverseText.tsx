import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Trash2, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import reverseTextImage from "../../../../attached_assets/reverse-text.webp";

const ACCENT = "#00a884";

const faqs = [
  { q: "Is this Reverse Text Generator free?", a: "Yes, it is completely free to use with no hidden limits or charges." },
  { q: "Is my text stored anywhere?", a: "No. All processing happens directly in your browser. Your text is never sent to any server." },
  { q: "Can I use it on mobile?", a: "Yes, the tool is fully responsive and works perfectly on smartphones and tablets." },
  { q: "Does it support emojis and special characters?", a: "Yes. The tool supports plain text, numbers, emojis, and special characters." },
  { q: "What is the difference between Reverse Text and Reverse Words?", a: "Reverse Text flips the entire string character by character (e.g. Hello → olleH). Reverse Words keeps each word's letters intact but reverses the word order (e.g. Hello world → world Hello)." },
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
  "Instant text transformation — results appear immediately",
  "Reverse full sentences character by character",
  "Reverse word order while keeping each word intact",
  "Reverse each word's letters while keeping word order",
  "Live character and word counter",
  "One-click copy to clipboard",
  "Mobile-friendly responsive design",
  "100% free, secure, and no signup required",
];

export default function ReverseText() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const charCount = input.length;
  const wordCount = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

  const reverseText = () => setOutput(input.split("").reverse().join(""));
  const reverseWords = () => setOutput(input.split(" ").reverse().join(" "));
  const reverseEach = () =>
    setOutput(
      input
        .split(" ")
        .map((w) => w.split("").reverse().join(""))
        .join(" ")
    );
  const clear = () => { setInput(""); setOutput(""); };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: "Copied!", description: "Reversed text copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <SeoHead
        title="Reverse Text Generator — Flip Text & Words Backwards"
        description="Backwards text in one click. Reverse full sentences, flip word order, or reverse each word's letters — instantly, free, and without any signup."
        canonical="https://textsinvisible.com/reverse-text"
        ogTitle="Backwards & Reverse Text Generator"
        ogDescription="Reverse full sentences, flip word order, or reverse each word's letters instantly."
        schema={faqSchema}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {/* Hero */}
        <motion.div variants={fadeIn} className="text-center space-y-6 py-6 md:py-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border"
            style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, borderColor: `${ACCENT}30` }}
          >
            <ArrowLeftRight className="h-4 w-4" /> Online Reverse Text Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Reverse Text{" "}
            <span style={{ color: ACCENT }}>Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Backwards text in one click. Reverse full sentences, flip word order, or reverse each word's
            letters — instantly, free, and without any signup.
          </p>
        </motion.div>

        {/* Tool Card */}
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl bg-white shadow-md overflow-hidden"
            style={{ border: `2px solid ${ACCENT}30`, borderTop: `6px solid ${ACCENT}` }}
          >
            <div className="p-6 md:p-8 space-y-5">
              {/* Input */}
              <div className="space-y-2">
                <Label htmlFor="rtg-input">Input Text</Label>
                <Textarea
                  id="rtg-input"
                  data-testid="textarea-rtg-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or paste text here..."
                  className="min-h-[140px] resize-none text-sm focus-visible:ring-0"
                  style={{ borderColor: "#e5e5e5" }}
                  onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                />
                <p className="text-xs text-muted-foreground">
                  Characters: <strong>{charCount}</strong> &nbsp;|&nbsp; Words: <strong>{wordCount}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  data-testid="button-reverse-text"
                  onClick={reverseText}
                  className="text-white text-xs sm:text-sm"
                  style={{ backgroundColor: ACCENT }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#019270")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                >
                  Reverse Text
                </Button>
                <Button
                  data-testid="button-reverse-words"
                  onClick={reverseWords}
                  className="text-white text-xs sm:text-sm"
                  style={{ backgroundColor: ACCENT }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#019270")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                >
                  Reverse Words
                </Button>
                <Button
                  data-testid="button-reverse-each"
                  onClick={reverseEach}
                  className="text-white text-xs sm:text-sm"
                  style={{ backgroundColor: ACCENT }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#019270")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                >
                  Reverse Each Word
                </Button>
                <Button
                  data-testid="button-rtg-clear"
                  onClick={clear}
                  variant="outline"
                  className="text-xs sm:text-sm hover:text-white"
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
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
                </Button>
              </div>

              {/* Output */}
              <div className="space-y-2">
                <Label htmlFor="rtg-output">Output Result</Label>
                <Textarea
                  id="rtg-output"
                  data-testid="textarea-rtg-output"
                  readOnly
                  value={output}
                  placeholder="Output will appear here after clicking a reverse option..."
                  className="min-h-[140px] resize-none text-sm bg-muted/20"
                />
              </div>

              {/* Copy Button */}
              <Button
                data-testid="button-rtg-copy"
                onClick={handleCopy}
                disabled={!output}
                className="w-full text-white"
                size="lg"
                style={{
                  backgroundColor: copied ? "#16a34a" : ACCENT,
                }}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = "#019270";
                }}
                onMouseLeave={(e) => {
                  if (!copied) e.currentTarget.style.backgroundColor = ACCENT;
                }}
              >
                {copied ? (
                  <><Check className="mr-2 h-4 w-4" /> Copied!</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">How the Reverse Text Generator Works</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The tool works by rearranging your text based on the option you select. For example:
            </p>
            <div
              className="rounded-xl p-4 border font-mono text-sm"
              style={{ backgroundColor: `${ACCENT}08`, borderColor: `${ACCENT}25` }}
            >
              <p><strong className="text-foreground">Input:</strong> Hello world!</p>
              <p style={{ color: ACCENT }}><strong className="text-foreground">Reverse Text Output:</strong> !dlrow olleH</p>
            </div>
            <p>
              Unlike complicated software, this tool works directly in your browser. There is no signup, no
              download, and no data storage. Everything happens instantly and securely on your device.
            </p>
            <p>It supports plain text, numbers, emojis, and special characters — and it is fully compatible with desktop, tablet, and mobile.</p>
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">How to Use Our Reverse Text Generator</h2>
          <p className="text-muted-foreground leading-relaxed">Using the tool is very simple:</p>
          <div className="space-y-6">
            {[
              {
                n: 1,
                title: "Enter Your Text",
                desc: "Paste or type your content in the input box above. The character and word count updates live as you type.",
              },
              {
                n: 2,
                title: "Choose a Reverse Option",
                desc: "You will see four buttons: Reverse Text (character by character), Reverse Words (flip word order), Reverse Each Word (flip letters in each word), and Clear.",
              },
              {
                n: 3,
                title: "Copy the Output",
                desc: 'Click the "Copy to Clipboard" button below the output box to use your reversed text anywhere.',
              },
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

          {/* Reverse Options Detail */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { label: "Reverse Text", before: "Hello world", after: "dlrow olleH", color: "bg-teal-50 border-teal-100" },
              { label: "Reverse Words", before: "Hello world", after: "world Hello", color: "bg-blue-50 border-blue-100" },
              { label: "Reverse Each Word", before: "Hello world", after: "olleH dlrow", color: "bg-purple-50 border-purple-100" },
            ].map((ex) => (
              <div key={ex.label} className={`rounded-xl border p-4 space-y-2 ${ex.color}`}>
                <p className="font-semibold text-sm text-foreground">{ex.label}</p>
                <p className="text-xs text-muted-foreground font-mono">Before: {ex.before}</p>
                <p className="text-xs font-mono font-semibold" style={{ color: ACCENT }}>After: {ex.after}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Create Reverse Text Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-8">
          <img
            src={reverseTextImage}
            alt="Create Reverse Text In Different Ways"
            className="w-full h-auto rounded-2xl shadow-lg border border-border"
            loading="lazy"
          />
        </motion.div>

        {/* Why People Use It */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-5">
          <h2 className="text-3xl font-display font-bold">Why People Use a Reverse Text Generator</h2>
          <p className="text-muted-foreground leading-relaxed">This tool is useful in many creative and technical situations:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Social Media Posts", desc: "Reversed text makes captions more eye-catching and unique on Instagram, Facebook, and other platforms.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Gaming Profiles", desc: "Combine reversed text with Free Fire invisible text to create stylish and unique usernames.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Discord and Chat Apps", desc: "Use reversed text to create funny or mysterious messages in chats.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Coding and Programming", desc: "Developers test string manipulation functions and quickly verify reversed outputs.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-4 border transition-shadow duration-300 hover:shadow-sm" style={{ backgroundColor: item.bg, borderColor: item.border }}>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Key Features of This Tool</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: ACCENT }}
                >
                  ✓
                </span>
                <span className="text-muted-foreground text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Reverse Text vs Other Tools */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Reverse Text vs Other Text Tools</h2>
          <p className="text-muted-foreground leading-relaxed">
            Many people confuse reverse tools with other text generators. Here is a clear breakdown:
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: ACCENT }}>
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">Tool</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">What It Does</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Best For</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-border bg-white">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href="/reverse-text" className="hover:underline" style={{ color: ACCENT }}>
                      Reverse Text Generator
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Flips your text backwards
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Creative posts, gaming, coding
                  </td>
                </tr>

                <tr className="border-t border-border bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    <Link href="/unicode-text-converter" className="hover:underline" style={{ color: ACCENT }}>
                      Unicode Text Converter
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Converts normal text into stylish Unicode fonts (Bold, Italic, Script, Fraktur and more)
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Social media bios, gaming names, YouTube titles
                  </td>
                </tr>

                <tr className="border-t border-border bg-white">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href="/mirror-text-generator" className="hover:underline" style={{ color: ACCENT }}>
                      Mirror Text Generator
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Creates flipped and mirrored text using Unicode alternatives
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Creative posts, usernames, hidden messages
                  </td>
                </tr>

                <tr className="border-t border-border bg-white">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href="/" className="hover:underline" style={{ color: ACCENT }}>
                      Invisible Text Generator
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Creates blank Unicode characters
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Blank nicknames, hidden spacing
                  </td>
                </tr>

                {/* NEW TOOL: Free Fire Invisible Text */}
                <tr className="border-t border-border bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">
                    <Link href="/free-fire-text" className="hover:underline" style={{ color: ACCENT }}>
                      FF Invisible Text
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Generates invisible Unicode characters for Free Fire nicknames
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Free Fire blank names, clan tags, unique identities
                  </td>
                </tr>

                {/* NEW TOOL: Text Spacer */}
                <tr className="border-t border-border bg-white">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href="/text-spacer" className="hover:underline" style={{ color: ACCENT }}>
                      Text Spacer
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Adds custom spacing between letters, words, or lines
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Formatting text, styling Instagramcaptions, improving readability
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Common Mistakes to Avoid</h2>
          <ul className="space-y-3">
            {[
              "Do not paste heavily formatted content from Word documents — plain text works best.",
              "Check punctuation after reversing text, as symbols may shift to unexpected positions.",
              "Make sure reversed text fits your platform's character limits before posting.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center">!</span>
                <span className="text-muted-foreground leading-relaxed text-sm">{tip}</span>
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
                  data-testid={`faq-toggle-${i}`}
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

        {/* Related Text Tools Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">Related Text Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/", label: "Invisible Text Generator", desc: "Generate blank invisible characters instantly." },
              { href: "/free-fire-text", label: "FF Invisible Text", desc: "Invisible text for Free Fire names & chats." },
              { href: "/unicode-text-converter", label: "Unicode Converter", desc: "Convert text into stylish Unicode fonts." },
              { href: "/mirror-text-generator", label: "Mirror Text", desc: "Create mirrored, upside-down text effects." },
              { href: "/text-spacer", label: "TextSpacer", desc: "Add perfect spacing to Instagram captions." },
              { href: "/blogs", label: "Read Our Blogs", desc: "Tips and guides for text formatting tricks." },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div className="group border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-white/60 transition-all cursor-pointer space-y-1">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tool.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Final Thoughts */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-12 space-y-4">
          <h2 className="text-3xl font-display font-bold">Final Thoughts</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The Reverse Text Generator is a practical and creative tool for anyone who wants to flip text quickly and easily.
              Whether you are creating social media content, testing code, designing graphics, or experimenting with <a href="/invisible-text" className="text-primary hover:text-primary/80 transition-colors">
                invisible text
              </a> and <a href="/free-fire-text" className="text-primary hover:text-primary/80 transition-colors">
                Free Fire invisible names
              </a>, this tool gives you instant and reliable results.
            </p>
            <p>Try it now and transform your text in seconds.</p>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
