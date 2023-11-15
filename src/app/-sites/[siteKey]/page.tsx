import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Home({ params }: {
  params: {
    siteKey: string
  }
}) {
  const siteKey = decodeURIComponent(params.siteKey);
  const site = await api.site.getSiteBySubdomain.query({ subdomain: siteKey })

  if (!site) {
    notFound();
  }

  const posts = await api.post.getAllPostsBySiteKey.query({ siteKey })

  if (posts.length === 0) {
    return <div>No posts yet</div>
  }

  return <div className='flex flex-col gap-2'>
    {posts.map(post => <Link href={`/${post.slug}`} key={post.id}>{post.name}</Link>)}
  </div>
}