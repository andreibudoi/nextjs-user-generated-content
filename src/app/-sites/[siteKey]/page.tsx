import {api} from "~/trpc/server";
import {notFound} from "next/navigation";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home({params}: {
  params: {
    siteKey: string
  }
}) {
  const siteKey = decodeURIComponent(params.siteKey);
  // const site = await api.site.getSiteBySubdomain.query({subdomain: siteKey})
  // console.log(site, 'site')
  // if (!site) {
  //   notFound();
  // }
  // const {createdById, name} =site;
  // console.log(site)
  return <div>{siteKey}</div>
}