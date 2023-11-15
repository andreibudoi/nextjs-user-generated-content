import { z } from "zod";

export const createPostDto =
  z.object({
    name: z.string().min(3).max(30),
    content: z.string(),
  })
