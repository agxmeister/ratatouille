import { Recipe, CreateRecipe, UpdateRecipe, CreateRecipeSchema, UpdateRecipeSchema } from './schema'
import { IRecipeRepository, FileRecipeRepository } from './repository'

export class RecipeService {
    private repository: IRecipeRepository

    constructor(repository?: IRecipeRepository) {
        this.repository = repository || new FileRecipeRepository()
    }

    async getAllRecipes(): Promise<Recipe[]> {
        return this.repository.findAll()
    }

    async getRecipeById(id: string): Promise<Recipe | null> {
        return this.repository.findById(id)
    }

    async createRecipe(data: CreateRecipe): Promise<Recipe> {
        const validatedData = CreateRecipeSchema.parse(data)
        
        const newRecipe: Recipe = {
            ...validatedData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        
        return this.repository.create(newRecipe)
    }

    async updateRecipe(id: string, data: UpdateRecipe): Promise<Recipe | null> {
        const validatedData = UpdateRecipeSchema.parse(data)
        
        const existingRecipe = await this.repository.findById(id)
        if (!existingRecipe) {
            return null
        }
        
        const updatedRecipe: Recipe = {
            ...existingRecipe,
            ...validatedData,
            updatedAt: new Date().toISOString()
        }
        
        return this.repository.update(id, updatedRecipe)
    }

    async deleteRecipe(id: string): Promise<boolean> {
        return this.repository.delete(id)
    }
}

export const recipeService = new RecipeService()