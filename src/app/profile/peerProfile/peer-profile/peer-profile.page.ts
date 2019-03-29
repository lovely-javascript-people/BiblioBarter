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
  peerUsername: string;
  image: string;
  peerSchool: string;

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
    const allListings = [];
    const wantBooks = [];
    _.each(bookWanted, (bookTitle) => {
      _.each(this.listings, (listingObj) => {
        const newBookTitle = bookTitle.split('');
        newBookTitle[0] = '';
        newBookTitle[newBookTitle.length - 1] = '';
        const newTitle = newBookTitle.join('');
        if (listingObj.title === newTitle) {
          wantBooks.push(listingObj);
        }
      });
    });

    _.each(wantBooks, (eachBook) => {
      _.each(this.entireListings, (aListing) => {
        if (eachBook.id_book === aListing.id_book) {
          allListings.push(aListing);
        }
      });
    });
    
    _.each(myOffer, (offerObj) => {
      _.each(this.possibleBooks[0], (possibleBook) => {
        const possibleTitle = offerObj.split('');
        possibleTitle[0] = '';
        possibleTitle[possibleTitle.length - 1] = '';
        const newPossibleTitle = possibleTitle.join('');
        if (possibleBook.book.title === newPossibleTitle) {
          allListings.push(possibleBook);
        }
      });
    });

    let moneyOffer = (this.offeredMoney * -100);
    let moneyWant = (this.wantMoney * 100);

    if (moneyOffer !== 0) {
      this.money = moneyOffer;
    } else {
      this.money = moneyWant;
    }

    let money = this.money;

    this.apiService.sendOffer({
      idRecipient: this.peer,
      idSender: localStorage.userid,
      money: money,
      listings: allListings,
    });
  }

  setUser(data) {
    console.log(data, 'HEY HERE');
    const user: any = localStorage.selectedUser;
    // console.log(data);
    this.user = data || user.nickname;
  }

  findPeer(userId) {
    console.log(userId, 'User Id for set Peer');
    this.apiService.getUserInfo(userId, this.setPeer);
  }

  setPeer(data) {
    console.log(data, 'PEER DDATS SCHOOL');
    this.peerUsername = data.user_name;
    this.image = data.image_link;
    this.peerSchool = data.school.name;
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
    this.setPeer = this.setPeer.bind(this);
    this.findPeer = this.findPeer.bind(this);
    this.findPeer(this.peer);
  }

}
