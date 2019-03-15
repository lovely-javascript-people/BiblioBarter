import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModal } from './search_modal.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  entryComponents: [
    SearchModal
  ],
  exports: [SearchModal]
})
export class SearchModalsModule { }
