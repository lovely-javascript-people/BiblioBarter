import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  url: any;
  isbnQuery: string = " ";
  isbn: string = " ";
  listings: any = [];
  wants: any = [];

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService,) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    localStorage.setItem('selectedUser', JSON.stringify(this.listings[index]));
    this.router.navigate(['/peer-profile']);
  }

  searchBooks(data, callback) {
    this.apiService.getBooks(data, callback);
  }

    setListing(searchedListings) {
      console.log(searchedListings, 'BACK ON MATCHES PAGE');
      this.listings = searchedListings;
    }

  // THIS DOESNT WORK YET --> SUPPOSED TO GRAB USER MATCHES ON INIT 
  // userMatches() {
  //   this.http.get(`http://localhost:3000/user/want?${localStorage.userid}`)
  //   .subscribe((wantListArray) => {
  //     console.log(wantListArray, 'ARRAY OF WANT LIST******');
  //     this.wants = wantListArray;
  //     this.isbnQuery = wantListArray[0].isbn;
  //     console.log(this.isbnQuery, 'ISBN IN USER MATCHES');
  //   })
  //   let isbn = this.isbnQuery;
  //   this.searchBooks(isbn, this.setListing);
  // }



  ngOnInit() {
    // this.userMatches();
    this.url = document.URL;
    this.setListing = this.setListing.bind(this);
    this.searchBooks(this.isbnQuery, this.setListing);
  }

}
