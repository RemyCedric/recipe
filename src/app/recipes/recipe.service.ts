import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
export class RecipeService {
  private recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2015/11/shakshuka-11.jpg'
    ),
    new Recipe('Cumin Rice', 'Wonderful tasty recipe', 'https://www.docteur-lequere.fr/images/junk-food.jpg'),
  ];
  constructor() {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeSelected(): EventEmitter<Recipe> {
    return this.recipeSelected;
  }
}
