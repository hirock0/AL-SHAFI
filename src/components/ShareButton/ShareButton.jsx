// components/ShareButton.jsx
"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Share URL Copied Successfully!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyUrl}
      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-border
      hover:border-primary text-text hover:text-primary  transition-all
      duration-200 w-full"
    >
      <Share2 className="w-4 h-4" strokeWidth={2} />
      <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}
