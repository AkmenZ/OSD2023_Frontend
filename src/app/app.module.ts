import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//auth0
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
//material imports
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';
//components
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeRowComponent } from './recipe-row/recipe-row.component';
import { RecipeComponent } from './recipe/recipe.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { InterceptorService } from './loader/interceptor.service';
import { FlagListComponent } from './flag-list/flag-list.component';

const material = [
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatProgressBarModule
]

@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    RecipeFormComponent,
    RecipeDetailsComponent,
    RecipeRowComponent,
    RecipeComponent,
    HomeComponent,
    ProfileComponent,
    RecipeModalComponent,
    FlagListComponent
  ],
  imports: [
    material,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({...environment.auth0,
      httpInterceptor: {
        allowedList: [`${environment.apiUri}/reciepes`],
      },})
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
