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
    // let isbn = this.isbnQuery;
    this.apiService.getBooks(data, callback);
  }

    setListing(searchedListings) {
      console.log(searchedListings, 'BACK ON MATCHES PAGE');
      this.listings = searchedListings;
    }

  userMatches() {
    //this.http.get(`//ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/user/want?${localStorage.userid}`)
    this.http.get(`http://localhost:3000/user/want?${localStorage.userid}`)
    .subscribe((wantListArray) => {
      console.log(wantListArray, 'ARRAY OF WANT LIST');
      this.wants = wantListArray;
      this.isbnQuery = wantListArray[0].isbn;
      console.log(this.isbnQuery, 'ISBN');
    })
  //   const http = this.http;
  //   const isbn = this.isbn;
  //   console.log(isbn, 'TEST ISBN');
  // http.get(`http://localhost:3000/search/listing/isbn?${isbn}`)
  //   .subscribe((searchedListings: any) => {
  //     console.log(this.isbn, 'HEY THIS IS THE ISBN HEY');
  //     // console.log(searchedListings, 'AUTOSEARCH BOOKS');
  //     this.listings = searchedListings;
  //   })
    this.searchBooks();
  }



  ngOnInit() {
    // this.userMatches();
    this.url = document.URL;
    this.setListing = this.setListing.bind(this);
    this.searchBooks(this.isbnQuery, this.setListing);
  }

}
