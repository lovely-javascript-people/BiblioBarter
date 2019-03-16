import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WantListModal } from './want_list_modal.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: WantListModal
  }
];

@NgModule({
  declarations: [WantListModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    WantListModal
  ],
  exports: [WantListModal]
})
export class WantListModalModule { }
