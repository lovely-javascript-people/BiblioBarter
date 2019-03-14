import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {
  isLoggedIn$ = new Subject();
  isLoggedIn: Boolean = false;
  auth0 = new auth0.WebAuth({
    clientID: 'ivIuyoWYphC-Rxf2AWNO6cl9HRID0X9x',
    domain: 'bibliobarter.auth0.com',
    responseType: 'token id_token',
    audience: 'https://bibliobarter.auth0.com/userinfo',
    redirectUri: 'http://localhost:8100/callback',
    scope: 'openid'
  });

  constructor(public router: Router) {
    // Check if user is logged In when Initializing
    const loggedIn = this.isLoggedIn = this.isAuthenticated();
    this.isLoggedIn$.next(loggedIn);
  }

  // attach to login button
  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const loggedIn = this.isLoggedIn = true;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/Matches']);
        console.log(localStorage);
      } else if (err) {
        const loggedIn = this.isLoggedIn = false;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/Greet']);
      }
      console.log(this.isLoggedIn);
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  // connect to logout button
  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    const loggedIn = this.isLoggedIn = false;
    this.isLoggedIn$.next(loggedIn);
  }
//  This method checks if the user is authenticated or not by checking the token expiration 
//  date from local storage.
  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }
}