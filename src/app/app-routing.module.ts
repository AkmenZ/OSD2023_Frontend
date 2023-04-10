import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { FlagListComponent } from './flag-list/flag-list.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'recipes',component: RecipeListComponent},
{path: 'flagged', component: FlagListComponent, canActivate: [AuthGuard]},
{path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
{ path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
