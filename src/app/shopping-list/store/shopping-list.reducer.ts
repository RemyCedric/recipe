import { Ingredient } from 'src/app/shared/ingredient.model';
import { Action } from '@ngrx/store';

export interface State {
  ingredients: Ingredient[];
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(state = initialState, action: Action): State {
  switch (action.type) {
    default:
      return state;
  }
}
