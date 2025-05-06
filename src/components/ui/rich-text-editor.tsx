"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import Quill dynamically to avoid SSR issues
const QuillImport = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p className="border p-4 text-center">Loading editor...</p>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  error = false,
}: RichTextEditorProps) {
  // Only render QuillImport on the client side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
      ["image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "link",
    "image",
  ];

  if (!mounted) {
    return (
      <div
        className={`border p-4 min-h-[200px] ${
          error ? "border-rose-500" : "border-input"
        }`}
      >
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={`${className} ${error ? "quill-error" : ""}`}>
      <style jsx global>{`
        .quill-error .ql-container {
          border-color: hsl(0, 84.2%, 60.2%) !important;
        }
        .quill-error .ql-toolbar {
          border-color: hsl(0, 84.2%, 60.2%) !important;
        }
      `}</style>
      <QuillImport
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder={placeholder}
        className="min-h-[200px] [&_.ql-container]:rounded-b-md [&_.ql-toolbar]:rounded-t-md"
      />
    </div>
  );
}
