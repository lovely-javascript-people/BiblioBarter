import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modals',
  templateUrl: './search_modal.component.html',
  styleUrls: ['./search_modal.scss'],
})

export class SearchModal implements OnInit {
  query: string = '';

  constructor(public modal: ModalController) { }

  async closeModal() {
    this.modal.dismiss();
  }

  // function that takes in isbn number from input field
  // and sends get req to api server /search/listing/isbn
  searchBooks() {
    console.log('search');
    console.log(this.query)
  }


  ngOnInit() {}

}
