import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsComponent } from './modals.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [ModalsComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    ModalsComponent
  ]
})
export class ModalsModule { }
