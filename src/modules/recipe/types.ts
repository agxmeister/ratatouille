import { z } from 'zod'
import {
    RecipeSchema,
    CreateRecipeSchema,
    UpdateRecipeSchema,
    RequestPathChiefSchema,
    RequestPathChiefRecipeSchema,
} from './schema'

export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>
export type RequestPathChief = z.infer<typeof RequestPathChiefSchema>
export type RequestPathChiefRecipe = z.infer<typeof RequestPathChiefRecipeSchema>