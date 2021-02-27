import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient, //
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put<{ message: string }>('https://ng-complete-e35f5-default-rtdb.firebaseio.com/recipes.json', recipes) //
      .subscribe();
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user: User) => {
        return this.http.get<Recipe[]>('https://ng-complete-e35f5-default-rtdb.firebaseio.com/recipes.json', {
          params: new HttpParams().set('auth', user.token),
        });
      }),
      map((recipes: Recipe[]) => {
        return recipes.map((recipe) => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
