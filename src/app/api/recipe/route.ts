import { NextRequest, NextResponse } from 'next/server'
import { container } from '@/container'
import { RecipeService } from '@/modules/recipe/service'
import { TYPES } from '@/types'
import { ZodError } from 'zod'

export async function GET() {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const recipes = await recipeService.getAllRecipes()
        const recipeSummaries = recipes.map(recipe => ({
            id: recipe.id,
            summary: recipe.summary
        }))
        return NextResponse.json(recipeSummaries)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const body = await request.json()
        const recipe = await recipeService.createRecipe(body)
        return NextResponse.json(recipe, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to create recipe' },
            { status: 500 }
        )
    }
}