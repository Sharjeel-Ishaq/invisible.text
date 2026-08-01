import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGenerateText } from "@/hooks/use-generator";
import { Copy, Sparkles, AlignVerticalSpaceAround, Instagram, Gamepad2, Check, Plus, Minus, CheckCircle2, Flame, ArrowRight, ChevronDown, ChevronUp, EyeOff, ArrowLeftRight, Hash, MessageCircle, MessageSquare, Music, RefreshCw } from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "wouter";
import { UnicodeTable } from "@/components/UnicodeTable";
import featuredImage from "@assets/image_1776348074881.png";
import howToUseImage from "../../../../attached_assets/Invisible-Text.jpg";

const generateSchema = z.object({
  length: z.coerce.number().min(1).max(5000).default(100),
});

const ACCENT = "#00a884";
const homeFaqs = [
  {
    q: "What Are Some Examples Of Invisible Text?",
    a: "Invisible text uses special hidden characters that you cannot see. Examples include Zero Width Space, Zero Width Joiner, and Zero Width Non-Joiner. They look empty but are real characters.",
  },
  {
    q: "How To Write Invisible Text?",
    a: "You cannot type invisible text with a normal keyboard. Use this tool: select your platform, choose the number of characters, click Generate Invisible Text, then copy and paste the result.",
  },
  {
    q: "How Does Invisible Text Work?",
    a: "Invisible text uses special Unicode characters. They do not appear on the screen but are still counted as text by apps, so the message looks empty but is not actually empty.",
  },
  {
    q: "How To Write Invisible Text On WhatsApp?",
    a: "WhatsApp does not allow empty messages. Select WhatsApp in Platform Mode, generate invisible text, copy it, paste it into WhatsApp, and send it. The message will look blank.",
  },
  {
    q: "How To Write An Invisible Message?",
    a: "Generate invisible text using the tool, copy it, and paste it into a chat or comment. It will appear empty to others.",
  },
  {
    q: "How To Send Invisible Text?",
    a: "Open the tool, choose the number of characters, click Generate Invisible Text, copy it, and paste it into any app to send.",
  },
];

export default function Home() {
  const { toast } = useToast();
  const generateMutation = useGenerateText();
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);




  const form = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: { length: 1 },
  });

  const currentLength = Number(form.watch("length")) || 1;

  const increment = () => form.setValue("length", Math.min(currentLength + 1, 5000), { shouldValidate: true });
  const decrement = () => form.setValue("length", Math.max(currentLength - 1, 1), { shouldValidate: true });

  const onSubmit = (data: z.infer<typeof generateSchema>) => {
    generateMutation.mutate(data, {
      onSuccess: (response) => {
        setGeneratedText(response.text);
        toast({ title: "Text Generated!", description: response.message });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast({ title: "Copied!", description: "Invisible text copied to clipboard successfully." });
    setTimeout(() => setCopied(false), 2000);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const features = [
    {
      title: "100% Free Forever",
      description: "There is no need to pay any money, sign-up, or registration to use this tool. It is completely free.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
    {
      title: "True Unicode Characters",
      description: "Generates real Hangul Filler (U+3164) invisible characters that work consistently across platforms.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
    {
      title: "Customizable Length",
      description: "Generate anywhere from 1 to 5000 invisible characters to fit any need or platform limit.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
    {
      title: "One-Click Copy",
      description: "Copy your invisible text to the clipboard instantly with a single click — ready to paste anywhere.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
    {
      title: "Universal Compatibility",
      description: "Works perfectly on WhatsApp, Instagram, Snapchat, Twitter/X, Discord, and most mobile games.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
    {
      title: "Private & Lightning Fast",
      description: "Results are generated instantly with no page reload, and no data is ever stored or tracked.",
      bg: "rgb(239, 246, 255)",
      border: "rgb(191, 219, 254)",
    },
  ];

  return (
    <Layout>
      <SeoHead
        title="Invisible Text Generator — Send Blank Messages for WhatsApp & More"
        description="Generate invisible Unicode characters instantly. Perfect for sending blank messages on WhatsApp, adding space to Instagram bios, or hiding your username in games."
        canonical="https://textsinvisible.com/"
        ogTitle="Invisible Text Generator — Send Blank Messages"
        ogDescription="Generate invisible Unicode characters instantly. Works on WhatsApp, Instagram, and Discord."
        ogImage="/favicon.png"
        schema={faqSchema}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {/* Hero + Generator — two-column layout */}
        <motion.div variants={fadeIn} className="py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left: Hero Text */}
            <div className="space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <EyeOff className="h-4 w-4 flex-shrink-0" />
                The original invisible text tool. Works in your browser.
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight">
                Generate{" "}
                <span className="text-gradient">Invisible Text</span> for Any Platform
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Create hidden Unicode characters instantly. Perfect for sending blank messages on WhatsApp,
                adding space to Instagram bios, or hiding your username in games.
              </p>
              <p className="text-base text-muted-foreground">
                We've generated{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>2,847,391</span>{" "}
                invisible characters with a total count of{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>14.2 million</span>.
              </p>
            </div>

            {/* Right: Step-based Generator Card */}
            <div>
              <Card
                className="glass-card overflow-hidden shadow-lg"
                style={{ border: `1.5px solid ${ACCENT}30` }}
              >
                <CardContent className="p-6 space-y-6">

                  {/* Step 1 */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Step 1: Set Character Length
                    </p>
                    <div
                      className="rounded-xl border-2 border-solid p-5 flex flex-col items-center gap-3"
                      style={{ borderColor: `${ACCENT}40` }}
                    >
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            size="icon"
                            onClick={decrement}
                            data-testid="button-decrement"
                            aria-label="Decrease character count"
                            className="border-2 text-white flex-shrink-0"
                            style={{ backgroundColor: ACCENT, borderColor: ACCENT }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            id="length"
                            data-testid="input-length"
                            type="number"
                            {...form.register("length", { valueAsNumber: true })}
                            className="text-lg font-mono text-center flex-1"
                            style={{ borderColor: `${ACCENT}50` }}
                            min={1}
                            max={5000}
                          />
                          <Button
                            type="button"
                            size="icon"
                            onClick={increment}
                            data-testid="button-increment"
                            aria-label="Increase character count"
                            className="border-2 text-white flex-shrink-0"
                            style={{ backgroundColor: ACCENT, borderColor: ACCENT }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Choose 1–5000 invisible characters &nbsp;·&nbsp; Hangul Filler (U+3164)
                        </p>
                        {form.formState.errors.length && (
                          <p className="text-sm text-destructive text-center">{form.formState.errors.length.message}</p>
                        )}

                        {/* Step 2 */}
                        <div className="pt-2 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Step 2: Generate Text
                          </p>
                          <Button
                            type="submit"
                            data-testid="button-generate"
                            disabled={generateMutation.isPending}
                            className="text-white w-full shadow-md"
                            style={{ backgroundColor: ACCENT }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {generateMutation.isPending ? "Generating..." : "Generate Invisible Text"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Step 3: Copy Result
                    </p>
                    <div className="relative">
                      <Textarea
                        readOnly
                        data-testid="textarea-output"
                        value={generatedText}
                        placeholder="Your invisible text will appear here..."
                        className={`min-h-[100px] resize-none bg-muted/20 font-mono transition-colors ${
                          generatedText ? "text-transparent" : "text-foreground"
                        }`}
                        style={{ borderColor: generatedText ? `${ACCENT}40` : undefined }}
                      />
                      {generatedText && (
                        <div className="absolute inset-0 pointer-events-none px-3 py-2 text-sm font-mono break-all whitespace-pre-wrap select-none overflow-hidden">
                          <span className="bg-[#00a8841a] text-transparent">{generatedText}</span>
                        </div>
                      )}
                      {generatedText && (
                        <div className="absolute top-2 right-2">
                          <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">
                            {generatedText.length} chars
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleCopy}
                      data-testid="button-copy"
                      disabled={!generatedText}
                      size="lg"
                      className="w-full text-white"
                      style={{ backgroundColor: copied ? "#16a34a" : ACCENT }}
                    >
                      {copied ? (
                        <><Check className="mr-2 h-4 w-4" /> Copied!</>
                      ) : (
                        <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Paste it anywhere — WhatsApp, Instagram, Discord, games &amp; more
                    </p>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </motion.div>



        {/* What Is Invisible Text Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto py-8 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-6">What Is Invisible Text?</h2>
          <img
            src={featuredImage}
            alt="Invisible Text and Blank Space — Create and Send Blank Messages and Hidden Names Like a Pro"
            className="w-full rounded-2xl shadow-lg border border-border mb-6"
            loading="lazy"
          />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Invisible text refers to characters that exist in a digital message or field but cannot be seen by the naked eye.
              These are not simply blank spaces — they are special Unicode characters that take up space and are recognized by
              computers and apps, yet render as completely transparent to anyone reading the message.
            </p>
            <p>
              The most commonly used invisible character is the <strong className="text-foreground">Hangul Filler (U+3164)</strong>,
              a Unicode character originally designed as a placeholder in Korean typography. When used in a text field, it looks like
              a blank space — no dots, no dashes, and no other visible symbols — but it is actually a perfectly valid character that
              passes most text validation checks with ease. That’s why it is considered a great choice for use in WhatsApp, Instagram,
              Discord, Free Fire, PUBG and various other apps and games.
            </p>
            <p>
              Other invisible Unicode characters include the Zero Width Space (U+200B), Zero Width Non-Joiner (U+200C), and
              the Braille Pattern Blank (U+2800), each with slightly different behaviors across platforms. Our generator focuses on
              the Hangul Filler because it offers the broadest compatibility and most reliable invisibility across modern apps and devices.
            </p>
            <p>
              Invisible text has many legitimate and creative uses: bypassing character minimums, creating blank usernames in games,
              formatting social media bios with clean spacing, sending surprise blank messages, or even watermarking digital text
              with hidden identifiers. Whatever your use case, this tool makes generating invisible text fast, easy, and free.
            </p>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div variants={fadeIn} className="max-w-6xl mx-auto py-12 border-t border-border">
          <h2 className="text-3xl font-display font-bold text-center mb-10">Where Do We Use Invisible Text And Blank Spaces?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/free-fire-text">
              <FFToolCard />
            </Link>
            <UseCaseCard
              icon={<Instagram className="h-8 w-8 text-pink-500" />}
              title="Instagram Bio"
              description="Add clean line breaks and spacing to your bio without using dots or awkward characters."
            />
            <UseCaseCard
              icon={<Gamepad2 className="h-8 w-8 text-purple-500" />}
              title="Gaming Names"
              description="Hide your identity in Among Us, PUBG, Free Fire and other supported games with an invisible name."
            />
            <UseCaseCard
              icon={<MessageCircle className="h-8 w-8 text-green-500" />}
              title="WhatsApp"
              description="Send blank messages or create invisible status updates to surprise your friends."
            />
            <UseCaseCard
              icon={<MessageSquare className="h-8 w-8 text-indigo-500" />}
              title="Discord"
              description="Create clean channel names, invisible roles, or blank messages in your server."
            />
            <UseCaseCard
              icon={<Music className="h-8 w-8 text-black" />}
              title="TikTok"
              description="Add invisible spaces to your TikTok captions and comments for a cleaner look."
            />
          </div>
        </motion.div>


        {/* Unicode Table Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto py-8 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-3">Types Of Unicode Invisible Characters</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            There are dozens of Unicode characters that render as invisible or blank across different platforms.
            Below is a complete reference table. Click any row in the <strong className="text-foreground">Example</strong> column
            to instantly copy that character to your clipboard.
          </p>
          <UnicodeTable />
        </motion.div>

        {/* Key Features Section */}
        <motion.div variants={fadeIn} className="max-w-5xl mx-auto py-8 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-6">Key Features Of Blank Text Generator</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our invisible text generator is built to be simple, reliable, and accessible for everyone. Here is what sets it apart:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl p-5 border transition-shadow duration-300 hover:shadow-sm"
                style={{ backgroundColor: feature.bg, borderColor: feature.border }}
              >
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How To Use Section */}
        <motion.div variants={fadeIn} className="max-w-6xl mx-auto py-8 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-6">How To Use Texts Invisible?</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Using our invisible text generator is straightforward. Follow these four simple steps to create and use
            your invisible characters wherever you need them:
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Steps - Left side on desktop, top on mobile */}
            <div className="flex-1 space-y-6">
              <HowToStep
                number={1}
                title="Set Your Character Count"
                description='Use the number input at the top of the generator to choose how many invisible characters you want. Click the "+" button to increase the count or the "−" button to decrease it. You can also type a number directly into the field. The minimum is 1 and the maximum is 5000 characters.'
              />
              <HowToStep
                number={2}
                title='Click "Generate"'
                description='Once you have set your desired length, press the Generate button. The tool will instantly create a string of invisible Unicode characters (Hangul Filler U+3164) and display them in the output box. The output box will show the character count to confirm your text has been generated.'
              />
              <HowToStep
                number={3}
                title="Copy the Invisible Text"
                description={"Click the \"Copy to Clipboard\" button below the output box. The invisible characters will be copied silently — you won't see anything on your clipboard, but the characters are there and ready to be pasted."}
              />
              <HowToStep
                number={4}
                title="Paste and Use"
                description="Go to the app, game, or platform where you want to use the invisible text and paste it (Ctrl+V on desktop, long-press and Paste on mobile). The field will appear empty to others, but your invisible characters will be present. This works on WhatsApp, Instagram, Twitter/X, Discord, PUBG, Free Fire, and many other platforms."
              />
            </div>

            {/* Image - Right side on desktop, bottom on mobile */}
            <div className="flex-1 flex items-center justify-center min-h-96 md:min-h-full">
              <img
                src={howToUseImage}
                alt="How to use invisible text generator - Step by step guide"
                className="w-117 h-full object-contain rounded-2xl shadow-lg border border-border"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Related Text Tools Section */}
        <motion.div variants={fadeIn} className="max-w-6xl mx-auto py-12 border-t border-border">
          <h2 className="text-3xl font-display font-bold text-center mb-8">Related Text Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <RelatedToolCard
              href="/"
              icon={<EyeOff className="h-6 w-6" style={{ color: ACCENT }} />}
              title="Invisible Text"
              description="Generate invisible Unicode characters instantly."
              accent={ACCENT}
            />
            <RelatedToolCard
              href="/free-fire-text"
              icon={<Flame className="h-6 w-6 text-orange-500" />}
              title="FF Invisible Text"
              description="Create blank nicknames for Free Fire gameplay."
              accent="#f97316"
            />
            <RelatedToolCard
              href="/reverse-text"
              icon={<ArrowLeftRight className="h-6 w-6 text-purple-500" />}
              title="Reverse Text"
              description="Flip and mirror any text string instantly."
              accent="#a855f7"
            />
            <RelatedToolCard
              href="/mirror-text-generator"
              icon={<RefreshCw className="h-6 w-6 text-teal-500" />}
              title="Mirror Text"
              description="Create flipped and mirrored text using Unicode alternatives."
              accent="#06b6d4"
            />
            <RelatedToolCard
              href="/unicode-text-converter"
              icon={<Hash className="h-6 w-6 text-blue-500" />}
              title="Unicode Converter"
              description="Convert text to or from Unicode code points or vice versa."
              accent="#3b82f6"
            />
            <RelatedToolCard
              href="/text-spacer"
              icon={<AlignVerticalSpaceAround className="h-6 w-6 text-emerald-500" />}
              title="TextSpacer"
              description="Add wide spaces or dots between your text characters."
              accent="#10b981"
            />
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto py-12 border-t border-border">
          <h2 className="text-3xl font-display font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {homeFaqs.map((faq, i) => (
              <div key={i} className="border faq-item rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-home-${i}`}
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


      </motion.div>
    </Layout>
  );
}

function FFToolCard() {
  return (
    <Card className="border-transparent shadow-md bg-white cursor-pointer group h-full">
      <CardContent className="pt-6">
        <div className="mb-4 bg-orange-100 p-3 rounded-xl w-fit">
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 font-display">FF Invisible Text</h3>
        <p className="text-muted-foreground">
          Create invisible nicknames for Free Fire using Hangul Filler or Braille Blank characters.
        </p>
      </CardContent>
    </Card>
  );
}


function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-transparent shadow-md bg-white">
      <CardContent className="pt-6">
        <div className="mb-4 bg-secondary/50 p-3 rounded-xl w-fit">{icon}</div>
        <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function HowToStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-5">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg"
        style={{ backgroundColor: ACCENT }}
      >
        {number}
      </div>
      <div className="space-y-1 pt-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function RelatedToolCard({ href, icon, title, description, accent }: { href: string; icon: React.ReactNode; title: string; description: string; accent: string }) {
  return (
    <Link href={href}>
      <Card
        className="cursor-pointer h-full"
        style={{ borderColor: `${accent}40` }}
      >
        <CardHeader className="p-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${accent}15` }}
          >
            {icon}
          </div>
          <CardTitle className="text-sm font-bold" style={{ color: accent }}>{title}</CardTitle>
          <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
