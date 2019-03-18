import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {
    
  }

  getPeerProfile(peerId, callback) {
    this.http.get(`http://localhost:3000/peer`, { params: {peerId} }).subscribe(data => {
      callback(data);
    })
  }

  sendOffer(options: any) {
    this.http.post('http://localhost:3000/offerlisting', { params: options }).subscribe(resp => {
      resp['bookWantedTitle'] = options.bookWantedTitle;
      console.log(resp);
    })
  }

  getOffers(callback) {
    this.http.get('http://localhost:3000/offers', { params: { id_user: localStorage.userid }}).subscribe(data => {
      callback(data)
    })
  }

  getProfile(username, callback) {
    this.http.get('http://localhost:3000/profile', { params: { username } })
    .subscribe(data => {
      callback(data);
    });
  }

  // helper function to send user info
    userSignup({nickname, family_name, given_name, picture}) {
      // // this.http.post('http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/signup', {
      // // this.http.post('http://bibliobarter.com/signup', {
      this.http.post('http://localhost:3000/signup', { params :{
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
      this.http.get('http://localhost:3000/matches').subscribe((response) => {
      console.log(response);
      });
    }
}
