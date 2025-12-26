// src/modules/tag/tag.schema.ts
import { z } from "zod";

export const tagNameParamSchema = z.object({
  params: z.object({
    name: z.string().trim().min(1).max(50),
  }),
});

export type TagNameParams = z.infer<typeof tagNameParamSchema.shape.params>;
