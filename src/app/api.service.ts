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

  getBookInfoForOfferingList(isbn: string, callback) {
    this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`)
      .subscribe(((bookInfo: any) => {
        console.log(bookInfo, 'BOOK INFO API SERVICE');
        callback(bookInfo); // gets title of book
      }))
  }

  addBookToUserOfferingList(isbnVal, bookCondition, title, userid) {
    console.log(title, 'TITLE');
    this.http.post(`${this.local}/user/listing`, { params: isbnVal, bookCondition, title, userid })
      .subscribe((allListings: any) => {
          console.log(allListings, 'ALL LISTINGS IN API SERVICE');
        });
  }

  getPeerProfile(peerId, callback) {
    this.http.get(`${this.local}/peer`, { params: {peerId} }).subscribe(data => {
      callback(data);
    })
  }

  getBooks(isbn: string, callback) {
    this.http.get(`${this.local}/search/listing/isbn?${isbn}`).subscribe((searchedListings: any) => {
      callback(searchedListings);
    })
  }

  sendOffer(options: any) {
    this.http.post(`${this.local}/offerlisting`, { params: options }).subscribe(resp => {
      resp['bookWantedTitle'] = options.bookWantedTitle;
      console.log(resp);
    })
  }

  getOffers(callback) {
    this.http.get(`${this.local}/offers`, { params: { id_user: localStorage.userid }}).subscribe(data => {
      callback(data)
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
      // // this.http.post('http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/signup', {
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

    getMatches(): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ? '/matches' : 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches';
      this.http.get(`${this.local}/matches`).subscribe((response) => {
      console.log(response);
      });
    }
}
