import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
// import {NavController, ToastController} from '@ionic/angular';
// import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastController } from '@ionic/angular';




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
    private apiService: ApiService,
    public toastController: ToastController,
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
    this.presentToast('Your message has been sent!');
    this.closeModal();
  }

  async closeModal() {
    this.modal.dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2000,
      color: 'primary',
      position: 'top', // or don't include to be bottom
    });
    toast.present();
  }

  ngOnInit() {
  }

}
