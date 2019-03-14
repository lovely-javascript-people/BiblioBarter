import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {

    //NOT YET WORKING --> 
      // ERROR IN CONSOLE
    // need a catch for /callback from auth0
  // get for login
  this.http.get('/callback', (req: any, res: any) => {
    console.log('LOGIN');
  })
  
  this.http.get('/login/callback', (req: any, res: any) => {
    console.log('LOGIN');
  })

    // post for signup
    this.http.post('/callback', (req: any, res: any) => {
      console.log('SIGNUP');
    })

    this.http.post('/login/callback', (req: any, res: any) => {
      console.log('SIGNUP');
    })
  }

    getMatches(): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ? '/matches' : 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches';
      this.http.get('ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches').subscribe((response) => {
      console.log(response);
      });
    }
}
