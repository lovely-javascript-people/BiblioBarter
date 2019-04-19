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
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);
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
    const {offerId, myTitles, peerTitles, peerid, peer} = this.offers[index];
    this.offerid = offerId;
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
        this.presentOfferToast('Offer has been accepted');
        this.apiService.getOffers(this.renderOffers);
      });
    this.chat.offerChat(`${peer} + ${localStorage.username}`, peer, this.chat.addPeerToChat);
  }

  /**
   * Takes in all offers involving any listings made by the user, 
   * breaks them down into accepted, pending, and rejected offers, 
   * and sends offers to be rendered
   * @param offers Array containing all offer information involving user's listed books.
   * @param type Tells the function if it is receiving accepted or pending offers
   */
  renderOffers(offers, type) {
    this.allOffers = offers;
    const offs: object[] = [];
    const acceptedOffers: object[] = [];
    let i = 0;

    for (const offer of offers) {
    if (offer[0].status === 'pending') {
      const lists = offer.slice(2)
        .map(listing => [listing.listing.available, offer])
        .filter(list => list[0] === false);
      for (let list of lists) {
        this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: list[1][0].id_offer } })
      .subscribe((offerData) => {
        this.presentOfferToast('Offer has been rejected.'); 
      });
      } 
      if (offer[0].id_sender !== localStorage.userid) {
    const offerObj: any = {};
    offerObj.myTitles = [];
    offerObj.peerTitles = [];

    offer.slice(2).forEach((listing) => {
      if (listing.listing.id_user === offer[1].id_user) {
        offerObj.peerTitles.push(listing.book.title);
      } else {
        offerObj.myTitles.push(listing.book.title);
      }
      
    })
    offerObj.peer = offer[1].user_name;
    offerObj.peerid = offer[1].id_user;
    offerObj.status = offer[0].status;
    offerObj.email = offer[1].email;
    offerObj.offerId = offer[0].id_offer;

    if(offer[0].money_exchange_cents > 0) {
      offerObj.userMoney = `and $${offer[0].money_exchange_cents / 100}`;
    } else if(offer[0].money_exchange_cents < 0){
       offerObj.peerMoney = `and $${((-1 * offer[0].money_exchange_cents) / 100)}`;
    }
    offs.push(offerObj);
    i++;
  }
  } else if (offer[0].status === 'accepted' && offer[0].id_sender !== Number(localStorage.userid)) {
        const [
          offered,
          peer,
        ] = offer;
        const {id_user, email, user_name} = peer, {status, id_offer, money_exchange_cents, id_sender} = offered;


        const offerObj: any = {};
        offerObj.myTitles = [];
        offerObj.peerTitles = [];
        
        // get all user titles
        offer.slice(2).forEach((listing) => {
          const {listing: { id_user }, book: { title } } = listing
          if (id_user === peer.id_user) {
            offerObj.peerTitles.push(title);
          } else {
            offerObj.myTitles.push(title);
          }
        })
        offerObj.peer = user_name;
        offerObj.status = status;
        offerObj.email = email;
        offerObj.offerId = id_offer;

        if(money_exchange_cents > 0) {
          offerObj.userMoney = `and $${money_exchange_cents / 100}`;
        } else if(money_exchange_cents < 0){
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
    if (type === 'accepted') {
      this.acceptedOffs = acceptedOffers;
    } else {
      this.offers = offs;
    }
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
        this.presentOfferToast('Offer has been rejected.');
        this.apiService.getOffers(this.renderOffers);
      });
  }


  cancelAcceptedOffer(index) {
    this.offerid = this.acceptedOffs[index].offerId;
    const id_offer = this.offerid;
    this.http.patch(`http://${this.local}/offerlisting`, { params: { status: 'rejected', offerId: id_offer } })
      .subscribe((offerData) => {
        this.presentOfferToast('Accepted offer has been cancelled.');
        this.apiService.getAcceptedOffers(this.renderOffers);
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
    this.http.delete(`http://${this.local}/deleteListing`, { params: { bookId, listingId } })
      .subscribe((data) => {
        this.apiService.renderListingsList(this.setListings);
      });
  }


  deleteWant(wantId, want) {
    this.presentToast(want);
    this.http.delete(`http://${this.local}/deleteWant`, { params: { wantId } })
    .subscribe((data) => {
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
    this.apiService.getAcceptedOffers(this.renderOffers);
  }

}