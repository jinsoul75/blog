import Link from "next/link";
import { notFound } from "next/navigation";
import { mockPosts } from "@/lib/mock-posts";
import { formatDate } from "@/lib/posts";

export default async function PreviewPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { slug } = await params;
  const post = mockPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <main id="main-content" className="reading-shell">
      <Link className="back-link" href="/preview">
        ← 미리보기 글 목록
      </Link>
      <header className="article-header">
        <div className="post-meta">
          <span className="category">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>예시 글</span>
        </div>
        <h1>{post.title}</h1>
        <div className="post-tags">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/preview?tag=${encodeURIComponent(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>
      <article
        id="post-content"
        className="prose prose-neutral dark:prose-invert"
        style={{ maxWidth: 740 }}
      >
        <p>{post.text}</p>
        <blockquote>
          <p>
            목록과 검색 동작을 확인하기 위한 목데이터입니다. 실제 작성된 글은
            아닙니다.
          </p>
        </blockquote>
      </article>
    </main>
  );
}
