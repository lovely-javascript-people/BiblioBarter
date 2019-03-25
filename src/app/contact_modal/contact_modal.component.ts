import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
// import {NavController, ToastController} from '@ionic/angular';
// import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';



@Component({
  selector: 'app-modals',
  templateUrl: './contact_modal.component.html',
  styleUrls: ['./contact_modal.component.scss'],
})

export class ContactModal implements OnInit {

  emailAddress: string;
  emailBody: string;

  // available: boolean = true;


  constructor(
    public modal: ModalController,
    // private emailComposer: EmailComposer,
    private apiService: ApiService
    ) {  }

    // send(){
    //   this.emailComposer.isAvailable().then((available) =>{
    //   if(available) {
    //     //Now we know we can send
    //     console.log('sending email');
    //   }
    //   });
    // }



/////////////////////
  submitEmail() {
    const userId = localStorage.userid;
    const userEmail = this.emailAddress;
    const emailBody = this.emailBody;
    this.apiService.contactUs(userId, userEmail, emailBody);
    this.closeModal();
  }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
  }

}
