import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, LogOut, User, Mail, KeyRound, CheckCircle, AlertCircle,
  Eye, EyeOff, Plus, Edit, Trash2, FileText, Globe, Clock,
  Image, Search, AlertTriangle, ChevronLeft, Upload, Code2
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { CodeEmbed, buildEmbedSrcdoc } from "@/lib/tiptap-code-embed";
import { PostContent } from "@/components/PostContent";

type AdminProfile = { id: number; username: string; email: string };

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string;
  status: "draft" | "published" | "scheduled";
  scheduledDate: string | null;
  createdAt: string;
};

// ─── SEO Score ───────────────────────────────────────────────────────────────

function calcSeoScore(data: {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
}): { score: number; checks: { label: string; pass: boolean | null; hint: string }[] } {
  const kw = data.focusKeyword.toLowerCase().trim();
  const checks = [
    {
      label: "Focus keyword in title",
      pass: kw ? data.title.toLowerCase().includes(kw) : null,
      hint: kw ? (data.title.toLowerCase().includes(kw) ? "Good" : `Add "${data.focusKeyword}" to the title`) : "Set a focus keyword",
    },
    {
      label: "Focus keyword in content",
      pass: kw ? data.content.toLowerCase().includes(kw) : null,
      hint: kw ? (data.content.toLowerCase().includes(kw) ? "Good" : `Mention "${data.focusKeyword}" in the content`) : "Set a focus keyword",
    },
    {
      label: "Focus keyword in meta title",
      pass: kw ? data.metaTitle.toLowerCase().includes(kw) : null,
      hint: kw ? (data.metaTitle.toLowerCase().includes(kw) ? "Good" : `Add "${data.focusKeyword}" to meta title`) : "Set a focus keyword",
    },
    {
      label: "Meta description length (120–160 chars)",
      pass: data.metaDescription.length >= 120 && data.metaDescription.length <= 160,
      hint: `Current: ${data.metaDescription.length} chars ${data.metaDescription.length < 120 ? "(too short)" : data.metaDescription.length > 160 ? "(too long)" : "(good)"}`,
    },
    {
      label: "Title length (50–60 chars)",
      pass: data.title.length >= 50 && data.title.length <= 60,
      hint: `Current: ${data.title.length} chars ${data.title.length < 50 ? "(too short)" : data.title.length > 60 ? "(too long)" : "(good)"}`,
    },
  ];

  const applicable = checks.filter((c) => c.pass !== null);
  const passed = applicable.filter((c) => c.pass === true).length;
  const score = applicable.length > 0 ? Math.round((passed / applicable.length) * 100) : 0;
  return { score, checks };
}

function SeoScorePanel({ data }: { data: { title: string; content: string; metaTitle: string; metaDescription: string; focusKeyword: string } }) {
  const { score, checks } = calcSeoScore(data);
  const color = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-500";
  const bg = score >= 70 ? "bg-green-50 border-green-200" : score >= 40 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${bg}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">SEO Score</span>
        <span className={`text-2xl font-bold ${color}`}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-1.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {c.pass === null ? (
              <AlertTriangle className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
            ) : c.pass ? (
              <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-medium">{c.label}</span>
              <span className="text-gray-500 ml-1">— {c.hint}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Link Dialog ─────────────────────────────────────────────────────────────

function LinkDialog({
  open,
  onClose,
  onInsert,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (href: string, rel: string, target: string) => void;
  initial: { href: string; rel: string; target: string };
}) {
  const [href, setHref] = useState(initial.href);
  const [rel, setRel] = useState(initial.rel || "follow");
  const [newTab, setNewTab] = useState(initial.target === "_blank");

  useEffect(() => {
    if (open) {
      setHref(initial.href);
      setRel(initial.rel || "follow");
      setNewTab(initial.target === "_blank");
    }
  }, [open, initial.href, initial.rel, initial.target]);

  if (!open) return null;

  const handleInsert = () => {
    if (!href.trim()) return;
    const relAttr = rel === "nofollow" ? "nofollow" : rel === "nofollow noopener" ? "nofollow noopener noreferrer" : "";
    const target = newTab ? "_blank" : "";
    onInsert(href.trim(), relAttr, target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-sm mb-4">Insert / Edit Link</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">URL *</Label>
            <Input
              autoFocus
              value={href}
              onChange={(e) => setHref(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsert();
                }
              }}
              placeholder="https://example.com"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Rel Attribute</Label>
            <select
              value={rel}
              onChange={(e) => setRel(e.target.value)}
              className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background"
            >
              <option value="follow">Follow (default)</option>
              <option value="nofollow">Nofollow</option>
              <option value="nofollow noopener">Nofollow + Noopener</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="link-newtab"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="link-newtab" className="text-xs font-normal cursor-pointer">Open in new tab</Label>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="button" size="sm" className="text-white" style={{ backgroundColor: "#00a884" }} onClick={handleInsert}>
              {initial.href ? "Update Link" : "Insert Link"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Code Embed Dialog ───────────────────────────────────────────────────────

function CodeEmbedDialog({
  open,
  onClose,
  onInsert,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (data: { html: string; css: string; js: string }) => void;
  initial: { html: string; css: string; js: string };
}) {
  const [tab, setTab] = useState<"html" | "css" | "js" | "preview">("html");
  const [html, setHtml] = useState(initial.html);
  const [css, setCss] = useState(initial.css);
  const [js, setJs] = useState(initial.js);

  useEffect(() => {
    if (open) {
      setHtml(initial.html);
      setCss(initial.css);
      setJs(initial.js);
      setTab("html");
    }
  }, [open, initial.html, initial.css, initial.js]);

  if (!open) return null;

  const handleInsert = () => {
    onInsert({ html, css, js });
    onClose();
  };

  const tabBtn = (key: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`px-3 py-1.5 text-xs font-semibold rounded-t-md border-b-2 transition-colors ${
        tab === key
          ? "border-[#00a884] text-[#00a884] bg-white"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Code2 className="h-4 w-4" style={{ color: "#00a884" }} /> Insert Code (HTML / CSS / JS)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-5 pt-3 border-b flex gap-1 bg-gray-50">
          {tabBtn("html", "HTML")}
          {tabBtn("css", "CSS")}
          {tabBtn("js", "JavaScript")}
          {tabBtn("preview", "Live Preview")}
        </div>

        <div className="flex-1 overflow-auto p-5">
          {tab === "html" && (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder='<button class="my-btn">Click me</button>'
              spellCheck={false}
              className="w-full min-h-[260px] font-mono text-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
            />
          )}
          {tab === "css" && (
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder=".my-btn { background:#00a884; color:#fff; padding:8px 16px; border-radius:6px; border:0; cursor:pointer; }"
              spellCheck={false}
              className="w-full min-h-[260px] font-mono text-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
            />
          )}
          {tab === "js" && (
            <textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              placeholder='document.querySelector(".my-btn")?.addEventListener("click", () => alert("Hi!"));'
              spellCheck={false}
              className="w-full min-h-[260px] font-mono text-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
            />
          )}
          {tab === "preview" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                This is exactly how the embed will appear to visitors.
              </p>
              <iframe
                key={`${html}|${css}|${js}`}
                sandbox="allow-scripts"
                srcDoc={buildEmbedSrcdoc({ html, css, js })}
                className="w-full min-h-[280px] border rounded-lg bg-white"
                title="Code Embed Preview"
              />
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-white"
            style={{ backgroundColor: "#00a884" }}
            onClick={handleInsert}
          >
            {initial.html || initial.css || initial.js ? "Update Code Embed" : "Insert Code Embed"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── WYSIWYG Toolbar ─────────────────────────────────────────────────────────

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInitial, setLinkInitial] = useState({ href: "", rel: "follow", target: "" });
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeInitial, setCodeInitial] = useState({ html: "", css: "", js: "" });
  const [editingPos, setEditingPos] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      setCodeInitial(detail.attrs);
      setEditingPos(typeof detail.pos === "number" ? detail.pos : null);
      setCodeDialogOpen(true);
    };
    window.addEventListener("code-embed-edit", handler);
    return () => window.removeEventListener("code-embed-edit", handler);
  }, []);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-xs font-medium transition-colors ${active ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`;

  const openLinkDialog = () => {
    const attrs = editor.getAttributes("link");
    setLinkInitial({
      href: attrs.href || "",
      rel: attrs.rel || "follow",
      target: attrs.target || "",
    });
    setLinkDialogOpen(true);
  };

  const handleLinkInsert = (href: string, rel: string, target: string) => {
    editor.chain().focus().setLink({ href, rel: rel || undefined, target: target || undefined } as any).run();
  };

  const openCodeDialog = () => {
    setCodeInitial({ html: "", css: "", js: "" });
    setEditingPos(null);
    setCodeDialogOpen(true);
  };

  const handleCodeInsert = (data: { html: string; css: string; js: string }) => {
    if (editingPos != null) {
      editor
        .chain()
        .focus()
        .command(({ tr, dispatch }) => {
          const node = tr.doc.nodeAt(editingPos);
          if (!node || node.type.name !== "codeEmbed") return false;
          if (dispatch) {
            tr.setNodeMarkup(editingPos, undefined, data);
          }
          return true;
        })
        .run();
      setEditingPos(null);
    } else {
      editor.chain().focus().insertContent({ type: "codeEmbed", attrs: data }).run();
    }
  };

  return (
    <>
      <LinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onInsert={handleLinkInsert}
        initial={linkInitial}
      />
      <CodeEmbedDialog
        open={codeDialogOpen}
        onClose={() => { setCodeDialogOpen(false); setEditingPos(null); }}
        onInsert={handleCodeInsert}
        initial={codeInitial}
      />
      <div className="flex flex-wrap gap-1 p-2 border border-border rounded-t-lg bg-gray-50">
        <button type="button" className={btn(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          className={btn(editor.isActive("link"))}
          onClick={openLinkDialog}
        >
          Link
        </button>
        <button
          type="button"
          className={btn(false)}
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Img
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          className={`${btn(false)} flex items-center gap-1`}
          onClick={openCodeDialog}
          title="Insert HTML / CSS / JavaScript code that will run on the published page"
        >
          <Code2 className="h-3 w-3" /> Code
        </button>
      </div>
    </>
  );
}

// ─── Blog Post Form ───────────────────────────────────────────────────────────

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  focusKeyword: z.string().default(""),
  featuredImage: z.string().default(""),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  scheduledDate: z.string().optional(),
});
type PostForm = z.infer<typeof postFormSchema>;

function BlogPostForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: BlogPost;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<PostForm>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      focusKeyword: initialData?.focusKeyword || "",
      featuredImage: initialData?.featuredImage || "",
      status: initialData?.status || "published",
      scheduledDate: initialData?.scheduledDate
        ? new Date(initialData.scheduledDate).toISOString().slice(0, 16)
        : "",
    },
  });

  const watchedValues = form.watch();

  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { rel: null, target: null } }),
      TiptapImage,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
      CodeEmbed,
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
  });

  const togglePreview = () => {
    setPreviewHtml(editor?.getHTML() || "");
    setShowPreview((v) => !v);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      const content = editor?.getHTML() || "";
      const payload = { ...data, content };
      if (initialData) {
        const res = await apiRequest("PATCH", `/api/admin/blog/${initialData.id}`, payload);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/admin/blog", payload);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      onSuccess();
    },
    onError: (err: any) => {
      try {
        const jsonStr = err.message?.replace(/^\d+:\s*/, "");
        const parsed = JSON.parse(jsonStr);
        setErrorMsg(parsed?.message || "Failed to save post.");
      } catch {
        setErrorMsg("Failed to save post.");
      }
    },
  });

  const autoSlug = useCallback(async (title: string) => {
    if (!title) return;
    if (initialData) return;
    try {
      const res = await fetch(`/api/admin/slugify?title=${encodeURIComponent(title)}`, { credentials: "include" });
      const data = await res.json();
      form.setValue("slug", data.slug);
    } catch {}
  }, [form, initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) form.setValue("featuredImage", data.url);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: PostForm) => {
    setErrorMsg("");
    saveMutation.mutate(data);
  };

  const statusValue = form.watch("status");
  const seoData = {
    title: watchedValues.title || "",
    content: editor?.getText() || "",
    metaTitle: watchedValues.metaTitle || "",
    metaDescription: watchedValues.metaDescription || "",
    focusKeyword: watchedValues.focusKeyword || "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <h2 className="text-xl font-bold">{initialData ? "Edit Post" : "Create New Post"}</h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-1">
                  <Label>Title *</Label>
                  <Input
                    {...form.register("title")}
                    placeholder="Enter post title..."
                    onBlur={(e) => autoSlug(e.target.value)}
                  />
                  {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Slug *</Label>
                  <Input {...form.register("slug")} placeholder="post-url-slug" />
                  {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Content *</Label>
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5"
                      style={{
                        borderColor: showPreview ? "#00a884" : "#e5e7eb",
                        backgroundColor: showPreview ? "#00a884" : "#fff",
                        color: showPreview ? "#fff" : "#374151",
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showPreview ? "Back to Editor" : "Live Preview"}
                    </button>
                  </div>
                  {showPreview ? (
                    <div className="border border-border rounded-lg p-5 bg-white min-h-[300px]">
                      <div className="text-xs uppercase font-semibold mb-3 tracking-wide text-muted-foreground">
                        Preview — exactly how visitors will see this post
                      </div>
                      <PostContent
                        html={previewHtml}
                        className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-[#00a884]"
                      />
                    </div>
                  ) : (
                    <>
                      <EditorToolbar editor={editor} />
                      <EditorContent editor={editor} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-4 w-4" /> SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Focus Keyword</Label>
                  <Input {...form.register("focusKeyword")} placeholder="e.g. invisible text" />
                </div>
                <div className="space-y-1">
                  <Label>Meta Title</Label>
                  <Input {...form.register("metaTitle")} placeholder="SEO title (50–60 chars recommended)" />
                  <p className="text-xs text-muted-foreground">{watchedValues.metaTitle?.length || 0} characters</p>
                </div>
                <div className="space-y-1">
                  <Label>Meta Description</Label>
                  <textarea
                    {...form.register("metaDescription")}
                    placeholder="SEO description (120–160 chars recommended)"
                    rows={3}
                    className="w-full rounded-lg border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">{watchedValues.metaDescription?.length || 0} characters</p>
                </div>

                <SeoScorePanel data={seoData} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    )}
                  />
                </div>

                {statusValue === "scheduled" && (
                  <div className="space-y-1">
                    <Label>Scheduled Date & Time</Label>
                    <Input
                      type="datetime-local"
                      {...form.register("scheduledDate")}
                    />
                  </div>
                )}

                {errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white"
                  style={{ backgroundColor: "#00a884" }}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : initialData ? "Update Post" : "Create Post"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="h-4 w-4" /> Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {watchedValues.featuredImage && (
                  <img
                    src={watchedValues.featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                )}
                <div className="space-y-2">
                  <label className="block w-full">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground text-center">or paste URL below</p>
                  <Input
                    {...form.register("featuredImage")}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Blog Post List ───────────────────────────────────────────────────────────

function BlogPostList({
  onNew,
  onEdit,
}: {
  onNew: () => void;
  onEdit: (post: BlogPost) => void;
}) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "scheduled">("all");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] }),
  });

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const statusBadge = (status: string) => {
    if (status === "published") return <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>;
    if (status === "scheduled") return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Draft</Badge>;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Blog Posts</h2>
        <Button onClick={onNew} className="gap-2 text-white" style={{ backgroundColor: "#00a884" }}>
          <Plus className="h-4 w-4" /> Create New Post
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "published", "draft", "scheduled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "all" ? `All (${posts.length})` : `${f} (${posts.filter((p) => p.status === f).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No {filter !== "all" ? filter : ""} posts yet.</p>
          <Button onClick={onNew} variant="outline" size="sm" className="mt-3 gap-2">
            <Plus className="h-4 w-4" /> Create one
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-white hover:bg-gray-50 transition-colors">
              {post.featuredImage ? (
                <img src={post.featuredImage} alt={post.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  {statusBadge(post.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  /{post.slug} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`/blogs/${post.slug}`, "_blank")}
                  title="Preview"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(post)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Delete this post?")) deleteMutation.mutate(post.id);
                  }}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Update Credentials Form ──────────────────────────────────────────────────

const updateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newUsername: z.string().min(3, "Min 3 characters").or(z.literal("")).optional(),
    newEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
    newPassword: z.string().min(8, "Min 8 characters").or(z.literal("")).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (d) => !d.newPassword || d.newPassword === d.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] },
  );
type UpdateForm = z.infer<typeof updateSchema>;

function CredentialsCard({ admin }: { admin: AdminProfile }) {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: { currentPassword: "", newUsername: "", newEmail: "", newPassword: "", confirmPassword: "" },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateForm) => {
      const payload: Record<string, string> = { currentPassword: data.currentPassword };
      if (data.newUsername) payload.newUsername = data.newUsername;
      if (data.newEmail) payload.newEmail = data.newEmail;
      if (data.newPassword) payload.newPassword = data.newPassword;
      return apiRequest("PATCH", "/api/admin/update", payload);
    },
    onSuccess: () => {
      setSuccessMsg("Credentials updated successfully.");
      setErrorMsg("");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: any) => {
      try {
        const jsonStr = err.message?.replace(/^\d+:\s*/, "");
        const parsed = JSON.parse(jsonStr);
        setErrorMsg(parsed?.message || "Update failed.");
      } catch {
        setErrorMsg("Update failed.");
      }
      setSuccessMsg("");
    },
  });

  return (
    <div className="space-y-5">
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" style={{ color: "#00a884" }} /> Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Username</p>
              <p className="font-semibold">{admin.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="font-semibold">{admin.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5" style={{ color: "#00a884" }} /> Update Credentials
          </CardTitle>
          <CardDescription>Leave a field blank to keep it unchanged. Current password is always required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label>Current Password *</Label>
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} {...form.register("currentPassword")} className="pr-10" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowCurrent(v => !v)}>
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.currentPassword && <p className="text-xs text-red-500">{form.formState.errors.currentPassword.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>New Username</Label>
                <Input {...form.register("newUsername")} placeholder="Leave blank to keep" />
              </div>
              <div className="space-y-1">
                <Label>New Email</Label>
                <Input type="email" {...form.register("newEmail")} placeholder="Leave blank to keep" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>New Password</Label>
                <div className="relative">
                  <Input type={showNew ? "text" : "password"} {...form.register("newPassword")} className="pr-10" placeholder="Min 8 characters" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowNew(v => !v)}>
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <Input type="password" {...form.register("confirmPassword")} placeholder="Repeat new password" />
                {form.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>}
              </div>
            </div>
            {successMsg && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
            <Button type="submit" className="w-full text-white" style={{ backgroundColor: "#00a884" }} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating…" : "Update Credentials"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Redirect Component ──────────────────────────────────────────────────────

function AdminRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/admin/login");
  }, [navigate]);
  return null;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();

  const { data: admin, isLoading } = useQuery<AdminProfile>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => navigate("/admin/login"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!admin) {
    return <AdminRedirect />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00a884" }}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Admin Panel</span>
              <span className="ml-2 text-xs text-gray-400">InvisibleText</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="gap-2 text-gray-600"
          >
            <LogOut className="h-4 w-4" />
            {logoutMutation.isPending ? "Logging out…" : "Logout"}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="blog">
          <TabsList className="mb-8">
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="h-4 w-4" /> Blog Posts
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <User className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            {view === "list" && (
              <BlogPostList
                onNew={() => { setEditingPost(undefined); setView("create"); }}
                onEdit={(post) => { setEditingPost(post); setView("edit"); }}
              />
            )}
            {(view === "create" || view === "edit") && (
              <BlogPostForm
                initialData={editingPost}
                onSuccess={() => { setView("list"); setEditingPost(undefined); }}
                onCancel={() => { setView("list"); setEditingPost(undefined); }}
              />
            )}
          </TabsContent>

          <TabsContent value="settings">
            <CredentialsCard admin={admin} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
