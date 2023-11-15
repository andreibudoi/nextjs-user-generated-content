import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export default async function BlogPost({ params }: {
  params: {
    siteKey: string
    slug: string
  }
}) {
  const siteKey = decodeURIComponent(params.siteKey);
  const slug = decodeURIComponent(params.slug);
  const post = await api.post.getPost.query({ siteKey, slug })

  if (!post) {
    notFound();
  }
  const { name, content } = post;
  const renderedHTML = generateHTML(JSON.parse(content), [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal pl-4",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc pl-4",
        },
      },
    }),
  ]);

  return <div className='w-full flex flex-col items-center gap-10'>
    <h1 className='text-5xl font-bold'>{name}</h1>
    <div
      className='w-full prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl'
      dangerouslySetInnerHTML={{ __html: renderedHTML }}
    />
  </div>
}