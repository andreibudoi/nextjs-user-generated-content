import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getUserSiteHref } from "~/helpers";

export default async function YourWebsite() {
  const site = await api.site.getSiteByUserId.query()
  if (!site) {
    return;
  }

  const userHref = getUserSiteHref(site)

  const latestPost = await api.post.getLatest.query()
  const latestPostHref = `${userHref}/${latestPost?.id}`

  return (
    <div className='w-full flex flex-col'>
      <Button asChild variant='link'>
        <Link
          href={userHref}
          target='_blank'
          className='text-xl'
        >
          {`Your website: ${userHref}`}
        </Link>
      </Button>
      {!!latestPost && <Button asChild variant='link'>
        <Link
          href={latestPostHref}
          target='_blank'
          className='text-xl'
        >
          {`Latest post: ${latestPost.name}`}
        </Link>
      </Button>}
    </div>
  )
}