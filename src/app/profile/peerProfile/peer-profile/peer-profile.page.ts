import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../../../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../../../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { _ } from 'underscore';

@Component({
  selector: 'app-peer-profile',
  templateUrl: './peer-profile.page.html',
  styleUrls: ['./peer-profile.page.scss'],
})
export class PeerProfilePage implements OnInit {
  img: string;
  me: any;
  peer: any;
  user: any;
  school: string;
  offers: object[];
  wants: any[];
  listings: any[];
  entireListings: any[];
  possibleBooks: any[] = [];
  isReady: string;
  wantMoney = 0;
  offeredMoney = 0;
  money: number;

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router, ) {}

  getPeerBooks(id, callback) {
    this.apiService.getPeerProfile(id, callback);
  }

  getYourBooks() {
    this.apiService.renderListingsList(this.setYourBooks);
  }

  getYourWants() {
    this.apiService.renderWantList(this.setYourWants);
  }

  setYourBooks(data) {
    // console.log(data);
    const lists = this.wants.map(list => list.title);
    const xRefer = data.filter(piece => lists.includes(piece.book.title));
    this.possibleBooks.push(xRefer);
  }

  setYourWants(data) {
    const wants = this.listings.map(want => want.title);
    const xRefer = data.filter(piece => wants.includes(piece.title));
    this.possibleBooks.push(xRefer);
    this.isReady = 'Ready!';
  }

  async setBooks(data) {
    console.log(data, 'jeef');
    const temp = data.slice(0, data.length - 2);
    this.wants = temp;
    this.listings = data[data.length - 2];
    this.entireListings = data[data.length - 1];
    console.log(this.entireListings);
    this.getYourBooks();
    this.getYourWants();
  }

  makeOffer(bookWanted: any, myOffer: any) {
    debugger;
    const allListings = [];
    bookWanted.forEach((listing) => {
      allListings.push(_.filter(this.listings, list => list.title === listing));
    });
    myOffer.forEach((listing) => {
      allListings.push(_.filter(this.listings, list => list.title === listing));
    });
    
    let moneyOffer = (this.offeredMoney * -100);
    let moneyWant = (this.wantMoney * 100);

    if (moneyOffer !== 0) {
      this.money = moneyOffer;
    } else {
      this.money = moneyWant;
    }
    // console.log(moneyOffer, 'MONEY OFFER');
    // console.log(moneyWant, 'MONEY WANT');
    let money = this.money;
    // console.log(money, 'MONEY FOR EXCHANGE');

    this.apiService.sendOffer({
      idRecipient: this.peer,
      idSender: localStorage.userid,
      money: money,
      listings: allListings,
    });
  }
  // makeOffer(bookWanted: any, myOffer: any) {
  //   debugger;
  //   const want = bookWanted.split('');
  //   want[0] = '';
  //   want[want.length - 1] = '';
  //   const newWant = want.join('');
  //   const off = myOffer.split('');
  //   off[0] = '';
  //   off[off.length - 1] = '';
  //   const newOff = off.join('');
  //   // console.log(newOff);
  //   const wanted = _.filter(this.listings, list => list.title === newWant);
  //   const offered = this.possibleBooks[0].filter(book => newOff === book.book.title);
  //   const wanting = this.entireListings.filter(listin => listin.id_book === wanted[0].id_book);
  //   console.log(wanted, offered, 'WANTED, OFFERED');

  //   let moneyOffer = (this.offeredMoney * -100);
  //   let moneyWant = (this.wantMoney * 100);

  //   if(moneyOffer !== 0) {
  //     this.money = moneyOffer;
  //   } else {
  //     this.money = moneyWant;
  //   }
  //   // console.log(moneyOffer, 'MONEY OFFER');
  //   // console.log(moneyWant, 'MONEY WANT');
  //   let money = this.money;
  //   // console.log(money, 'MONEY FOR EXCHANGE');

  //   this.apiService.sendOffer({
  //     bookWanted: wanting,
  //     bookOffering: offered[0].id_listing,
  //     money: money,
  //   });
  // }

  setUser(data) {
    const user: any = localStorage.selectedUser;
    // console.log(data);
    this.user = data || user.nickname;
  }
  ngOnInit() {
    this.me = JSON.parse(localStorage.userid);
    this.peer = localStorage.selectedUser;

    this.wants = [];
    this.setYourBooks = this.setYourBooks.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setBooks = this.setBooks.bind(this);
    this.getPeerBooks = this.getPeerBooks.bind(this);
    if (this.peer.listing) {
      console.log(this.peer);
    this.getPeerBooks(this.peer.listing.id_user, this.setBooks);
    } else {
      this.getPeerBooks(this.peer, this.setBooks);
    }
    this.setYourWants = this.setYourWants.bind(this);

  }

}
