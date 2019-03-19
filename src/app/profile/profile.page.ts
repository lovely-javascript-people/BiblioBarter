import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit{
  img: any;
  user: any;
  school: any;
  offers: any = [];
  wants: any = [];
  listings: any = [];
  allOffers: any = [];
  offerid: any; // need to grab correct offerid --> where do we get this

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router, private http: HttpClient,) {}

  setUser(data) {
    console.log(data);
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);

    if (data[0].length) {
        this.user = data[0].user_name;
        if (data[1].length) {
        this.school = data[1][0].name;
        }
        this.img = data[0].link_image;
    } else {
      this.user = localStorage.username;
    }
  }

  async openWantListModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: WantListModal, 
      componentProps:{values: data}
    });
    return await modalPage.present();
  }
  
  async openAddListingModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: AddListingModal, 
      componentProps:{values: data}
    });
    return await modalPage.present();
  }

  acceptOffer() {
  console.log('offer accepted');
  const id_offer = 53; // need to grab correct offerid
  this.http.patch('http://localhost:3000/offerlisting', { params: {status: 'accepted', offerId: id_offer} })
    .subscribe((offerData) => {
      console.log(offerData, 'OFFER DATA FROM SERVER');
    })
  }

  renderOffers(offers) {
    console.log(offers, 'OFFERS');
    this.allOffers = offers;
    let offs: any = []
    for (let offer of offers.slice(1)) {
    let offerobj: any = {};
    offerobj.offeredTitle = offer.titleOffered.title;
    offerobj.wantedTitle = offer.titleWanted.title;
    offerobj.peer = offer.peer.user_name;
    offerobj.status = offer.offer.status;
    offerobj.email = offer.peer.email;
    offs.push(offerobj);
  }
  this.offers = offs;
  console.log(this.offers);
}

  rejectOffer() {
    console.log('offer rejected');
    const id_offer = this.offerid; // need to grab correct offerid
    this.http.patch('http://localhost:3000/offerlisting', { params: {status: 'rejected', offerId: id_offer} })
    .subscribe(() => {

    })
    }

  renderWantList() {
    // console.log(localStorage.userid, 'USERID');
  this.http.get(`http://localhost:3000/user/want?${localStorage.userid}`)
    .subscribe((wantListArray) => {
      console.log(wantListArray, 'ARRAY OF WANT LIST');
      this.wants = wantListArray;
    })
  }

  renderListingsList() {
  this.http.get(`http://localhost:3000/user/listing?${localStorage.userid}`)
    .subscribe((listingListArray) => {
      console.log(listingListArray, 'ARRAY OF OFFERING LIST');
      this.listings = listingListArray;
    })
  }

  ngOnInit() {
    this.renderWantList();
    this.renderListingsList();
    this.renderOffers = this.renderOffers.bind(this);
    this.setUser = this.setUser.bind(this);
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
    this.apiService.getOffers(this.renderOffers);
  }

}