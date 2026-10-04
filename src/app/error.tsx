"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content" className="home-shell empty-state"><h1>글을 불러오지 못했어요</h1><p>잠시 후 다시 시도해 주세요.</p><button onClick={reset}>다시 불러오기 ↗</button></main>;
}
