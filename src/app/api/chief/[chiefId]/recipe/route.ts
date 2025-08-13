import { NextRequest, NextResponse } from 'next/server'
import { container } from '@/container'
import { RecipeService, RequestPathChief } from '@/modules/recipe'
import { TYPES } from '@/types'
import { ZodError } from 'zod'

export async function GET(
    request: NextRequest,
    { params }: { params: RequestPathChief }
) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const recipes = await recipeService.getAllRecipes(params.chiefId)
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

export async function POST(
    request: NextRequest,
    { params }: { params: RequestPathChief }
) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const body = await request.json()
        const recipe = await recipeService.createRecipe(params.chiefId, body)
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