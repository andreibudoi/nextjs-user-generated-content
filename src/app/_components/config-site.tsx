"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Link from "next/link";

import { type CreateSiteDto, createSiteDto } from "~/server/api/modules/site/site.dto";
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";

export default function ConfigSite() {
  const { toast } = useToast()

  const utils = api.useUtils()
  const { data: userSite, isLoading } = api.site.getSiteByUserId.useQuery()
  const { mutateAsync: createSite } = api.site.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
      })
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message
      })
    },
    onSettled: () =>
      utils.site.getSiteByUserId.invalidate()
  });
  const { mutateAsync: updateSite } = api.site.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
      })
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message
      })
    },
    onSettled: () =>
      utils.site.getSiteByUserId.invalidate()
  });

  const form = useForm<CreateSiteDto>({
    resolver: zodResolver(createSiteDto),
    defaultValues: {
      subdomain: "",
      name: "",
      description: ""
    },
  })
  const { reset } = form;

  useEffect(() => {
    if (userSite) {
      reset({
        subdomain: userSite.subdomain,
        name: userSite.name ?? "",
        description: userSite.description ?? "",
      })
    }
  }, [userSite, reset])


  if (isLoading) return null;

  async function onSubmit(values: CreateSiteDto) {
    const id = userSite?.id
    try {
      return id ? await updateSite({ id, ...values }) : await createSite(values)
    } catch (_) {
    }
  }

  const protocol = env.NEXT_PUBLIC_DOMAIN_ROOT === 'localhost:3000' ? 'http://' : 'https://'
  const userHref = `${protocol}${userSite?.subdomain}.${env.NEXT_PUBLIC_DOMAIN_ROOT}`

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdomain</FormLabel>
              <FormControl>
                <Input placeholder="your-site" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your site" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description of your site" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className='flex justify-between flex-wrap gap-4'>
          <Button type="submit" loading={form.formState.isSubmitting}>Submit</Button>

          {!!userSite && <div className='flex gap-2'>
            <Button asChild variant='link'>
              <Link
                href={userHref}
                target='_blank'
                className='text-xl'
              >
                {`Your website: ${userHref}`}
              </Link>
            </Button>
          </div>}
        </div>
      </form>
    </Form>
  )
}