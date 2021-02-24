import { Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private ingredientsChanged = new Subject<Ingredient[]>();
  private startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('apple', 5), //
    new Ingredient('tomatoes', 10),
  ];

  constructor() {}

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }
  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients().slice());
  }

  updateIngredient(ingredient: Ingredient, index: number): void {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.getIngredients().slice());
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredientsChanged(): Subject<Ingredient[]> {
    return this.ingredientsChanged;
  }

  getStartedEditing(): Subject<number> {
    return this.startedEditing;
  }
}
