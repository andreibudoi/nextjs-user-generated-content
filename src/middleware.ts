import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

const HIDDEN_ROUTE_PREFIX = '-sites';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host');

  if (!host || host === env.NEXT_PUBLIC_DOMAIN_ROOT) {
    return NextResponse.next();
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const siteKey = host.replace(`.${env.NEXT_PUBLIC_DOMAIN_ROOT}`, "");
  const isUserSite = siteKey !== env.NEXT_PUBLIC_DOMAIN_ROOT;
  const isForbidden = pathname.startsWith(`/${HIDDEN_ROUTE_PREFIX}`);

  if (isForbidden) {
    return NextResponse.rewrite(`${origin}/404`);
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  if (isUserSite) {
    // return NextResponse.next();
    return NextResponse.rewrite(new URL(`/${HIDDEN_ROUTE_PREFIX}/${siteKey}${path}`, req.url));
  }
  return NextResponse.next();
}
