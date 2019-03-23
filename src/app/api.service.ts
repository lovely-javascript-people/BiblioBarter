import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  host = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = 'http://localhost:3000';

  contactUs(userId, userEmail, emailBody) {
    console.log(userId, userEmail, emailBody, 'USER AND MESSAGE INFO');
    this.http.post(`${this.local}/contactUs`, {userId: userId, userEmail: userEmail, emailBody: emailBody})
      .subscribe((data) => {
        console.log(data);
      });
  }

  userAcceptOffer() {
    console.log('accepted');
  }

  updateSettings(firstName, lastName, userEmail, userId, searchRadius, address, phoneNumber) {
    console.log(userId, 'USER ID');
    console.log(firstName, 'first name');
    // patch req to server
    this.http.patch(`${this.local}/user/settings`, {email: userEmail, userId: userId, radius: searchRadius, firstName: firstName, lastName: lastName, address: address, phoneNumber: phoneNumber})
      .subscribe((data) => {
        console.log(data);
      });
  }

  getBookInfoForOfferingList(isbn: string, callback) {
    this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`) // book info from book api
      .subscribe(((bookInfo: any) => {
        callback(bookInfo); // gets title of book
      }))
  }

  addBookToUserOfferingList(isbnVal, bookCondition, title, userid, imageLink) {
    this.http.post(`${this.local}/user/listing`, { params: isbnVal, bookCondition, title, userid, imageLink })
      .subscribe((allListings: any) => {
        console.log(allListings, 'ALL LISTINGS IN OFFERING LIST')
        });
  }

  addBookToUserWantList(isbnVal, userid, title, imageLink) {
    this.http.post(`${this.local}/user/want`, { params: isbnVal, userid, title, imageLink })
      .subscribe((allWants: any) => {
      console.log(allWants, 'ALL WANTS FROM API SERVICE');
    })
  }

  renderWantList(callback) {
    // console.log(localStorage.userid, 'USERID');
    this.http.get(`http://localhost:3000/user/want?${localStorage.userid}`)
    .subscribe((wantListArray) => {
      console.log(wantListArray, 'ARRAY OF WANT LIST');
      callback(wantListArray);
    })
  }

  renderListingsList(callback) {
    this.http.get(`http://localhost:3000/user/listing?${localStorage.userid}`)
    .subscribe((listingListArray) => {
      console.log(listingListArray, 'ARRAY OF OFFERING LIST');
      callback(listingListArray);
    })
  }

  searchForBookWithIsbn(isbn) {
    this.http.get(`${this.local}/search/listing/isbn?${isbn}`)
    .subscribe((searchedListings: any) => {
      console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
      localStorage.setItem('searchedListings', searchedListings);
      console.log(localStorage);
    })
  }

  getPeerProfile(peerId, callback) {
    console.log(peerId, 'PEEER ID');
    this.http.get(`${this.local}/peer`, { params: {peerId} }).subscribe(data => {
      callback(data);
    })
  }

  getBooks(isbn: string, callback) {
    this.http.get(`${this.local}/search/listing/isbn?${isbn}`).subscribe((searchedListings: any) => {
      console.log(searchedListings, 'SEARCHED LISTINGS');
      callback(searchedListings);
    })
  }

  sendOffer(options: any) {
    this.http.post(`${this.local}/offerlisting`, { params: options }).subscribe(resp => {
      resp['bookWantedTitle'] = options.bookWantedTitle;
      console.log(resp);
    })
  };

  getOffers(callback) {
    console.log('TRYING TO GET OFFERS BUT STILL NOT WORKING');
    this.http.get(`${this.local}/offers`, { params: { id_user: localStorage.userid }}).subscribe(data => {
      console.log(data, 'DATA IN FROM GETOFFERS API CALL');
      callback(data);
    })
  }

  getProfile(username, callback) {
    this.http.get(`${this.local}/profile`, { params: { username } })
    .subscribe(data => {
      callback(data);
    });
  }

  // helper function to send user info
    userSignup({nickname, family_name, given_name, picture}) {
      // // this.http.post('http://localhost:3000/signup', {
      // // this.http.post('http://bibliobarter.com/signup', {
      this.http.post(`${this.local}/signup`, { params :{
        nickname,
        family_name,
        given_name,
        picture,
      }}).subscribe((response) => {
        console.log(response);
        });
    }

    getMatches(callback): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ? '/matches' : 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches';
      this.http.get(`${this.local}/matches`).subscribe((response) => {
      callback(response);
      });
    }

    getSchools(school, callback) {
      this.http.get(`${this.local}/schools`, { params: { school } }).subscribe((response) => {
        callback(response);
        }); 
    }

    counterOffer(id) {
      this.http.get(`${this.local}/counter`, { params: { id } }).subscribe((response) => {
        console.log(response);
        });
    }
}

