import { getPublishedPosts } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { PostsSection } from "@/components/PostsSection";

type PublishedPost = PageObjectResponse;

// Revalidate every hour
export const revalidate = 3600; 

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main>
      <div className="page-inner">
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-balance text-[2.4rem] font-semibold tracking-tight sm:text-[2.8rem]">
            jinsoul blog
          </h1>
        </header>

        <PostsSection posts={posts as PublishedPost[]} />
      </div>
    </main>
  );
}