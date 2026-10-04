"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
const subscribe = () => () => {};
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      className="theme-toggle"
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span aria-hidden="true">{dark ? "☾" : "☀"}</span>
    </button>
  );
}
