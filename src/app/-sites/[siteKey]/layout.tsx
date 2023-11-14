import {type ReactNode} from "react";
import {notFound} from "next/navigation";
import {type Metadata} from "next";
import {api} from "~/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: { siteKey: string };
}): Promise<Metadata | null> {
  const siteKey = decodeURIComponent(params.siteKey);
  const site = await api.site.getSiteBySubdomain.query({subdomain: siteKey})
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
  const site = await api.site.getSiteBySubdomain.query({subdomain: siteKey})

  if (!site) {
    notFound();
  }

  return (
    <div>
      {children}
    </div>
  );
}
