import { NextRequest, NextResponse } from 'next/server'
import { recipeService } from '@/modules/recipe/service'
import { ZodError } from 'zod'

export async function GET() {
    try {
        const recipes = await recipeService.getAllRecipes()
        return NextResponse.json(recipes)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const recipe = await recipeService.createRecipe(body)
        return NextResponse.json(recipe, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to create recipe' },
            { status: 500 }
        )
    }
}