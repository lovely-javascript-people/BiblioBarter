import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})

export class SettingsModal implements OnInit {

  constructor(public modal: ModalController, public settings: SettingsService, private auth: AuthService) { }

  switchAccount() {
    let that = this;
    this.auth.logout();
    
    setTimeout(() => that.auth.login(), 1500);
  }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {}

}
