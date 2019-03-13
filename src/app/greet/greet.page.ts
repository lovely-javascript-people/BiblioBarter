import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-greet',
  templateUrl: './greet.page.html',
  styleUrls: ['./greet.page.scss'],
})
export class GreetPage implements OnInit {

  bool: true

  constructor(private apiService: ApiService) { }

  getMatches(): void {
    this.apiService.getMatches();
  }

  ngOnInit() {
    this.getMatches();
  }

}
