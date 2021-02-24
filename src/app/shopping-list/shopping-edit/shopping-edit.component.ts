import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('form') ngForm!: NgForm;

  constructor(private shoppingListService: ShoppingListService) {}

  onSubmit() {
    this.shoppingListService.addIngredient(new Ingredient(this.ngForm.value.name, this.ngForm.value.amount));
    this.ngForm.reset();
  }

  ngOnInit(): void {}
}
