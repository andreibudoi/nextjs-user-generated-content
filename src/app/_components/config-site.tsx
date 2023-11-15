"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { type CreateSiteDto, createSiteDto } from "~/server/api/modules/site/site.dto";
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

export default function ConfigSite() {
  const { toast } = useToast()
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const utils = api.useUtils()

  const { data: userSite, isLoading } = api.site.getSiteByUserId.useQuery()
  const { mutateAsync: createSite } = api.site.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
      })
      setOpen(false);
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message
      })
    },
    onSettled: async () => {
      await utils.site.getSiteByUserId.invalidate()
      router.refresh();
    }
  });
  const { mutateAsync: updateSite } = api.site.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
      })
      setOpen(false);
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message
      })
    },
    onSettled: async () => {
      await utils.site.getSiteByUserId.invalidate()
      router.refresh();
    }
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


  if (isLoading) {
    return <Button variant="outline" disabled>Configure Website</Button>;
  }

  async function onSubmit(values: CreateSiteDto) {
    const id = userSite?.id
    try {
      if (!!id) {
        return await updateSite({ id, ...values });
      } else {
        return await createSite(values);
      }
    } catch (_) {
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Configure Website</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Website</DialogTitle>
          <DialogDescription>
            {"Make changes to your website here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
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

            <DialogFooter>
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={!form.formState.isDirty}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}