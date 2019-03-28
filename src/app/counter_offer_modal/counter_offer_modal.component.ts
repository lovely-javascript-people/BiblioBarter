import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './counter_offer_modal.component.html',
  styleUrls: ['./counter_offer_modal.scss'],
})

export class CounterOfferModal implements OnInit {

  userBooks: any[] = [];
  peerListings: any;
  peerWants: any;
  ready: boolean = false;

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

  async closeModal() {
    this.modal.dismiss();
  }

  setUserBooks(data) {
    console.log(data);
    this.userBooks.push(data);
  }

  setPeerBooks(data) {
    console.log(data);
    this.ready = true;
  }

  sendCounterOffer() {
    console.log('I ALMOST LIKE THIS OFFER BUT ITS NOT QUITE RIGHT YET!');
    // this.http.patch('/offers', {})
    this.closeModal();
  }

  ngOnInit() {
    this.setUserBooks = this.setUserBooks.bind(this);
    this.setPeerBooks = this.setPeerBooks.bind(this);
    this.apiService.renderListingsList(this.setUserBooks);
    this.apiService.renderWantList(this.setUserBooks);
    this.apiService.getPeerProfile(localStorage.peerid, this.setPeerBooks);
  }

}
