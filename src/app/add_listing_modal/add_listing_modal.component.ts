import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modals',
  templateUrl: './add_listing_modal.component.html',
  styleUrls: ['./add_listing_modal.component.scss'],
})

export class AddListingModal implements OnInit {

  isbnVal: string = '';

  constructor(public modal: ModalController, private http: HttpClient) { }

  async closeModal() {
    this.modal.dismiss();
  }

  addBook() {
    console.log(this.isbnVal);
    const isbnVal = this.isbnVal;
    this.http.post('http://localhost:3000/user/listing', { params: isbnVal })
    .subscribe((allListings: any) => {
      console.log(allListings, 'ALL LISTINGS + NEW ONE');
    })
    this.closeModal();
  }

  ngOnInit() {}

}
