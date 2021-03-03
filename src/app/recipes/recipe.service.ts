import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged: Subject<Recipe[]> = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(private store: Store<fromApp.AppState>) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(recipe: Recipe, index: number): void {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  addIngredientToShopping(recipe: Recipe): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(recipe.ingredients));
  }

  getRecipeChanged(): Subject<Recipe[]> {
    return this.recipeChanged;
  }
}
