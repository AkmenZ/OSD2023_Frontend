import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { Recipe } from 'src/interfaces/recipe';
import { Comment } from 'src/interfaces/comment';
import { CommentService } from 'src/services/comment.service';
import { RecipeService } from 'src/services/recipe.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.css'],
})
export class RecipeModalComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() isAdmin!: boolean;
  currentRecipe: Recipe | undefined;
  message: string = '';
  selectedRecipeId: string = '';
  flagClicked: boolean | undefined = false;
  private url: string = `${environment.apiUri}/recipes/api/recipes/`;

  commentList: Comment[] = [];
  commentForm: FormGroup;

  isAuthenticated$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
  code$ = this.user$.pipe(map((user) => JSON.stringify(user, null)));

  userId: string;
  userName: string;
  newCommentContent: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private recipeService: RecipeService,
    public auth: AuthService,
    private commentService: CommentService,
    private http: HttpClient
  ) {
    this.recipe = this.data.recipe;
    this.isAdmin = this.data.isAdmin;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.selectedRecipeId = this.data.recipe._id;
    console.log('current recipe id', this.selectedRecipeId);

    this.auth.user$.subscribe((user) => {
      this.userId = user.sub;
      this.userName = user.nickname;
    });

    //get comments
    this.commentService.getComments(this.selectedRecipeId).subscribe({
      next: (value: Comment[]) => {
        this.commentList = value;
      },
      complete: () => console.log('Comment Service Finished!'),
      error: (message) => (this.message = message),
    });
  }

  //update recipe
  updateRecipe(id: string, recipe: Recipe): void {
    console.log('updating ');
    console.table(recipe);
    this.recipeService.updateRecipe(id, recipe).subscribe({
      next: (recipe) => {
        console.log(JSON.stringify(recipe) + ' has been updated');
        this.message = 'recipe has been updated';
      },
      error: (err) => (this.message = err),
    });

    this.ngOnInit();
  }

  //delete recipe
  deleteRecipe() {
    if (this.selectedRecipeId) {
      this.recipeService.deleteRecipe(this.selectedRecipeId).subscribe({
        next: (recipe) => {
          console.log(JSON.stringify(recipe) + ' has been deleted');
          this.message = 'recipe has been deleted';
        },
        error: (err) => (this.message = err),
      });
    }

    this.ngOnInit();
    this.currentRecipe = undefined;
  }

  //flag recipe
  flagRecipe() {
    const setTrue = {
      isFlagged: true,
    };
    this.http
      .put(
        this.url + this.selectedRecipeId,
        setTrue
      )
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });
  }

  //like recipe
  likeRecipe(userId: string) {
    this.http
      .get(this.url + this.selectedRecipeId)
      .subscribe((recipe) => {
        const likedBy = this.recipe.likedBy || [];
        if (!likedBy.some((like) => like.likeAuthorId === userId)) {
          likedBy.push({ likeAuthorId: userId });
          const likes = (this.recipe.likes || 0) + 1; // Increment the number of likes by 1
          this.http
            .put(
              this.url +
                this.selectedRecipeId,
              { likedBy, likes }
            )
            .subscribe({
              next: (response) => console.log(response),
              error: (error) => console.log(error),
            });
        }
      });
  }

  //add comment
  addNewComment(commentAuthorId: string, commentAuthorName: string) {
    const newComment: Comment = {
      recipeId: this.selectedRecipeId,
      commentAuthorId: commentAuthorId,
      commentAuthorName: commentAuthorName,
      commentContent: this.newCommentContent,
    };
    this.commentService.addComment(newComment).subscribe({
      next: (value: Comment) => {
        this.commentList.push(value);
        console.log('Comment added successfully!');
      },
      complete: () => console.log('Add Comment Service Finished!'),
      error: (message) => (this.message = message),
    });
  }
}
