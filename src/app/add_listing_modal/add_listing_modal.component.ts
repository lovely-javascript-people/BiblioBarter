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

  addBook(isbn) {
    this.apiService.getBookInfoForOfferingList(isbn, this.getBookTitle);
    
    const postBook = this.postBookToOfferingList;
    setTimeout(function(){ postBook() }, 1000);

    this.closeModal();
  }

  postBookToOfferingList() {
    const isbnVal = this.isbnVal;
    const bookCondition = this.bookCondition;
    const title = this.title;
    const userid = this.userid;
    console.log(this.title, 'TITLE IN POSTBOOKTOOFFERINGLIST')
    this.apiService.addBookToUserOfferingList(isbnVal, bookCondition, title, userid);
  }

  getBookTitle(bookInfo) {
    this.title = bookInfo[Object.keys(bookInfo)[0]].info_url
    .split('/')[bookInfo[Object.keys(bookInfo)[0]].info_url.split('/').length - 1]
    .split('_').join(' ');
    // console.log(this.title, 'TITLE OF THE BOOK');
  }

  ngOnInit() {
    this.getBookTitle = this.getBookTitle.bind(this);
    this.postBookToOfferingList = this.postBookToOfferingList.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

}
