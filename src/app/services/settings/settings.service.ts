import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private auth: AuthService, private http: HttpClient) {}
  host = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = 'http://localhost:3000';

  switchAccount() {
    const that = this;
    this.auth.logout();

    setTimeout(() => that.auth.login(), 1500);
  }

  defineSearchRadius(radius: any) {
    // this.http.post('http://localhost:3000/search', { 'radius': radius })
    console.log(radius);
  }

  changeSchool(school) {
    console.log(school);
    this.http.patch(`${this.local}/school`, { 'school': school, 'userId': localStorage.userid }).subscribe(data => console.log(data));
  }

  deleteAccount(username) {
    // this.http.delete('http://localhost:3000/delete', { params: { 'user': username } })
    console.log(`Why you do this, ${username}?`);
  }
}
