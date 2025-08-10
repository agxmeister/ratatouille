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
    private recipesDir: string

    constructor() {
        this.dataDir = path.join(process.cwd(), 'data')
        this.recipesDir = path.join(this.dataDir, 'recipes')
    }

    private async ensureDataDir(): Promise<void> {
        try {
            await fs.access(this.recipesDir)
        } catch {
            await fs.mkdir(this.recipesDir, { recursive: true })
        }
    }

    private getRecipeFilePath(id: string): string {
        return path.join(this.recipesDir, `${id}.json`)
    }

    async findAll(): Promise<Recipe[]> {
        await this.ensureDataDir()
        try {
            const files = await fs.readdir(this.recipesDir)
            const jsonFiles = files.filter(file => file.endsWith('.json'))
            
            const recipes = await Promise.all(
                jsonFiles.map(async (file) => {
                    const filePath = path.join(this.recipesDir, file)
                    const data = await fs.readFile(filePath, 'utf-8')
                    return JSON.parse(data) as Recipe
                })
            )
            
            return recipes.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        } catch {
            return []
        }
    }

    async findById(id: string): Promise<Recipe | null> {
        await this.ensureDataDir()
        try {
            const filePath = this.getRecipeFilePath(id)
            const data = await fs.readFile(filePath, 'utf-8')
            return JSON.parse(data) as Recipe
        } catch {
            return null
        }
    }

    async create(recipe: Recipe): Promise<Recipe> {
        await this.ensureDataDir()
        const filePath = this.getRecipeFilePath(recipe.id)
        await fs.writeFile(filePath, JSON.stringify(recipe, null, 2))
        return recipe
    }

    async update(id: string, recipe: Recipe): Promise<Recipe | null> {
        await this.ensureDataDir()
        const filePath = this.getRecipeFilePath(id)
        
        try {
            await fs.access(filePath)
            await fs.writeFile(filePath, JSON.stringify(recipe, null, 2))
            return recipe
        } catch {
            return null
        }
    }

    async delete(id: string): Promise<boolean> {
        await this.ensureDataDir()
        const filePath = this.getRecipeFilePath(id)
        
        try {
            await fs.unlink(filePath)
            return true
        } catch {
            return false
        }
    }
}