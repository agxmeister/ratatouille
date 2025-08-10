import { z } from 'zod'

export const RecipeSchema = z.object({
    id: z.string()
        .describe('Unique identifier for the recipe'),
    summary: z.string().min(1, "Summary is required")
        .describe('A brief summary of the recipe')
        .meta({ example: 'How to set up a development environment' }),
    description: z.string().optional()
        .describe('Detailed description of the recipe')
        .meta({ example: 'This guide walks through setting up a complete development environment...' }),
    preconditions: z.array(z.string()).optional()
        .describe('List of preconditions that should be met before starting')
        .meta({ example: ['Node.js installed', 'Git configured'] }),
    steps: z.array(z.string()).optional()
        .describe('List of steps to follow')
        .meta({ example: ['Install dependencies', 'Configure environment variables', 'Run the application'] }),
    postconditions: z.array(z.string()).optional()
        .describe('List of postconditions that should be verified after completion')
        .meta({ example: ['Application runs on localhost:3000', 'All tests pass'] }),
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