import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { Recipe } from 'src/interfaces/recipe';
import { RecipeService } from 'src/services/recipe.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.css']
})
export class RecipeModalComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() isAdmin!: boolean;
  currentRecipe : Recipe | undefined;
  message: string = "";
  selectedRecipeId: string = "";

  isAuthenticated$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
  code$ = this.user$.pipe(
    map((user) => JSON.stringify(user, null))
    );
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private recipeService: RecipeService, public auth: AuthService) {
    this.recipe = this.data.recipe;
    this.isAdmin = this.data.isAdmin;
  }

  ngOnInit(): void {
    console.log(this.data)
    this.selectedRecipeId = this.data.recipe._id;
    console.log('current recipe id', this.selectedRecipeId);
  }

    //update recipe
    updateRecipe(id: string, recipe: Recipe): void {
      console.log('updating ');
      console.table (recipe);
      this.recipeService.updateRecipe(id, recipe)
        .subscribe({
          next: recipe => {
            console.log(JSON.stringify(recipe) + ' has been updated');
            this.message = " recipe has been updated";
          },
          error: (err) => this.message = err
        });
  
      this.ngOnInit();
    }
  
    //delete recipe
    deleteRecipe() {
      if (this.selectedRecipeId) {
        this.recipeService.deleteRecipe(this.selectedRecipeId)
          .subscribe({
            next: recipe => {
              console.log(JSON.stringify(recipe) + ' has been deleted');
              this.message = "recipe has been deleted";
            },
            error: (err) => this.message = err
          });
      }
  
      this.ngOnInit();
      this.currentRecipe=undefined;
    }

}
