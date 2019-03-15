import { Component, OnInit } from '@angular/core';
import { SampleUsers } from '../../../mock data/authExampleData';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  url: any;
  users: any = [{ 
    family_name: "Theriot",
    gender: "female",
    given_name: "Laura",
    locale: "en",
    name: "Laura Theriot",
    nickname: "laurafrancestheriot",
    picture: "https://lh5.googleusercontent.com/-uhzzI0LuR2M/AAAAAAAAAAI/AAAAAAAAAKw/Z_9cPaPYOO0/photo.jpg",
    sub: "google-oauth2|114526446460397805282",
    updated_at: "2019-03-14T23:55:43.269Z"
    },
    { 
      family_name: "Landry",
      gender: "female",
      given_name: "Olivia",
      locale: "en",
      name: "Olivia Landry",
      nickname: "OliviaCLandry",
      picture: "https://lh5.googleusercontent.com/-uhzzI0LuR2M/AAAAAAAAAAI/AAAAAAAAAKw/Z_9cPaPYOO0/photo.jpg",
      sub: "google-oauth2|114526446460397805282",
      updated_at: "2019-03-14T23:55:43.269Z"
      },
      { 
        family_name: "Parker",
        gender: "female",
        given_name: "Rhett",
        locale: "en",
        name: "Rhett Parker",
        nickname: "GoRhettro",
        picture: "https://lh5.googleusercontent.com/-uhzzI0LuR2M/AAAAAAAAAAI/AAAAAAAAAKw/Z_9cPaPYOO0/photo.jpg",
        sub: "google-oauth2|114526446460397805282",
        updated_at: "2019-03-14T23:55:43.269Z"
        }];

  ngOnInit() {
    this.url = document.URL;
  }
}
