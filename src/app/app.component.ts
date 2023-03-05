import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  isAuthenticated$ = this.auth.isAuthenticated$
  user$ = this.auth.user$;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private router: Router) {}

  handleLogout() {
    this.auth.logout();
    localStorage.clear();
  }
  handleLogin() {
    this.auth.loginWithRedirect({appState: { target: '/recipes  ',}});
  }
  handleSignUp() {
    this.auth.loginWithRedirect({screen_hint:"signup"})
  }
}
