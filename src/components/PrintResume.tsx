"use client";

export function PrintResume() {
  return (
    <button className="about-button about-print" onClick={() => window.print()}>
      이력서 인쇄 / PDF 저장 <span aria-hidden="true">↗</span>
    </button>
  );
}
