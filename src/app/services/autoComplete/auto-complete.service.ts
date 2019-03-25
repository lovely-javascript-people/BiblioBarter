import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {

  constructor(private http: HttpClient) { }
  findUniversity(term, callback) {
    this.http.get(`https://api.collegeai.com/v1/api/autocomplete/colleges?api_key=DO_NOT_USE_TESTING_KEY&query=${term}`).subscribe(data => {
      callback(data);
    });
  }

}
