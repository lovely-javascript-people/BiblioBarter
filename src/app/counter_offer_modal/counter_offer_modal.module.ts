import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterOfferModal } from './counter_offer_modal.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CounterOfferModal
  }
];

@NgModule({
  declarations: [CounterOfferModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    CounterOfferModal
  ],
  exports: [CounterOfferModal]
})
export class CounterOfferModule { }
