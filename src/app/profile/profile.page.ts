import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../want_list_modal/want_list_modal.component';
import { CounterOfferModal } from '../counter_offer_modal/counter_offer_modal.component';
import { AddListingModal } from '../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { ChatService } from '../chat.service';
import { CameraOptions } from '@ionic-native/camera/ngx';
import * as Stripe from "stripe";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  img: string;
  user: string;
  school: string;
  offers: any[] = [];
  wants: object[] = [];
  listings: object[] = [];
  allOffers: any[] = [];
  loaded = false;
  acceptedOffs: any[] = [];
  offerid: number; // need to grab correct offerid --> where do we get this
  open: boolean = false;
  recipId: number;
  money_exchanged: number;
  deleteId: number;
  deleteString: string;
  peerName: string;
  
    // to send to counteroffer modal
    peerid: number;
    peerMoney: string;
    peerTitles: string[];
    peer: string;
    myTitles: string[];
    offerId: number;

  constructor(
    private apiService: ApiService,
    public modal: ModalController,
    private router: Router,
    private http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
    public chat: ChatService,
  ) { }

    // local = 'http://localhost:3000';
    // local = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
    // local = '18.220.255.216:3000';
    local = 'localhost:3000';

  setUser(data) {
    console.log(data, 'THIS DATA', data[0], 'length');
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);
    // console.log(data[1][0].name, 'SCHOOL NAME');
    if (data[0]) {
      this.img = data[0].image_link;
      this.user = data[0].user_name;
      if (data[1].length) {
        this.school = data[1][0].name || null;
      }
      this.loaded = true;
    } else {
      this.user = localStorage.username;
    }
  }

  async openWantListModal() {
    var data = { message: 'hello world' };
    const modalPage = await this.modal.create({
      component: WantListModal,
      componentProps: { 
        user: data,
      }
    });
    modalPage.onDidDismiss().then(data => {
      this.apiService.renderWantList(this.setWantList);
    });
    return await modalPage.present();
  }

  async openAddListingModal() {
    var data = { message: 'hello world' };
    const modalPage = await this.modal.create({
      component: AddListingModal,
      componentProps: { values: data }
    });
    modalPage.onDidDismiss().then(() => {
      this.apiService.renderListingsList(this.setListings);
    });
    return await modalPage.present();
  }

  async openCounterOfferModal() {
    // let peerId = this.peerid;
    // console.log(peerId, 'PEER ID TEST');

    var data = { message: 'hello world' };
    const modalPage = await this.modal.create({
      component: CounterOfferModal,
      componentProps: { 
        peerid: this.peerid,
        peerMoney: this.peerMoney,
        peerTitles: this.peerTitles,
        peer: this.peer,
        myTitles: this.myTitles,
        offerId: this.offerId,
      }
    });
    modalPage.onDidDismiss().then(data => {
      this.apiService.getOffers(this.renderOffers);
    });
    return await modalPage.present();
  };
  
  /**
   * Sends offer, user, and peer info to server
   * @param index The index of the accepted offer in the this.offers array
   */
  acceptOffer(index) {
    console.log(this.allOffers, 'ALL OFFERS');
    console.log(this.offers[index], 'CLICKED ON OFFER');
    const {offerId, myTitles, peerTitles, peerid, peer} = this.offers[index];
    this.offerid = offerId;
    // this.apiService.userAcceptOffer(); // for when we refactor
  
    this.http.patch(`http://${this.local}/accept/offerlisting`, { 
      params: { 
        status: 'accepted', 
        offerId, 
        myTitles: myTitles.filter(title => title !== " and "), 
        peerTitles: peerTitles.filter(title => title !== " and "), 
        peerid, 
        userId: localStorage.userid
      }})
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Offer has been accepted');
        this.apiService.getOffers(this.renderOffers);
      });
    this.chat.offerChat(`${peer} + ${localStorage.username}`, peer, this.chat.addPeerToChat);
      // debugger;
  }

  /**
   * Takes in all offers involving any listings made by the user, 
   * breaks them down into accepted, pending, and rejected offers, 
   * and sends offers to be rendered
   * @param offers Array containing all offer information involving user's listed books.
   */
  renderOffers(offers) {
    console.log(offers, 'OFFERS FROM RENDER OFFERS');

    this.allOffers = offers;
    const offs: object[] = [];
    const acceptedOffers: object[] = [];
    let i = 0;

    for (const offer of offers.slice(0, offers.length - 1)) {
      if (offer.offer.status === 'pending' && offer.offer.id_sender === Number(localStorage.userid)) {
        const myList = offer.myListings.map(listing => [listing.listing.available, offer]);
        const peerList = offer.peerListings.map(listing => [listing.listing.available, offer]);
        const lists = myList.concat(peerList).filter(list => list[0] === false);
        for (let list of lists) {
          this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: list[1].offer.id_offer } })
        .subscribe((offerData) => {
          console.log(offerData, 'OFFER DATA');
          this.presentOfferToast('Offer has been rejected.'); 
        });
        } 
      }
    }

    for (const offer of offers.slice(0, offers.length - 1)) {
    if (offer.offer.status === 'pending' && offer.offer.id_sender !== Number(localStorage.userid)) {
      const myList = offer.myListings.map(listing => [listing.listing.available, offer]);
      const peerList = offer.peerListings.map(listing => [listing.listing.available, offer]);
      const lists = myList.concat(peerList).filter(list => list[0] === false);
      for (let list of lists) {
        this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: list[1].offer.id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Offer has been rejected.'); 
      });
      } 
    const offerObj: any = {};
    offerObj.myTitles = [];
    offerObj.peerTitles = [];

    offer.myListings.forEach((listing) => {
      offerObj.myTitles.push(listing.title);
    })

    offer.peerListings.forEach((listing) => {
      offerObj.peerTitles.push(listing.title);
    })
    offerObj.peer = offer.peerInfo.user_name;
    offerObj.peerid = offer.peerInfo.id_user;
    offerObj.status = offer.offer.status;
    offerObj.email = offer.peerInfo.email;
    offerObj.offerId = offer.offer.id_offer;

    if(offer.offer.money_exchange_cents > 0) {
      offerObj.userMoney = `and $${offer.offer.money_exchange_cents / 100}`;
    } else if(offer.offer.money_exchange_cents < 0){
       offerObj.peerMoney = `and $${((-1 * offer.offer.money_exchange_cents) / 100)}`;
    }
    offs.push(offerObj);
    i++;
  } else if (offer.offer.status === 'accepted' && offer.offer.id_sender !== Number(localStorage.userid)) {
        const {
          offer: {status, id_offer, id_sender, money_exchange_cents}, 
          peerInfo: {user_name, id_user, email}, 
          myListings, 
          peerListings
        } = offer;

        const offerObj: any = {};
        offerObj.myTitles = [];
        offerObj.peerTitles = [];
        
        // get all user titles
        myListings.forEach((listing) => {
          offerObj.myTitles.push(listing.title);
        })
    
        // get all peer titles
        peerListings.forEach((listing) => {
          offerObj.peerTitles.push(listing.title);
        })
        offerObj.peer = user_name;
        offerObj.status = status;
        offerObj.email = email;
        offerObj.offerId = id_offer;

        if(money_exchange_cents > 0) {
          offerObj.userMoney = `and $${money_exchange_cents / 100}`;
        } else if(offer.offer.money_exchange_cents < 0){
           offerObj.peerMoney = `and $${((-1 * money_exchange_cents) / 100)}`;
        }
        acceptedOffers.push(offerObj);
        i++;
      }
    }
    offs.forEach((listing: any) => {
      let { myTitles, peerTitles } = listing;
      if(myTitles.length > 1) {
        myTitles.splice(myTitles.length - 1, 0, ' and ');
      }
      if(peerTitles.length > 1) {
        peerTitles.splice(peerTitles.length - 1, 0, ' and ');
      }
    });
    acceptedOffers.forEach((listing: any) => {
      let { myTitles, peerTitles } = listing;
      if(myTitles.length > 1) {
        myTitles.splice(myTitles.length - 1, 0, ' and ');
      }
      if(peerTitles.length > 1) {
        peerTitles.splice(peerTitles.length - 1, 0, ' and ');
      }
    });
    this.offers = offs;
    this.acceptedOffs = acceptedOffers;
    console.log(offs, 'OFFERS AFTER RENDER CALLED');
  }

  /**
   * Called when a user clicks reject on an offer, removes it from their offers
   * @param index The index of the rejected offer in the this.offers array
   */
  rejectOffer(index) {
    this.offerid = this.offers[index].offerId;
    const id_offer = this.offerid;
    // this.apiService.userAcceptOffer(); // for when we refactor
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Offer has been rejected.');
        this.apiService.getOffers(this.renderOffers);
      });
  }


  cancelAcceptedOffer(index) {
    console.log(this.acceptedOffs[index], 'OFFER TO BE CANCELED');
    this.offerid = this.acceptedOffs[index].offerId;
    const id_offer = this.offerid;
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Accepted offer has been cancelled.');
        this.apiService.getOffers(this.renderOffers);
      });
  }

  setWantList(array) {
    this.wants = array;
  }

  setListings(array) {
    this.listings = array;
  }

  deleteListing(bookId, listingId, listing) {
    this.presentToast(listing);
    console.log(listingId, 'delete listing clicked');
    this.http.delete(`http://${this.local}/deleteListing`, { params: { bookId, listingId } })
      .subscribe((data) => {
        console.log(data, 'delete listing');
        this.apiService.renderListingsList(this.setListings);
      });
  }


  deleteWant(wantId, want) {

    this.presentToast(want);
    console.log('delete want', wantId);
    this.http.delete(`http://${this.local}/deleteWant`, { params: { wantId } })
    .subscribe((data) => {
      console.log(data, 'delete want');
      this.apiService.renderWantList(this.setWantList);
    });

  }

  deleteWantAlert(wantId, want) {
    this.presentAlertMultipleButtons(this.deleteWant(wantId, want));
  }


  async presentToast(item) {
    const toast = await this.toastController.create({
      message: `Your ${item} has been deleted.`,
      duration: 2000,
      color: 'primary',
      position: 'top', // or don't include to be bottom
    });
    toast.present();
  }
  async presentOfferToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'primary',
      position: 'top',
    });
    toast.present();
  }

  async presentAlertMultipleButtons(callback) {
    const alert = await this.alertController.create({
      header: 'Wait!',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete this book?',
    buttons: [{text: 'Cancel', handler: () => {console.log('CANCEL THIS PLEASE')}}, {text: 'Delete', handler: () => {callback}}]
    });
    return await alert.present();
  }

  // openCamera() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64 (DATA_URL):
  //     let base64Image = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //     // Handle error
  //   });
  // } 

  camOpen() {
    if (!this.open) {
      this.open = true;
    }
  }

  camClose() {
    if (this.open) {
      this.open = false;
    }
  }

  ngOnInit() {
    this.setWantList = this.setWantList.bind(this);
    this.apiService.renderWantList(this.setWantList);
    this.setListings = this.setListings.bind(this);
    this.apiService.renderListingsList(this.setListings);
    this.renderOffers = this.renderOffers.bind(this);
    this.setUser = this.setUser.bind(this);
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
    this.apiService.getOffers(this.renderOffers);
  }

}