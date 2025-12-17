"use client";

import { useMemo } from "react";
import { sanitizeRichHtml } from "@/utils/sanitizeRichHtml/sanitizeRichHtml";

export default function ConverterToHtml({ html, className }) {
  const safeHtml = useMemo(() => sanitizeRichHtml(html), [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
