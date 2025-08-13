import { inject, injectable } from 'inversify'
import { Recipe, CreateRecipe, UpdateRecipe, CreateRecipeSchema, UpdateRecipeSchema } from './schema'
import type { IRecipeRepository } from './repository'
import { v4 as uuidv4 } from 'uuid'
import { TYPES } from '@/types'

@injectable()
export class RecipeService {
    constructor(@inject(TYPES.RecipeRepository) private readonly repository: IRecipeRepository) {
    }

    async getAllRecipes(chiefId: string): Promise<Recipe[]> {
        return this.repository.findAll(chiefId)
    }

    async getRecipeById(chiefId: string, recipeId: string): Promise<Recipe | null> {
        return this.repository.findById(chiefId, recipeId)
    }

    async createRecipe(chiefId: string, data: CreateRecipe): Promise<Recipe> {
        const validatedData = CreateRecipeSchema.parse(data)
        
        const newRecipe: Recipe = {
            id: uuidv4(),
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        
        return this.repository.create(chiefId, newRecipe)
    }

    async updateRecipe(chiefId: string, recipeId: string, data: UpdateRecipe): Promise<Recipe | null> {
        const validatedData = UpdateRecipeSchema.parse(data)
        
        const existingRecipe = await this.repository.findById(chiefId, recipeId)
        if (!existingRecipe) {
            return null
        }
        
        const updatedRecipe: Recipe = {
            ...existingRecipe,
            ...validatedData,
            updatedAt: new Date().toISOString()
        }
        
        return this.repository.update(chiefId, recipeId, updatedRecipe)
    }

    async deleteRecipe(chiefId: string, recipeId: string): Promise<boolean> {
        return this.repository.delete(chiefId, recipeId)
    }
}