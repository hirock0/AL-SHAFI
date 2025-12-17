import DOMPurify from "isomorphic-dompurify";

/** Keep rich formatting (classes + inline styles) but sanitize safely */
export function sanitizeRichHtml(html) {
  const input = html || "";

  // Safer external links
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if ("target" in node) {
      const el = node;
      if (el.target === "_blank") {
        const rel = (el.getAttribute("rel") || "")
          .split(" ")
          .filter(Boolean);

        if (!rel.includes("noopener")) rel.push("noopener");
        if (!rel.includes("noreferrer")) rel.push("noreferrer");

        el.setAttribute("rel", rel.join(" "));
      }
    }
  });

  // Broad tag list to preserve typical editor output
  const ALLOWED_TAGS = [
    "div","p","br","hr","blockquote","pre","code","figure","figcaption",
    "span","strong","b","em","i","u","s","sub","sup","small",
    "ul","ol","li",
    "h1","h2","h3","h4","h5","h6",
    "a","img",
    "table","thead","tbody","tfoot","tr","th","td",
  ];

  const ALLOWED_ATTR = [
    "style","class","id",
    "href","target","rel",
    "title","alt","width","height",
    "aria-label","aria-hidden","role",
    "colspan","rowspan","align","valign",
  ];

  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true },
    ALLOW_DATA_ATTR: true,
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|sms):|data:image\/(?:png|gif|jpg|jpeg|webp|svg\+xml);base64)/i,
  });
}

/** Minimal, “simple HTML” version (no classes/styles) */
export function toSimpleHtml(html) {
  const input = html || "";
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      "p","br","strong","em","u","s",
      "ul","ol","li",
      "blockquote","pre","code",
      "a","img",
      "h1","h2","h3"
    ],
    ALLOWED_ATTR: ["href","target","rel","alt","width","height","title"],
    FORBID_ATTR: ["class","style","id"],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|sms):|data:image\/(?:png|gif|jpg|jpeg|webp|svg\+xml);base64)/i,
  });
}

/** Plain text extraction */
export function htmlToPlainText(html) {
  if (!html) return "";
  return (
    html
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim() || ""
  );
}
