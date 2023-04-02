import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAdmin = false;

  constructor() { }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  setIsAdmin(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }
}
