import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactModal } from './contact_modal.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ContactModal
  }
];

@NgModule({
  declarations: [ContactModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    ContactModal
  ],
  exports: [ContactModal]
})
export class ContactModalModule { }
