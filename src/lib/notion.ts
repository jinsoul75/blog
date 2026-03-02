import { Client } from '@notionhq/client';
import { NotionToMarkdown } from "notion-to-md";
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

const isFullPageObject = (
  entry: QueryDatabaseResponse['results'][number],
): entry is PageObjectResponse => entry.object === 'page' && 'properties' in entry;

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * Notion Database ID를 정규화합니다.
 * URL 형식이 들어온 경우 UUID만 추출합니다.
 */
const normalizeDatabaseId = (id: string | undefined): string => {
  if (!id) {
    throw new Error('NOTION_DATABASE_ID가 .env.local 파일에 설정되지 않았습니다.');
  }

  // URL 형식인 경우 UUID만 추출
  // 예: https://www.notion.so/workspace/32자리UUID?v=... -> 32자리UUID
  const urlMatch = id.match(/([a-f0-9]{32})/i);
  if (urlMatch) {
    // UUID 형식으로 변환 (하이픈 추가)
    const uuid = urlMatch[1];
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`;
  }

  // 이미 UUID 형식이거나 다른 형식인 경우 그대로 반환
  return id.trim();
};

/**
 * 게시된 모든 블로그 포스트를 가져옵니다.
 * Notion 데이터베이스에 'Published' (Checkbox), 'Date' (Date) 속성이 있다고 가정합니다.
 */
export const getPublishedPosts = async (): Promise<PageObjectResponse[]> => {
  const databaseId = normalizeDatabaseId(process.env.NOTION_DATABASE_ID);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    return response.results.filter(isFullPageObject);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'object_not_found') {
      throw new Error(
        `Notion 데이터베이스를 찾을 수 없습니다 (ID: ${databaseId}).\n` +
        `해결 방법:\n` +
        `1. Notion에서 데이터베이스 페이지를 엽니다\n` +
        `2. 우측 상단의 "···" 메뉴를 클릭합니다\n` +
        `3. "Connections" → Integration을 선택하거나 추가합니다\n` +
        `4. Integration이 올바른 워크스페이스에 있는지 확인합니다\n` +
        `   (https://www.notion.so/my-integrations)`
      );
    }
    throw error;
  }
};

/**
 * 슬러그(slug)를 이용해 특정 포스트의 페이지 정보를 가져옵니다.
 * Notion 데이터베이스에 'Slug' (Rich Text) 속성이 있다고 가정합니다.
 */
export const getPostBySlug = async (
  slug: string,
): Promise<PageObjectResponse | null> => {
  const normalizedSlug = slug?.trim();
  if (!normalizedSlug) {
    // 슬러그가 비어 있으면 Notion 쿼리를 날리지 않고 바로 null 반환
    return null;
  }

  const databaseId = normalizeDatabaseId(process.env.NOTION_DATABASE_ID);

  try {
    // 슬러그 필터가 실제 속성 이름/타입과 다를 수 있으므로,
    // 전체 결과를 가져온 뒤 코드에서 슬러그를 비교합니다.
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const fullPages = response.results.filter(isFullPageObject);

    const matchedPage = fullPages.find((page) => {
      const properties = page.properties as PageObjectResponse["properties"];
      const slugProperty =
        (properties as Record<string, PageObjectResponse["properties"][string]>)
          .slug ??
        (properties as Record<string, PageObjectResponse["properties"][string]>)
          .Slug;

      if (slugProperty?.type === "rich_text") {
        const value =
          slugProperty.rich_text[0]?.plain_text?.trim().toLowerCase();
        return value === normalizedSlug.toLowerCase();
      }

      if (slugProperty?.type === "title") {
        const value = slugProperty.title[0]?.plain_text?.trim().toLowerCase();
        return value === normalizedSlug.toLowerCase();
      }

      return false;
    });

    if (!matchedPage) {
      return null;
    }

    return matchedPage;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'object_not_found') {
      throw new Error(
        `Notion 데이터베이스를 찾을 수 없습니다 (ID: ${databaseId}).\n` +
        `해결 방법:\n` +
        `1. Notion에서 데이터베이스 페이지를 엽니다\n` +
        `2. 우측 상단의 "···" 메뉴를 클릭합니다\n` +
        `3. "Connections" → Integration을 선택하거나 추가합니다\n` +
        `4. Integration이 올바른 워크스페이스에 있는지 확인합니다\n` +
        `   (https://www.notion.so/my-integrations)`
      );
    }
    throw error;
  }
};

/**
 * 특정 페이지의 모든 블록(콘텐츠)을 가져옵니다.
 */
export const getPageBlocks = async (pageId: string) => {
  let allBlocks: Awaited<ReturnType<typeof notion.blocks.children.list>>['results'] = [];
  let nextCursor: string | null | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: nextCursor ?? undefined,
      page_size: 100, // Notion API max page size
    });
    allBlocks = allBlocks.concat(response.results);
    nextCursor = response.next_cursor;
  } while (nextCursor);

  return allBlocks;
};

/**
 * 특정 슬러그에 해당하는 페이지를 마크다운 문자열로 변환해서 반환합니다.
 */
export const getPostMarkdownBySlug = async (
  slug: string,
): Promise<{ page: PageObjectResponse; markdown: string } | null> => {
  const page = await getPostBySlug(slug);
  if (!page) return null;

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  return {
    page,
    markdown: mdString.parent,
  };
};

/**
 * 포스트에서 slug를 추출합니다.
 */
const getPostSlug = (page: PageObjectResponse): string | null => {
  const properties = page.properties as PageObjectResponse["properties"];
  const slugProperty =
    (properties as Record<string, PageObjectResponse["properties"][string]>)
      .slug ??
    (properties as Record<string, PageObjectResponse["properties"][string]>)
      .Slug;

  if (slugProperty?.type === "rich_text") {
    return slugProperty.rich_text[0]?.plain_text?.trim().toLowerCase() || null;
  }

  if (slugProperty?.type === "title") {
    return slugProperty.title[0]?.plain_text?.trim().toLowerCase() || null;
  }

  return null;
};

/**
 * 모든 포스트의 slug 목록을 가져옵니다. (SSG용)
 */
export const getAllPostSlugs = async (): Promise<string[]> => {
  const posts = await getPublishedPosts();
  const slugs = posts
    .map(getPostSlug)
    .filter((slug): slug is string => slug !== null);

  return slugs;
};
