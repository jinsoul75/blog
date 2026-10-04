"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  children: string;
}
const subscribe = () => () => {};

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const theme = mounted && resolvedTheme === "dark" ? oneDark : oneLight;

  return (
    <SyntaxHighlighter
      className="not-prose"
      language={language || "text"}
      style={theme}
      customStyle={{
        margin: "1.5rem 0",
        overflowX: "auto",
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
