import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Copy,
    Check,
    Trash2,
    RefreshCw,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import MirrorTextImage from "../../../../attached_assets/mirror-text.webp";

const ACCENT = "#00a884";

const faqs = [
    {
        q: "Does mirror text work on Instagram?",
        a: "Yes, it works on all Unicode-supported platforms.",
    },
    {
        q: "Is mirror text different from reverse text?",
        a: "Yes. Reverse text only changes order, while mirror text also flips characters when possible.",
    },
    { q: "Is it free?", a: "Yes, 100% free." },
    {
        q: "How is Mirror Text different from other tools on this site?",
        a: "Mirror Text flips and substitutes characters to create a reflected effect. For simple order reversal, use Reverse Text. For invisible characters, use Invisible Text.",
    },
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
    "Real-time mirror text generation",
    "Unicode-based transformation",
    "Copy with one click",
    "Reverse toggle option",
    "Works on social platforms",
    "No login required",
];

// A best-effort mapping of characters to visually mirrored Unicode equivalents.
const MIRROR_MAP: Record<string, string> = {
    a: "50".replace("%", ""),
};

// We'll build a more complete map programmatically below using known characters.
function buildMirrorMap(): Record<string, string> {
    const map: Record<string, string> = {
        a: "ɒ",
        b: "q",
        // A best-effort mapping of characters to visually mirrored Unicode equivalents.
        // We'll build a more complete map programmatically below using known characters.
        f: "ɟ",
        g: "ɓ",
        h: "ɥ",
        i: "ᴉ",
        j: "ɾ",
        k: "ʞ",
        l: "l",
        m: "ɯ",
        n: "u",
        o: "o",
        p: "d",
        q: "b",
        r: "ɹ",
        s: "s",
        t: "ʇ",
        u: "n",
        v: "v",
        w: "w",
        x: "x",
        y: "ʎ",
        z: "z",
        A: "A",
        B: "ᗺ",
        C: "Ɔ",
        D: "D",
        E: "Ǝ",
        F: "Ⅎ",
        G: "⅁",
        H: "H",
        I: "I",
        J: "ſ",
        K: "K",
        L: "˥",
        M: "M",
        N: "N",
        O: "O",
        P: "Ԁ",
        Q: "Q",
        R: "R",
        S: "S",
        T: "T",
        U: "∩",
        V: "V",
        W: "W",
        X: "X",
        Y: "Y",
        Z: "Z",
        0: "0",
        1: "Ɩ",
        2: "ᄅ",
        3: "Ɛ",
        4: "߈",
        5: "Ƽ",
        6: "9",
        7: "ㄥ",
        8: "8",
        9: "6",
        ",": ",",
        ".": ".",
        "?": "¿",
        "!": "¡",
        '"': '"',
        "'": "'",
        "(": ")",
        ")": "(",
        "[": "]",
        "]": "[",
        "{": "}",
        "}": "{",
        "<": ">",
        ">": "<",
        " ": " ",
    };
    return map;
}

const MIRRORS = buildMirrorMap();

function mirrorChar(ch: string) {
    return MIRRORS[ch] ?? ch;
}

export default function MirrorTextGenerator() {
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [reverseOrder, setReverseOrder] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const charCount = input.length;

    // Output is generated only when the user presses the Generate button.

    const generate = () => {
        const mapped = input.split("").map(mirrorChar).join("");
        setOutput(reverseOrder ? mapped.split("").reverse().join("") : mapped);
    };

    // Mirror each word individually but preserve original spacing and word order
    const generateMirrorWords = () => {
        if (!input.trim()) {
            toast({
                title: "Nothing to mirror",
                description: "Type or paste some text first.",
                variant: "destructive",
            });
            return;
        }
        const parts = input.split(/(\s+)/); // keep whitespace tokens
        const transformed = parts
            .map((part) => {
                if (/^\s+$/.test(part)) return part;
                const mapped = part.split("").map(mirrorChar).join("");
                return mapped.split("").reverse().join("");
            })
            .join("");
        setOutput(transformed);
        toast({
            title: "Mirror words generated",
            description: "Each word was mirrored while preserving spacing.",
        });
    };

    const clear = () => {
        setInput("");
        setOutput("");
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Mirror text copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    };

    return (
        <Layout>
            <SeoHead
                title="Mirror Text Generator – Create Flipped & Mirrored Unicode Text"
                description="Mirror Text Generator lets you convert normal text into a flipped and mirrored version using special Unicode characters. Create reflected text for social posts, usernames, and hidden messages."
                canonical="/mirror-text-generator"
                ogTitle="Mirror Text Generator"
                ogDescription="Create flipped and mirrored unicode text instantly in your browser."
                schema={faqSchema}
            />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="space-y-4"
            >
                <motion.div
                    variants={fadeIn}
                    className="text-center space-y-6 py-6 md:py-10"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border"
                        style={{
                            backgroundColor: `${ACCENT}15`,
                            color: ACCENT,
                            borderColor: `${ACCENT}25`,
                        }}
                    >
                        <RefreshCw className="h-4 w-4" /> Mirror Text Generator
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                        Mirror Text{" "}
                        <span style={{ color: ACCENT }}>Generator</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Convert normal text into a flipped and mirrored version
                        using special Unicode characters. Perfect for creative
                        posts and stylish usernames.
                    </p>
                </motion.div>
                <motion.div variants={fadeIn} className="max-w-3xl mx-auto">
                    <div
                        className="rounded-2xl bg-white shadow-md overflow-hidden"
                        style={{
                            border: `2px solid ${ACCENT}20`,
                            borderTop: `6px solid ${ACCENT}`,
                        }}
                    >
                        <div className="p-6 md:p-8 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="mtg-input">Input Text</Label>
                                <Textarea
                                    id="mtg-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type or paste text here..."
                                    className="min-h-[140px] resize-none text-sm focus-visible:ring-0"
                                    style={{ borderColor: "#e5e5e5" }}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = ACCENT)
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = "#e5e5e5")
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Characters: <strong>{charCount}</strong>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <Button
                                    onClick={generate}
                                    className="w-full md:w-auto text-white text-xs sm:text-sm"
                                    style={{ backgroundColor: ACCENT }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#008f6f")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            ACCENT)
                                    }
                                >
                                    Generate Mirror Text
                                </Button>
                                <Button
                                    onClick={generateMirrorWords}
                                    className="w-full md:w-auto text-white text-xs sm:text-sm"
                                    style={{
                                        backgroundColor: ACCENT,
                                        color: "#ffffff",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#008f6f")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            ACCENT)
                                    }
                                >
                                    Generate Mirror Words
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setReverseOrder((s) => !s)}
                                    className="w-full md:w-auto text-xs"
                                    style={{ borderColor: "#e5e5e5" }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor =
                                            ACCENT;
                                        e.currentTarget.style.backgroundColor = `${ACCENT}15`;
                                        e.currentTarget.style.color = ACCENT;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "#e5e5e5";
                                        e.currentTarget.style.backgroundColor =
                                            "transparent";
                                        e.currentTarget.style.color = "inherit";
                                    }}
                                >
                                    {reverseOrder
                                        ? "Reverse order: ON"
                                        : "Reverse order: OFF"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clear}
                                    className="w-full md:w-auto text-xs"
                                    style={{ borderColor: "#e5e5e5" }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor =
                                            ACCENT;
                                        e.currentTarget.style.backgroundColor = `${ACCENT}15`;
                                        e.currentTarget.style.color = ACCENT;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "#e5e5e5";
                                        e.currentTarget.style.backgroundColor =
                                            "transparent";
                                        e.currentTarget.style.color = "inherit";
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Clear
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mtg-output">
                                    Output Result
                                </Label>
                                <Textarea
                                    id="mtg-output"
                                    readOnly
                                    value={output}
                                    placeholder="Mirrored text will appear here..."
                                    className="min-h-[140px] resize-none text-sm bg-muted/20"
                                />
                            </div>

                            {/* Mobile: single full-width copy button */}
                            <div className="md:hidden">
                                <Button
                                    onClick={handleCopy}
                                    disabled={!output}
                                    className="w-full text-white"
                                    size="lg"
                                    style={{
                                        backgroundColor: copied
                                            ? "#16a34a"
                                            : ACCENT,
                                    }}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />{" "}
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />{" "}
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Desktop / default full-width copy button */}
                            <div className="hidden md:block">
                                <Button
                                    onClick={handleCopy}
                                    disabled={!output}
                                    className="w-full text-white"
                                    size="lg"
                                    style={{
                                        backgroundColor: copied
                                            ? "#16a34a"
                                            : ACCENT,
                                    }}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />{" "}
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />{" "}
                                            Copy to Clipboard
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4"
                >
                    <h2 className="text-3xl font-display font-bold">
                        What is Mirror Text
                    </h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Mirror text is a style of text where characters are
                            flipped horizontally and reversed in order so that
                            the text appears like a reflection in a mirror.
                        </p>
                        <p>
                            Mirror text complements other creative text tools on
                            this site — it works nicely alongside Invisible Text
                            for hidden spacing and with FF Invisible Text when
                            building unique game names.
                        </p>
                        <div
                            className="rounded-xl p-4 border font-mono text-sm"
                            style={{
                                backgroundColor: `${ACCENT}08`,
                                borderColor: `${ACCENT}25`,
                            }}
                        >
                            <p>
                                <strong className="text-foreground">
                                    Normal:
                                </strong>{" "}
                                Hello
                            </p>
                            <p style={{ color: ACCENT }}>
                                <strong className="text-foreground">
                                    Mirror:
                                </strong>{" "}
                                {"ollɘH"}
                            </p>
                        </div>
                        <p>
                            This effect is created using Unicode characters that
                            visually resemble mirrored letters.
                        </p>
                    </div>
                </motion.div>

                {/* Featured image: placed after "What is Mirror Text" section */}
                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto pt-6"
                >
                    <div className="rounded-2xl overflow-hidden shadow-md">
                        <img
                            src={MirrorTextImage}
                            alt="Mirror Text Generator - featured"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto border-t border-border pt-10 space-y-6"
                >
                    <h2 className="text-3xl font-display font-bold">
                        How Mirror Text Works
                    </h2>
                    <div className="text-muted-foreground leading-relaxed space-y-3">
                        <p>
                            <strong>Character Replacement</strong>: Each letter
                            is replaced with a mirrored Unicode equivalent.
                        </p>
                        <p>
                            <strong>Order Reversal</strong>: The entire text is
                            reversed so it reads correctly in a mirror.
                        </p>
                        <p>
                            Combining these steps creates the true mirror
                            effect.
                        </p>
                        <p>
                            Mirror Text relies on Unicode glyphs and careful
                            ordering rather than images or CSS transforms. If
                            you need different transformations, try the Unicode
                            Converter to explore alternate glyph sets.
                        </p>
                    </div>

                    <h3 className="text-2xl font-semibold">Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span
                                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    ✓
                                </span>
                                <span className="text-muted-foreground text-sm leading-relaxed">
                                    {f}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                        Note: Mirror Text and Reverse Text are related but
                        distinct — Reverse Text simply reverses order while
                        Mirror Text also substitutes mirrored characters when
                        available.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4"
                >
                    <h2 className="text-3xl font-display font-bold">
                        Use cases
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Instagram captions & bios",
                            "Stylish usernames",
                            "WhatsApp & Discord messages",
                            "Creative design text",
                        ].map((u) => (
                            <div
                                key={u}
                                className="rounded-xl p-4 border transition-shadow duration-300 hover:shadow-sm"
                                style={{
                                    backgroundColor: "rgb(239, 246, 255)",
                                    borderColor: "rgb(191, 219, 254)",
                                }}
                            >
                                <h3 className="font-semibold text-foreground mb-1">
                                    {u}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Use mirror text for creative expression and
                                    unique styling across social platforms.
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p className="mb-2">
                            Related tools: try{" "}
                            <Link
                                href="/invisible-text"
                                className="text-primary hover:underline"
                            >
                                Invisible Text
                            </Link>{" "}
                            for hidden spacing, or{" "}
                            <Link
                                href="/free-fire-text"
                                className="text-primary hover:underline"
                            >
                                FF Invisible Text
                            </Link>{" "}
                            for game-specific generators.
                        </p>
                        <p>
                            For alternate glyphs and font-like substitutions,
                            check the{" "}
                            <Link
                                href="/unicode-text-converter"
                                className="text-primary hover:underline"
                            >
                                Unicode Converter
                            </Link>
                            . If you need spacing tweaks,{" "}
                            <Link
                                href="/text-spacer"
                                className="text-primary hover:underline"
                            >
                                TextSpacer
                            </Link>{" "}
                            can help.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto border-t border-border pt-10 space-y-4"
                >
                    <h2 className="text-3xl font-display font-bold">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="border faq-item rounded-xl overflow-hidden"
                            >
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/30 transition-colors"
                                    onClick={() =>
                                        setOpenFaq(openFaq === i ? null : i)
                                    }
                                >
                                    <span className="font-medium text-foreground pr-4">
                                        {faq.q}
                                    </span>
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
                            { href: "/reverse-text", label: "Reverse Text", desc: "Flip and reverse any text in one click." },
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

                <motion.div
                    variants={fadeIn}
                    className="max-w-4xl mx-auto border-t border-border pt-10 pb-12 space-y-4"
                >
                    <h2 className="text-3xl font-display font-bold">
                        Final Notes
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Not all characters have perfect mirrored versions. Some
                        letters may remain the same or look slightly different
                        depending on the platform font. This tool tries to
                        choose visually-appropriate Unicode alternatives where
                        possible.
                    </p>
                </motion.div>
            </motion.div>
        </Layout>
    );
}
