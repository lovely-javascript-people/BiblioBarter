import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './add_listing_modal.component.html',
  styleUrls: ['./add_listing_modal.component.scss'],
})

export class AddListingModal implements OnInit {

  isbnVal: string = '';
  bookCondition: string = '';
  title: string = '';
  userid: number = localStorage.userid;

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

  async closeModal() {
    this.modal.dismiss();
  }

  addBook(isbn, callback) {
    this.apiService.addListingToUserOfferingList(isbn, callback);
    // const bookCondition = this.bookCondition;
    // // const isbnVal = this.isbnVal;

    // this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`)
    //   .subscribe(((bookInfo: any) => {

    //     // sends obj w url key where the end of the url is the book title separated by _
    //     // grab just the title out of the url and switch _ to ' '
    //     this.title = bookInfo[Object.keys(bookInfo)[0]].info_url
    //     .split('/')[bookInfo[Object.keys(bookInfo)[0]].info_url.split('/').length - 1]
    //     .split('_').join(' ');
    //     const title = this.title; // so that sending will not yield undefined

    // // make sure userid is saved to loacal storage
    // // send userid from localstorage.userid
    // const userid = this.userid;
    // console.log(userid, 'USER ID');

    // this.http.post('http://localhost:3000/user/listing', { params: isbnVal, bookCondition, title, userid }) // add userid
    // .subscribe((allListings: any) => {
    //   console.log(allListings, 'ALL LISTINGS + NEW ONE');
    // })
    
    // this.closeModal();
    //   }));

  }

  ngOnInit() {
    this.closeModal = this.closeModal.bind(this);
  }

}
