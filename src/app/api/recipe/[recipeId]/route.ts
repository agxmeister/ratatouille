import { NextRequest, NextResponse } from 'next/server'
import { recipeService } from '@/modules/recipe/service'
import { ZodError } from 'zod'

export async function GET(
    request: NextRequest,
    { params }: { params: { recipeId: string } }
) {
    try {
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
    { params }: { params: { recipeId: string } }
) {
    try {
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
                { error: 'Validation failed', details: error.errors },
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
    { params }: { params: { recipeId: string } }
) {
    try {
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