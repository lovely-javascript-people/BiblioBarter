import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsModal } from './modals.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [SettingsModal],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    SettingsModal
  ],
  exports: [SettingsModal]
})
export class ModalsModule { }
