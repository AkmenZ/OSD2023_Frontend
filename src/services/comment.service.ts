import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private dataUri: string = `${environment.apiUri}/recipes/api/comments`;

  constructor(private http: HttpClient) { }

  //get comments
  getComments(recipeId?: string) : Observable<Comment[]> {
    this.dataUri = `${environment.apiUri}/recipes/api/comments`;
    if(recipeId) {
      this.dataUri += `?recipeId=${recipeId}`
    }
    return this.http.get<Comment[]>(`${this.dataUri}`)
    .pipe(retry(3), catchError(this.handleError));
  }

  //add comment
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUri}/recipes/api/comments`, comment)
      .pipe(catchError(this.handleError));
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
