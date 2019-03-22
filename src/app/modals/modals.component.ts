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

  school: string;
  radius: number = 10;
  universities: any[] = [];
  emailAddress: string;
  nameFirst: string;
  nameLast: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  registrationForm: FormGroup;

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

    settingsUpdate(setting) {
      const userId = localStorage.userid;
      const searchRadius = this.radius;
      const nameFirst = this.nameFirst;
      const nameLast = this.nameLast;
      const userEmail = this.emailAddress;
      const address = this.address;
      const phoneNumber = this.phoneNumber;
      this.presentToast(setting);
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

  setSchool(setting) {
    this.presentToast(setting);
    this.settings.changeSchool(this.school)
  }

  // searchRadius() {
  //   this.settings.defineSearchRadius(this.radius)
  // }

  async closeModal() {
    this.modal.dismiss();
  }

  async presentToast(setting) {
    const toast = await this.toastController.create({
      message: `Your ${setting} has been saved.`,
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
