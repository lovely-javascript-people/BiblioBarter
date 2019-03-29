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
  peerid: number;
  peerMoney: string;
  peerTitles: string[];
  peer: string;
  myTitles: string[];
  offerId: number;

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
    console.log(`${this.peerid} peer id, ${this.peerMoney} peer money, ${this.peerTitles} peer Titles ${this.peer} peer ${this.offerId} offer id ${this.myTitles} my titles`);    // this.http.patch('/offers', {})
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
