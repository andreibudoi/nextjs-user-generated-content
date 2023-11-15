import { z } from "zod";

// chatgpt
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createPostDto =
  z.object({
    name: z.string().min(3).max(30),
    content: z.string(),
    slug: z.string().regex(slugRegex, {
      message: 'Invalid slug format',
    }),
    siteId: z.string(),
  });
