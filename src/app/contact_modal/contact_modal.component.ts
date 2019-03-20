import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modals',
  templateUrl: './contact_modal.component.html',
  styleUrls: ['./contact_modal.component.scss'],
})

export class ContactModal implements OnInit {

  constructor(
    public modal: ModalController, 
    // public settings: SettingsService, 
    // private auth: AuthService,
    // private auto: AutoCompleteService
    ) { }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
  }

}
