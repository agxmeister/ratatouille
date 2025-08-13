import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { IRecipeRepository, FileRecipeRepository, RecipeService } from './modules/recipe'

const container = new Container()

container.bind<IRecipeRepository>(TYPES.RecipeRepository).to(FileRecipeRepository).inSingletonScope()
container.bind<RecipeService>(TYPES.RecipeService).to(RecipeService).inSingletonScope()

export { container }