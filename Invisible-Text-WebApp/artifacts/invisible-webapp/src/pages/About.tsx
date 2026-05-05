import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function About() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <Layout>
            <SeoHead
                title="About Us — Textsinvisible.com"
                description="Learn about our mission to provide free, fast, and accessible text formatting tools. We build simple Unicode utilities for everyone."
                canonical="https://textsinvisible.com/about"
                ogTitle="About Textsinvisible — Free Text Tools"
                ogDescription="Discover our story and why we built free Unicode text formatting tools for Instagram, WhatsApp, Discord, and gaming."
            />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-4"
            >
                {/* Hero Section */}
                <motion.div variants={fadeIn} className="text-center space-y-6 py-6 md:py-10">
                    <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
                        About <span className="text-primary">Textsinvisible</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Your Simple Toolkit for Smarter Text Formatting
                    </p>
                </motion.div>

                {/* Main Content */}
                <motion.div variants={fadeIn} className="max-w-3xl mx-auto py-8 border-t border-border">
                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        {/* Welcome Section */}
                        <section className="space-y-4">
                            <h2 className="text-3xl font-display font-bold text-foreground">Welcome to Textsinvisible.com</h2>
                            <p>
                                We are a small, dedicated team of developers and designers who believe that the right typography tools
                                should be fast, free, and accessible to everyone. We built this website to solve real problems—whether
                                it's adding invisible space to an Instagram bio, creating a unique gaming nickname, or generating stylish
                                Unicode text without installing any software.
                            </p>
                        </section>

                        {/* Why We Built Section */}
                        <section className="space-y-4">
                            <h2 className="text-3xl font-display font-bold text-foreground">Why We Built These Tools</h2>
                            <p>
                                We noticed that many existing text tools are complicated, slow, or locked behind sign-up walls. Simple
                                tasks—like inserting a line break on Instagram or copying a reversed string for a developer test—shouldn't
                                require downloading an app or paying a fee. We created Textsinvisible to strip away that friction.
                            </p>
                            <p>
                                Our toolkit focuses on the creative and practical power of Unicode characters. Unlike standard fonts that
                                need to be installed, Unicode characters are universal building blocks recognized by nearly every modern
                                device and platform. They let you format text that works natively on Instagram, WhatsApp, YouTube, gaming
                                chats, and beyond.
                            </p>
                        </section>

                        {/* Suite of Tools Section */}
                        <section className="space-y-4">
                            <h2 className="text-3xl font-display font-bold text-foreground">Our Suite of Free Tools</h2>
                            <p>
                                Every tool on our site runs instantly in your browser. We don't store your text, we don't track your
                                identity, and we never require a login.
                            </p>
                            <ul className="space-y-4 ml-4">
                                <li>
                                    <strong className="text-foreground">Invisible Text Generator:</strong> Create blank messages, hidden
                                    characters, and clean bio spacing using characters like the Hangul Filler (U+3164). It's the foundation
                                    for invisible usernames and clever formatting.
                                </li>
                                <li>
                                    <strong className="text-foreground">Free Fire Invisible Name Generator:</strong> A specialized spin-off
                                    from our main invisible text tool, designed specifically to bypass Free Fire's standard space restrictions
                                    and create a clean, blank nickname safely.
                                </li>
                                <li>
                                    <strong className="text-foreground">Unicode Text Converter:</strong> Instantly transform normal text into
                                    bold, italic, script, fraktur, double-struck, and other stylish Unicode fonts. Perfect for social media
                                    bios and video titles.
                                </li>
                                <li>
                                    <strong className="text-foreground">TextSpacer:</strong> Fix Instagram's frustrating line break problem.
                                    We insert invisible Unicode characters on blank lines so your captions, bios, and comments keep their
                                    paragraph spacing after posting.
                                </li>
                                <li>
                                    <strong className="text-foreground">Reverse Text Generator:</strong> Flip text backwards, reverse word
                                    order, or reverse each word's letters instantly for creative posts, coding tests, or unique usernames.
                                </li>
                            </ul>
                        </section>

                        {/* What We Stand For Section */}
                        <section className="space-y-4">
                            <h2 className="text-3xl font-display font-bold text-foreground">What We Stand For</h2>
                            <ul className="space-y-4 ml-4">
                                <li>
                                    <strong className="text-foreground">100% Free Forever:</strong> No hidden fees, no premium tiers, no
                                    registration. All tools are free to use, every time you visit.
                                </li>
                                    <li>
                                    <strong className="text-foreground">Privacy First:</strong> We designed these tools to be client-side.
                                    Your text is processed directly on your device—it is never uploaded to our servers for processing, stored,
                                    or analyzed. Read our <Link href="/privacy-policy" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link> for more details.
                                </li>
                                <li>
                                    <strong className="text-foreground">Simple & Reliable:</strong> We focus on a clean, mobile-friendly
                                    interface that gets the job done with one-click copy functionality and instant results.
                                </li>
                                <li>
                                    <strong className="text-foreground">Educational & Practical:</strong> We explain why a tool works, not just
                                    how to use it. Our guides break down the Unicode standards behind invisible text and styling so you can
                                    understand, learn, and apply them creatively.
                                </li>
                            </ul>
                        </section>

                        {/* Independence Section */}
                        <section className="space-y-4">
                            <h2 className="text-3xl font-display font-bold text-foreground">Independent and Not Affiliated</h2>
                            <p>
                                Textsinvisible is an independent project. We are not affiliated with WhatsApp, Facebook/Meta, Instagram,
                                Discord, Garena Free Fire, or any other third-party platform mentioned on our site. All trademarks are the
                                property of their respective owners. Our tools are created to work alongside these platforms, but we do not
                                control their individual updates and policies.
                            </p>
                        </section>

                        {/* Closing Section */}
                        <section className="space-y-4 pt-4 border-t border-border">
                            <p>
                                Thank you for using our tools. We hope they help you create something unique.
                            </p>
                            <p>
                                Have questions or feedback? <a href="/contact" className="text-primary hover:underline">Visit our Contact Page.</a>
                            </p>
                            <p className="text-sm text-muted-foreground/70">Last Updated: April 26, 2026</p>
                        </section>
                    </div>
                </motion.div>
            </motion.div>
        </Layout>
    );
}
