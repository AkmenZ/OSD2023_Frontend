import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Recipe } from 'src/interfaces/recipe';
import { RecipeService } from 'src/services/recipe.service';

@Component({
  selector: 'app-flag-list',
  templateUrl: './flag-list.component.html',
  styleUrls: ['./flag-list.component.css'],
})
export class FlagListComponent implements OnInit {
  flag: true;
  recipeList: Recipe[];
  message: string = '';
  private url: string = `${environment.apiUri}/recipes/api/recipes`;

  constructor(private recipeService: RecipeService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getFlagged().subscribe({
      next: (value: Recipe[]) => {
        this.recipeList = value;
        console.log('Recipes loaded successfully!');
      },
      error: (message) => (this.message = message),
    });
  }

  unflagRecipe(selectedRecipeId: string) {
    const setFalse = {
      isFlagged: false,
    };
    this.http
      .put(
        this.url + selectedRecipeId,
        setFalse
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loadRecipes();
        },
        error: (error) => console.log(error),
      });
  }

  deleteRecipe(selectedRecipeId: string) {
    this.http
      .delete(this.url + selectedRecipeId)
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });
  }
}
