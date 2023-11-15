import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogPost({ params }: {
  params: {
    siteKey: string
  }
}) {
  const siteKey = decodeURIComponent(params.siteKey);
  const site = await api.site.getSiteBySubdomain.query({ subdomain: siteKey })

  if (!site) {
    notFound();
  }

  const posts = await api.post.getAllPostsByCreatedById.query({ createdById: site.createdById })

  if (posts.length === 0) {
    return <div>No posts yet</div>
  }

  return <div>{posts.map(post => <Link href={`/${post.id}`} key={post.id}>{post.name}</Link>)}</div>
}