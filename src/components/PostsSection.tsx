"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDate, matchesPost, type PostSummary } from "@/lib/posts";
export function PostsSection({
  posts,
  basePath = "/",
}: {
  posts: PostSummary[];
  basePath?: string;
}) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const tag = params.get("tag") ?? "";
  function update(q: string, t: string) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (t) p.set("tag", t);
    history.replaceState(null, "", p.size ? `${basePath}?${p}` : basePath);
  }
  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );
  const results = useMemo(
    () => posts.filter((p) => matchesPost(p, query, tag)),
    [posts, query, tag],
  );
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const requestedPage = Number(params.get("page") ?? 1);
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1),
  );
  const pageNumbers = Array.from(
    new Set(
      [1, totalPages, page - 1, page, page + 1].filter(
        (n) => n >= 1 && n <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b);
  function changePage(next: number) {
    if (next < 1 || next > totalPages || next === page) return;
    const p = new URLSearchParams(params.toString());
    if (next === 1) p.delete("page");
    else p.set("page", String(next));
    history.pushState(null, "", p.size ? `${basePath}?${p}` : basePath);
    document.getElementById("posts")?.scrollIntoView({ block: "start" });
  }
  return (
    <section id="posts" className="archive">
      <div className="archive-toolbar">
        <h2>
          글 목록 <span>{posts.length.toString().padStart(2, "0")}</span>
        </h2>
        <span className="muted">최신순으로 모았어요</span>
      </div>
      <div className="search-field">
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="search">
          제목, 내용, 태그 검색
        </label>
        <input
          id="search"
          type="search"
          placeholder="제목, 본문, 태그로 검색"
          value={query}
          onChange={(e) => update(e.target.value, tag)}
        />
      </div>
      <nav className="tags" aria-label="태그 필터">
        <button aria-pressed={!tag} onClick={() => update(query, "")}>
          전체
        </button>
        {tags.map((t) => (
          <button
            key={t}
            aria-pressed={tag === t}
            onClick={() => update(query, tag === t ? "" : t)}
          >
            #{t}
          </button>
        ))}
      </nav>
      <p className="result-count" role="status">
        {query || tag
          ? `검색 결과 ${results.length}개의 글`
          : `${results.length}개의 이야기`}
        {totalPages > 1 && ` · ${page} / ${totalPages} 페이지`}
      </p>
      {results.slice((page - 1) * pageSize, page * pageSize).map((post) => {
        const pos = query.trim()
          ? post.text.toLowerCase().indexOf(query.trim().toLowerCase())
          : -1;
        const preview =
          pos > 80
            ? "…" + post.text.slice(Math.max(0, pos - 45), pos + 140)
            : post.excerpt;
        return (
          <article className="post-row" key={post.id}>
            <div className="post-meta">
              <span className="category">{post.category}</span>
              <span>{formatDate(post.date)}</span>
              <span>{post.minutes}분 읽기</span>
            </div>
            <Link
              className="post-link"
              href={`${basePath === "/" ? "/posts" : basePath}/${post.slug}`}
            >
              <h3>
                {post.title}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>
                {preview}
                {preview && "…"}
              </p>
            </Link>
            <div className="post-tags">
              {post.tags.map((t) => (
                <button key={t} onClick={() => update(query, t)}>
                  #{t}
                </button>
              ))}
            </div>
          </article>
        );
      })}
      {!results.length && (
        <div className="empty-state">
          <h3>찾으시는 글이 아직 없어요</h3>
          <p>다른 검색어를 입력하거나 태그를 해제해 보세요.</p>
          <button onClick={() => update("", "")}>전체 글 보기 ↗</button>
        </div>
      )}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="글 목록 페이지">
          <button
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
            aria-label="이전 페이지"
          >
            ← 이전
          </button>
          {pageNumbers.map((n, index) => (
            <span className="pagination-item" key={n}>
              {index > 0 && n - pageNumbers[index - 1] > 1 && (
                <span className="pagination-gap" aria-hidden="true">
                  …
                </span>
              )}
              <button
                aria-label={`${n}페이지`}
                aria-current={page === n ? "page" : undefined}
                onClick={() => changePage(n)}
              >
                {n}
              </button>
            </span>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
            aria-label="다음 페이지"
          >
            다음 →
          </button>
        </nav>
      )}
    </section>
  );
}
