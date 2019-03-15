import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModal } from './search_modal.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [SearchModal],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    SearchModal
  ],
  exports: [SearchModal]
})
export class SearchModalsModule { }
