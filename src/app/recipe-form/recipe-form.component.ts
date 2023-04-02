import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { catchError } from 'rxjs';
import { Recipe } from 'src/interfaces/recipe';
import { RecipeService } from 'src/services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe?: Recipe;
  @Output() recipeFormClose = new EventEmitter<Recipe>();

  user$ = this.auth.user$;
  userId: string = '';
  userName: string = '';
  recipeForm: FormGroup;
  ingredients!: FormArray;
  selectedImage: File | null = null;

  constructor(public auth: AuthService, private fb: FormBuilder, private recipeService: RecipeService, private http:HttpClient) {}

  ngOnInit(): void {
    //initialize recipe form
    this.recipeForm = new FormGroup({
      title: new FormControl('', Validators.required),
      authorId: new FormControl(''),
      authorName: new FormControl(''),
      image: new FormControl(''),
      diet: new FormControl(''),
      ingredients: new FormArray([]),
      instructions: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      cookTime: new FormControl('', Validators.required),
    });

    //initialize the ingredients FormArray
    this.ingredients = this.recipeForm.get('ingredients') as FormArray<any>;

    //get the logged in user
    this.auth.user$.subscribe(user => {
      this.userId = user?.sub as string;
      console.log('id is:', this.userId);
      
      this.userName = user?.nickname as string;
      console.log('user name is:',this.userName)

      //set value of authorId to userId
      const authorIdFormControl = this.recipeForm.get('authorId');
      if (authorIdFormControl) {
        authorIdFormControl.setValue(this.userId);
      }

      //set value of nickname to userName
      const authorNameFormControl = this.recipeForm.get('authorName');
      if (authorNameFormControl) {
        authorNameFormControl.setValue(this.userName);
      }
    });

  }

  submit() {
    console.log('forms submitted with: ');
    console.table(this.recipeForm?.value);
    //this.recipeFormClose.emit(this.recipeForm?.value);
    const ingredients = this.recipeForm.get('ingredients').value;

    var formData: any = new FormData();
    formData.append('title', this.recipeForm.get('title').value);
    formData.append('authorId', this.recipeForm.get('authorId').value);
    formData.append('authorName', this.recipeForm.get('authorName').value);
    formData.append('image', this.recipeForm.get('image').value);
    formData.append('diet', this.recipeForm.get('diet').value);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][amount]`, ingredient.amount);
    });
    formData.append('instructions', this.recipeForm.get('instructions').value);
    formData.append('cookTime', this.recipeForm.get('cookTime').value);
    

    this.http.post('http://localhost:3000/recipes/api/recipes', formData).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error)
    });

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

  onImageSelected(event: any) {
    //const file = event.target.files[0];
    //this.recipeForm.get('image').setValue(file);
    const file = (event.target as HTMLInputElement).files[0];
  console.log('Selected file:', file);
  console.log('File name:', file.name);
  console.log('File size:', file.size);
  console.log('File type:', file.type);
    this.recipeForm.patchValue({ image: file });
  }

}

