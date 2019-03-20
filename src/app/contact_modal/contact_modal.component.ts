import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modals',
  templateUrl: './contact_modal.component.html',
  styleUrls: ['./contact_modal.component.scss'],
})

export class ContactModal implements OnInit {

  emailAddress: string = '';
  emailBody: string = '';

  constructor(
    public modal: ModalController, 
    ) { }

  submitEmail() {
    console.log(this.emailAddress);
    console.log(this.emailBody);
    this.closeModal();
  }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
  }

}
