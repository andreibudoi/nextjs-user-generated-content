"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Toggle } from "~/components/ui/toggle";

export function CreatePost({ siteId }: { siteId?: string }) {
  const { toast } = useToast()
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-full min-w-full h-full w-full bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none overflow-auto',
      },
    },
    content: '<p>Hello World! 🌎️</p>',
  })

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
      })
      setName("");
      setSlug("");
      editor?.commands.clearContent();
      setOpen(false);
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message
      })
    },
    onSettled: () => {
      router.refresh();
    }
  });

  if (!siteId) {
    return <Button variant="outline" disabled>You need to configure your website before creating a post</Button>
  }

  const zodError = createPost?.error?.data?.zodError;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create post</Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col max-w-3xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>
            Create a post and publish it to your website
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              createPost.mutate({ name, slug, siteId, content: JSON.stringify(editor?.getJSON()) });
            } catch (_) {
            }
          }}
          className="flex flex-col gap-2 h-full"
        >
          <div className="space-y-2">
            <Label htmlFor='postName'>Title</Label>
            <Input
              id='postName'
              placeholder="Awesome post"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-sm font-medium text-destructive">
              {zodError?.fieldErrors?.name?.toString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='postSlug'>Slug</Label>
            <Input
              id='postSlug'
              placeholder="awesome-post"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-sm font-medium text-destructive">
              {zodError?.fieldErrors?.slug?.toString()}
            </p>
          </div>

          <EditorContent
            className='flex h-[20rem] w-full rounded-md border border-input overflow-hidden'
            editor={editor}/>
          {editor ? <RichTextEditorToolbar editor={editor}/> : null}

          <DialogFooter>
            <Button
              type="submit"
              loading={createPost.isLoading}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div
      className="border border-input bg-transparent rounded-md p-1 flex flex-row flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4"/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4"/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4"/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4"/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4"/>
      </Toggle>
    </div>
  );
};
