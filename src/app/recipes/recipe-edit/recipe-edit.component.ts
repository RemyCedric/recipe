import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  formGroup!: FormGroup;
  ingredients: Ingredient[] = [];
  editMode = false;

  constructor(
    private route: ActivatedRoute, //
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params: Params) => {
      const id = 'id';
      this.id = +params[id];
      // Actually the two routes who have access to this component are `:id/edit` and `new`
      // If id is not a parameter of the route, because we reached `new` => `params['id'] will be null
      this.editMode = params[id] != null;
      this.initForm();
    });
  }

  initForm(): void {
    this.formGroup = new FormGroup({});

    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients: FormArray = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      const ingredients = 'ingredients';
      if (recipe[ingredients]) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required), //
              amount: new FormControl(ingredient.amount, [
                Validators.required, //
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.formGroup = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  getIngredientsControl(): AbstractControl[] {
    return (this.formGroup.get('ingredients') as FormArray).controls;
  }

  addIngredient(): void {
    (this.formGroup.get('ingredients') as FormArray).controls.push(
      new FormGroup({
        name: new FormControl('', Validators.required), //
        amount: new FormControl('', [
          Validators.required, //
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }
  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onSubmit(): void {
    /*    const newRecipe = new Recipe(
      this.formGroup.value.name, //
      this.formGroup.value.description,
      this.formGroup.value.imagePath,
      this.formGroup.value['ingredients']
    );*/
    const newRecipe = this.formGroup.value;
    if (this.editMode) {
      this.recipeService.updateRecipe(newRecipe, this.id);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  onDeleteIngredient(index: number): void {
    (this.formGroup.get('ingredients') as FormArray).removeAt(index);
  }
}
