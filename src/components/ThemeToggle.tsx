"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 방지를 위해 마운트 후에만 렌더링
  // 이 패턴은 next-themes와 함께 사용할 때 일반적이고 안전합니다
  // React Compiler가 경고하지만, 이는 의도적인 패턴입니다
  // 서버와 클라이언트의 렌더링 결과를 일치시키기 위해 필요합니다
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  // 테마 변경 감지 및 디버깅
  useEffect(() => {
    if (mounted) {
      console.log("테마 상태:", { theme, resolvedTheme });
      console.log("HTML 클래스:", document.documentElement.className);
    }
  }, [theme, resolvedTheme, mounted]);

  const handleToggle = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    console.log("테마 변경:", newTheme, "현재 resolvedTheme:", resolvedTheme);
    setTheme(newTheme);
    
    // 디버깅: html 클래스 확인
    setTimeout(() => {
      console.log("HTML 클래스:", document.documentElement.className);
      console.log("HTML 배경색:", window.getComputedStyle(document.documentElement).backgroundColor);
      console.log("Body 배경색:", window.getComputedStyle(document.body).backgroundColor);
    }, 100);
  };

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-black shadow-lg shadow-black/10 backdrop-blur">
        {/* 로딩 상태에서는 임시 아이콘 */}
        <span aria-hidden="true">☀️</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 cursor-pointer rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-black shadow-lg shadow-black/10 backdrop-blur hover:border-sky-400 hover:text-sky-700 dark:border-white/20 dark:bg-neutral-900/80 dark:text-neutral-100 dark:shadow-black/40"
    >
      <span className="sr-only">
        {resolvedTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      </span>
      <span aria-hidden="true" className="text-lg leading-none">
        {resolvedTheme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
