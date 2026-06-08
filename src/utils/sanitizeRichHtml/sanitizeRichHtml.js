"use client";

import DOMPurify from "dompurify";

/** Keep rich formatting (classes + inline styles) but sanitize safely */
export function sanitizeRichHtml(html) {
  const input = html || "";

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if ("target" in node && node.target === "_blank") {
      const rel = (node.getAttribute("rel") || "")
        .split(" ")
        .filter(Boolean);

      if (!rel.includes("noopener")) rel.push("noopener");
      if (!rel.includes("noreferrer")) rel.push("noreferrer");

      node.setAttribute("rel", rel.join(" "));
    }
  });

  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true },
    ALLOW_DATA_ATTR: true,
    ALLOWED_TAGS: [
      "div","p","br","hr","blockquote","pre","code","figure","figcaption",
      "span","strong","b","em","i","u","s","sub","sup","small",
      "ul","ol","li",
      "h1","h2","h3","h4","h5","h6",
      "a","img",
      "table","thead","tbody","tfoot","tr","th","td",
    ],
    ALLOWED_ATTR: [
      "style","class","id",
      "href","target","rel",
      "title","alt","width","height",
      "aria-label","aria-hidden","role",
      "colspan","rowspan","align","valign",
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|sms):|data:image\/(?:png|gif|jpg|jpeg|webp|svg\+xml);base64)/i,
  });
}
