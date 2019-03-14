import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    FooterModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePage
      }
    ])
  ],
  declarations: [ProfilePage]
})
export class ProfileModule {}
