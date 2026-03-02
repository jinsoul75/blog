"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PostsSectionProps = {
  posts: PageObjectResponse[];
};

const CATEGORIES = ["전체", "개발", "회고", "후기"] as const;
type Category = (typeof CATEGORIES)[number];

const DEFAULT_CATEGORY: Category = "전체";
const POSTS_PER_PAGE = 9;

type PageProperties = PageObjectResponse["properties"];

function isDoneStatus(post: PageObjectResponse): boolean {
  const properties = post.properties as PageProperties;
  const statusProperty = (properties as Record<string, PageProperties[string]>)
    .Status;

  if (statusProperty?.type === "status") {
    return statusProperty.status?.name === "Done";
  }

  return false;
}

function getPostCategory(post: PageObjectResponse): Category | "기타" {
  const categoryProperty = post.properties.Category;

  if (categoryProperty?.type === "select") {
    const name = categoryProperty.select?.name;
    if (name === "개발" || name === "회고" || name === "후기") {
      return name;
    }
  }

  return "기타";
}

export function PostsSection({ posts }: PostsSectionProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(DEFAULT_CATEGORY);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const donePosts = posts.filter(isDoneStatus);

    const result =
      selectedCategory === "전체"
        ? donePosts
        : donePosts.filter(
            (post) => getPostCategory(post) === selectedCategory,
          );

    return result;
  }, [posts, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, safeCurrentPage]);

  const handleChangeCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <nav className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleChangeCategory(category)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition cursor-pointer",
                isActive
                  ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </nav>

      <div className="overflow-x-auto">
        <table className="w-4/5 mx-auto border-collapse">
          <tbody>
            {paginatedPosts.map((post: PageObjectResponse) => {
              const titleProperty = post.properties.title;
              const dateProperty = post.properties["Publication Date"];
              const slugProperty = post.properties.slug;

              const title =
                titleProperty?.type === "title"
                  ? titleProperty.title[0]?.plain_text ?? "Untitled"
                  : "Untitled";

              const dateValue =
                dateProperty?.type === "date"
                  ? dateProperty.date?.start
                  : undefined;

              const date = dateValue
                ? new Date(dateValue).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date not set";

              const slug =
                slugProperty?.type === "rich_text"
                  ? slugProperty.rich_text[0]?.plain_text
                  : undefined;

              if (!slug) {
                return null;
              }

              const category = getPostCategory(post);

              return (
                <tr
                  key={post.id}
                  className="border-b border-neutral-100 dark:border-neutral-900"
                >
                  <td className="py-4 px-4 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap w-0 align-middle">
                    {date}
                  </td>
                  <td className="py-4 px-4 text-left w-full">
                    <Link
                      href={`/posts/${slug}`}
                      className="block cursor-pointer"
                    >
                      <span className="text-sm font-medium text-black dark:text-white">
                        {title}
                      </span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-right align-middle whitespace-nowrap w-32">
                    <span className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-700 min-w-18">
                      {category === "기타" ? "글 보기" : category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPosts.length > 0 && (
        <div className="mt-12 flex items-center justify-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          <button
            type="button"
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={[
              "rounded-full px-3 py-1 transition cursor-pointer",
              currentPage === 1
                ? "text-neutral-300 cursor-not-allowed dark:text-neutral-600"
                : "hover:text-black dark:hover:text-white",
            ].join(" ")}
          >
            이전
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handleChangePage(page)}
                  className={[
                    "h-7 min-w-7 rounded-full px-2 text-xs font-medium transition cursor-pointer",
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white",
                  ].join(" ")}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={[
              "rounded-full px-3 py-1 transition cursor-pointer",
              currentPage === totalPages
                ? "text-neutral-300 cursor-not-allowed dark:text-neutral-600"
                : "hover:text-black dark:hover:text-white",
            ].join(" ")}
          >
            다음
          </button>
        </div>
      )}
    </>
  );
}

