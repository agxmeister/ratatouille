import { createDocument } from 'zod-openapi'
import { z } from 'zod'
import {
    RecipeSchema,
    RecipeSummarySchema,
    CreateRecipeSchema,
    UpdateRecipeSchema,
    RequestPathChiefSchema,
    RequestPathChiefRecipeSchema,
} from '@/modules/recipe'

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
        '/chief/{chiefId}/recipe': {
            get: {
                summary: 'Retrieve a list of all recipes for a specific chief.',
                requestParams: {
                    path: RequestPathChiefSchema,
                },
                responses: {
                    '200': {
                        description: 'Recipes retrieved successfully',
                        content: {
                            'application/json': {
                                schema: z.array(RecipeSummarySchema)
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                    }
                }
            },
            post: {
                summary: 'Create a new recipe for a specific chief.',
                requestParams: {
                    path: RequestPathChiefSchema,
                },
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
        '/chief/{chiefId}/recipe/{recipeId}': {
            get: {
                summary: 'Retrieve a recipe by its identity for a specific chief.',
                requestParams: {
                    path: RequestPathChiefRecipeSchema,
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
                summary: 'Update an existing recipe with new details for a specific chief.',
                requestParams: {
                    path: RequestPathChiefRecipeSchema,
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
                summary: 'Delete a recipe by its identity for a specific chief.',
                requestParams: {
                    path: RequestPathChiefRecipeSchema,
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