import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WantListModal } from './want_list_modal.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [WantListModal],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    WantListModal
  ],
  exports: [WantListModal]
})
export class WantListModule { }
