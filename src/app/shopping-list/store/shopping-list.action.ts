import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

const ADD_INGREDIENT = 'ADD_INGREDIENT';
const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

export class AddIngredient implements Action {
  type = ADD_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  type = ADD_INGREDIENTS;

  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  type = UPDATE_INGREDIENT;

  constructor(public payload: { index: number; ingredient: Ingredient }) {}
}

export class DeleteIngredient implements Action {
  type = DELETE_INGREDIENT;

  constructor(public payload: number) {}
}

export type shoppingListAction =
  | AddIngredient //
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient;
