import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import type { IRecipeRepository } from './modules/recipe/repository'
import { FileRecipeRepository } from './modules/recipe/repository'
import { RecipeService } from './modules/recipe/service'

const container = new Container()

container.bind<IRecipeRepository>(TYPES.RecipeRepository).to(FileRecipeRepository).inSingletonScope()
container.bind<RecipeService>(TYPES.RecipeService).to(RecipeService).inSingletonScope()

export { container }