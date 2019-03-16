import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  

  constructor(private auth: AuthService, private http: HttpClient) { }

  switchAccount() {
    let that = this;
    this.auth.logout();
    
    setTimeout(() => that.auth.login(), 1500);
  }

  defineSearchRadius(radius: any) {
    // this.http.post('http://localhost:3000/search', { 'radius': radius })
    console.log(radius);
  }

  changeSchool(school) {
    // this.http.patch('http://localhost:3000/school', { 'school': school })
    console.log(school);
  }

  deleteAccount(username) {
    // this.http.delete('http://localhost:3000/delete', { params: { 'user': username } })
    console.log(`Why you do this, ${username}?`);
  }
}
