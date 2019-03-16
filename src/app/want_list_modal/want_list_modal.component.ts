import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modals',
  templateUrl: './want_list_modal.component.html',
  styleUrls: ['./want_list_modal.scss'],
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
    const isbnVal = this.isbnVal;
    this.http.post('http://localhost:3000/user/want', { params: isbnVal })
    .subscribe((allWants: any) => {
      console.log(allWants, 'ALL WANTS + NEW ONE');
    })
    this.closeModal();
  }


  ngOnInit() {}

}
