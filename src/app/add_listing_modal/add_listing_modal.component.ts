import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './add_listing_modal.component.html',
  styleUrls: ['./add_listing_modal.component.scss'],
})

export class AddListingModal implements OnInit {

  isbnVal: string;
  bookCondition: string;
  title: string;
  userid: number = localStorage.userid;
  // animated: boolean = true;
  image: string;
  open: boolean = false;
  num: any;

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService, private barcodeScanner: BarcodeScanner) { }

  async closeModal() {
    this.modal.dismiss();
  }

  addBook(isbn) {
    this.apiService.getBookInfoForOfferingList(isbn, this.getBookTitle);

    const postBook = this.postBookToOfferingList;
    setTimeout(function() { postBook(); }, 1000);

    this.closeModal();
  }

  camOpen() {
    this.open = true;
  }

  camClose() {
    this.open = false;
  }

  postBookToOfferingList() {
    const isbnVal = this.isbnVal;
    const bookCondition = this.bookCondition;
    const title = this.title;
    const userid = this.userid;
    const imageLink = this.image;
    console.log(this.title, 'TITLE IN POSTBOOKTOOFFERINGLIST');
    this.apiService.addBookToUserOfferingList(isbnVal, bookCondition, title, userid, imageLink);
  }

  getBookTitle(bookInfo) {
    const isbnNum = this.isbnVal;
    // console.log(bookInfo, 'BOOK INFO');
    this.title = bookInfo[Object.keys(bookInfo)[0]].info_url
    .split('/')[bookInfo[Object.keys(bookInfo)[0]].info_url.split('/').length - 1]
    .split('_').join(' ');
    // this.image = bookInfo[Object.keys(bookInfo)[0]].thumbnail_url || null; // GRABS THE THUMBNAIL
    // console.log(this.title, 'TITLE OF THE BOOK');
    // get book image
    this.http.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnNum}`)
      .subscribe((bookInfo: any) => {
        this.image = bookInfo.items[0].volumeInfo.imageLinks.thumbnail;
        console.log(bookInfo.items[0].volumeInfo.imageLinks.thumbnail, 'BOOK IMAGE GOOGLE BOOKS API');
      });
  }

  ngOnInit() {
    this.getBookTitle = this.getBookTitle.bind(this);
    this.postBookToOfferingList = this.postBookToOfferingList.bind(this);
    this.closeModal = this.closeModal.bind(this);
}

}
