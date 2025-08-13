import { injectable } from 'inversify'
import { Recipe } from './schema'
import fs from 'fs/promises'
import path from 'path'

export interface IRecipeRepository {
    findAll(chiefId: string): Promise<Recipe[]>
    findById(chiefId: string, recipeId: string): Promise<Recipe | null>
    create(chiefId: string, recipe: Recipe): Promise<Recipe>
    update(chiefId: string, recipeId: string, recipe: Recipe): Promise<Recipe | null>
    delete(chiefId: string, recipeId: string): Promise<boolean>
}

@injectable()
export class FileRecipeRepository implements IRecipeRepository {
    private readonly dataDir = path.join(process.cwd(), 'data')

    private getChiefDir(chiefId: string): string {
        return path.join(this.dataDir, 'chiefs', chiefId, 'recipes')
    }

    private async ensureDataDir(chiefId: string): Promise<void> {
        const chiefDir = this.getChiefDir(chiefId)
        try {
            await fs.access(chiefDir)
        } catch {
            await fs.mkdir(chiefDir, { recursive: true })
        }
    }

    private getRecipeFilePath(chiefId: string, recipeId: string): string {
        return path.join(this.getChiefDir(chiefId), `${recipeId}.json`)
    }

    async findAll(chiefId: string): Promise<Recipe[]> {
        await this.ensureDataDir(chiefId)
        const chiefDir = this.getChiefDir(chiefId)
        try {
            const files = await fs.readdir(chiefDir)
            const jsonFiles = files.filter(file => file.endsWith('.json'))
            
            const recipes = await Promise.all(
                jsonFiles.map(async (file) => {
                    const filePath = path.join(chiefDir, file)
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

    async findById(chiefId: string, recipeId: string): Promise<Recipe | null> {
        await this.ensureDataDir(chiefId)
        try {
            const filePath = this.getRecipeFilePath(chiefId, recipeId)
            const data = await fs.readFile(filePath, 'utf-8')
            return JSON.parse(data) as Recipe
        } catch {
            return null
        }
    }

    async create(chiefId: string, recipe: Recipe): Promise<Recipe> {
        await this.ensureDataDir(chiefId)
        const filePath = this.getRecipeFilePath(chiefId, recipe.id)
        await fs.writeFile(filePath, JSON.stringify(recipe, null, 2))
        return recipe
    }

    async update(chiefId: string, recipeId: string, recipe: Recipe): Promise<Recipe | null> {
        await this.ensureDataDir(chiefId)
        const filePath = this.getRecipeFilePath(chiefId, recipeId)
        
        try {
            await fs.access(filePath)
            await fs.writeFile(filePath, JSON.stringify(recipe, null, 2))
            return recipe
        } catch {
            return null
        }
    }

    async delete(chiefId: string, recipeId: string): Promise<boolean> {
        await this.ensureDataDir(chiefId)
        const filePath = this.getRecipeFilePath(chiefId, recipeId)
        
        try {
            await fs.unlink(filePath)
            return true
        } catch {
            return false
        }
    }
}