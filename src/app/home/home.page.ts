import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    localStorage.setItem('selectedUser', JSON.stringify(this.listings[index]));
    this.router.navigate(['/peer-profile']);
  }

  searchBooks() {
    console.log(this.isbnQuery)
    this.http.get(`ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/search/listing/isbn?${this.isbnQuery}`)
    .subscribe((searchedListings: any) => {
      console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
      this.listings = searchedListings;
    })
  }

  userMatches() {
    this.http.get(`ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/user/want?${localStorage.userid}`)
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
  }
}
