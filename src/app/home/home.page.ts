import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApiService } from '../api.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  url: any;
  isbnQuery: string = "";
  isbn: string = "";
  listings: any = [];
  wants: any[];
  num: string; // stores the scanned result
  matches: any[];
  open: boolean = false;

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    localStorage.setItem('selectedUser', JSON.stringify(this.listings[index]));
    this.router.navigate(['/peer-profile']);
  }

  camOpen() {
    if (!this.open) {
      this.open = true;
    }
  }

  camClose() {
    if (this.open) {
      this.open = false;
    }
  }

  searchBooks(data, callback) {
    this.apiService.getBooks(data, callback);
  }

  setMatches(data) {
    // let want = this.wants.map(want => want.title);
    // data.filter(piece => want.includes(piece.title))
  }

  setWants(data) {
    this.wants = data;
    console.log(this.wants);
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

  // new scan method
  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      // this is called when a barcode is found
      console.log(`barcode data: ${barcodeData}`);
      console.log(("We got a barcode\n" +
        "Result: " + barcodeData.text + "\n" +
        "Format: " + barcodeData.format + "\n" +
        "Cancelled: " + barcodeData.cancelled));
      this.num = barcodeData.text
    }).catch((err) => {
      console.log(`error in barcode scan: ${err}`);
    });
  }

  ngOnInit() {
    // this.userMatches();
    this.url = document.URL;
    this.setListing = this.setListing.bind(this);
    this.searchBooks(this.isbnQuery, this.setListing);
    this.setWants = this.setWants.bind(this);
    this.apiService.renderWantList(this.setWants);
  }

}
