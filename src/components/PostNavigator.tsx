"use client";
import { useEffect, useState } from "react";
export type TocItem = { id: string; text: string; level: number };
export function PostNavigator({
  rootId,
}: {
  rootId: string;
  items?: TocItem[];
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");
  useEffect(() => {
    const headings = Array.from(
      document
        .getElementById(rootId)
        ?.querySelectorAll<HTMLElement>("h1,h2,h3") ?? [],
    );
    const frame = requestAnimationFrame(() =>
      setItems(
        headings.map((h) => ({
          id: h.id,
          text: h.textContent ?? "",
          level: Number(h.tagName[1]),
        })),
      ),
    );
    const scroll = () => {
      let current = headings[0]?.id ?? "";
      for (const h of headings)
        if (h.getBoundingClientRect().top <= 160) current = h.id;
      setActive(current);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [rootId]);
  if (!items.length) return null;
  return (
    <aside className="toc">
      <details open>
        <summary>이 글의 목차</summary>
        <nav aria-label="본문 목차">
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              style={{ paddingLeft: i.level === 3 ? 24 : 12 }}
            >
              {i.text}
            </a>
          ))}
        </nav>
      </details>
    </aside>
  );
}
