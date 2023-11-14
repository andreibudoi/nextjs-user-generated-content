import { api } from "~/trpc/server";
import { env } from "~/env.mjs";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function YourWebsite() {
  const site = await api.site.getSiteByUserId.query()
  if (!site) {
    return;
  }

  const protocol = env.NEXT_PUBLIC_DOMAIN_ROOT === 'localhost:3000' ? 'http://' : 'https://'
  const userHref = `${protocol}${site.subdomain}.${env.NEXT_PUBLIC_DOMAIN_ROOT}`

  return (
    <Button asChild variant='link'>
      <Link
        href={userHref}
        target='_blank'
        className='text-xl'
      >
        {`Your website: ${userHref}`}
      </Link>
    </Button>
  )
}