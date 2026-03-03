"use client";

import { useEffect, useMemo, useState } from "react";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

type PostNavigatorProps = {
  rootId: string;
  items: TocItem[];
};

export function PostNavigator({ rootId, items }: PostNavigatorProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const headings = items
      .map((item) => root.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [rootId, items]);

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  if (!hasItems) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
          On this page
        </p>
        <nav aria-label="본문 네비게이터">
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    "block text-sm transition-colors",
                    item.level === 1
                      ? "pl-0"
                      : item.level === 2
                        ? "pl-3"
                        : "pl-6",
                    activeId === item.id
                      ? "font-semibold text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
                  ].join(" ")}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
