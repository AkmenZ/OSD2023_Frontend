import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recipe } from 'src/interfaces/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private dataUri: string = '';

  constructor(private http: HttpClient) { }

  //get all recipes
  getRecipes(diet?: string) : Observable<Recipe[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/recipes`;
    if(diet && diet != 'any') {
      this.dataUri += `?diet=${diet}`
    }
    return this.http.get<Recipe[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
  }

  //add recipe
  addRecipe(recipe: Recipe) : Observable<Recipe> {
    return this.http.post<Recipe>(this.dataUri, recipe)
    .pipe(catchError(this.handleError))
  }

  //update recipe
  updateRecipe(id: string, recipe: Recipe) : Observable<Recipe> {
    console.log('subscribing to update' + id);
    let recipeUri: string = this.dataUri + '/' + id;
    return this.http.put<Recipe>(recipeUri, recipe)
    .pipe(catchError(this.handleError))
  }

  //delete recipe
  deleteRecipe(id: string) : Observable<unknown> {
    const url = `${this.dataUri}/${id}`;
    return this.http.delete(url)
    .pipe(catchError(this.handleError))
  }

  //handle errors
  private handleError(error: HttpErrorResponse){
    if(error.status === 0){
      console.error("Error occured:", error.error)
    } else {
      console.error(`Backend returned code ${error.status}, body was`, error.error);
    }
    return throwError(() => new Error("Something bad happened!"));
  }
}

