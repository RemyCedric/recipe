import {
  Component, //
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') ngForm!: NgForm;
  subscription!: Subscription;
  editedItemIndex!: number;
  editMode = false;
  editedItem!: Ingredient | null;

  constructor(private store: Store<fromApp.AppState>) {}

  onSubmit(): void {
    const newIngredient = new Ingredient(this.ngForm.value.name, this.ngForm.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.clear();
  }

  delete(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.clear();
  }

  clear(): void {
    this.editMode = false;
    this.ngForm.reset();
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.ngForm.setValue({
          name: this.editedItem ? this.editedItem.name : '',
          amount: this.editedItem ? this.editedItem.amount : '',
        });
      } else {
        this.editMode = false;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
