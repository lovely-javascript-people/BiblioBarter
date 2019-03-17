import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  url: any;
  isbnQuery: string = " ";

  constructor(private http: HttpClient) { }

  // SAMPLE DATA //
  // the listings prop should be set to the array of listings sent back from the DB on search
  listings: any = [];


  profileButtonClick(index) {
    console.log(this.listings[index]);
  }

  searchBooks() {
    console.log(this.isbnQuery)
    this.http.get(`http://localhost:3000/search/listing/isbn?${this.isbnQuery}`)
    .subscribe((searchedListings: any) => {
      console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
      this.listings = searchedListings;

    })

  }


  ngOnInit() {
    this.url = document.URL;
  }
}
