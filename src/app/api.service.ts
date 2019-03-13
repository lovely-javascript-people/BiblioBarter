import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) { }

    getMatches(): any {
      this.http.get('ec2-18-188-132-186.us-east-2.compute.amazonaws.com/matches', { headers: { 'Content-Type': 'text/html' }}).subscribe((response) => {
      console.log(response);
  });
    }
}
