import { createDocument } from 'zod-openapi'
import { z } from 'zod'
import { RecipeSchema, RecipeListSchema, CreateRecipeSchema, UpdateRecipeSchema, RequestPathRecipeSchema } from '@/modules/recipe/schema'

const HealthResponseSchema = z.object({
    status: z.string().describe('Health status')
}).describe('Health check response')

export const openApiDocument = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'Ratatouille API',
        version: '1.0.0',
    },
    paths: {
        '/health': {
            get: {
                summary: 'Check the health status of the service.',
                responses: {
                    '200': {
                        description: 'Service is healthy',
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
                summary: 'Retrieve a list of all recipes.',
                responses: {
                    '200': {
                        description: 'Recipes retrieved successfully',
                        content: {
                            'application/json': {
                                schema: z.array(RecipeListSchema)
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            },
            post: {
                summary: 'Create a new recipe.',
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
                summary: 'Retrieve a recipe by its identity.',
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
                summary: 'Update an existing recipe with new details.',
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
                summary: 'Delete a recipe by its identity.',
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
                summary: 'Retrieve the OpenAPI specification.',
                responses: {
                    '200': {
                        description: 'OpenAPI specification retrieved successfully',
                    }
                }
            }
        }
    }
})