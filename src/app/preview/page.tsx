import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostsSection } from "@/components/PostsSection";
import { mockPosts } from "@/lib/mock-posts";

export default function Preview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main id="main-content" className="home-shell">
      <h1 className="sr-only">글 목록 미리보기</h1>
      <p className="search-hint" style={{ marginTop: 24 }}>
        미리보기 · 예시 글 20개
      </p>
      <Suspense fallback={<p>글 목록을 불러오고 있어요…</p>}>
        <PostsSection posts={mockPosts} basePath="/preview" />
      </Suspense>
    </main>
  );
}
