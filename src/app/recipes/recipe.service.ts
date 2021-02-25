import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged: Subject<Recipe[]> = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(private shoppingListService: ShoppingListService) {}

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

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  addIngredientToShopping(recipe: Recipe): void {
    this.shoppingListService.addIngredients(recipe.ingredients);
  }

  getRecipeChanged(): Subject<Recipe[]> {
    return this.recipeChanged;
  }
}
