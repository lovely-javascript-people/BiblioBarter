import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { AuthService } from '../services/auth/auth.service';
import { AutoCompleteService } from '../services/autoComplete/auto-complete.service';
import { ApiService } from '../api.service';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, } from '@angular/forms';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})

export class SettingsModal implements OnInit {

  school: any;
  radius = 10;
  universities: any[] = [];
  emailAddress: string = '';
  nameFirst: string = '';
  nameLast: string = '';
  userEmail: string = '';
  phoneNumber: string = '';
  address: string = '';
  registrationForm: FormGroup;
  recentUnis: any;
  schoolInput: boolean = true;
  settingsFilled: boolean = false;

  constructor(
    public modal: ModalController,
    public settings: SettingsService,
    private auth: AuthService,
    private auto: AutoCompleteService,
    private apiService: ApiService,
    public toastController: ToastController
    ) { }

    autoComplete(data) {
      this.universities = data.collegeList;
    }

    settingsUpdate(first, last, email, radius, school) {
      const userId = localStorage.userid;
      const searchRadius = radius;
      const nameFirst = first;
      const nameLast = last;
      const address = '123 jeef st.';
      const userEmail = email;
      const phoneNumber = '7334887';
      // debugger;
      if (userId && nameFirst && nameLast && address && phoneNumber && userEmail) {
        this.presentToast('Thanks, your info has been successfully submitted. Please enter your university below.');
        this.apiService.updateSettings(nameFirst, nameLast, userEmail, userId, searchRadius, address, phoneNumber);
        this.settingsFilled = true;
      } else {
        this.presentToast('All fields must be fully and accurately completed');
      }
    }

    selectUni(event) {
      this.school = event.target.textContent;
      this.recentUnis = this.universities;
      this.universities = [];
    }

    onChange() {
      console.log(this.school);
      this.auto.findUniversity(this.school, this.autoComplete);
    }

  switchAccount() {
    this.settings.switchAccount();
  }

  deleteProfile() {
    this.settings.deleteAccount(localStorage.getItem('username'));
    this.auth.logout();
  }

  setSchool(setting) {
    this.presentToast(setting);
    if (this.recentUnis.map(uni => uni.name).includes(this.school)) {
      this.recentUnis = [];
      this.presentToast(`${this.school} is now set as your university`);
      this.settings.changeSchool(this.school);
      localStorage.loginMethod = 'login';
    } else {
      this.presentToast('You must choose a university from the list');
    }
  }

  searchRadius() {
    this.settings.defineSearchRadius(this.radius)
  }

  async closeModal() {
    this.modal.dismiss();
  }

  async presentToast(setting) {
    const toast = await this.toastController.create({
      message: setting,
      duration: 2000,
      color: 'primary',
      position: 'top', // or don't include to be bottom
    });
    toast.present();
  }

  ngOnInit() {
    this.autoComplete = this.autoComplete.bind(this);
  }

}
