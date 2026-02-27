import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

const isFullPageObject = (
  entry: QueryDatabaseResponse['results'][number],
): entry is PageObjectResponse => entry.object === 'page' && 'properties' in entry;

// Debugging: Check if the environment variable is loaded.
console.log(
  "Checking Notion Token:",
  process.env.NOTION_TOKEN
    ? `Loaded, starts with '${process.env.NOTION_TOKEN.substring(0, 5)}...'`
    : "NOT LOADED OR UNDEFINED"
);

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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
  
  // 디버깅: Database ID 확인
  console.log('Database ID:', databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT SET');

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      // filter: {
      //   property: 'Published',
      //   checkbox: {
      //     equals: true,
      //   },
      // },
      // sorts: [
      //   {
      //     property: 'Date',
      //     direction: 'descending',
      //   },
      // ],
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
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        // Notion DB에서 slug는 rich_text 속성이라고 가정합니다.
        // 실제 속성 이름(대소문자 포함)이 다르면 여기 문자열을 맞춰주세요.
        property: 'slug',
        rich_text: {
          equals: normalizedSlug,
        },
      },
    });

    const fullPage = response.results.find(isFullPageObject);
    if (!fullPage) {
      return null;
    }

    return fullPage;
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
