import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApiService } from '../api.service';
import { $ } from 'protractor';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  url: any;
  isbnQuery = '';
  isbn = '';
  listings: any[] = [];
  yourWants: any[];
  num: string; // stores the scanned result
  matches: any[] = [];
  open = false;
  yourListings: any[];
  othersWants: any[] = [];
  matchedUsers: any[] = [];
  inRadius: string;
  matched: boolean = false;
  searched: boolean = false;

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner, public loadingController: LoadingController) { }

  profileButtonClick(index) {
    console.log(this.listings[index]);
    if (this.listings.length) {
      console.log(this.listings[index], 'hi');
    localStorage.setItem('selectedUser', this.listings[index].listing.id_user);
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

  setSchoolsInRadius(data) {
    let schoolNames = data.results.map(school => school.poi.name);
    this.inRadius = schoolNames.join(' ');
    console.log(this.inRadius);
    this.apiService.getMatches(this.setMatches);
  }

  setUser(data) {
    console.log(data);
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);
  }

  setOthersWants(data) {
    const piece = data.slice(0, data.length - 2);
    const filtP = piece.filter(bit => this.yourListings.includes(bit.title));
    if (filtP.length) {
      this.matchedUsers.push(filtP[0].id_user);
    }
    this.othersWants.push(filtP);
    console.log(this.othersWants);
    if (this.othersWants.length === this.matches.length) {
      const filtMatches = this.matches.filter(match => this.matchedUsers.includes(match.id));
      this.matches = filtMatches;
    }
  }

  setMatches(data) {
    console.log(data, 'SET MATCHES DATA');
    const keys = Object.keys(data);
    if (this.yourWants.length) {
    const want = this.yourWants.map(want => want.title);
    const matches = [];
    let matchType;
    let schoo = '';
    for (const key of keys) {
      const matchObj: any = {};
      if (!key.includes('id') && !key.includes('school')) {
        if (data[`${key}_school`] !== null) {
          console.log(data[`${key}_school`].name);
          data[key] = data[key].filter(piece => want.includes(piece.title) && (this.inRadius.includes(data[`${key}_school`].name)));
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
    }
    console.log(matches);
    this.matches = matches.sort((a, b) => b.num - a.num);
    for (const match of this.matches) {
      this.apiService.getPeerProfile(match.id, this.setOthersWants);
    }
    if(matches.length) {
      this.matched = true;
    }
  }
  }

  setYourWants(data) {
    this.yourWants = data;
    console.log(this.yourWants);
  }

  setYourListings(data) {
    const lists = data.map(piece => {
      return piece.book.title;
    });
    this.yourListings = lists;
    console.log(this.yourListings);
  }

    setListing(searchedListings) {
      console.log(searchedListings, 'BACK ON MATCHES PAGE');
      this.listings = searchedListings;
      this.searched = true;
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
    });
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      duration: 2000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  ngOnInit() {
    this.url = document.URL;
    this.setListing = this.setListing.bind(this);
    // this.searchBooks(this.isbnQuery, this.setListing);
    this.setYourWants = this.setYourWants.bind(this);
    this.setYourListings = this.setYourListings.bind(this);
    this.setOthersWants = this.setOthersWants.bind(this);
    this.setSchoolsInRadius = this.setSchoolsInRadius.bind(this);
    this.setMatches = this.setMatches.bind(this);
    this.apiService.renderWantList(this.setYourWants);
    this.apiService.renderListingsList(this.setYourListings);
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
    this.apiService.getSchools(localStorage.userid, this.setSchoolsInRadius);
    this.presentLoadingWithOptions();
  }

}
