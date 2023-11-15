import { env } from "~/env.mjs";
import type { Site } from '@prisma/client'

export const getUserSiteHref = (site: Site) => {
  const protocol = env.NEXT_PUBLIC_DOMAIN_ROOT === 'localhost:3000' ? 'http://' : 'https://'
  return `${protocol}${site.subdomain}.${env.NEXT_PUBLIC_DOMAIN_ROOT}`
}