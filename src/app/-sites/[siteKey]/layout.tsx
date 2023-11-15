import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { api } from "~/trpc/server";
import Link from "next/link";
import { getUserSiteHref } from "~/helpers";

export async function generateMetadata({
  params,
}: {
  params: { siteKey: string };
}): Promise<Metadata | null> {
  const siteKey = decodeURIComponent(params.siteKey);
  const site = await api.site.getSiteBySubdomain.query({ subdomain: siteKey })
  if (!site) {
    return null;
  }
  const {
    name: title,
    description,
  } = site;

  return {
    title,
    description,
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { siteKey: string };
  children: ReactNode;
}) {
  const siteKey = decodeURIComponent(params.siteKey);
  const site = await api.site.getSiteBySubdomain.query({ subdomain: siteKey })

  if (!site) {
    notFound();
  }

  const userHref = getUserSiteHref(site)

  return (
    <main
      className="flex min-h-screens p-10 flex-col">
      <Link href={userHref} className='text-4xl pb-4 font-bold'>{site?.name || "Blog"}</Link>
      {children}
    </main>
  );
}
