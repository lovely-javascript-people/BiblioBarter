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

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

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

  sendCounterOffer() {
    console.log(`${this.peerid} peer id, ${this.peerMoney} peer money, ${this.peerTitles} peer Titles ${this.peer} peer ${this.offerId} offer id ${this.myTitles} my titles`);    // this.http.patch('/offers', {})
    this.closeModal();
  }

  ngOnInit() {
    this.setYourBooks = this.setYourBooks.bind(this);
    this.setBooks = this.setBooks.bind(this);
    this.setYourWants = this.setYourWants.bind(this);
    this.apiService.renderListingsList(this.setYourBooks);
    this.apiService.renderWantList(this.setYourWants);
    this.apiService.getPeerProfile(localStorage.peerid, this.setBooks);
  }

}
