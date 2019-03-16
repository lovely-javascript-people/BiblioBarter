import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsModal } from './modals.component';
import {IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsModal],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [
    SettingsModal
  ],
  exports: [SettingsModal]
})
export class ModalsModule { }
