import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token!: boolean;

  constructor() {}

  logout(): void {
    this.token = false;
  }

  isAuthenticated(): boolean {
    return this.token;
  }
}
