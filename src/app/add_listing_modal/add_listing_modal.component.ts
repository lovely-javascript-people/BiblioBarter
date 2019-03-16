import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modals',
  templateUrl: './add_listing_modal.component.html',
  styleUrls: ['./add_listing_modal.component.scss'],
})

export class AddListingModal implements OnInit {

  constructor(public modal: ModalController) { }

  async closeModal() {
    this.modal.dismiss();
  }

  addBook() {
    console.log('add a book to my list');
    // this.http.get(`http://localhost:3000/search/listing/isbn?${this.isbnQuery}`)
    // .subscribe((searchedListings: any) => {
    //   console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
    // })
    this.closeModal();
  }

  ngOnInit() {}

}
