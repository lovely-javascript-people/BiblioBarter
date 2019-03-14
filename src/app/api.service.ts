import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {

  }

    getMatches(): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ? '/matches' : 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches';
      this.http.get('ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/matches').subscribe((response) => {
      console.log(response);
      });
    }
}
