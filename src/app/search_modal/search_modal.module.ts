import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModal } from './search_modal.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SearchModal
  }
];

@NgModule({
  declarations: [SearchModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    SearchModal
  ],
  exports: [SearchModal]
})
export class SearchModalsModule { }
