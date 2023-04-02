import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from 'src/interfaces/recipe';
import { AdminService } from 'src/services/admin.service';
import { RecipeService } from 'src/services/recipe.service';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() isAdmin!: boolean;
  recipeList: Recipe[] = [];
  message: string = "";
  selectedValue: string = "";
  showRecipeForm: boolean = false;
  currentRecipe : Recipe | undefined;
  isAuthenticated$ = this.auth.isAuthenticated$;
  diet: string = '';

  constructor(private recipeService: RecipeService, public auth: AuthService, 
              public dialog: MatDialog, private adminService: AdminService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes(this.diet).subscribe({
      next: (value: Recipe[] )=> this.recipeList = value,
      complete: () => console.log('Recipe Service Finished!'),
      error: (message) => this.message = message
    });

    //get the boolean value from admin service
    this.isAdmin = this.adminService.getIsAdmin();
  }

  clicked (recipe: Recipe): void {
    this.currentRecipe = recipe;
  }

  openAddRecipe(): void {
    this.currentRecipe = undefined;
    this.showRecipeForm = true;
  }

  openEditRecipe(): void {
    this.showRecipeForm = true;
  }

  //add new recipe
  addRecipe(newRecipe: Recipe): void {
    const formData = new FormData();
    formData.append('recipe', JSON.stringify(newRecipe));

    console.log('adding new recipe ' + JSON.stringify(newRecipe));
    this.recipeService.addRecipe(newRecipe)
      .subscribe({
        next: recipe => {
          console.log(JSON.stringify(recipe) + ' has been added');
          this.message = "new recipe has been added";
        },
        error: (err) => this.message = err
      });
    this.ngOnInit();
  }

  //update recipe
  updateRecipe  (id: string, recipe: Recipe): void {
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
    console.log('deleting recipe');
    if (this.currentRecipe) {
      this.recipeService.deleteRecipe(this.currentRecipe._id)
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

  closeForm(recipe?: Recipe): void {
    this.showRecipeForm = false;
    console.table(recipe);
    if (recipe == null) {
      this.message = "form closed without saving";
      this.currentRecipe = undefined
    }
    else {
      this.addRecipe(recipe);
    }
  }

  isSelected(recipe: Recipe): boolean {
    if (!recipe || !this.currentRecipe) {
      return false;
    }
    else {
      return recipe._id === this.currentRecipe._id;
    }
  }

  onDietChange() {
    console.log('Selected diet:', this.diet);
    
    this.recipeService.getRecipes(this.diet).subscribe({
      next: (value: Recipe[] )=> this.recipeList = value,
      complete: () => console.log('Filter applied'),
      error: (message) => this.message = message
    });
  }

  openModal() {
    //this.dialog.open(RecipeModalComponent, {data: {recipe: this.currentRecipe}});
    const dialogRef = this.dialog.open(RecipeModalComponent, {
      data: { recipe: this.currentRecipe, isAdmin: this.isAdmin }
    });
  }
  
}
