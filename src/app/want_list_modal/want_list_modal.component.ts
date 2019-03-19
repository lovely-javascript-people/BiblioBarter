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
  userid: number = localStorage.userid;
  title: string = '';

  constructor(public modal: ModalController, private http: HttpClient) { }

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

    // post req to api server to save wanted book to db  
    const userid = this.userid;
    const title = this.title;

      this.http.post('ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/user/want', { params: isbnVal, userid, title })
    .subscribe((allWants: any) => {
      console.log(allWants, 'ALL WANTS + NEW ONE');
    })

    this.closeModal();
    }));

  }


  ngOnInit() {}

}
