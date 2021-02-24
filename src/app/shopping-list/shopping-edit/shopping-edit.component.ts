import {
  Component, //
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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
  editedItem!: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  onSubmit(): void {
    const ingredient = new Ingredient(this.ngForm.value.name, this.ngForm.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(ingredient, this.editedItemIndex);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.clear();
  }

  delete(): void {
    this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.clear();
  }

  clear(): void {
    this.editMode = false;
    this.ngForm.reset();
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.getStartedEditing().subscribe((index: number) => {
      const ingredient = this.shoppingListService.getIngredient(index);
      this.editedItemIndex = index;
      this.editMode = true;
      this.editedItem = ingredient;
      this.ngForm.setValue({ ...ingredient });
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
