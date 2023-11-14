import {z} from "zod";

export const createSiteDto =
  z.object({
    subdomain: z.string().min(3).max(30),
    name: z.string().max(30).optional(),
    description: z.string().max(50).optional()
  })

export type CreateSiteDto =  z.infer<typeof createSiteDto>

export const updateSiteDto =
  z.object({
    id: z.number(),
    subdomain: z.string().min(3).max(30).optional(),
    name: z.string().max(30).optional(),
    description: z.string().max(50).optional()
  })
