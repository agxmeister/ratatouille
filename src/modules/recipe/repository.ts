import { Recipe } from './schema'
import fs from 'fs/promises'
import path from 'path'

export interface IRecipeRepository {
    findAll(): Promise<Recipe[]>
    findById(id: string): Promise<Recipe | null>
    create(recipe: Recipe): Promise<Recipe>
    update(id: string, recipe: Recipe): Promise<Recipe | null>
    delete(id: string): Promise<boolean>
}

export class FileRecipeRepository implements IRecipeRepository {
    private dataDir: string
    private filePath: string

    constructor() {
        this.dataDir = path.join(process.cwd(), 'data')
        this.filePath = path.join(this.dataDir, 'recipes.json')
    }

    private async ensureDataDir(): Promise<void> {
        try {
            await fs.access(this.dataDir)
        } catch {
            await fs.mkdir(this.dataDir, { recursive: true })
        }
    }

    private async loadRecipes(): Promise<Recipe[]> {
        await this.ensureDataDir()
        try {
            const data = await fs.readFile(this.filePath, 'utf-8')
            return JSON.parse(data)
        } catch {
            return []
        }
    }

    private async saveRecipes(recipes: Recipe[]): Promise<void> {
        await this.ensureDataDir()
        await fs.writeFile(this.filePath, JSON.stringify(recipes, null, 2))
    }

    async findAll(): Promise<Recipe[]> {
        return this.loadRecipes()
    }

    async findById(id: string): Promise<Recipe | null> {
        const recipes = await this.loadRecipes()
        return recipes.find(recipe => recipe.id === id) || null
    }

    async create(recipe: Recipe): Promise<Recipe> {
        const recipes = await this.loadRecipes()
        recipes.push(recipe)
        await this.saveRecipes(recipes)
        return recipe
    }

    async update(id: string, recipe: Recipe): Promise<Recipe | null> {
        const recipes = await this.loadRecipes()
        const index = recipes.findIndex(r => r.id === id)
        
        if (index === -1) {
            return null
        }
        
        recipes[index] = recipe
        await this.saveRecipes(recipes)
        return recipe
    }

    async delete(id: string): Promise<boolean> {
        const recipes = await this.loadRecipes()
        const filteredRecipes = recipes.filter(recipe => recipe.id !== id)
        
        if (filteredRecipes.length === recipes.length) {
            return false
        }
        
        await this.saveRecipes(filteredRecipes)
        return true
    }
}