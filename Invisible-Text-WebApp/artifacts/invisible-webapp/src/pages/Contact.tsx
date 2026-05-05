import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useContactForm, insertContactSchema } from "@/hooks/use-contact";
import { Mail, Send, MessageCircle, Bug, ShieldCheck, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const ACCENT = "#00a884";
const LIGHT_BLUE_BG = "rgb(239, 246, 255)";
const LIGHT_BLUE_BORDER = "rgb(191, 219, 254)";

export default function Contact() {
  const { toast } = useToast();
  const contactMutation = useContactForm();

  const form = useForm<z.infer<typeof insertContactSchema>>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertContactSchema>) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent!",
          description: "We've received your message and will get back to you soon.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <SeoHead
        title="Contact Us"
        description="Have questions or suggestions? Contact the Invisible Text team. We'd love to hear from you."
        canonical="https://textsinvisible.com/contact"
        ogTitle="Contact Us"
        ogDescription="Get in touch with the Invisible Text team for support and feedback."
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-4xl mx-auto py-12 px-4 space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We’re glad you’re here. If you have questions, suggestions, or need assistance with our invisible text tools, feel free to reach out.
          </p>
          <div className="text-sm font-medium" style={{ color: ACCENT }}>
            Website: <Link href="https://textsinvisible.com" target="_blank" className="text-primary hover:text-primary/80 transition-colors">
              https://textsinvisible.com
            </Link>
          </div>
        </div>

        {/* Contact Form Section */}
        <motion.div variants={fadeIn} className="max-w-2xl mx-auto w-full">
          <Card className="glass-card" style={{ border: `2px solid ${ACCENT}20`, borderTop: `4px solid ${ACCENT}` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" style={{ color: ACCENT }} />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    {...form.register("name")}
                    className="bg-white/50"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...form.register("email")}
                    className="bg-white/50"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    {...form.register("message")}
                    className="min-h-[120px] bg-white/50"
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-white shadow-lg"
                  style={{ backgroundColor: ACCENT }}
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Inquiries */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10" style={{ color: ACCENT }}>
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">General Inquiries</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              For general questions about our invisible character generator, compatibility issues, or technical concerns, contact us via email.
            </p>
            <EmailBlock />
          </motion.div>

          {/* Suggestions & Feedback */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10" style={{ color: ACCENT }}>
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Feedback</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Have an idea to improve Textsinvisible? Found a bug or noticed something not working correctly? We welcome your input to improve the platform.
            </p>
          </motion.div>

          {/* Legal & Policy */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10" style={{ color: ACCENT }}>
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Legal & Policy</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              For copyright concerns, legal notices, or policy inquiries, please include your full name and a detailed description of your request.
            </p>
            <EmailBlock />
          </motion.div>

          {/* Technical Support */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10" style={{ color: ACCENT }}>
                <Bug className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Technical Support</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              If invisible text is not working, please mention the platform (Instagram, WhatsApp, etc.), device type, and a brief description of the issue.
            </p>
          </motion.div>
        </div>

        {/* Info Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
          <motion.div variants={fadeIn} className="flex gap-4 p-6 rounded-2xl border" style={{ backgroundColor: LIGHT_BLUE_BG, borderColor: LIGHT_BLUE_BORDER }}>
            <Clock className="h-6 w-6 flex-shrink-0" style={{ color: ACCENT }} />
            <div className="space-y-1">
              <h3 className="font-bold">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24–48 business hours. Please note that response times may vary during weekends or holidays.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-4 p-6 rounded-2xl border" style={{ backgroundColor: LIGHT_BLUE_BG, borderColor: LIGHT_BLUE_BORDER }}>
            <Shield className="h-6 w-6 flex-shrink-0" style={{ color: ACCENT }} />
            <div className="space-y-1">
              <h3 className="font-bold">Privacy Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is safe with us. Any information you share is handled strictly in accordance with our <Link href="/privacy-policy" className="underline font-medium" style={{ color: ACCENT }}>Privacy Policy</Link> and used only for support communication.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="text-center pt-8">
          <p className="text-muted-foreground font-medium">
            Thank you for using <span style={{ color: ACCENT }}><Link href="https://textsinvisible.com" target="_blank" className="text-primary hover:text-primary/80 transition-colors">Textsinvisible</Link>
            </span>. We look forward to assisting you.
          </p>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

function EmailBlock() {
  return (
    <div className="p-4 rounded-xl inline-flex items-center gap-2 border w-full md:w-auto" style={{ backgroundColor: LIGHT_BLUE_BG, borderColor: LIGHT_BLUE_BORDER }}>
      <span className="font-bold" style={{ color: ACCENT }}>Email:</span>
      <a 
        href="mailto:support@textsinvisible.com" 
        className="underline font-medium transition-opacity hover:opacity-80"
        style={{ color: ACCENT }}
      >
        support@textsinvisible.com
      </a>
    </div>
  );
}
