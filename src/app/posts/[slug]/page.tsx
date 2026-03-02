import { getPostMarkdownBySlug, getAllPostSlugs } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CodeBlock } from "@/components/CodeBlock";

// 제목 기반 slug를 사용하므로 동적 라우팅을 허용
export const dynamicParams = true;

// SSG를 사용하므로 revalidate 제거 (또는 false로 설정)
// ISR을 원한다면 revalidate 값을 설정
// export const revalidate = 3600;

const getPostTitle = (page: PageObjectResponse) => {
  const props = page.properties as PageObjectResponse["properties"];
  const titleProperty =
    (props as Record<string, PageObjectResponse["properties"][string]>).title ??
    props.Name;

  if (titleProperty?.type === "title") {
    return titleProperty.title[0]?.plain_text || "Untitled";
  }

  return "Untitled";
};

const getPostDate = (page: PageObjectResponse) => {
  const props = page.properties as PageObjectResponse["properties"];
  const dateProperty =
    (props as Record<string, PageObjectResponse["properties"][string]>)[
      "Publication Date"
    ] ?? props.Date;

  if (dateProperty?.type === "date" && dateProperty.date?.start) {
    return new Date(dateProperty.date.start).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return "Date not set";
};

// SSG: 빌드 시 생성할 모든 경로를 반환
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPostMarkdownBySlug(slug);

  if (!result) {
    notFound();
  }

  const { page, markdown } = result;
  const title = getPostTitle(page);
  const date = getPostDate(page);

  return (
    <main>
      <div className="page-inner">
        <article className="mx-auto w-full max-w-3xl">
          <header className="mb-10 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <Link
                href="/"
                className="cursor-pointer underline-offset-2 hover:underline"
              >
                ← 글 목록으로
              </Link>
              <span>{date}</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
              {title}
            </h1>
          </header>

          <section className="prose prose-sky mx-auto max-w-none text-neutral-900 lg:prose-lg dark:prose-invert dark:text-neutral-100">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                // HTML 태그를 직접 렌더링하도록 허용
                h1: ({ children, ...props }) => (
                  <h1 className="mt-8 mb-4 text-3xl font-bold text-neutral-900 dark:text-white" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="mt-6 mb-3 text-2xl font-bold text-neutral-900 dark:text-white" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="mt-4 mb-2 text-xl font-bold text-neutral-900 dark:text-white" {...props}>
                    {children}
                  </h3>
                ),
                // 코드 블록 커스텀 렌더링
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  const codeString = String(children).replace(/\n$/, "");
                  const inline = !match; // language가 없으면 inline 코드

                  return !inline && language ? (
                    <CodeBlock language={language}>{codeString}</CodeBlock>
                  ) : (
                    <code
                      className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // pre 태그는 CodeBlock에서 처리하므로 제거
                pre: ({ children }) => {
                  return <>{children}</>;
                },
              } as Components}
            >
              {markdown}
            </ReactMarkdown>
          </section>
        </article>
      </div>
    </main>
  );
}
