import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  url: any;

  constructor(private http: HttpClient) { }

  // SAMPLE DATA //
  // the listings prop should be set to the array of listings sent back from the DB on search
  listings: any = [{ 
    family_name: "Theriot",
    gender: "female",
    isbn: 1234345234,
    userid: 4523,
    title: "This is my English book",
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
      isbn: 12345454,
      userid: 4524,
      title: "This is my Science book",
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
        isbn: 12398234734,
        userid: 4525,
        title: "This is my Architecture book",
        locale: "en",
        name: "Rhett Parker",
        nickname: "GoRhettro",
        picture: "https://lh5.googleusercontent.com/-uhzzI0LuR2M/AAAAAAAAAAI/AAAAAAAAAKw/Z_9cPaPYOO0/photo.jpg",
        sub: "google-oauth2|114526446460397805282",
        updated_at: "2019-03-14T23:55:43.269Z"
        }];

  profileButtonClick(index) {
    console.log(this.listings[index]);
  }

  renderSearchedBooksList() {
    this.http.get(`http://localhost:3000/search/listing/isbn?${localStorage.userid}`)
      .subscribe((searchedBooksArray) => {
        console.log(searchedBooksArray, 'searched books array');
        this.listings = searchedBooksArray;
        
      })
    }

  ngOnInit() {
    this.url = document.URL;
  }
}
