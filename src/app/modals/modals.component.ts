import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { AuthService } from '../services/auth/auth.service';
import { AutoCompleteService } from '../services/autoComplete/auto-complete.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})

export class SettingsModal implements OnInit {

  school: string;
  radius: number;
  universities: any[] = [];
  emailAddress: string;
  nameFirst: string;
  nameLast: string;
  userEmail: string;
  phoneNumber: string;

  constructor(
    public modal: ModalController, 
    public settings: SettingsService, 
    private auth: AuthService,
    private auto: AutoCompleteService,
    private apiService: ApiService
    ) { }

    autoComplete(data) {
      this.universities = data.collegeList;
    }

    settingsUpdate() {
      const userId = localStorage.userid;
      const searchRadius = this.radius;
      const nameFirst = this.nameFirst;
      const nameLast = this.nameLast;
      const userEmail = this.userEmail;
      const address = this.emailAddress;
      const phoneNumber = this.phoneNumber;
      this.apiService.updateSettings(nameFirst, nameLast, userEmail, userId, searchRadius, address, phoneNumber);
    }

    selectUni(event) {
      this.school = event.target.textContent;
      this.universities = [];
    }

    onChange() {
      this.auto.findUniversity(this.school, this.autoComplete);
    }

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

  // searchRadius() {
  //   this.settings.defineSearchRadius(this.radius)
  // }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
    this.autoComplete = this.autoComplete.bind(this);
  }

}
