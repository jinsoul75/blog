import { getPostMarkdownBySlug, getAllPostSlugs } from "@/lib/notion";
import { summarizePost, formatDate } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";
import { PostNavigator } from "@/components/PostNavigator";
import { createSlugFromTitle } from "@/lib/slug";
import { Children, isValidElement, type ReactNode } from "react";
export const revalidate = 1800;
export async function generateStaticParams() {
  return (await getAllPostSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const result = await getPostMarkdownBySlug((await params).slug);
  if (!result) return {};
  const post = summarizePost(result.page, result.markdown);
  return { title: post.title, description: post.excerpt };
}
function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return text(node.props.children);
  return "";
}
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const result = await getPostMarkdownBySlug((await params).slug);
  if (!result) notFound();
  const post = summarizePost(result.page, result.markdown);
  const ids = new Map<string, number>();
  function id(children: ReactNode) {
    const base = createSlugFromTitle(text(children)) || "section";
    const count = ids.get(base) ?? 0;
    ids.set(base, count + 1);
    return count ? base + "-" + count : base;
  }
  return (
    <main id="main-content" className="reading-shell">
      <Link className="back-link" href="/#posts">
        ← 글 목록
      </Link>
      <header className="article-header">
        <div className="post-meta">
          <span className="category">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>{post.minutes}분 읽기</span>
        </div>
        <h1>{post.title}</h1>
        <div className="post-tags">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}#posts`}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>
      <div className="reading-grid">
        <article className="article-body">
          <section
            id="post-content"
            className="prose prose-neutral dark:prose-invert max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 id={id(children)}>{children}</h1>,
                h2: ({ children }) => <h2 id={id(children)}>{children}</h2>,
                h3: ({ children }) => <h3 id={id(children)}>{children}</h3>,
                pre: ({ children }) => {
                  const child = Children.toArray(children)[0];
                  if (
                    isValidElement<{
                      className?: string;
                      children?: ReactNode;
                    }>(child)
                  ) {
                    const lang = /language-([^\s]+)/.exec(
                      child.props.className ?? "",
                    )?.[1];
                    return (
                      <CodeBlock language={lang}>
                        {text(child.props.children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return <pre>{children}</pre>;
                },
                table: ({ children }) => (
                  <div
                    className="table-scroll"
                    tabIndex={0}
                    role="region"
                    aria-label="본문 표, 가로 스크롤 가능"
                  >
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {result.markdown}
            </ReactMarkdown>
          </section>
          <div className="article-end">
            <p>끝까지 읽어주셔서 감사합니다.</p>
            <Link href="/#posts">다른 이야기 읽기 ↗</Link>
            <a href="#main-content">맨 위로 ↑</a>
          </div>
        </article>
        <PostNavigator rootId="post-content" />
      </div>
    </main>
  );
}
