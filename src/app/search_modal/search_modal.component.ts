import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home.page';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './search_modal.component.html',
  styleUrls: ['./search_modal.scss'],
})

export class SearchModal implements OnInit {
  isbnQuery = '';
  listings: any = [];

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

  async closeModal() {
    this.modal.dismiss();
  }

  // function that takes in isbn number from input field
  // and sends get req to api server /search/listing/isbn
    // returns all listings of book
  searchBooks() {
    const isbn = this.isbnQuery;
    this.apiService.searchForBookWithIsbn(isbn);
    // console.log(this.isbnQuery)
    // this.http.get(`http://localhost:3000/search/listing/isbn?${this.isbnQuery}`)
    // .subscribe((searchedListings: any) => {
    //   console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
    //   localStorage.setItem('searchedListings', searchedListings);
    //   console.log(localStorage);
    // })

    this.closeModal();
  }

  ngOnInit() {

  }

}
