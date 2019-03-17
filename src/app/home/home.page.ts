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
  listings: any = [];

  constructor(private http: HttpClient, private router: Router) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    localStorage.setItem('selectedUser', JSON.stringify(this.listings[index]));
    this.router.navigate(['/peer-profile']);
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
