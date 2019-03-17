import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FooterModule } from '../../../footer/footer.module';
import { IonicModule } from '@ionic/angular';

import { PeerProfilePage } from './peer-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PeerProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PeerProfilePage]
})
export class PeerProfilePageModule {}
