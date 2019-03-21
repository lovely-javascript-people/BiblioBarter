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
  yourWants: any[];
  num: string; // stores the scanned result
  matches: any[];
  open: boolean = false;
  yourListings: any[];
  othersWants: any[] = [];
  matchedUsers: any[] = [];

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    if (this.listings.length) {
    localStorage.setItem('selectedUser', this.listings[index]);
    } else {
      localStorage.setItem('selectedUser', index);
    }
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

  setOthersWants(data) {
    let piece = data.slice(0, data.length - 2);
    let filtP = piece.filter(bit => this.yourListings.includes(bit.title));
    if (filtP.length) {
      this.matchedUsers.push(filtP[0].id_user);
    }
    this.othersWants.push(filtP);
    console.log(this.othersWants);
    if (this.othersWants.length === this.matches.length) {
      let filtMatches = this.matches.filter(match => this.matchedUsers.includes(match.id))
      this.matches = filtMatches;
    }
  }

  /**
   * setMatches receives all the data from the API server with information on all books.
   * Contains user and book title information. Filtered 
   * @param {array} data - contains tuples, all users and book titles
   */
  setMatches(data) {
    console.log(data);
    let keys = Object.keys(data);
    let want = this.yourWants.map(want => want.title);
    let matches = [];
    let matchType;
    for (let key of keys) {
      let matchObj: any = {};
      if (!key.includes('id')) {
      data[key] = data[key].filter(piece => want.includes(piece.title))
      if (!data[key].length || key === localStorage.username) {
        delete data[key];
      } else {
      if (data[key].length > 1) {
        matchType = 'books';
      } else {
        matchType = 'book';
      }
      matchObj.name = key;
      matchObj.num = data[key].length;
      matchObj.type = matchType;
      matchObj.id = data[key + '_id'];
      matches.push(matchObj);
    }
    }
    }
    console.log(matches);
    this.matches = matches.sort((a, b) => b.num - a.num);
    for (let match of this.matches) {
      this.apiService.getPeerProfile(match.id, this.setOthersWants);
    }
  }

  setYourWants(data) {
    this.yourWants = data;
    console.log(this.yourWants);
  }

  setYourListings(data) {
    let lists = data.map(piece => {
      return piece.book.title;
    });
    this.yourListings = lists;
    console.log(this.yourListings);
  }

    setListing(searchedListings) {
      console.log(searchedListings, 'BACK ON MATCHES PAGE');
      this.listings = searchedListings;
    }
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
    this.url = document.URL;
    this.setListing = this.setListing.bind(this);
    this.searchBooks(this.isbnQuery, this.setListing);
    this.setYourWants = this.setYourWants.bind(this);
    this.setYourListings = this.setYourListings.bind(this);
    this.setOthersWants = this.setOthersWants.bind(this);
    this.setMatches = this.setMatches.bind(this);
    this.apiService.renderWantList(this.setYourWants);
    this.apiService.renderListingsList(this.setYourListings);
    this.apiService.getMatches(this.setMatches);
  }

}
