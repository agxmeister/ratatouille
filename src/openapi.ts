import { createDocument } from 'zod-openapi'
import { z } from 'zod'
import { RecipeSchema, CreateRecipeSchema, UpdateRecipeSchema, RequestPathRecipeSchema } from '@/modules/recipe/schema'

const HealthResponseSchema = z.object({
    status: z.string().describe('Health status')
}).describe('Health check response')

export const openApiDocument = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'Ratatouille API',
        version: '1.0.0',
        description: 'API for interacting with the Ratatouille service'
    },
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                description: 'Check the health status of the API',
                responses: {
                    '200': {
                        description: 'API is healthy',
                        content: {
                            'application/json': {
                                schema: HealthResponseSchema
                            }
                        }
                    }
                }
            }
        },
        '/recipe': {
            get: {
                summary: 'Get all recipes',
                description: 'Retrieve a list of all recipes',
                responses: {
                    '200': {
                        description: 'List of recipes retrieved successfully',
                        content: {
                            'application/json': {
                                schema: z.array(RecipeSchema)
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            },
            post: {
                summary: 'Create a new recipe',
                description: 'Create a new recipe with the provided details',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: CreateRecipeSchema
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Recipe created successfully',
                        content: {
                            'application/json': {
                                schema: RecipeSchema
                            }
                        }
                    },
                    '400': {
                        description: 'Validation failed',
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            }
        },
        '/recipe/{recipeId}': {
            get: {
                summary: 'Get recipe by ID',
                description: 'Retrieve a specific recipe by its ID',
                requestParams: {
                    path: RequestPathRecipeSchema,
                },
                responses: {
                    '200': {
                        description: 'Recipe retrieved successfully',
                        content: {
                            'application/json': {
                                schema: RecipeSchema
                            }
                        }
                    },
                    '404': {
                        description: 'Recipe not found',
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            },
            put: {
                summary: 'Update recipe',
                description: 'Update an existing recipe with new details',
                requestParams: {
                    path: RequestPathRecipeSchema,
                },
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: UpdateRecipeSchema
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Recipe updated successfully',
                        content: {
                            'application/json': {
                                schema: RecipeSchema
                            }
                        }
                    },
                    '400': {
                        description: 'Validation failed',
                    },
                    '404': {
                        description: 'Recipe not found',
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            },
            delete: {
                summary: 'Delete recipe',
                description: 'Delete a recipe by its ID',
                requestParams: {
                    path: RequestPathRecipeSchema,
                },
                responses: {
                    '200': {
                        description: 'Recipe deleted successfully',
                    },
                    '404': {
                        description: 'Recipe not found',
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            }
        },
        '/openapi': {
            get: {
                summary: 'Get OpenAPI specification',
                description: 'Retrieve the OpenAPI specification for this API',
                responses: {
                    '200': {
                        description: 'OpenAPI specification retrieved successfully',
                    }
                }
            }
        }
    }
})