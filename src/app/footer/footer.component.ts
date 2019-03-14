import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }
  
  onClick(): void {
    console.log('log me out!');
    this.authService.logout();
    this.router.navigate(['/Greet']);
  }
  ngOnInit() {}

}
