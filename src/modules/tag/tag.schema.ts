// src/modules/tag/tag.schema.ts
import { z } from "zod";

export const tagNameParamSchema = z.object({
  name: z.string().trim().min(1).max(50),
});
