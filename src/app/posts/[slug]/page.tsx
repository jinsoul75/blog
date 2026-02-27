import { getPostBySlug, getPageBlocks } from '@/lib/notion';
import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Fragment, type JSX } from 'react';

// Revalidate every hour
export const revalidate = 3600;

// Helper function to render text annotations from Notion
const renderText = (textArray: RichTextItemResponse[] = []) => {
  return textArray.map((text: RichTextItemResponse, index: number) => {
    const { annotations, plain_text, href } = text;
    const { bold, code, italic, strikethrough, underline } = annotations;

    let content: JSX.Element = <>{plain_text}</>;

    if (bold) content = <strong>{content}</strong>;
    if (italic) content = <em>{content}</em>;
    if (strikethrough) content = <s>{content}</s>;
    if (underline) content = <u>{content}</u>;
    if (code) content = <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{content}</code>;
    if (href) content = <a href={href} className="text-blue-500 hover:underline">{content}</a>;
    
    return <Fragment key={index}>{content}</Fragment>;
  });
};

// Helper function to render a single Notion block
const renderBlock = (block: BlockObjectResponse) => {
  // The 'prose' class from Tailwind Typography will handle most of the styling
  switch (block.type) {
    case 'paragraph':
      return <p>{renderText(block.paragraph.rich_text)}</p>;
    case 'heading_1':
      return <h1>{renderText(block.heading_1.rich_text)}</h1>;
    case 'heading_2':
      return <h2>{renderText(block.heading_2.rich_text)}</h2>;
    case 'heading_3':
      return <h3>{renderText(block.heading_3.rich_text)}</h3>;
    case 'bulleted_list_item':
      return <li>{renderText(block.bulleted_list_item.rich_text)}</li>;
    case 'numbered_list_item':
      return <li>{renderText(block.numbered_list_item.rich_text)}</li>;
    case 'code':
      // The prose class styles this, but we can add language later
      return (
        <pre><code>{renderText(block.code.rich_text)}</code></pre>
      );
    case 'image': {
      const image = block.image;
      const src = image.type === 'external' ? image.external.url : image.file.url;
      const captionNodes = image.caption.length ? renderText(image.caption) : null;
      const captionPlain = image.caption.map((text) => text.plain_text).join(' ').trim();
      const altText = captionPlain || 'Blog post image';

      return (
        <figure className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/20">
            <Image
              src={src}
              alt={altText}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>
          {captionNodes && (
            <figcaption className="text-center text-sm text-neutral-400">
              {captionNodes}
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      // Fallback for unsupported blocks
      return <p className="text-red-500">[Unsupported block type: {block.type}]</p>;
  }
};

const isFullBlock = (
  block: BlockObjectResponse | PartialBlockObjectResponse,
): block is BlockObjectResponse => 'type' in block;

const getPostTitle = (page: PageObjectResponse) => {
  const titleProperty = page.properties.Name;
  if (titleProperty?.type === 'title') {
    return titleProperty.title[0]?.plain_text || 'Untitled';
  }
  return 'Untitled';
};

const getPostDate = (page: PageObjectResponse) => {
  const dateProperty = page.properties.Date;
  if (dateProperty?.type === 'date' && dateProperty.date?.start) {
    return new Date(dateProperty.date.start).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return 'Date not set';
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const rawBlocks = await getPageBlocks(post.id);
  const blocks = rawBlocks.filter(isFullBlock);

  const title = getPostTitle(post);
  const date = getPostDate(post);

  return (
    <main>
      <div className="page-inner">
        <article className="mx-auto w-full max-w-3xl">
          <header className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700/70 bg-neutral-900/80 px-3 py-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Notion Post
              </span>
              <span>{date}</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
          </header>

          <section className="prose prose-invert prose-sky mx-auto max-w-none lg:prose-lg">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </section>
        </article>
      </div>
    </main>
  );
}