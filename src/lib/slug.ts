import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const createSlugFromTitle = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getPostTitleText = (page: PageObjectResponse): string => {
  const properties = page.properties as PageObjectResponse["properties"];
  const titleProperty =
    (properties as Record<string, PageObjectResponse["properties"][string]>)
      .title ?? properties.Name;

  if (titleProperty?.type === "title") {
    return titleProperty.title[0]?.plain_text?.trim() || "Untitled";
  }

  return "Untitled";
};

export const getPostSlugFromTitle = (page: PageObjectResponse): string => {
  const title = getPostTitleText(page);
  return createSlugFromTitle(title);
};
