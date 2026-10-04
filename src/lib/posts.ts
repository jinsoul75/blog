import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getPostSlugFromTitle, getPostTitleText } from "./slug";

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  text: string;
  minutes: number;
};

export function summarizePost(
  page: PageObjectResponse,
  markdown: string,
): PostSummary {
  const p = page.properties;
  const tag = p.Tags ?? p.Tag;
  const date = p["Publication Date"] ?? p.Date;
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`#*_>|~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    id: page.id,
    slug: getPostSlugFromTitle(page),
    title: getPostTitleText(page),
    date: date?.type === "date" ? (date.date?.start ?? "") : "",
    category:
      p.Category?.type === "select"
        ? (p.Category.select?.name ?? "기록")
        : "기록",
    tags:
      tag?.type === "multi_select"
        ? tag.multi_select.map((t) => t.name)
        : tag?.type === "select" && tag.select
          ? [tag.select.name]
          : [],
    excerpt: text.slice(0, 160),
    text,
    minutes: Math.max(1, Math.ceil(text.length / 650)),
  };
}

export function matchesPost(post: PostSummary, query: string, tag: string) {
  const haystack = [post.title, post.text, ...post.tags]
    .join(" ")
    .normalize("NFC")
    .toLocaleLowerCase();
  const terms = query
    .normalize("NFC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return (
    (!tag || post.tags.includes(tag)) &&
    terms.every((term) => haystack.includes(term))
  );
}

export function formatDate(date: string) {
  return date
    ? new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";
}
