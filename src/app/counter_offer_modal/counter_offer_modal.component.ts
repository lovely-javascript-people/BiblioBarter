import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { _ } from 'underscore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modals',
  templateUrl: './counter_offer_modal.component.html',
  styleUrls: ['./counter_offer_modal.scss'],
})

export class CounterOfferModal implements OnInit {

  userBooks: any[] = [];
  peerListings: any;
  possibleBooks: any[] = [];
  wants: any;
  listings: any;
  entireListings: any;
  peerWants: any;
  ready: boolean = false;
  peerid: number;
  peerMoney: string;
  peerTitles: string[];
  peer: string;
  myTitles: string[];
  offerId: number;

  // counter offer money
  offeredMoney: number;
  wantMoney: number;

  constructor(
    public modal: ModalController, 
    private http: HttpClient, 
    private apiService: ApiService,
    private toastController: ToastController,
    ) { }

  local = 'localhost:3000';

  async closeModal() {
    this.modal.dismiss();
  }

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
    this.ready = true;
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

  sendCounterOffer(bookWanted: any, myOffer: any) {
    // send up all listing ids to modal

    // patch to change last offer to rejected
    let prevId = this.offerId;

    // const allListings = [];
    // const wantBooks = [];
    // _.each(bookWanted, (bookTitle) => {
    //   _.each(this.listings, (listingObj) => {
    //     const newBookTitle = bookTitle.split('');
    //     newBookTitle[0] = '';
    //     newBookTitle[newBookTitle.length - 1] = '';
    //     const newTitle = newBookTitle.join('');
    //     if (listingObj.title === newTitle) {
    //       wantBooks.push(listingObj);
    //     }
    //   });
    // });

    // _.each(wantBooks, (eachBook) => {
    //   _.each(this.entireListings, (aListing) => {
    //     if (eachBook.id_book === aListing.id_book) {
    //       allListings.push(aListing);
    //     }
    //   });
    // });

    // _.each(myOffer, (offerObj) => {
    //   _.each(this.possibleBooks[0], (possibleBook) => {
    //     const possibleTitle = offerObj.split('');
    //     possibleTitle[0] = '';
    //     possibleTitle[possibleTitle.length - 1] = '';
    //     const newPossibleTitle = possibleTitle.join('');
    //     if (possibleBook.book.title === newPossibleTitle) {
    //       allListings.push(possibleBook);
    //     }
    //   });
    // });

    // let moneyOffer = (this.offeredMoney * -100);
    // let moneyWant = (this.wantMoney * 100);

    // if (moneyOffer !== 0) {
    //   this.money = moneyOffer;
    // } else {
    //   this.money = moneyWant;
    // }

    // let money = this.money;

    // this.apiService.sendOffer({
    //   idRecipient: this.peer,
    //   idSender: localStorage.userid,
    //   money: money,
    //   listings: allListings,
    // });
    // this.presentToast('Your offer has been sent.');

    this.http.patch(`http://${this.local}/offerlisting`, {params: { status: 'rejected', offerId: prevId }})
      .subscribe((data) => {
        console.log(data, 'OLD OFFER SHOULD BE REJECTED')
      })

    // this.http.post(`http://${this.local}/offers`, { params: { previousId: prevId, recipientTitles: wantTitles, senderTitles: offerTitles} })
    //   .subscribe((data) => {
    //     console.log(data, 'COUNTER OFFER');
    //   })

    this.closeModal();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'primary',
      position: 'top',
    });
    toast.present();
  }

  ngOnInit() {
    this.setYourBooks = this.setYourBooks.bind(this);
    this.setBooks = this.setBooks.bind(this);
    this.setYourWants = this.setYourWants.bind(this);
    this.apiService.getPeerProfile(this.peerid, this.setBooks);
    this.apiService.renderListingsList(this.setYourBooks);
    this.apiService.renderWantList(this.setYourWants);
  }

}
