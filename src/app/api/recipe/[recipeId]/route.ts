import { NextRequest, NextResponse } from 'next/server'
import { container } from '@/container'
import { RecipeService } from '@/modules/recipe/service'
import { TYPES } from '@/types'
import { ZodError } from 'zod'
import { RequestPathRecipe } from '@/modules/recipe/schema'

export async function GET(
    request: NextRequest,
    { params }: { params: RequestPathRecipe }
) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const recipe = await recipeService.getRecipeById(params.recipeId)
        if (!recipe) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(recipe)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch recipe' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: RequestPathRecipe }
) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const body = await request.json()
        const recipe = await recipeService.updateRecipe(params.recipeId, body)
        if (!recipe) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(recipe)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to update recipe' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: RequestPathRecipe }
) {
    try {
        const recipeService = container.get<RecipeService>(TYPES.RecipeService)
        const deleted = await recipeService.deleteRecipe(params.recipeId)
        if (!deleted) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { message: 'Recipe deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete recipe' },
            { status: 500 }
        )
    }
}