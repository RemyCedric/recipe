import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeComponent } from './recipe-list/recipe/recipe.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';

@NgModule({
  declarations: [
    RecipesComponent, //
    RecipeListComponent,
    RecipeDetailsComponent,
    RecipeComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [
    CommonModule, //
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: RecipeStartComponent },
          { path: 'new', component: RecipeEditComponent, resolve: [RecipesResolverService] },
          { path: ':id', component: RecipeDetailsComponent, resolve: [RecipesResolverService] },
          { path: ':id/edit', component: RecipeEditComponent },
        ],
      },
    ]),
  ],
})
export class RecipesModule {}
