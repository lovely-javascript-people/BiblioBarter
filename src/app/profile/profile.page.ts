import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit{
  img: any;
  user: any;
  school: any;
  wants: any[]

  constructor(private apiService: ApiService) {}

  setUser(data) {
    console.log(data);
    this.user = data[0].user_name;
    this.school = data[1][0].name_school;
    this.img = data[0].link_image;
  }
  
  ngOnInit() {
    this.setUser = this.setUser.bind(this);
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
  }

}