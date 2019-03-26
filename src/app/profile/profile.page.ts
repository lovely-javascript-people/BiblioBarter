import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { CameraOptions } from '@ionic-native/camera/ngx'; 

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  img: any;
  user: any;
  school: any;
  offers: any = [];
  wants: any = [];
  listings: any = [];
  allOffers: any = [];
  loaded = false;
  acceptedOffs: any = [];
  offerid: any;
  open: boolean = false;
  recipId: number;
  money_exchanged: number;

  constructor(
    private apiService: ApiService,
    public modal: ModalController,
    private router: Router,
    private http: HttpClient,
    public toastController: ToastController,
    ) {}

  setUser(data) {
    console.log(data, 'THIS DATA', data[0], 'length');
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);
    console.log(data[1][0].name, 'SCHOOL NAME');
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
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: WantListModal,
      componentProps: {values: data}
    });
    return await modalPage.present();
  }

  async openAddListingModal() {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: AddListingModal,
      componentProps: {values: data}
    });
    return await modalPage.present();
  }

  acceptOffer(index) {
  console.log(this.allOffers, 'ALL OFFERS');
  console.log(this.offers[index], 'CLICKED ON OFFER');

  this.offerid = this.offers[index].offerId;
  const id_offer = this.offerid;
    // this.apiService.userAcceptOffer(); // for when we refactor
  this.http.patch('http://localhost:3000/offerlisting', { params: {status: 'accepted', offerId: id_offer} })
    .subscribe((offerData) => {
      console.log(offerData, 'OFFER DATA');
    });
  }

  counterOffer(index) {

    // for loop through allOffers to find senderId by matching the offerId
    for(let i = 1; i < this.allOffers.length - 1; i++) {
      if (this.allOffers[i].offer.id_offer === this.offers[index].offerId) {
          this.recipId = this.allOffers[i].peer.id_user;
          this.money_exchanged = this.allOffers[i].offer.money_exchange_cents;
      }
    }

    let idOfferPrev = this.offers[index].offerId; // this is the offerId of the offer that the user is countering
    let idRecipient = this.recipId;
    let idSender = localStorage.userid;
    let money = this.money_exchanged;
    let listings; // this should be an array of all of the listing ids involved.
                  // should get this back in offers after refactor

    this.apiService.counterOffer(idOfferPrev, idRecipient, idSender, listings, money);
  }

  renderOffers(offers) {
    console.log(offers, 'OFFERS');
    this.allOffers = offers;
    const offs: object[] = [];
    const acceptedOffers: object[] = [];
    let i = 0;
    for (const offer of offers.slice(1)) {
    if (offer.offer.status === 'pending') {
    const offerObj: any = {};
    offerObj.offeredTitle = offer.titleOffered.title;
    offerObj.wantedTitle = offer.titleWantd.title;
    offerObj.peer = offer.peer.user_name;
    offerObj.status = offer.offer.status;
    offerObj.email = offer.peer.email;
    offerObj.offerId = offer.offer.id_offer;
    
    offs.push(offerObj);
    i++;
      } else if (offer.offer.status === 'accepted') {
    const offerObj: any = {};
    offerObj.offeredTitle = offer.titleOffered.title;
    offerObj.wantedTitle = offer.titleWantd.title;
    offerObj.peer = offer.peer.user_name;
    offerObj.status = offer.offer.status;
    offerObj.email = offer.peer.email;
    offerObj.offerId = offer.offer.id_offer;
    // console.log(offerObj, 'OFFER OBJECT');
    acceptedOffers.push(offerObj);
    i++;
      }
  }
  this.offers = offs;
  this.acceptedOffs = acceptedOffers;
  // console.log(this.offers, 'THIS DOT OFFERS');
}

  rejectOffer(index) {
    this.offerid = this.offers[index].offerId;
    const id_offer = this.offerid;
      // this.apiService.userAcceptOffer(); // for when we refactor
    this.http.patch('http://localhost:3000/offerlisting', { params: {status: 'rejected', offerId: id_offer} })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
      });

    }

  cancelAcceptedOffer(index) {
    console.log(this.acceptedOffs[index], 'OFFER TO BE CANCELED');
    this.offerid = this.acceptedOffs[index].offerId;
    const id_offer = this.offerid;
    this.http.patch('http://localhost:3000/offerlisting', { params: {status: 'rejected', offerId: id_offer} })
      .subscribe((offerData) => {
        console.log(offerData, 'OFFER DATA');
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
    this.http.delete('http://localhost:3000/deleteListing', { params: { bookId, listingId }})
      .subscribe((data) => {
        console.log(data, 'delete listing');
      });
  }

  deleteWant(wantId, want) {
    console.log('delete want', wantId);
    this.presentToast(want);
    this.http.delete('http://localhost:3000/deleteWant', { params: { wantId }})
      .subscribe((data) => {
        console.log(data, 'delete want');
      });
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
