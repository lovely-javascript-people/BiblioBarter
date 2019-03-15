import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit{
  url: any;
  username: any;
  wants: any[]

  constructor(private apiService: ApiService) {}

  setUser({ username }) {
    this.username = username;
  }
  
  ngOnInit() {
    this.setUser = this.setUser.bind(this);
    this.url = document.URL
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
  }

}