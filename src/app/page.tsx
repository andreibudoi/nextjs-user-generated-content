import Link from "next/link";

import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import ConfigSite from "./_components/config-site";
import YourWebsite from "./_components/your-website";
import { CreatePost } from "~/app/_components/create-post";

export default async function Home() {
  const session = await getServerAuthSession();
  const { user } = session ?? {}
  const hello = await api.hello.query({ text: user?.name ?? "from tRPC" });

  const site = session ? await api.site.getSiteByUserId.query() : null;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col gap-4 px-4 py-16 w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <p className="text-2xl">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
          <Button asChild>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </Button>
        </div>

        {session &&
          <>
            <YourWebsite/>
            <ConfigSite/>
            <CreatePost siteId={site?.id}/>
          </>
        }
      </div>
    </main>
  );
}
