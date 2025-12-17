"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

export default function RichTextEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const Quill = (await import("quill")).default;

      if (!mounted || !containerRef.current) return;

      // Toolbar
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ];

      // Create editor element once
      if (!editorRef.current) {
        editorRef.current = document.createElement("div");
        containerRef.current.appendChild(editorRef.current);
      }

      // Initialize Quill
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Write your product description...",
        modules: {
          toolbar: toolbarOptions,
          clipboard: { matchVisual: false },
        },
      });

      // Set initial content
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Sync back to parent
      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root?.innerHTML || "";
        onChange(html);
      });
    })();

    return () => {
      mounted = false;

      // Cleanup
      if (containerRef.current && editorRef.current) {
        containerRef.current.removeChild(editorRef.current);
      }

      quillRef.current = null;
      editorRef.current = null;
    };
  }, []);

  // Update editor when parent value changes
  useEffect(() => {
    const quill = quillRef.current;
    if (quill && quill.root && quill.root.innerHTML !== value) {
      const sel = quill.getSelection();
      quill.root.innerHTML = value || "";
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-gray-200">
      <div ref={containerRef} />
    </div>
  );
}
