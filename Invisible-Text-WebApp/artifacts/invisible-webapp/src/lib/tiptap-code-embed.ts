import { Node, mergeAttributes } from "@tiptap/core";

export interface CodeEmbedAttrs {
  html: string;
  css: string;
  js: string;
}

export function buildEmbedSrcdoc({ html, css, js }: CodeEmbedAttrs): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:12px;font-family:system-ui,sans-serif;color:#111}${css}</style></head><body>${html}<script>(function(){try{${js}}catch(e){document.body.insertAdjacentHTML("beforeend","<pre style=\\"color:#b91c1c;background:#fee2e2;padding:8px;border-radius:6px;font-size:12px;white-space:pre-wrap\\">"+(e&&e.message?e.message:String(e))+"</pre>")}})();<\/script></body></html>`;
}

export const CodeEmbed = Node.create({
  name: "codeEmbed",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      html: { default: "" },
      css: { default: "" },
      js: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-code-embed]",
        getAttrs: (el: HTMLElement | string) => {
          if (typeof el === "string") return false;
          try {
            const raw = el.getAttribute("data-code-embed") || "";
            const data = JSON.parse(decodeURIComponent(raw));
            return {
              html: data.html || "",
              css: data.css || "",
              js: data.js || "",
            };
          } catch {
            return { html: "", css: "", js: "" };
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }: { HTMLAttributes: Record<string, any>; node: any }) {
    const payload = encodeURIComponent(
      JSON.stringify({
        html: node.attrs.html,
        css: node.attrs.css,
        js: node.attrs.js,
      }),
    );
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-code-embed": payload,
        class: "code-embed-block",
      }),
      "",
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }: { node: any; getPos: any; editor: any }) => {
      const dom = document.createElement("div");
      dom.className = "code-embed-block";
      dom.style.cssText =
        "border:2px dashed #00a884;border-radius:12px;padding:12px;margin:14px 0;background:#f0fdf9;position:relative";

      const label = document.createElement("div");
      label.style.cssText =
        "font-size:11px;font-weight:700;color:#00a884;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px";
      label.innerHTML =
        '<span>⚙️ CODE EMBED — Live preview (click to edit)</span>';

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "Edit";
      editBtn.style.cssText =
        "background:#00a884;color:#fff;border:0;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer";
      editBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = typeof getPos === "function" ? getPos() : null;
        window.dispatchEvent(
          new CustomEvent("code-embed-edit", {
            detail: {
              pos,
              attrs: { html: node.attrs.html, css: node.attrs.css, js: node.attrs.js },
            },
          }),
        );
      };

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.style.cssText =
        "background:#fee2e2;color:#b91c1c;border:0;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer";
      removeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = typeof getPos === "function" ? getPos() : null;
        if (pos != null) {
          editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
        }
      };

      const btnRow = document.createElement("div");
      btnRow.style.cssText = "display:flex;gap:6px";
      btnRow.appendChild(editBtn);
      btnRow.appendChild(removeBtn);
      label.appendChild(btnRow);

      dom.appendChild(label);

      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "width:100%;border:1px solid #d1fae5;border-radius:8px;background:#fff;min-height:120px;display:block";
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.srcdoc = buildEmbedSrcdoc({
        html: node.attrs.html,
        css: node.attrs.css,
        js: node.attrs.js,
      });
      dom.appendChild(iframe);

      return {
        dom,
        update(updated) {
          if (updated.type.name !== "codeEmbed") return false;
          iframe.srcdoc = buildEmbedSrcdoc({
            html: updated.attrs.html,
            css: updated.attrs.css,
            js: updated.attrs.js,
          });
          return true;
        },
      };
    };
  },
});
