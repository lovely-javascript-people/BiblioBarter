import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modals',
  templateUrl: './want_list_modal.component.html',
  styleUrls: ['./want_list_modal.component.scss'],
})

export class WantListModal implements OnInit {
  isbnVal: string = '';

  constructor(public modal: ModalController, private http: HttpClient) { }

  async closeModal() {
    this.modal.dismiss();
  }

  // function that takes in isbn number from input field
  // and sends get req to api server /search/listing/isbn
    // returns all listings of book
  addBookToWant() {
    console.log(this.isbnVal);
    // this.http.get(`http://localhost:3000/search/listing/isbn?${this.isbnQuery}`)
    // .subscribe((searchedListings: any) => {
    //   console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
    // })
    this.closeModal();
  }


  ngOnInit() {}

}
