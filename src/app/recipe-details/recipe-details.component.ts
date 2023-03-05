import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/interfaces/recipe';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipe!: Recipe;
  currentBook : Recipe | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

