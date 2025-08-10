import { z } from 'zod'

export const RecipeSchema = z.object({
    id: z.string()
        .describe('Unique identifier for the recipe'),
    title: z.string().min(1, "Title is required")
        .describe('The title of the recipe')
        .meta({ example: 'Chocolate Cake' }),
    summary: z.string().min(1, "Summary is required")
        .describe('A brief summary of the recipe')
        .meta({ example: 'A delicious chocolate cake recipe' }),
    description: z.string().min(1, "Description is required")
        .describe('Detailed description of the recipe')
        .meta({ example: 'This chocolate cake is made with premium cocoa powder...' }),
    createdAt: z.string()
        .describe('Timestamp when the recipe was created'),
    updatedAt: z.string()
        .describe('Timestamp when the recipe was last updated')
}).describe('Recipe object')

export const CreateRecipeSchema = RecipeSchema.omit({ id: true, createdAt: true, updatedAt: true })
    .describe('Recipe creation payload')
export const UpdateRecipeSchema = CreateRecipeSchema.partial()
    .describe('Recipe update payload')

export const RequestPathRecipeSchema = z.object({
    recipeId: z.string()
        .describe('The ID of the recipe')
})

export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>
export type RequestPathRecipe = z.infer<typeof RequestPathRecipeSchema>