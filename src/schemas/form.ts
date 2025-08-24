import { z } from "zod"

export const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "email", "textarea", "number"]),
  label: z.string().min(1, "Label is required"),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
})

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
})

export const responseSchema = z.record(z.string(), z.any())

export type Field = z.infer<typeof fieldSchema>
export type CreateFormData = z.infer<typeof createFormSchema>
export type ResponseData = z.infer<typeof responseSchema>
