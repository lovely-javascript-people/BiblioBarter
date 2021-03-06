import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-greet',
  templateUrl: './greet.page.html',
  styleUrls: ['./greet.page.scss'],
})
export class GreetPage implements OnInit {

  bool: true;

  constructor(private apiService: ApiService, public authService: AuthService) { }


  onLoginClick(): void {
    console.log('log me in!');
    this.authService.login();
    localStorage.setItem('loginMethod', 'login');
  }

  onSignUpClick(): void {
    console.log('sign me up!');
    this.authService.login();
    localStorage.setItem('loginMethod', 'signup');
  }

  getMatches(): void {
    // this.apiService.getMatches();
  }

  ngOnInit() {
    // this.getMatches();
    // console.log(this.authService.username);
  }

}
