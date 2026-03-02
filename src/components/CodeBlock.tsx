"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR 시 기본 스타일
    return (
      <pre className="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
        <code className="text-sm">{children}</code>
      </pre>
    );
  }

  const theme = resolvedTheme === "dark" ? oneDark : oneLight;

  return (
    <SyntaxHighlighter
      language={language || "text"}
      style={theme}
      customStyle={{
        borderRadius: "0.5rem",
        padding: "1rem",
        fontSize: "0.875rem",
        lineHeight: "1.5",
      }}
      showLineNumbers={false}
    >
      {children}
    </SyntaxHighlighter>
  );
}
