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

  constructor(public modal: ModalController, private http: HttpClient, private apiService: ApiService) { }

  async closeModal() {
    this.modal.dismiss();
  }

  sendCounterOffer() {
    console.log('I ALMOST LIKE THIS OFFER BUT ITS NOT QUITE RIGHT YET!');
    this.closeModal();
  }

  ngOnInit() {}

}
