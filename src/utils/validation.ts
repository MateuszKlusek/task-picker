import z from "zod";

export const configSchema = z.object({
  root: z.string(),
  shell: z.string().optional(),
  fzfConfig: z.object({
    height: z.string().optional(),
    previewWindow: z
      .object({
        direction: z.enum(["down", "up", "left", "right"]).optional(),
        percentage: z.string().optional(),
      })
      .optional(),
  }),
});

export const configSchemaWithoutRoot = configSchema.omit({ root: true });
