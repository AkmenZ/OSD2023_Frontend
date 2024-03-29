import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recipe } from 'src/interfaces/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private dataUri: string = `${environment.apiUri}/recipes/api/recipes`;

  constructor(private http: HttpClient) { }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  
  //get all recipes
  getRecipes(diet?: string) : Observable<Recipe[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/recipes`;
    if(diet && diet != 'any') {
      this.dataUri += `?diet=${diet}`
    }
    return this.http.get<Recipe[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
  }

  //get all my recipes
  getMyRecipes(authorId?: string) : Observable<Recipe[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/recipes`;
    if(authorId) {
      this.dataUri += `?authorId=${authorId}`
    }
    return this.http.get<Recipe[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
  }

  //get all my favorite recipes
  getMyFavoriteRecipes(authorId?: string) : Observable<Recipe[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/recipes`;
    if(authorId) {
      this.dataUri += `/likedby/${authorId}`
    }
    return this.http.get<Recipe[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
  }

  //add recipe
  addRecipe(recipe: any) : Observable<any> {
    var formData = new FormData();
    console.log('Recipe logged 1:', recipe);
    var recipeData = JSON.stringify(recipe);
    formData.append("recipeData", recipeData);

    console.log('image:', recipe.image);

    console.log('Data URI:', this.dataUri);

    return this.http.post<Recipe>(this.dataUri, formData)
    .pipe(
      tap(res => console.log('Response:', res)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
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

  //get flagged recipes
  getFlagged() : Observable<Recipe[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/recipes?isFlagged=true`;
    return this.http.get<Recipe[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
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

