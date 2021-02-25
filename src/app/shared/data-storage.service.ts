import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient, //
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put<{ message: string }>('https://ng-complete-e35f5-default-rtdb.firebaseio.com/recipes.json', recipes) //
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
