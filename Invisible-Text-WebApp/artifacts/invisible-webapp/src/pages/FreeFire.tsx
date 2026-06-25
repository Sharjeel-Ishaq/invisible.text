import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Plus, Minus, Flame, Shield, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import ffInvisibleImage from "../../../../attached_assets/ff-invisible-text.webp";
import ffInvisibleMessageImage from "../../../../attached_assets/invisible-text-ff-message.webp";


const MODES = {
  generatorA: { label: "Generator A", char: "\u3164", unicode: "U+3164", name: "Hangul Filler" },
  generatorB: { label: "Generator B", char: "\u2800", unicode: "U+2800", name: "Braille Pattern Blank" },
  safeMode: { label: "Safe Mode", char: "\u0020", unicode: "U+0020", name: "Standard Space" },
};

type ModeKey = keyof typeof MODES;

const faqs = [
  {
    q: "Can I get banned for using invisible text in Free Fire?",
    a: "No. Invisible text uses valid Unicode characters. It is not a hack or cheat. The game accepts these characters as legitimate input.",
  },
  {
    q: "How many characters or spaces are allowed in a Free Fire nickname?",
    a: "The limit may change with updates, but generally around 12–14 visible characters. Invisible characters also count toward the limit.",
  },
  {
    q: "Does this work on Android and iPhone?",
    a: "Yes. Invisible text works on both platforms because it uses Unicode characters supported by the game.",
  },
  {
    q: "Is it still working in 2026?",
    a: "Yes, as long as the game continues to accept these Unicode characters.",
  },
  {
    q: "Can I use invisible text in clan names?",
    a: "Yes, it can also be used in clan names or team tags.",
  },
];

export default function FreeFire() {
  const { toast } = useToast();
  const [length, setLength] = useState(1);
  const [mode, setMode] = useState<ModeKey>("generatorA");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const increment = () => setLength((l) => Math.min(l + 1, 200));
  const decrement = () => setLength((l) => Math.max(l - 1, 1));

  const handleGenerate = () => {
    const char = MODES[mode].char;
    const text = char.repeat(length);
    setGeneratedText(text);
    toast({
      title: "Invisible Text Generated!",
      description: `${length} ${MODES[mode].name} characters ready to copy.`,
    });
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Paste it directly into your Free Fire nickname field.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SeoHead
        title="Free Fire Invisible Name Generator — Create Blank Nicknames"
        description="Create blank nicknames for Free Fire using Unicode invisible characters. Choose your generator mode, set the length, copy, and paste directly into your profile."
        canonical="https://textsinvisible.com/free-fire-text"
        ogTitle="Free Fire Invisible Name Generator"
        ogDescription="Generate invisible Unicode characters for your Free Fire nickname instantly."
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border" style={{ backgroundColor: "#00a88415", color: "#00a884", borderColor: "#00a88440" }}>
            <Flame className="h-4 w-4" /> Free Fire Invisible Text Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Free Fire <span className="text-gradient">Invisible Name</span> Generator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create blank nicknames for Free Fire using Unicode <a href="/" className="text-primary hover:text-primary/80 transition-colors">invisible characters</a>.
            Choose your generator mode, set the length, copy, and paste directly into your profile.
          </p>
        </motion.div>

        {/* Generator */}
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto">
          <Card className="glass-card overflow-hidden" style={{ border: "2px solid #00a88430", borderTop: "4px solid #00a884" }}>
            <CardHeader className="border-b border-border/50" style={{ backgroundColor: "#00a88408" }}>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" style={{ color: "#00a884" }} />
                FF Invisible Text Generator
              </CardTitle>
              <CardDescription>
                Select a generator mode, adjust the length, then copy the invisible text.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Mode Tabs */}
              <div className="space-y-2">
                <Label>Generator Mode</Label>
                <Tabs value={mode} onValueChange={(v) => setMode(v as ModeKey)}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="generatorA" data-testid="tab-generator-a">
                      <Zap className="h-3.5 w-3.5 mr-1.5" /> Generator A
                    </TabsTrigger>
                    <TabsTrigger value="generatorB" data-testid="tab-generator-b">
                      <Shield className="h-3.5 w-3.5 mr-1.5" /> Generator B
                    </TabsTrigger>
                    <TabsTrigger value="safeMode" data-testid="tab-safe-mode">
                      Safe Mode
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="generatorA">
                    <p className="text-sm text-muted-foreground mt-2 p-3 rounded-lg border" style={{ backgroundColor: "#00a88410", borderColor: "#00a88430" }}>
                      <strong className="text-foreground">Hangul Filler ({MODES.generatorA.unicode})</strong> — provides the best compatibility with Free Fire, which is why it is the first choice of most users.
                    </p>
                  </TabsContent>
                  <TabsContent value="generatorB">
                    <p className="text-sm text-muted-foreground mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      Uses <strong className="text-foreground">Braille Pattern Blank ({MODES.generatorB.unicode})</strong> — alternative mode if Generator A is rejected.
                    </p>
                  </TabsContent>
                  <TabsContent value="safeMode">
                    <p className="text-sm text-muted-foreground mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      Uses <strong className="text-foreground">Standard Space ({MODES.safeMode.unicode})</strong> — good for testing text formatting. Not fully invisible in all cases.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Length Control */}
              <div className="space-y-2">
                <Label htmlFor="ff-length">Number of Characters</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <Button
                      type="button"
                      size="icon"
                      onClick={decrement}
                      data-testid="button-ff-decrement"
                      className="text-white flex-shrink-0"
                      style={{ backgroundColor: "#00a884", borderColor: "#00a884" }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="ff-length"
                      data-testid="input-ff-length"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Math.min(200, Math.max(1, Number(e.target.value))))}
                      className="text-lg font-mono text-center flex-1"
                      min={1}
                      max={200}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={increment}
                      data-testid="button-ff-increment"
                      className="text-white flex-shrink-0"
                      style={{ backgroundColor: "#00a884", borderColor: "#00a884" }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    data-testid="button-ff-generate"
                    onClick={handleGenerate}
                    className="text-white w-full sm:w-auto sm:min-w-[120px] shadow-lg"
                    style={{ backgroundColor: "#00a884" }}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 15–30 characters for a fully blank nickname.
                </p>
              </div>

              {/* Output */}
              <div className="space-y-2">
                <Label>Output — Invisible Text</Label>
                <div className="relative">
                  <Textarea
                    readOnly
                    data-testid="textarea-ff-output"
                    value={generatedText}
                    placeholder="Your invisible text will appear here. Click Generate to start."
                    className={`min-h-[120px] resize-none bg-muted/20 font-mono transition-colors ${
                      generatedText ? "text-transparent" : "text-foreground"
                    }`}
                  />
                  {generatedText && (
                    <div className="absolute inset-0 pointer-events-none px-3 py-2 text-base md:text-sm font-mono break-all whitespace-pre-wrap select-none overflow-hidden">
                      <span className="bg-[#00a8841a] text-transparent px-0.3">
                        {generatedText}
                      </span>
                    </div>
                  )}
                  {generatedText && (
                    <span className="absolute top-3 right-3 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">
                      {generatedText.length} chars
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 p-6 flex justify-end" style={{ backgroundColor: "#00a88408" }}>
              <Button
                onClick={handleCopy}
                data-testid="button-ff-copy"
                disabled={!generatedText}
                size="lg"
                className="w-full sm:w-auto text-white"
                style={{ backgroundColor: copied ? "#16a34a" : "#00a884" }}
              >
                {copied ? (
                  <><Check className="mr-2 h-4 w-4" /> Copied!</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" /> Copy Invisible Text</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Intro Content */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
          <p>
            In Free Fire, your nickname is part of your identity. Many players want a unique name that stands out.
            Some prefer stylish symbols. Others want something clean and mysterious — like an invisible name.
          </p>
          <p>
            If you've ever tried to add a space to your Free Fire nickname and received an error, don't worry.
            Common spaces don't work, but special Unicode characters are accepted as valid characters by the
            system even though they look like spaces.
          </p>
        </motion.div>

        {/* What Is FF Invisible Text */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">What Is Free Fire Invisible Text?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Free Fire invisible text is not a normal space. It is a special Unicode character that looks empty but is
              still recognized as a valid character by the system.
            </p>
            <p>
              When you press the spacebar on your keyboard, you create a standard space. Free Fire blocks these spaces
              in certain positions. However, some Unicode characters appear blank but are technically different from regular spaces.
            </p>
            <p>Two commonly used invisible characters are:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#00a884" }} />
                <span><strong className="text-foreground">Hangul Filler (U+3164)</strong> — Often works best in Free Fire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span><strong className="text-foreground">Braille Pattern Blank (U+2800)</strong> — Alternative option if needed</span>
              </li>
            </ul>
            <p>These characters allow players to:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Create a fully invisible nickname</li>
              <li>Add blank space between stylish symbols</li>
              <li>Make a name look clean and minimal</li>
              <li>Create a hidden or mysterious identity</li>
            </ul>
          </div>
        </motion.div>

        {/* Why Players Use */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Why Players Use Invisible Names in Free Fire</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { title: "Unique Identity", desc: "A blank or minimal name stands out in matches.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Clean Look", desc: "Some players prefer a simple and silent style.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Creative Design", desc: "Invisible space can be combined with symbols.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
              { title: "Clan Customization", desc: "Useful in clan tags and team names.", bg: "rgb(239, 246, 255)", border: "rgb(191, 219, 254)" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-4 border transition-shadow duration-300 hover:shadow-sm "
                style={{ backgroundColor: item.bg, borderColor: item.border }}
              >
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed pt-2">
            It is not a hack. It simply uses supported Unicode characters.
          </p>
        </motion.div>

        {/* Step-by-Step Guide */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">How to Create a Free Fire Hidden Name</h2>
          <p className="text-muted-foreground leading-relaxed">
            The easiest way to create <a href="/" className="text-primary hover:text-primary/80 transition-colors">invisible text</a> is by using the generator at the top of this page. Here is how:
          </p>
          <div className="space-y-4">
            {[
              {
                n: 1,
                title: "Select the Quantity",
                desc: "Choose how much invisible text you need. For nicknames, 10–50 characters are usually recommended. Use the + and − buttons or type directly.",
              },
              {
                n: 2,
                title: 'Click "Generate"',
                desc: "The tool will generate blank characters automatically using the selected Unicode mode. The output box will confirm the character count.",
              },
              {
                n: 3,
                title: 'Click "Copy Invisible Text"',
                desc: "Click the copy button to copy the invisible text to your clipboard. The text is invisible — you won't see anything, but it's ready to paste.",
              },
              {
                n: 4,
                title: "Paste in Free Fire",
                desc: "Open Free Fire, go to your profile, tap the edit icon on your nickname, paste the copied text, and save. Your name will now appear blank.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full text-white flex items-center justify-center font-bold" style={{ backgroundColor: "#00a884" }}>
                  {step.n}
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FF Invisible Text In Nickname & Message */}
        <motion.div variants={fadeIn} className="max-w-6xl mx-auto border-t border-border pt-10 pb-8 space-y-6">
          <h2 className="text-3xl font-display font-bold">Free Fire Invisible Text In Nickname & Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={ffInvisibleImage}
              alt="Free Fire invisible text nickname demo"
              className="w-full h-48 sm:h-60 md:h-69 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-border object-cover"
              loading="lazy"
            />
            <img
              src={ffInvisibleMessageImage}
              alt="Free Fire invisible text message demo"
              className="w-full h-48 sm:h-60 md:h-69 rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-border object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Generator Modes Explained */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6">
          <h2 className="text-3xl font-display font-bold">Generator Modes Explained</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our tool works as a <a href="/reverse-text" className="text-primary hover:text-primary/80 transition-colors">Unicode Text Converter</a> with multiple modes to ensure compatibility and flexibility across different platforms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-5 space-y-2" style={{ border: "1px solid #00a88440", backgroundColor: "#00a88410" }}>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: "#00a884" }} />
                <h3 className="font-semibold text-foreground">Generator A (Primary)</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground">U+3164 — Hangul Filler</p>
              <p className="text-sm text-muted-foreground">Best compatibility with Free Fire. Recommended for most users.</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">Generator B (Alternate)</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground">U+2800 — Braille Pattern Blank</p>
              <p className="text-sm text-muted-foreground">Useful if Generator A is rejected. Backup option for tricky cases.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-foreground">Safe Mode</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground">U+0020 — Standard Space</p>
              <p className="text-sm text-muted-foreground">Good for testing text formatting. Not fully invisible in most cases.</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            If Generator A is rejected, you can switch to Generator B or Safe Mode using the tabs in the generator above.
          </p>
        </motion.div>

        {/* Common Problems */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Common Problems and Solutions</h2>
          <div className="space-y-3">
            {[
              { problem: "Name Change Failed", solution: "Try switching to Generator B in the mode tabs above." },
              { problem: "Too Many Characters", solution: "Reduce the invisible text quantity to 15–20 characters." },
              { problem: "Name Already Taken", solution: "Add a small symbol or number alongside the invisible space." },
            ].map((item) => (
              <div key={item.problem} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex-shrink-0 text-sm font-semibold text-destructive sm:min-w-[160px]">
                  Problem: {item.problem}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600 font-semibold">Solution:</span> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Best Practices for Using Invisible Text</h2>
          <ul className="space-y-3">
            {[
              "Use 15–30 invisible characters for a fully blank nickname look.",
              "Combine with stylish symbols for creative nickname designs.",
              "Test with a small amount before final submission to confirm it works.",
              "Keep your name simple and clean — subtle designs often look more professional.",
              "Do not use excessive characters — stay within the name length limit.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: "#00a88420", color: "#00a884" }}>
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Creative Nickname Ideas */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4">
          <h2 className="text-3xl font-display font-bold">Creative Nickname Ideas</h2>

          <p className="text-muted-foreground leading-relaxed">
            You can take your Free Fire nickname to the next level by combining invisible text with other creative styles.
            Instead of using a completely blank name, try mixing invisible characters with symbols, stylish fonts, or reversed text.
          </p>

          <ul className="space-y-3">
            {[
              "Combine invisible text with stylish symbols to create unique nickname designs.",
              "Use reversed text to create hidden or mysterious-looking names.",
              "Mix Unicode font styles like bold, italic, or gothic for a creative identity.",
              "Keep your design minimal — clean names often stand out more.",
              "Test different combinations to find a style that works in Free Fire.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: "#00a88420", color: "#00a884" }}
                >
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>

          <p className="text-muted-foreground leading-relaxed">
            You can also use tools like a{" "}
            <a href="/reverse-text" className="text-primary hover:text-primary/80 transition-colors">
              Reverse Text Generator
            </a>, a{" "}
            <a href="/text-spacer" className="text-primary hover:text-primary/80 transition-colors">
              Text Spacer
            </a>, or a{" "}
            <a href="/unicode-text-converter" className="text-primary hover:text-primary/80 transition-colors">
              Unicode Text Converter
            </a>{" "}
            to experiment with different styles and create a truly unique Free Fire nickname.
          </p>
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
                  <div className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm border-t border-blue-200 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Step */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto border-t border-border pt-10 pb-12 space-y-4">
          <h2 className="text-3xl font-display font-bold">Final Step</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Using hidden nicknames in Free Fire has become a popular way to make your profile look unique and
              different from others. Instead of trying complicated tricks or unsafe methods, you can generate safe,
              accurate, and fully functional hidden text in a matter of seconds with the help of the generator above,
              which can be easily used in your nickname.
            </p>
            <p>
              The key is to use the correct Unicode character and the right amount of spacing. With the proper method, you can create:
            </p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>A fully blank name</li>
              <li>Stylish spaced nicknames</li>
              <li>Minimal and clean gaming identity</li>
            </ul>
            <p>
              If Generator A does not work on the first try, switch to Generator B — both options are available directly in the tool above.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
