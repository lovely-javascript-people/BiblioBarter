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

  school: string = '';
  radius: any = '';

  constructor(public modal: ModalController, public settings: SettingsService, private auth: AuthService) { }

  switchAccount() {
    this.settings.switchAccount();
  }

  deleteProfile() {
    this.settings.deleteAccount(localStorage.getItem('username'));
    this.auth.logout();
  }

  setSchool() {
    this.settings.changeSchool(this.school)
  }

  searchRadius() {
    this.settings.defineSearchRadius(this.radius)
  }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {}

}
