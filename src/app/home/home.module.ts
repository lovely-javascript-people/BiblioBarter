import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { FooterModule } from '../footer/footer.module'
import { ModalsModule } from '../modals/modals.module'

@NgModule({
  imports: [
    FooterModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ModalsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
