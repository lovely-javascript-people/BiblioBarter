import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddListingModal } from './add_listing_modal.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [AddListingModal],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    AddListingModal
  ],
  exports: [AddListingModal]
})
export class AddListingModule { }
