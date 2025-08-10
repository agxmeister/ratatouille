import { z } from 'zod'

export const RecipeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export const CreateRecipeSchema = RecipeSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateRecipeSchema = CreateRecipeSchema.partial()

export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>