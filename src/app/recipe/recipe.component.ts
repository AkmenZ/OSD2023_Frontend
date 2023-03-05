import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/interfaces/recipe';
import { RecipeService } from 'src/services/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  recipes: Recipe[] = [];
  message: String = '';

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe({
      next: (value: Recipe[]) => this.recipes = value,
      complete: () => console.log('Recipe service finished'),
      error: (message) => this.message = message
    })
  }

}

