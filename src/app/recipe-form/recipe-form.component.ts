import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from 'src/interfaces/recipe';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe?: Recipe;
  @Output() recipeFormClose = new EventEmitter<Recipe>();

  recipeForm: FormGroup = new FormGroup({});
  ingredients!: FormArray;

  constructor() {}

  ngOnInit(): void {
    this.recipeForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      diet: new FormControl(''),
      ingredients: new FormArray([]),
      instructions: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      cookTime: new FormControl('', Validators.required),
    });
  }

  submit() {
    console.log('forms submitted with: ');
    console.table(this.recipeForm?.value);
    this.recipeFormClose.emit(this.recipeForm?.value);

    this.ngOnInit();
  }

  closeForm() {
    this.recipeFormClose.emit(undefined);
  }

  get instructions() {
    return this.recipeForm?.get('instructions');
  }

  addNewRow() {
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;
    this.ingredients.push(this.generateRow());
  }

  generateRow(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required)
    });
  }

  removeRow(index: any) {
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;
    this.ingredients.removeAt(index);
  }
}

