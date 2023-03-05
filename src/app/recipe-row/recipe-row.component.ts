import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/interfaces/recipe';

@Component({
  selector: 'app-recipe-row',
  templateUrl: './recipe-row.component.html',
  styleUrls: ['./recipe-row.component.css']
})
export class RecipeRowComponent implements OnInit {
  @Input() recipe!: Recipe;

  constructor() { }

  ngOnInit(): void {
  }

}
