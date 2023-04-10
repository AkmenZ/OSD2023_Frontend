import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { LoaderService } from './loader/loader.service';
import jwt_decode from 'jwt-decode';
import { AdminService } from 'src/services/admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'masterchef';
  isAuthenticated$ = this.auth.isAuthenticated$
  user$ = this.auth.user$;
  isAdmin = false;
  private jwtDecoderUrl: string = `${environment.jwtDecoderUri}/roles`;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, 
              private router: Router, public loaderService: LoaderService, private adminService: AdminService) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.auth.getIdTokenClaims().subscribe((claims) => {
          const token = claims.__raw;
          console.log("User Token - ", token);
    
          // Decode the token and check the user's roles
          const decodedToken: any = jwt_decode(token);
          console.log("User Token Decoded - ", decodedToken);
    
          if (decodedToken[this.jwtDecoderUrl] && decodedToken[this.jwtDecoderUrl].includes('admin')) {
            console.log("User is admin");
            this.adminService.setIsAdmin(true);
            this.isAdmin = true;
          } else {
            console.log("User is not admin");
            console.log('Decoded Token:', decodedToken[this.jwtDecoderUrl]);
            this.adminService.setIsAdmin(false);
          }
        });
      }
    });
    
  }

  handleLogout() {
    this.auth.logout();
    localStorage.clear();
    this.router.navigate(['/']);
  }
  handleLogin() {
    this.auth.loginWithRedirect({appState: { target: '/recipes',}});
  }
  handleSignUp() {
    this.auth.loginWithRedirect({screen_hint:"signup"})
  }

}
