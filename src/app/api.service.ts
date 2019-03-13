import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) { }

    getMatches(): any {
      this.http.get('/matches', { headers: { 'Content-Type': 'text/html' }}).subscribe((response) => {
      console.log(response);
  });
    }
}
