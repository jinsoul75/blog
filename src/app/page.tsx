import { getSearchablePosts } from "@/lib/notion";
import { PostsSection } from "@/components/PostsSection";
import { Suspense } from "react";
export const revalidate = 3600;
export default async function Home() {
  const posts = await getSearchablePosts();
  return (
    <main id="main-content" className="home-shell">
      <h1 className="sr-only">글 모아보기</h1>
      <Suspense fallback={<p role="status">글 목록을 불러오고 있어요…</p>}>
        <PostsSection posts={posts} />
      </Suspense>
    </main>
  );
}
