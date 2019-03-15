import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {
    this.http.get('/callback').subscribe(data => {
      console.log(data);
    })
    
    this.http.get('/login/callback').subscribe(data => {
      console.log(data);
    })
    
  }

  // helper function to send user info
    userSignup({nickname, family_name, given_name, picture}) {
      // this.http.post('http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/signup', {
      // this.http.post('http://bibliobarter.com/signup', {
      this.http.post('http://localhost:3000/signup', {
        nickname,
        family_name,
        given_name,
        picture,
      }).subscribe((response) => {
        console.log(response);
        });
    }

    getMatches(): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ? '/matches' : 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches';
      this.http.get('ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches').subscribe((response) => {
      console.log(response);
      });
    }
}
