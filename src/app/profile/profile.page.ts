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

  constructor(
    private apiService: ApiService,
    public modal: ModalController,
    private router: Router,
    private http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
  ) { }

    local = 'http://localhost:3000';
    // local = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
    // local = 'http://18.188.132.186:3000';
    // local = 'localhost:3000';

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
      componentProps: { values: data }
    });
    return await modalPage.present();
  }

  async openAddListingModal() {
    var data = { message: 'hello world' };
    const modalPage = await this.modal.create({
      component: AddListingModal,
      componentProps: { values: data }
    });
    return await modalPage.present();
  }

  async openCounterOfferModal() {
    var data = { message: 'hello world' };
    const modalPage = await this.modal.create({
      component: CounterOfferModal,
      componentProps: { values: data }
    });
    return await modalPage.present();
  }
  

  acceptOffer(index) {
    console.log(this.allOffers, 'ALL OFFERS');
    console.log(this.offers[index], 'CLICKED ON OFFER');

    this.offerid = this.offers[index].offerId;
    const id_offer = this.offerid;
    // this.apiService.userAcceptOffer(); // for when we refactor
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'accepted', offerId: id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Offer has been accepted');
      });
  }

  counterOffer(index) {

    console.log(this.offers, 'THIS DOT OFFERS OFFERS OFFERS');

    let idRecipient = this.offers[0].peerid;

    localStorage.setItem('peerid', idRecipient.toString());

    // this.apiService.counterOffer(idOfferPrev, idRecipient, idSender, listings, money);
  }

  // counterOffer(index) {

  //   // for loop through allOffers to find senderId by matching the offerId
  //   // for(let i = 1; i < this.allOffers.length - 1; i++) {
  //   //   if (this.allOffers[i].offer.id_offer === this.offers[index].offerId) {
  //   //       this.recipId = this.allOffers[i].peer.id_user;
  //   //       this.money_exchanged = this.allOffers[i].offer.money_exchange_cents;
  //   //   }
  //   // }

  //   console.log(this.offers, 'THIS DOT OFFERS OFFERS OFFERS');

  //   let idOfferPrev = this.offers[index].offerId; // this is the offerId of the offer that the user is countering
  //   let idRecipient = this.recipId;
  //   let idSender = localStorage.userid;
  //   let money = this.money_exchanged;
  //   let listings; // this should be an array of all of the listing ids involved.
  //                 // should get this back in offers after refactor
  //   localStorage.setItem('peerid', idRecipient.toString());

  //   // this.apiService.counterOffer(idOfferPrev, idRecipient, idSender, listings, money);
  // }


  renderOffers(offers) {
    console.log(offers, 'OFFERS FROM RENDER OFFERS');

    this.allOffers = offers;
    const offs: object[] = [];
    const acceptedOffers: object[] = [];
    let i = 0;

    for (const offer of offers.slice(0, offers.length - 1)) {
    if (offer.offer.status === 'pending' && offer.offer.id_sender !== Number(localStorage.userid)) {
    const offerObj: any = {};
    offerObj.myTitles = [];
    offerObj.peerTitles = [];
    
    // get all user titles
    offer.myListings.forEach((listing) => {
      offerObj.myTitles.push(listing.title);
    })

    // get all peer titles
    offer.peerListings.forEach((listing) => {
      offerObj.peerTitles.push(listing.title);
    })

    offerObj.peer = offer.peerInfo.user_name;
    offerObj.peerid = offer.peerInfo.id_user;
    offerObj.status = offer.offer.status;
    offerObj.email = offer.peerInfo.email;
    offerObj.offerId = offer.offer.id_offer;
    offerObj.money = offer.offer.money_exchange_cents / 100;
    
    offs.push(offerObj);
    i++;
      } else if (offer.offer.status === 'accepted' && offer.offer.id_sender !== Number(localStorage.userid)) {
        const offerObj: any = {};
        offerObj.myTitles = [];
        offerObj.peerTitles = [];
        
        // get all user titles
        offer.myListings.forEach((listing) => {
          offerObj.myTitles.push(listing.title);
        })
    
        // get all peer titles
        offer.peerListings.forEach((listing) => {
          offerObj.peerTitles.push(listing.title);
        })
    
        offerObj.peer = offer.peerInfo.user_name;
        offerObj.status = offer.offer.status;
        offerObj.email = offer.peerInfo.email;
        offerObj.offerId = offer.offer.id_offer;
        
        acceptedOffers.push(offerObj);
        i++;
      }
    }

    offs.forEach((listing: any) => {
      if(listing.myTitles.length > 1) {
        listing.myTitles.splice(listing.myTitles.length - 1, 0, ' and ');
      }

      if(listing.peerTitles.length > 1) {
        listing.peerTitles.splice(listing.peerTitles.length - 1, 0, ' and ');
      }
    });

    acceptedOffers.forEach((listing: any) => {
      if(listing.myTitles.length > 1) {
        listing.myTitles.splice(listing.myTitles.length - 1, 0, ' and ');
      }

      if(listing.peerTitles.length > 1) {
        listing.peerTitles.splice(listing.peerTitles.length - 1, 0, ' and ');
      }
    });

    this.offers = offs;
    this.acceptedOffs = acceptedOffers;

    console.log(offs, 'OFFERS AFTER RENDER CALLED');
  }



  rejectOffer(index) {
    this.offerid = this.offers[index].offerId;
    const id_offer = this.offerid;
    // this.apiService.userAcceptOffer(); // for when we refactor
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Offer has been rejected.');
      });
  }


  cancelAcceptedOffer(index) {
    console.log(this.acceptedOffs[index], 'OFFER TO BE CANCELED');
    this.offerid = this.acceptedOffs[index].offerId;
    const id_offer = this.offerid;
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: id_offer } })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
        this.presentOfferToast('Accepted offer has been cancelled.')
      });
  }

  setWantList(array) {
    this.wants = array;
  }

  setListings(array) {
    this.listings = array;
  }

  deleteListing(bookId, listingId, listing) {
    console.log(listingId, 'delete listing clicked');
    this.presentToast(listing);
    this.http.delete(`http://${this.local}/deleteListing`, { params: { bookId, listingId } })
      .subscribe((data) => {
        console.log(data, 'delete listing');
      });
  }

  // deleteWant() {
  deleteWant(wantId, want) {

    console.log('delete want', wantId);

    this.presentToast(want);
    this.http.delete(`http://${this.local}/deleteWant`, { params: { wantId } })
      .subscribe((data) => {
        console.log(data, 'delete want');
      });
  }

  deleteWantAlert(wantId, want) {
    this.presentAlertMultipleButtons(this.deleteWant(wantId, want));
  }

// deleteBookAlert(callback) {
//   this.presentAlertMultipleButtons(callback);
// }

// deleteBookAlert(callback, id, string) {
//   this.deleteId = id;
//   this.deleteString = string;
//   // this.presentAlertMultipleButtons(callback(id, string));
//   this.presentAlertMultipleButtons(callback);
// }

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