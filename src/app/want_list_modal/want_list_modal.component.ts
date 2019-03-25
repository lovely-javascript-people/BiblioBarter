import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './want_list_modal.component.html',
  styleUrls: ['./want_list_modal.scss'],
})

export class WantListModal implements OnInit {
  isbnVal = '';
  userid: number = localStorage.userid;
  title = '';
  imageLink: string;

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

  async closeModal() {
    this.modal.dismiss();
  }

  // function that takes in isbn number from input field
  // and sends get req to api server /search/listing/isbn
    // returns all listings of book
  addBookToWant() {
    const isbnVal = this.isbnVal;

    this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnVal}&format=json`)
    .subscribe(((bookInfo: any) => {
      // console.log(localStorage, 'LOCAL STORAGE');
      console.log(bookInfo);
      // sends obj w url key where the end of the url is the book title separated by _
      // grab just the title out of the url and switch _ to ' '
      this.title = bookInfo[Object.keys(bookInfo)[0]].info_url
      .split('/')[bookInfo[Object.keys(bookInfo)[0]].info_url.split('/').length - 1]
      .split('_').join(' ');
      this.imageLink = bookInfo[Object.keys(bookInfo)[0]].thumbnail_url || null;
    const userid = this.userid;
    const title = this.title;
    const imageLink = this.imageLink;
    this.apiService.addBookToUserWantList(isbnVal, userid, title, imageLink);

    this.closeModal();
    }));

  }


  ngOnInit() {}

}
